const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Puzzle extends Sequelize.Model {};
  Puzzle.init({
    puzzleId: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    solutionReference: { type: DataTypes.STRING(255), allowNull: false },
    solvedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    incorrectCount: { type: DataTypes.INTEGER, defaultValue: 0 },

  }, { sequelize, modelName: 'Puzzle' });

  return Puzzle;
}