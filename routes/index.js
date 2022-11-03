const express = require('express');

const env = process.env.NODE_ENV || 'development';
const path = require('path');

const config = require(path.join(__dirname, '/../config/config.json'))[env];
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { badRequestHandler, serverErrorHandler } = require('../helpers/errorHandlers');
const User = require('../models').user;
const UserToken = require('../models').user_token;

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Express' });
});

router.post('/signup', (req, res, next) => {
	if (!req.body.email) {
		return badRequestHandler(res, 'Error: User email is not specified!');
	}

	if (!req.body.password) {
		return badRequestHandler(res, 'Error: User password is not specified!');
	}

	const userEmail = req.body.email.toLowerCase();
	const userPassword = req.body.password;

	User.findOne({ where: { email: userEmail } }).then(
		(user) => {
			if (!user) {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(userPassword, salt, (err, hash) => {
						if (err) return next(err);

						User.create({ email: userEmail, password: hash }).then(
							(new_user) => {
								const accessTokenPrivateKey = config.accessTokenPrivateKey.replace(/\\n/g, '\n');
								const refreshTokenPrivateKey = config.refreshTokenPrivateKey.replace(/\\n/g, '\n');
								const accessToken = jwt.sign({ user_id: new_user.id }, accessTokenPrivateKey, { expiresIn: '30m', algorithm: 'RS256' });
								const newRefreshToken = jwt.sign({ user_id: new_user.id }, refreshTokenPrivateKey, { expiresIn: '1d', algorithm: 'RS256' });

								return res.json({
									message: 'User Created!',
									user: new_user,
									user_exists: false,
									access_token: accessToken,
									refresh_token: newRefreshToken
								});
							},
							(err) => {
								return serverErrorHandler(res, 'Error: Could not create user in sign up', err);
							}
						);
					});
				});
			} else {
				return badRequestHandler(res, 'Error: User already exists in sign up', { user_exists: true });
			}
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user profile in sign up', err);
		}
	);
});

router.get('/login', (req, res) => {
	if (!req.headers.email) {
		return badRequestHandler(res, 'Error: User email is not specified!');
	}

	if (!req.headers.pw) {
		return badRequestHandler(res, 'Error: User password is not specified!');
	}

	const userEmail = req.headers.email;
	const userPassword = req.headers.pw;

	User.findOne({ where: { email: userEmail.toLowerCase() } }).then(
		(user) => {
			if (!user) {
				return badRequestHandler(res, 'Error: User does not exist', { user_exists: false });
			}

			bcrypt.compare(userPassword, user.password).then((result) => {
				if (result) {
					const accessTokenPrivateKey = config.accessTokenPrivateKey.replace(/\\n/g, '\n');
					const refreshTokenPrivateKey = config.refreshTokenPrivateKey.replace(/\\n/g, '\n');
					const accessToken = jwt.sign({ user_id: user.id }, accessTokenPrivateKey, { expiresIn: '30m', algorithm: 'RS256' });
					const refreshToken = jwt.sign({ user_id: user.id }, refreshTokenPrivateKey, { expiresIn: '1d', algorithm: 'RS256' });

					UserToken.findOne({
						where: {
							user_id: user.id
						}
					}).then(
						(userToken) => {
							if (userToken) {
								userToken.update({
									refresh_token: refreshToken
								});
							} else {
								UserToken.create({
									user_id: user.id,
									refresh_token: refreshToken
								});
							}

							res.cookie('refresh_token', refreshToken, {
								httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000
							});

							return res.json({
								message: 'User logged in successfully!',
								user,
								user_exists: true,
								access_token: accessToken,
								refresh_token: refreshToken
							});
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to fetch user token in login', err);
						}
					);
				} else {
					return badRequestHandler(res, 'Invalid credentials', { user_exists: true });
				}
			}).catch((err) => {
				return serverErrorHandler(res, 'Error: Failed to verify password in login', err, { user_exists: true });
			});
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user profile in login', err);
		}
	);
});

module.exports = router;
