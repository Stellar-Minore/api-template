const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class user extends Model {
		static associate(models) {
			this.hasOne(models.reset_password_code, {
				foreignKey: 'user_id',
				sourceKey: 'id'
			});
		}
	}
	user.init({
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'user',
		paranoid: true,
		underscored: true
	});

	return user;
};
