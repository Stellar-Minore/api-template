module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('users', 'deletion_interval_in_days', {
			type: Sequelize.INTEGER,
			allowNull: true
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('users', 'deletion_interval_in_days');
	}
};
