const jwt = require('jsonwebtoken');
const User = require('../models').user;
const { serverErrorHandler, forbiddenClientHandler } = require('./errorHandlers');

exports.accountAuthenticator = async (req, res, next) => {
	const authToken = req.body.token || req.header('auth_token');
	const userID = req.body.userID || req.body.user_id || req.header('user_id') || req.params.user_id;

	if (authToken) {
		jwt.verify(authToken, req.app.get('superSecret'), async (err, decoded) => {
			if (err) {
				forbiddenClientHandler(res, 'Failed to authenticate token', err);
			} else {
				let userNotFoundError = false;
				let tokenMismatch = false;

				await User.findOne({ where: { id: decoded } }).then(
					async (user) => {
						if (!user) {
							userNotFoundError = true;
						} else if (userID && userID === decoded) {
							console.log('Token Authenticated');

							req.decodedUserID = decoded;
						} else {
							tokenMismatch = true;
						}
					},
					(err) => {
						serverErrorHandler(res, 'Error: Could not find user in user account authentication', err);
					}
				);

				if (userNotFoundError) {
					forbiddenClientHandler(res, 'This user account is deleted');
				} else if (tokenMismatch) {
					forbiddenClientHandler(res, 'Error: User ID and Auth Token mismatch');
				} else {
					next();
				}
			}
		});
	} else {
		forbiddenClientHandler(res, 'No token provided');
	}
};
