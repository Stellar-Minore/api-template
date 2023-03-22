const express = require('express');

const env = process.env.NODE_ENV || 'development';
const path = require('path');

const config = require(path.join(__dirname, '/../config/config.json'))[env];
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { badRequestHandler, serverErrorHandler, forbiddenClientHandler } = require('../helpers/errorHandlers');
const User = require('../models').user;
const UserToken = require('../models').user_token;

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Express' });
});

/* POST signup. */
router.post('/signup', async (req, res) => {
	if (!req.body.first_name) {
		return badRequestHandler(res, 'Error: User first name is not specified!');
	}

	if (!req.body.last_name) {
		return badRequestHandler(res, 'Error: User last name is not specified!');
	}

	if (!req.body.user_email) {
		return badRequestHandler(res, 'Error: User email is not specified!');
	}

	if (!req.body.password) {
		return badRequestHandler(res, 'Error: Password is not specified!');
	}

	const userEmail = req.body.user_email.toLowerCase();
	const hashPassword = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));

	User.findOne({ where: { email: userEmail } }).then(
		(user) => {
			if (!user) {
				User.create({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: userEmail,
					password: hashPassword
				}).then(
					async (newUser) => {
						const accessTokenPrivateKey = (process.env.accessTokenPrivateKey || config.accessTokenPrivateKey).replace(/\\n/g, '\n');
						const refreshTokenPrivateKey = (process.env.refreshTokenPrivateKey || config.refreshTokenPrivateKey).replace(/\\n/g, '\n');
						const accessToken = jwt.sign({ user_id: newUser.id }, accessTokenPrivateKey, { expiresIn: '30m', algorithm: 'RS256' });
						const refreshToken = jwt.sign({ user_id: newUser.id }, refreshTokenPrivateKey, { expiresIn: '30d', algorithm: 'RS256' });

						return res.json({
							message: 'User created successfully!',
							user: newUser,
							access_token: accessToken,
							refresh_token: refreshToken,
							user_exists: false
						});
					},
					(err) => {
						return serverErrorHandler(res, 'Error: Could not create user in POST sign up', err, { user_create_failed: true });
					}
				);
			} else {
				return badRequestHandler(res, 'Error: User already exists in POST sign up', { user_exists: true });
			}
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user in POST sign up', err, { user_fetch_failed: true });
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
	const refreshToken = req.cookies.refresh_token;

	User.findOne({ where: { email: userEmail.toLowerCase() } }).then(
		(user) => {
			if (!user) {
				return badRequestHandler(res, 'Error: User does not exist', { user_exists: false });
			}

			bcrypt.compare(userPassword, user.password).then(async (result) => {
				if (result) {
					if (refreshToken) {
						await UserToken.findOne({
							where: { refresh_token: refreshToken }
						}).then(
							async (userToken) => {
								if (!userToken) {
									await UserToken.destroy({
										where: { user_id: user.id }
									});
								} else {
									await UserToken.destroy({
										where: { refresh_token: refreshToken }
									});
								}

								res.clearCookie('refresh_token');
							},
							(err) => {
								return serverErrorHandler(res, 'Error: Failed to fetch user token in login', err, { user_token_fetch_failed: true });
							}
						);
					}

					const accessTokenPrivateKey = config.accessTokenPrivateKey.replace(/\\n/g, '\n');
					const refreshTokenPrivateKey = config.refreshTokenPrivateKey.replace(/\\n/g, '\n');
					const accessToken = jwt.sign({ user_id: user.id }, accessTokenPrivateKey, { expiresIn: '30m', algorithm: 'RS256' });
					const newRefreshToken = jwt.sign({ user_id: user.id }, refreshTokenPrivateKey, { expiresIn: '1d', algorithm: 'RS256' });

					UserToken.create({
						user_id: user.id,
						refresh_token: newRefreshToken
					}).then(
						() => {
							res.cookie('refresh_token', newRefreshToken, req.app.get('cookieOptions'));

							return res.json({
								message: 'User logged in successfully!',
								user,
								user_exists: true,
								access_token: accessToken,
								refresh_token: newRefreshToken
							});
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to create user token in login', err, { user_token_create_failed: true });
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
			return serverErrorHandler(res, 'Error: Failed to fetch user profile in login', err, { user_fetch_failed: true });
		}
	);
});

/* GET access token. */
router.get('/access_token', (req, res) => {
	const refreshToken = req.cookies.refresh_token;

	if (!refreshToken) {
		return badRequestHandler(res, 'Error: Refresh token cookie not found');
	}

	res.clearCookie('refresh_token');

	const refreshTokenPublicKey = config.refreshTokenPublicKey.replace(/\\n/g, '\n');

	UserToken.findOne({
		where: { refresh_token: refreshToken }
	}).then(
		(userToken) => {
			if (!userToken) {
				jwt.verify(refreshToken, refreshTokenPublicKey, { algorithm: 'RS256' }, async (err, decoded) => {
					if (err) {
						return forbiddenClientHandler(res, 'Failed to authenticate refresh token in GET access token!', err);
					}

					UserToken.destroy({
						where: { user_id: decoded.user_id }
					}).then(
						() => {
							return forbiddenClientHandler(res, 'This user does not have permission to get access token', err);
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to delete user token in GET access token', err, { user_token_delete_failed: true });
						}
					);
				});
			} else {
				jwt.verify(refreshToken, refreshTokenPublicKey, { algorithm: 'RS256' }, async (err, decoded) => {
					if (err) {
						await UserToken.destroy({
							where: { refresh_token: refreshToken }
						});

						return forbiddenClientHandler(res, 'Failed to authenticate refresh token in GET access token!', err);
					}

					if (userToken.user_id !== decoded.user_id) {
						return forbiddenClientHandler(res, 'Error: User ID and refresh token mismatch in GET access token!');
					}

					const accessTokenPrivateKey = config.accessTokenPrivateKey.replace(/\\n/g, '\n');
					const accessToken = jwt.sign({ user_id: decoded.user_id }, accessTokenPrivateKey, { expiresIn: '30m', algorithm: 'RS256' });
					const refreshTokenPrivateKey = config.refreshTokenPrivateKey.replace(/\\n/g, '\n');
					const newRefreshToken = jwt.sign({ user_id: decoded.user_id }, refreshTokenPrivateKey, { expiresIn: '1d', algorithm: 'RS256' });

					UserToken.destroy({
						where: { refresh_token: refreshToken }
					}).then(
						() => {
							UserToken.create({
								user_id: decoded.user_id,
								refresh_token: newRefreshToken
							}).then(
								() => {
									res.cookie('refresh_token', newRefreshToken, req.app.get('cookieOptions'));

									return res.json({
										message: 'Access and refresh token granted successfully!',
										access_token: accessToken,
										refresh_token: newRefreshToken
									});
								},
								(err) => {
									return serverErrorHandler(res, 'Error: Failed to create user token in GET access token', err, { user_token_create_failed: true });
								}
							);
						},
						(err) => {
							return serverErrorHandler(res, 'Error: Failed to delete user token in GET access token', err, { user_token_delete_failed: true });
						}
					);
				});
			}
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user token in GET access token', err, { user_token_fetch_failed: true });
		}
	);
});

/* GET logout. */
router.get('/logout', (req, res) => {
	const refreshToken = req.cookies.refresh_token;

	if (!refreshToken) {
		return badRequestHandler(res, 'Error: Refresh token cookie not found');
	}

	UserToken.findOne({
		where: { refresh_token: refreshToken }
	}).then(
		async (userToken) => {
			if (!userToken) {
				res.clearCookie('refresh_token');
			} else {
				await UserToken.destroy({
					where: { refresh_token: refreshToken }
				}).then(
					() => {
						res.clearCookie('refresh_token');
					},
					(err) => {
						return serverErrorHandler(res, 'Error: Failed to delete user token in GET logout', err, { user_token_delete_failed: true });
					}
				);
			}

			return res.json({
				message: 'User logged out successfully!',
			});
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user token in GET logout', err, { user_token_fetch_failed: true });
		}
	);
});

module.exports = router;
