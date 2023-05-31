const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class reset_password_code extends Model {
		static associate(models) {
			this.belongsTo(models.user, {
				foreignKey: 'user_id',
				targetKey: 'id'
			});
		}
	}

	reset_password_code.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		code: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		used: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'reset_password_code',
		paranoid: true,
		underscored: true
	});

	return reset_password_code;
};
