const { Op } = require('sequelize');
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

exports.deleteExpiredAccounts = () => {
	User.findAll({ where: { deletion_interval_in_days: { [Op.ne]: null } }, paranoid: false }).then(
		(users) => {
			const currentDate = new Date();
			const deletePermanently = true;

			users.forEach(async (user) => {
				const deletionDate = new Date(
					user.updated_at.getTime() + (user.deletion_interval_in_days * 24 * 60 * 60 * 1000)
				);

				if (deletionDate <= currentDate) {
					await this.deleteUserAccount(user.id, deletePermanently).catch(
						(err) => {
							console.log('Failed to delete user account in delete expired accounts', err);
						}
					);
				}
			});
		},
		(err) => {
			console.log('Failed to fetch user accounts in delete expired accounts', err);
		}
	);
};
