const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model {};
  User.init({
    attendeeId: {type: DataTypes.INTEGER, primaryKey: true},
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    displayNameFormat: {
      type: DataTypes.ENUM('Unknown', 'FirstNameLastName', 'FirstInitialLastName', 'Anonymous', 'Custom'),
      defaultValue: 'Unknown'
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        var displayNameFormat = this.getDataValue('displayNameFormat');
        var firstName = this.getDataValue('firstName');
        var lastName = this.getDataValue('lastName');
        if (!firstName) firstName = "";
        if (!lastName) lastName = "";
        if (displayNameFormat == 'FirstNameLastName'){
          return firstName + " " + lastName;
        }
        else if (displayNameFormat == 'FirstInitialLastName') {
          return firstName.charAt(0) + ". " + lastName;
        }
        else if (displayNameFormat == 'Custom')
          return firstName;
        else
          return 'Anonymous';
      },
      set(name) {
        this.setDataValue('displayNameFormat', 'Custom');
        this.setDataValue('firstName', name);
        this.setDataValue('lastName', "");
      }
    },
    solution1: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution2: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution3: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution4: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution5: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution6: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution7: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution8: {type: DataTypes.BOOLEAN, defaultValue: false},
    solution9: {type: DataTypes.BOOLEAN, defaultValue: false},
    prizeLevel: DataTypes.ENUM('none', 'bluesticker', 'yellowsticker', 'starsticker'),
    score: DataTypes.INTEGER,
    hasClaimedSticker: DataTypes.BOOLEAN,
  }, { sequelize, modelName: 'User' });

  return User;
}