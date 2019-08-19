/* This file contains the main interface into sequelize
 * It defines and imports all of the models internally,
 * and exposes utility functions for those models.
 * Avoid needing to export the models.
 */

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'adcHuntDb.sqlite'
});

// load models
var models = {};
models.string = sequelize.import('String', require(__dirname + '/string'));
models.user = sequelize.import('User', require(__dirname + '/user'));
models.blogpost = sequelize.import('BlogPost', require(__dirname + '/blogpost'));
models.puzzle = sequelize.import('Puzzle', require(__dirname + '/puzzle'));

// defaults
var resetStrings = true;
var resetUsers = false;
var resetBlogPosts = false;
var resetPuzzles = true;

var defaultStrings = [
    {
        referenceName: "SOLUTION_1",
        value: ""
    },
    {
        referenceName: "SOLUTION_2",
        value: ""
    },
    {
        referenceName: "SOLUTION_3",
        value: ""
    },
    {
        referenceName: "SOLUTION_4",
        value: ""
    },
    {
        referenceName: "SOLUTION_5",
        value: ""
    },
    {
        referenceName: "SOLUTION_6",
        value: ""
    },
    {
        referenceName: "TWILIO_TWIML_VOICE_RESPONSE",
        value: `Thanks so much for finding my dog Edison, I owe you one!  I knew that Brian's loyal readers would be able to find him.  
        I don't know what I would do without him if I had lost him!  Gosh, now that I think about it,
        Brian was the person who suggested I name my dog Edison in the first place.  Edison always was Brian's
        favorite scientist.  I think he even uses Edison for some of his computer 
        passwords.  Anyway, I'll come pick Edison up now, you can leave him there.  Goodbye!`
    },
    {
        referenceName: "TWILIO_TWIML_SMS_RESPONSE",
        value: "The number you are trying to reach does not support text messaging.  Please call this number instead."
    },

];

var defaultPuzzles = [
    {
        solutionReference: "SOLUTION_1"
    },
    {
        solutionReference: "SOLUTION_2"
    },
    {
        solutionReference: "SOLUTION_3"
    },
    {
        solutionReference: "SOLUTION_4"
    },
    {
        solutionReference: "SOLUTION_5"
    },
    {
        solutionReference: "SOLUTION_6"
    },
];

models.string.sync({force: resetStrings}).then( () => {
    models.string.bulkCreate(defaultStrings);
}).then( () => {

    models.string.findAll().then( strings => {
        console.log("Searching for strings")
        console.log(strings);
    });
});

models.user.sync({force: resetUsers});
models.blogpost.sync({force: resetBlogPosts});

models.puzzle.sync({force: resetPuzzles}).then( () => {
    models.puzzle.create(defaultPuzzles);
}).then( () => {

    models.puzzle.findAll({
        where: {puzzleId: 1}
    }).then( puzzle => {
        console.log("Searching for puzzle")
        console.log(puzzle);
    });
});


//validating communcation to the database 
sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
    }).catch(err => {
    console.error('Unable to connect to the database:', err);
});

/* String Management */
module.exports.Strings = {
    getList: async () => {
        var stringList = await models.string.findAll({
            attributes: ['referenceName'],
            order: [
                ['referenceName', 'DESC']
            ]
        });
        return stringList;
    },
    create: async (referenceName, value) => {
        var result = await models.string.create(
                { "referenceName": referenceName, "value": value }
            );
        return result;
    },
    get: async (referenceName) => {
        var string = await models.string.findOne({
            where: {referenceName: referenceName}
        });
        return string || "";
    },
    set: async (referenceName, value) => {
        console.log("Updating string: " + referenceName + " to " + value)
        var numUpdated = await models.string.update(
            {
                value: value 
            },
            {
                where: {referenceName: referenceName}
            }
        );
        return (numUpdated > 0);
    },
    delete: async (referenceName) => {
        var numDestroyed = await models.string.destroy({
            where: {referenceName: referenceName}
        });
        return (numDestroyed > 0);
    },
}

/* User Management */
module.exports.User = {
    findUser: async (attendeeId) => {
        var user = await models.user.findByPk(parseInt(attendeeId));
        return user;
    },
    createUser: async (attendeeId, first, last) => {
        var user = await models.user.findOrCreate(
            { 
                where: { attendeeId: parseInt(attendeeId) },
                defaults: {firstName:first, lastName: last}
            });
        return user[1];
    },
    checkExists: async (attendeeId) => {
        var count = await models.user.count({ where: { attendeeId: parseInt(attendeeId) } });
        if (count != 0) {
            return true;
        }
        return false;
    },
    deleteUser: async (attendeeId) => {
        var numDestroyed = await models.user.destroy(
        {
            where: { attendeeId: parseInt(attendeeId) }
        });
        return (numDestroyed > 0);
    },
    setFullName: async (attendeeId, fullName) => {
        var numUpdated = await models.user.update(
        {
            fullName: fullName
        },
        {
            where: { attendeeId: parseInt(attendeeId) }
        });
        return (numUpdated[0] > 0);
    },
    setDisplayNameFormat: async (attendeeId, displayNameFormat) => {
        if (displayNameFormat != 'Unknown' &&
            displayNameFormat != 'FirstNameLastName' &&
            displayNameFormat != 'FirstInitialLastName' &&
            displayNameFormat != 'Anonymous') {
                return false;
            }
            
        var numUpdated = await models.user.update(
        {
            displayNameFormat: displayNameFormat
        },
        {
            where: { attendeeId: parseInt(attendeeId) }
        });
        return (numUpdated[0] > 0);
    },
    submitPassword: async (attendeeId, solutionId, password) => {
        var passwords = ["password1","password2","password3","password4","password5","password6"];
        if (solutionId > 0 && 
            solutionId <= passwords.length && 
            password.toLowerCase() == passwords[solutionId-1]) {
            //Correct password - update in table
            var updateStruct;
            if (solutionId == 1)
                updateStruct = {solution1: true};
            else if (solutionId == 2)
                updateStruct = {solution2: true};
            else if (solutionId == 3)
                updateStruct = {solution3: true};
            else if (solutionId == 4)
                updateStruct = {solution4: true};
            else if (solutionId == 5)
                updateStruct = {solution5: true};
            else if (solutionId == 6)
                updateStruct = {solution6: true};
            else if (solutionId == 7)
                updateStruct = {solution7: true};
            else if (solutionId == 8)
                updateStruct = {solution8: true};
            else if (solutionId == 9)
                updateStruct = {solution9: true};
            if (updateStruct) {
                var numUpdated = await models.user.update(
                    updateStruct,
                    {
                        where: { attendeeId: parseInt(attendeeId) }
                    });
                return (numUpdated[0] > 0);
            } else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}

module.exports.BlogPost = {
    //Blog list
    getList: async () => {
        var blogList = await models.blogpost.findAll({
            attributes: ['blogId', 'title', 'releaseTime'],
            order: [
                ['releaseTime', 'DESC']
            ]
        });
        return blogList;
    },
    createPost: async (title, subtitle, author, dateStr, timeStr, imgPath, releaseTime, text) => {
        var result = await models.blogpost.create(
                { "title": title, "subtitle": subtitle, "author": author, "imagePath": imgPath,
                    "date": dateStr, "time": timeStr, "releaseTime": releaseTime, "text": text }
            );
        return result;
    },
    getPost: async (blogId) => {
        if (parseInt(blogId)) {
            var blogPost = await models.blogpost.findByPk(parseInt(blogId));
            return blogPost;
        }
        return "";
    },
    getActivePosts: async (dateUntil) => {
        var blogList = await models.blogpost.findAll({
            attributes: ['blogId', 'releaseTime', 'title', 'subtitle', 'imagePath', 'date', 'time', 'author', 'teaserText'],
            order: [
                ['releaseTime', 'DESC']
            ],
            where: {      
                releaseTime: { 
                    [Op.lte]: dateUntil.toISOString()
              }

            }
        });
        return blogList;
    },
    deletePost: async (blogId) => {
        if (parseInt(blogId)) {
            var numDestroyed = await models.blogpost.destroy(
                {
                    where: { blogId: parseInt(blogId) }
                });
            return (numDestroyed > 0);
        }
        return false;
    },
    updatePost: async (blogId, title, subtitle, author, dateStr, timeStr, imgPath, releaseTime, text) => {
        if (parseInt(blogId)) {
            var updateStruct = {};
            if (title) updateStruct["title"] = title;
            if (subtitle) updateStruct["subtitle"] = subtitle;
            if (author) updateStruct["author"] = author;
            if (imgPath) updateStruct["imagePath"] = imgPath;
            if (dateStr) updateStruct["date"] = dateStr;
            if (timeStr) updateStruct["time"] = timeStr;
            if (releaseTime) updateStruct["releaseTime"] = releaseTime;
            if (text) updateStruct["text"] = text;
            var numUpdated = await models.blogpost.update(
                updateStruct,
                {
                    where: { blogId: parseInt(blogId) }
                });
            return (numUpdated[0] > 0);
        } else {
            return false;
        }
    },
}

/* Puzzle Management */
module.exports.Puzzle = {
    get: async (puzzleId) => {
        var puzzle = await models.puzzle.findOne({
            where: {puzzleId: puzzleId}
        });
        return puzzle;
    }
}

module.exports.sequelize = sequelize;