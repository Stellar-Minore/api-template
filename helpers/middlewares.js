const env = process.env.NODE_ENV || 'development';
const path = require('path');

const config = require(path.join(__dirname, '/../config/config.json'))[env];
const jwt = require('jsonwebtoken');
const User = require('../models').user;
const { serverErrorHandler, forbiddenClientHandler } = require('./errorHandlers');

exports.accountAuthenticator = async (req, res, next) => {
	/* #swagger.autoBody = false */
	const userID = req.body.userID || req.body.user_id || req.header('user_id') || req.params.user_id;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		if (!req.cookies.refresh_token) {
			forbiddenClientHandler(res, 'Refresh token cookie not found');
		} else {
			const authToken = req.headers.authorization.split(' ')[1];
			const accessTokenPublicKey = (process.env.accessTokenPublicKey || config.accessTokenPublicKey).replace(/\\n/g, '\n');

			jwt.verify(authToken, accessTokenPublicKey, { algorithm: 'RS256' }, async (err, decoded) => {
				if (err) {
					forbiddenClientHandler(res, 'Failed to authenticate token', err);
				} else {
					await User.findOne({ where: { id: decoded.user_id } }).then(
						(user) => {
							if (!user) {
								forbiddenClientHandler(res, 'This user account is deleted');
							} else if (userID && userID === decoded.user_id) {
								console.log('Token Authenticated');

								req.decodedUserID = decoded.user_id;
								next();
							} else {
								forbiddenClientHandler(res, 'Error: User ID and Auth Token mismatch');
							}
						},
						(err) => {
							serverErrorHandler(res, 'Error: Could not find user in user account authentication', err);
						}
					);
				}
			});
		}
	} else {
		forbiddenClientHandler(res, 'No token provided');
	}
};
