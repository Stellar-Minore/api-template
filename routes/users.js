const express = require('express');

const router = express.Router();
const User = require('../models').user;
const { badRequestHandler, serverErrorHandler } = require('../helpers/errorHandlers');
const { accountAuthenticator } = require('../helpers/middlewares');
const { deleteUserAccount } = require('../helpers/globals');

/* GET users listing. */
router.get('/', (req, res) => {
	/* #swagger.path = '/users/' #swagger.tags = ['User'] */
	res.send('respond with a resource');
});

/* DELETE user account. */
router.delete('/account', accountAuthenticator, (req, res) => {
	/* #swagger.path = '/users/account'
	#swagger.tags = ['User']
	#swagger.summary = 'Deletes user account or marks user account for deletion.'
	#swagger.responses[200] = { schema: {
		message1: 'User account deleted successfully!',
		message2: 'User account marked for deletion successfully!'
	} }
	#swagger.responses[400, 500] = { schema: {
		$ref: '#/definitions/DeleteUserAccountErrorResponse' }
	}
	#swagger.responses[403] = { schema: { $ref: '#/definitions/ForbiddenClientErrors' } }
	*/

	const userID = req.decodedUserID;

	if (!('deletion_interval' in req.body)) {
		return badRequestHandler(res, 'Error: Deletion interval is not specified');
	}

	const deletionInterval = parseInt(req.body.deletion_interval, 10);

	if (Number.isNaN(deletionInterval) || deletionInterval < 0 || deletionInterval > 60) {
		return badRequestHandler(res, 'Error: Deletion interval must be a number between 0 and 60');
	}

	User.findOne({ where: { id: userID } }).then(
		async (user) => {
			if (!user) {
				return badRequestHandler(res, 'Error: User with this ID does not exist in DELETE user account', { user_does_not_exist: true });
			}

			if (user.deletion_interval_in_days) {
				return badRequestHandler(res, 'Error: User has already marked their account for deletion in DELETE user account', { already_marked_for_deletion: true });
			}

			const immediateDeletionRequested = (deletionInterval === 0);

			if (!immediateDeletionRequested) {
				await user.update({ deletion_interval_in_days: deletionInterval }).catch(
					(err) => {
						return serverErrorHandler(res, 'Error: Failed to update user details in DELETE user account', err, { user_details_update_failed: true });
					}
				);
			}

			deleteUserAccount(userID, immediateDeletionRequested).then(
				() => {
					res.clearCookie('refresh_token');

					return res.json({
						message: immediateDeletionRequested ? 'User account deleted successfully!' : 'User account marked for deletion successfully!'
					});
				},
				(err) => {
					return serverErrorHandler(res, 'Error: Failed to delete user account in DELETE user account', err, { delete_user_account_failed: true });
				}
			);
		},
		(err) => {
			return serverErrorHandler(res, 'Error: Failed to fetch user details in DELETE user account', err, { user_details_fetch_failed: true });
		}
	);
});

module.exports = router;
