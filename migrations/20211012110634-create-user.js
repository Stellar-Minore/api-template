module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				allowNull: false,
				defaultValue: Sequelize.UUIDV4,
				autoIncrement: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true
			},
			first_name: {
				type: Sequelize.STRING,
				allowNull: true
			},
			last_name: {
				type: Sequelize.STRING,
				allowNull: true
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
		await queryInterface.dropTable('users');
	}
};
