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

var defaultStrings = [
    {
        referenceName: "DATETIME_START_UTC",
        value: ""
    },
    {
        referenceName: "DATETIME_END_UTC",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_1",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_2",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_3",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_4",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_5",
        value: ""
    },
    {
        referenceName: "SOLUTION_REGEX_6",
        value: ""
    },   
    {
        referenceName: "SECURITY_QUESTION_1",
        value: "Security Question 1"
    },
    {
        referenceName: "SECURITY_QUESTION_2",
        value: "Security Question 2"
    },
    {
        referenceName: "SECURITY_QUESTION_3",
        value: "Security Question 3"
    },
    {
        referenceName: "SECURITY_QUESTION_4",
        value: "Security Question 4"
    },
    {
        referenceName: "SECURITY_QUESTION_5",
        value: "Security Question 5"
    },
    {
        referenceName: "TWILIO_TWIML_VOICE_RESPONSE",
        value: "Thanks so much for finding my dog Edison, I owe you one!  I knew that Brian's loyal readers would be able to find him.\
        I don't know what I would do without him if I had lost him!  Gosh, now that I think about it,\
        Brian was the person who suggested I name my dog Edison in the first place.  Edison always was Brian's\
        favorite scientist.  I think he even uses Edison for some of his computer\
        passwords.  Anyway, I'll come pick Edison up now, you can leave him there.  Goodbye!"
    },
    {
        referenceName: "TWILIO_TWIML_SMS_RESPONSE",
        value: "The number you are trying to reach does not support text messaging.  Please call this number instead."
    },

];

var defaultPuzzles = [
    {
        solutionReference: "SOLUTION_REGEX_1"
    },
    {
        solutionReference: "SOLUTION_REGEX_2"
    },
    {
        solutionReference: "SOLUTION_REGEX_3"
    },
    {
        solutionReference: "SOLUTION_REGEX_4"
    },
    {
        solutionReference: "SOLUTION_REGEX_5"
    },
    {
        solutionReference: "SOLUTION_REGEX_6"
    },
];

var Defaults = {
    resyncStrings: async () => {
        models.string.sync({force: true}).then( () => {
            models.string.bulkCreate(defaultStrings);
        });
    },
    resyncUsers: async () => {
        models.user.sync({force: true});
    },
    resyncBlogPosts: async () => {
        models.blogpost.sync({force: true});
    },
    resyncPuzzles: async () => {
        models.puzzle.sync({force: true}).then( () => {
            models.puzzle.bulkCreate(defaultPuzzles);
        });
    }
}


//validating communcation to the database 
console.log("Connecting to database.  Dialect = " + sequelize.getDialect());
sequelize.authenticate().then(() => {
    console.log('Connection established successfully.');
    }).catch(err => {
    console.error('Unable to connect to the database:', err);
});

/* String Management */
var StringsCache = {};
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
                { "referenceName": referenceName, "value": value }
            );
        if (result.referenceName)
            StringsCache[result.referenceName] = result.value;
        return result;
    },
    get: async (referenceName) => {
        if (StringsCache[referenceName]){
            // Cache hit
            return StringsCache[referenceName];
        }
        else {
            // Cache miss
            var string = await models.string.findOne({
                where: {referenceName: referenceName}
            });
            if (string){
                if (string.value) StringsCache[referenceName] = string.value;
                return string.value || "";
            }
            else return "";
        }
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

        if (numUpdated > 0) 
            StringsCache[referenceName] = value;

        return (numUpdated > 0);
    },
    delete: async (referenceName) => {
        var numDestroyed = await models.string.destroy({
            where: {referenceName: referenceName}
        });

        if (numDestroyed > 0) 
            delete StringsCache[referenceName];

        return (numDestroyed > 0);
    },
}

/* User Management */
var User = {
    findUser: async (attendeeId) => {
        var user = await models.user.findByPk(attendeeId).catch(() => {return null;});
        return user;
    },
    createUser: async (attendeeId, first, last) => {
        var user = await models.user.findOrCreate(
            { 
                where: { attendeeId: attendeeId },
                defaults: {firstName:first, lastName: last}
            });
        return user[1];
    },
    checkExists: async (attendeeId) => {
        var count = await models.user.count({ where: { attendeeId: attendeeId } });
        if (count != 0) {
            return true;
        }
        return false;
    },
    deleteUser: async (attendeeId) => {
        var numDestroyed = await models.user.destroy(
        {
            where: { attendeeId: attendeeId }
        });
        return (numDestroyed > 0);
    },
    setFullName: async (attendeeId, fullName) => {
        var numUpdated = await models.user.update(
        {
            fullName: fullName
        },
        {
            where: { attendeeId: attendeeId }
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
            where: { attendeeId: attendeeId }
        });
        return (numUpdated[0] > 0);
    },
    setHasClaimedSticker: async (attendeeId, hasClaimedSticker) => {
        var numUpdated = await models.user.update(
        {
            hasClaimedSticker: hasClaimedSticker
        },
        {
            where: { attendeeId: attendeeId }
        });
        return (numUpdated[0] > 0);
    },
    submitPassword: async (attendeeId, puzzleId, submittedPass) => {
        if (!submittedPass || !puzzleId || !attendeeId)
            return false;
        var trimmedPass = submittedPass.substring(0, 70).toLowerCase();
        var puzzle = await Puzzle.get(puzzleId);
        if (!puzzle)
            return false;

        var correctPassRegex = await Strings.get(puzzle.solutionReference);
        if (!correctPassRegex)
            return false;
        try {
            const passRe = new RegExp(correctPassRegex, 'i')
            if (passRe.test(trimmedPass)) {
                //Correct password - update in table
                var user = await models.user.findOne(
                    {
                        where: { attendeeId: attendeeId }
                    }
                );

                if (!user) 
                    return false;

                var userPoints = 0;
                switch (puzzle.solvedCount) {
                    case 0:
                    case 1:
                    case 2:
                        userPoints = 400;
                        break;
                    case 3:
                    case 4:
                        userPoints = 300;
                        break;
                    case 5:
                        userPoints = 200;
                        break;
                    case 6: 
                    default:
                        userPoints = 100;
                        break;
                }
                
                if (puzzleId == 1) {
                    if (!user.solution1) user.set('score', user.score + userPoints);
                    user.set('solution1', true);
                }
                else if (puzzleId == 2) {
                    if (!user.solution2) user.set('score', user.score + userPoints);
                    user.set('solution2', true);
                }
                else if (puzzleId == 3) {
                    if (!user.solution3) user.set('score', user.score + userPoints);
                    user.set('solution3', true);
                }
                else if (puzzleId == 4) {
                    if (!user.solution4) user.set('score', user.score + userPoints);
                    user.set('solution4', true);
                }
                else if (puzzleId == 5) {
                    if (!user.solution5) user.set('score', user.score + userPoints);
                    user.set('solution5', true);
                }
                else if (puzzleId == 6) {
                    if (!user.solution6) user.set('score', user.score + userPoints);
                    user.set('solution6', true);
                }
                else if (puzzleId == 7) {
                    if (!user.solution7) user.set('score', user.score + userPoints);
                    user.set('solution7', true);
                }
                else if (puzzleId == 8) {
                    if (!user.solution8) user.set('score', user.score + userPoints);
                    user.set('solution8', true);
                }
                else if (puzzleId == 9) {
                    if (!user.solution9) user.set('score', user.score + userPoints);
                    user.set('solution9', true);
                }

                //Update the user prizeLevel
                /* Any Question right: Common Prize
                 * Top 150 scores: Rare Prize
                 * Top 50 scores: Top Prize
                 */

                //award the common prize
                if (user.prizeLevel == "none")
                    user.set('prizeLevel', "bluesticker");

                var numFirstPrizes = 50;
                var numSecondPrizes = 100;
                //Get a list of the top attendeeIds by score
                var prizes_before = await models.user.findAll({
                    offset: 0,
                    limit: numFirstPrizes + numSecondPrizes,
                    attributes: ['attendeeId', 'score', 'prizeLevel'],
                    order: [
                        ['score', 'DESC']
                    ]
                });
                var firstPrize_before = prizes_before.slice(0, numFirstPrizes);
                var secondPrize_before = prizes_before.slice(numFirstPrizes, numFirstPrizes + numSecondPrizes);

                //save the new scores back to the db
                var userSavePromise = user.save();
                puzzle.set('solvedCount', puzzle.solvedCount + 1);
                puzzle.save();

                userSavePromise.then( () => {
                    //recalculate the top players
                    models.user.findAll({
                        offset: 0,
                        limit: numFirstPrizes + numSecondPrizes,
                        attributes: ['attendeeId', 'score', 'prizeLevel'],
                        order: [
                            ['score', 'DESC']
                        ]
                    }).then ( prizes_after => {
                        var firstPrize_after = prizes_after.slice(0, numFirstPrizes);
                        var secondPrize_after = prizes_after.slice(numFirstPrizes, numFirstPrizes + numSecondPrizes);
    
                        for (var i = 0; i < firstPrize_before.length; i++) {
                            //players that were in the old list, but not the new list get dropped
                            if (!firstPrize_after.includes(firstPrize_before[i])) {
                                var userToUpdate = firstPrize_before[i];
                                userToUpdate.set('prizeLevel', "bluesticker");
                                userToUpdate.save();
                            }
                        }
    
                        for (var i = 0; i < secondPrize_before.length; i++) {
                            //players that were in the old list, but not the new list get dropped
                            if (!secondPrize_after.includes(secondPrize_before[i])) {
                                var userToUpdate = secondPrize_before[i];
                                userToUpdate.set('prizeLevel', "bluesticker");
                                userToUpdate.save();
                            }
                        }
    
                        for (var i = 0; i < firstPrize_after.length; i++) {
                            //players in the new list but not in the old list get set                    
                            if (!firstPrize_before.includes(firstPrize_after[i])) {
                                var userToUpdate = firstPrize_after[i];
                                userToUpdate.set('prizeLevel', "starsticker");
                                userToUpdate.save();
                            }
                        }
    
                        for (var i = 0; i < secondPrize_after.length; i++) {
                            //players in the new list but not in the old list get set                    
                            if (!secondPrize_before.includes(secondPrize_after[i])) {
                                var userToUpdate = secondPrize_after[i];
                                userToUpdate.set('prizeLevel', "yellowsticker");
                                userToUpdate.save();
                            }
                        }
                    });
                });
                
                return true;
            } else {
                //Not a match
                return false;
            }
        } catch (ex) {
            // Invalid regex
            console.log(ex.message)
            console.log('Invalid password regex, string=' + correctPassRegex)
            return false;
        }
    },
    getLeaderboardPage: async (page) => {
        page = parseInt(page, 10);
        if (page < 1)
            page = 1;
        const offset = (page-1) * 25;
        const limit = 25;
        var list = await models.user.findAll({
            offset: offset,
            limit: limit,
            attributes: ['attendeeId', 'displayNameFormat', 'fullName', 'firstName', 'lastName', 'score'],
            order: [
                ['score', 'DESC']
            ]
        });
        for (var i = 0; i < list.length; i++) {
            list[i].leaderboardIndex = offset + i + 1;
        }
        return list;
    },
    getLeaderboardPageNumForUser: async (attendeeId) => {
        if (!attendeeId) return 0;

        var list = await models.user.findAll({
            attributes: ['attendeeId', 'score'],
            order: [
                ['score', 'DESC']
            ]
        });
        var index = list.findIndex(user => user.attendeeId == attendeeId);
        return Math.ceil(index / 25);
    },
    countLeaderboardPages: async () => {
        var count = await models.user.count();
        return Math.ceil(count / 25);
    },
    countPlayers: async () => {
        var count = await models.user.count();
        return count;
    },
    getSeenAndSolvedBlogs: async (attendeeId) => {
        var user = await models.user.findByPk(attendeeId).catch(() => {return null;});
        var ret = {};
        if (user) {
            ret.seen = user.blogSeenList;
            ret.solved = user.blogSolvedList;
        } else {
            ret.seen = [];
            ret.solved = [];
        }
        return ret;
    },
    markBlogSeen: async (attendeeId, blogId) => {
        models.user.findByPk(attendeeId).then( (user) => {
            if (user) {
                if (!user.blogSeenList.includes(blogId)) {
                        var newList = user.blogSeenList;
                        newList.push(parseInt(blogId));
                        user.set('blogSeenList', newList);
                    user.save();
                }
            }
        }).catch(() => {
            ;
        });
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
var Puzzle = {
    get: async (puzzleId) => {
        var puzzle = await models.puzzle.findOne({
            where: {puzzleId: puzzleId}
        });
        return puzzle;
    }
}

module.exports.Defaults = Defaults;
module.exports.Strings = Strings;
module.exports.User = User;
module.exports.BlogPost = BlogPost;
module.exports.Puzzle = Puzzle;
module.exports.sequelize = sequelize;