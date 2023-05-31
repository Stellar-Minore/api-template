module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('reset_password_codes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			code: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			used: {
				allowNull: false,
				defaultValue: false,
				type: Sequelize.BOOLEAN,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.UUID
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
	async down(queryInterface) {
		await queryInterface.dropTable('reset_password_codes');
	}
};
