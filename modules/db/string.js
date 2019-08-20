const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class String extends Sequelize.Model {};
  String.init({
    stringId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    referenceName: { type: DataTypes.STRING(255), unique: true, allowNull: false},
    value: { type: DataTypes.STRING(4096), allowNull: false },
  }, { sequelize, modelName: 'String' });

  return String;
}