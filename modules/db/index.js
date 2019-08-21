/* This file contains the main interface into sequelize
 * It defines and imports all of the models internally,
 * and exposes utility functions for those models.
 * Avoid needing to export the models.
 */

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//If production and DATABASE_URL is set, use postgres without logging
//If not production and DATABASE_URL is set, use postgres with logging
//If not production and no DATABASE_URL, fall back to sqlite3
const sequelize = (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') ? 
    new Sequelize( // DATABASE_URL is set
        process.env.DATABASE_URL, 
        { 
            dialect: 'postgres'
        }
    ) :
    (process.env.DATABASE_URL) ?
    new Sequelize( // DATABASE_URL is unset, so use a local instance
        process.env.DATABASE_URL, //On a local machine, this is something like 'postgres://postgres:postgres@127.0.0.1:5432/adcRoundupHunt'
        {
            dialect: 'postgres',
            logging:  console.log
        }
    ) :
    new Sequelize({
        dialect: 'sqlite',
        storage: 'adcHuntDb.sqlite'
    });


// load models
var models = {
    string: sequelize.import('String', require(__dirname + '/string')),
    user: sequelize.import('User', require(__dirname + '/user')),
    blogpost: sequelize.import('BlogPost', require(__dirname + '/blogpost')),
    puzzle: sequelize.import('Puzzle', require(__dirname + '/puzzle')),
};

// defaults
var resetStrings = false;  //Be very careful with these. Set to true to wipe and reinitalize each table.
var resetUsers = false;
var resetBlogPosts = false;
var resetPuzzles = false;

if (process.env.NODE_ENV === 'production') {
    //Never allow resyncing this way in production.
    resetStrings = false;
    resetUsers = false;
    resetBlogPosts = false;
    resetPuzzles = false;
}

var defaultStrings = [
    {
        referenceName: 'SOLUTION_REGEX_1',
        value: ''
    },
    {
        referenceName: 'SOLUTION_REGEX_2',
        value: ''
    },
    {
        referenceName: 'SOLUTION_REGEX_3',
        value: ''
    },
    {
        referenceName: 'SOLUTION_REGEX_4',
        value: ''
    },
    {
        referenceName: 'SOLUTION_REGEX_5',
        value: ''
    },
    {
        referenceName: 'SOLUTION_REGEX_6',
        value: ''
    },
    {
        referenceName: 'TWILIO_TWIML_VOICE_RESPONSE',
        value: `Thanks so much for finding my dog Edison, I owe you one!  I knew that Brian's loyal readers would be able to find him.  
        I don't know what I would do without him if I had lost him!  Gosh, now that I think about it,
        Brian was the person who suggested I name my dog Edison in the first place.  Edison always was Brian's
        favorite scientist.  I think he even uses Edison for some of his computer 
        passwords.  Anyway, I'll come pick Edison up now, you can leave him there.  Goodbye!`
    },
    {
        referenceName: 'TWILIO_TWIML_SMS_RESPONSE',
        value: 'The number you are trying to reach does not support text messaging.  Please call this number instead.'
    },

];

var defaultPuzzles = [
    {
        solutionRegexReference: 'SOLUTION_REGEX_1'
    },
    {
        solutionRegexReference: 'SOLUTION_REGEX_2'
    },
    {
        solutionRegexReference: 'SOLUTION_REGEX_3'
    },
    {
        solutionRegexReference: 'SOLUTION_REGEX_4'
    },
    {
        solutionRegexReference: 'SOLUTION_REGEX_5'
    },
    {
        solutionRegexReference: 'SOLUTION_REGEX_6'
    },
];

models.string.sync({force: resetStrings}).then( () => {
    models.string.bulkCreate(defaultStrings);
});

models.user.sync({force: resetUsers});
models.blogpost.sync({force: resetBlogPosts});

models.puzzle.sync({force: resetPuzzles}).then( () => {
    models.puzzle.bulkCreate(defaultPuzzles);
});


//validating communcation to the database 
sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
    }).catch(err => {
    console.error('Unable to connect to the database:', err);
});

/* String Management */
var Strings = {
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
                { 'referenceName': referenceName, 'value': value }
            );
        return result;
    },
    get: async (referenceName) => {
        var string = await models.string.findOne({
            where: {referenceName: referenceName}
        });
        if (string)
            return string.value || '';
        else return '';
    },
    set: async (referenceName, value) => {
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
var User = {
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
    submitPassword: async (attendeeId, puzzleId, submittedPass) => {

        var puzzle = await Puzzle.get(puzzleId);
        if (!puzzle) {
            return false;
        }

        var correctPass = await Strings.get(puzzle.solutionRegexReference);
        if (!correctPass) {
            return false;
        }

        var correctRe;
        try {
            correctRe = new RegExp(correctPass, 'i');
        } catch (ex) {
            // Password regex was invalid, puzzlemaster needs to fix that
            console.log('Invalid password regex for puzzleId=' + puzzleId + ', string=' + correctPass);
            return false;
        }

        if (correctRe.test(submittedPass)) {
            //Correct password - update in table
            var updateStruct;
            if (puzzleId === 1) {
                updateStruct = {solution1: true};
            } else if (puzzleId === 2) {
                updateStruct = {solution2: true};
            } else if (puzzleId === 3) {
                updateStruct = {solution3: true};
            } else if (puzzleId === 4) {
                updateStruct = {solution4: true};
            } else if (puzzleId === 5) {
                updateStruct = {solution5: true};
            } else if (puzzleId === 6) {
                updateStruct = {solution6: true};
            } else if (puzzleId === 7) {
                updateStruct = {solution7: true};
            } else if (puzzleId === 8) {
                updateStruct = {solution8: true};
            } else if (puzzleId === 9) {
                updateStruct = {solution9: true};
            }

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
        } else {
            return false;
        }
    }
}

var BlogPost = {
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
                { 'title': title, 'subtitle': subtitle, 'author': author, 'imagePath': imgPath,
                    'date': dateStr, 'time': timeStr, 'releaseTime': releaseTime, 'text': text }
            );
        return result;
    },
    getPost: async (blogId) => {
        if (parseInt(blogId)) {
            var blogPost = await models.blogpost.findByPk(parseInt(blogId));
            return blogPost;
        }
        return '';
    },
    getPostIfActive: async (blogId, date) => {
        if (parseInt(blogId)) {
            var blogPost = await models.blogpost.findOne({
                where: {  
                    blogId: parseInt(blogId),   
                    releaseTime: { 
                        [Op.lte]: date.toISOString()
                    }
                }
            });
            return blogPost;
        }
        return '';
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
            if (title) updateStruct['title'] = title;
            if (subtitle) updateStruct['subtitle'] = subtitle;
            if (author) updateStruct['author'] = author;
            if (imgPath) updateStruct['imagePath'] = imgPath;
            if (dateStr) updateStruct['date'] = dateStr;
            if (timeStr) updateStruct['time'] = timeStr;
            if (releaseTime) updateStruct['releaseTime'] = releaseTime;
            if (text) updateStruct['text'] = text;
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
var Puzzle = {
    get: async (puzzleId) => {
        var puzzle = await models.puzzle.findOne({
            where: {puzzleId: puzzleId}
        });
        return puzzle;
    }
}

module.exports.Strings = Strings;
module.exports.User = User;
module.exports.BlogPost = BlogPost;
module.exports.Puzzle = Puzzle;
module.exports.sequelize = sequelize;
