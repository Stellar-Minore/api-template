module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('user_tokens', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_id: {
				allowNull: false,
				type: Sequelize.UUID
			},
			refresh_token: {
				allowNull: false,
				type: Sequelize.TEXT('long')
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE
			}
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('user_tokens');
	}
};
