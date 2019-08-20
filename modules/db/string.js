const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class String extends Sequelize.Model {};
  String.init({
    stringId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    referenceName: { type: DataTypes.STRING, unique: true, allowNull: false},
    value: { type: DataTypes.STRING, allowNull: false },
  }, { sequelize, modelName: 'String' });

  return String;
}