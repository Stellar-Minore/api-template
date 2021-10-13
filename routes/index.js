const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { badRequestHandler, serverErrorHandler } = require('../helpers/errorHandlers');
const User = require('../models').user;

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
								const auth_token = jwt.sign(new_user.id, req.app.get('superSecret'));

								return res.json({
									message: 'User Created!',
									user: new_user,
									auth_token,
									user_exists: false
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

module.exports = router;
