const swaggerAutogen = require('swagger-autogen')();

const outputFile = '../swagger_output.json';
const endpointsFiles = ['../routes/*.js'];

const doc = {
	info: {
		title: 'API Template Documentation',
		description: 'Documentation for Stellar\'s API Template',
		version: '1.0.0',
	},
	host: process.env.API_HOST || 'localhost:3000',
	basePath: '/',
	schemes: ['http', 'https'],
	consumes: ['application/json'],
	produces: ['application/json'],
	tags: [
		{
			name: 'Index'
		},
		{
			name: 'User'
		}
	],
	definitions: {
		DeleteUserAccountErrorResponse: {
			400: {
				message1: 'Deletion interval is not specified',
				message2: 'Deletion interval must be a number between 0 and 60',
				user_does_not_exist: true,
				message3: 'User with this ID does not exist in DELETE user account',
				already_marked_for_deletion: true,
				message4: 'User has already marked their account for deletion in DELETE user account'
			},
			500: {
				user_details_update_failed: true,
				message1: 'Failed to update user details in DELETE user account',
				delete_user_account_failed: true,
				message2: 'Failed to delete user account in DELETE user account',
				user_details_fetch_failed: true,
				message3: 'Failed to fetch user details in DELETE user account'
			}
		},
		ForbiddenClientErrors: {
			success: false,
			permission_denied: true,
			message1: 'Refresh token cookie not found',
			message2: 'Failed to authenticate token',
			message3: 'This user account is deleted',
			message4: 'Could not find user in user account authentication',
			message5: 'User ID and Auth Token mismatch',
			message6: 'No token provided',
		},
		GetAccessTokenResponse: {
			message: 'Access and refresh token granted successfully!',
			access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
			refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
		},
		GetAccessTokenErrorResponse: {
			400: {
				message: 'Refresh token cookie not found'
			},
			403: {
				message1: 'Failed to authenticate refresh token in GET access token',
				message2: 'This user does not have permission to get access token',
				message3: 'Failed to authenticate refresh token in GET access token',
				message4: 'User ID and refresh token mismatch in GET access token',
			},
			500: {
				user_token_delete_failed: true,
				message1: 'Failed to delete user token in GET access token',
				user_token_create_failed: true,
				message2: 'Failed to create user token in GET access token',
				user_token_fetch_failed: true,
				message3: 'Failed to fetch user token in GET access token'
			}
		},
		GetResetCodeErrorResponse: {
			400: {
				message1: 'User email is not specified',
				user_does_not_exist: true,
				message2: 'User with this email does not exist in GET reset code'
			},
			500: {
				update_reset_password_code_failed: true,
				message1: 'Failed to update reset password code in GET reset code',
				create_reset_password_code_failed: true,
				message2: 'Failed to create reset password code in GET reset code',
				send_email_failed: true,
				message3: 'Failed to send reset password email in GET reset code',
				user_fetch_failed: true,
				message4: 'Failed to fetch user details in GET reset code'
			}
		},
		LoginResponse: {
			message: 'User logged in successfully!',
			user: { $ref: '#/definitions/User' },
			user_exists: true,
			access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
			refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
		},
		LoginErrorResponse: {
			400: {
				message1: 'User email is not specified',
				message2: 'User password is not specified',
				user_exists: false,
				message3: 'User does not exist',
				message4: 'Invalid credentials'
			},
			500: {
				user_token_fetch_failed: true,
				message1: 'Failed to fetch user token in login',
				user_token_create_failed: true,
				message2: 'Failed to create user token in login',
				user_exists: true,
				message3: 'Failed to verify password in login',
				user_fetch_failed: true,
				message4: 'Failed to fetch user profile in login'
			}
		},
		LogOutErrorResponse: {
			400: {
				message: 'Refresh token cookie not found'
			},
			500: {
				user_token_delete_failed: true,
				message1: 'Failed to delete user token in GET logout',
				user_token_fetch_failed: true,
				message2: 'Failed to fetch user token in GET logout'
			}
		},
		ResetPasswordCode: {
			$id: 1,
			$user_id: '92f7892b-c3cd-4db9-ab97-4b036dd9e238',
			$code: 3742,
			$used: true
		},
		ResetPasswordErrorResponse: {
			400: {
				message1: 'User email is not specified',
				message2: 'User password is not specified',
				user_does_not_exist: true,
				message3: 'User with this email does not exist in POST reset password',
				reset_code_expired: true,
				message4: 'Reset code has expired in POST reset password'
			},
			403: {
				message: 'User has not requested the reset code in POST reset password'
			},
			500: {
				update_reset_code_failed: true,
				message1: 'Failed to update reset code in POST reset password',
				reset_pasword_failed: true,
				message2: 'Failed to reset password in POST reset password',
				user_fetch_failed: true,
				message3: 'Failed to fetch user details in POST reset password'
			}
		},
		SignUpResponse: {
			message: 'User created successfully!',
			user: { $ref: '#/definitions/User' },
			access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
			refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
			user_exists: false
		},
		SignUpErrorResponse: {
			400: {
				message1: 'User first name is not specified',
				message2: 'User last name is not specified',
				message3: 'User email is not specified',
				message4: 'Password is not specified',
				user_exists: true,
				message5: 'User already exists in POST sign up'
			},
			500: {
				user_create_failed: true,
				message1: 'Could not create user in POST sign up',
				user_fetch_failed: true,
				message2: 'Failed to fetch user in POST sign up'
			}
		},
		User: {
			$id: '92f7892b-c3cd-4db9-ab97-4b036dd9e238',
			first_name: 'Stellar',
			last_name: 'Hissay',
			$email: 'hissay@gmail.com',
			password: 'Hissay123@'
		},
		UserToken: {
			$id: 1,
			$user_id: '92f7892b-c3cd-4db9-ab97-4b036dd9e238',
			$refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
		},
		VerifyResetCodeErrorResponse: {
			400: {
				message1: 'User email is not specified',
				message2: 'Reset code is not specified',
				user_does_not_exist: true,
				message3: 'User with this email does not exist in POST verify reset code',
				invalid_reset_code: true,
				message4: 'Invalid reset code in POST verify reset code',
				reset_code_used: true,
				message5: 'Reset code is already used in POST verify reset code',
				reset_code_expired: true,
				message6: 'Reset code has expired in POST verify reset code'
			},
			500: {
				user_fetch_failed: true,
				message: 'Failed to fetch user details in POST verify reset code'
			}
		}
	}
};

swaggerAutogen(outputFile, endpointsFiles, doc);
