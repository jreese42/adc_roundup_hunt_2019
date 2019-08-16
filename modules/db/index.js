/* This file contains the main interface into sequlize
 * It defines and imports all of the models internally,
 * and exposes utility functions for those models.
 * Avoid needing to export the models.
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'adcHuntDb.sqlite'
});

// load models

var models = {};
models.user = sequelize.import('User', require(__dirname + '/user'));

//validating communcation to the database 
sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
    }).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports.User = {
    findUserByAttendeeId: async function(attendeeId, firstName, lastName) {
        var user = await models.user.findOrCreate(
            { 
                where: { attendeeId: parseInt(attendeeId) },
                defaults: {firstName:firstName, lastName: lastName}
            });
        return user[0];
    }
}

module.exports.sequelize = sequelize;