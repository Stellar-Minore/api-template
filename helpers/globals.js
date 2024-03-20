const ResetPasswordCode = require('../models').reset_password_code;
const User = require('../models').user;
const UserToken = require('../models').user_token;

exports.deleteUserAccount = (userID, deletePermanently = false) => {
	const deletionOption = { force: deletePermanently };

	return Promise.all([
		ResetPasswordCode.destroy({ where: { user_id: userID }, ...deletionOption }),
		User.destroy({ where: { id: userID }, ...deletionOption }),
		UserToken.destroy({ where: { user_id: userID }, ...deletionOption })
	]);
};

