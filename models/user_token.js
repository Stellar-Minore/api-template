const {
	Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class user_token extends Model {
		static associate() {
			// define association here
		}
	}
	user_token.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false
		},
		refresh_token: {
			type: DataTypes.TEXT('long'),
			allowNull: false
		},
	}, {
		sequelize,
		modelName: 'user_token',
		paranoid: true,
		underscored: true
	});
	return user_token;
};
