var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */


router.get('/', function(req, res, next) {
    var db = req.app.get('db');

    var userPromise = db.User.findUser(req.session.attendeeId);
    var dateStartPromise = db.Strings.get("DATETIME_START_UTC");
    var dateEndPromise = db.Strings.get("DATETIME_END_UTC");
    Promise.all([userPromise, dateStartPromise, dateEndPromise]).then( values => {
        var user = values[0];
        var dateStartStr = values[1];
        var dateEndStr = values[2];

        if (!user) {
            res.status(401).render('error', { 
                errorText: "No User Record Found", 
                errorSubtext: "I could not locate a user record for you.  Please try again or contact the Gamemasters."
            });
        }
        if (user.solution6) {
            //User has already input the final password. Skip to the prize page.
            res.redirect('/winner');
        }

        var date = new Date(Date.now());
        //Admin option allows querying for a datetime that isn't now
        if (req.query.d && req.session.isAdmin) {
            var forDate = new Date(req.query.d);
            if (!isNaN(forDate))
                date = forDate;
        }

        var dateEnd = new Date(dateEndStr);
        if (!isNaN(dateEnd) && date > dateEnd) {
            //Game is over, redirect to the prize page
            res.redirect('/winner');
        }

        var dateStart = new Date(dateStartStr);
        if (isNaN(dateStart) || date >= dateStart) {
            //Game is on! Send the blog page.
            var blogsPromise = db.BlogPost.getActivePosts(date);
            var seenAndSolvedPromise = db.User.getSeenAndSolvedBlogs(req.session.attendeeId);
            Promise.all([blogsPromise, seenAndSolvedPromise]).then( values => {
                var blogList = values[0];
                var seenAndSolved = values[1];

                var locals = {
                    blog_posts: []
                };
                for (var i=0; i<blogList.length; i++){
                    blogList[i].entryUrl = "/blog/entry/" + blogList[i].blogId;
                    blogList[i].isNew = (!seenAndSolved.seen.includes(parseInt(blogList[i].blogId)));
                    locals.blog_posts[i] = blogList[i];
                }
            
                res.render('blog_index', locals);
            });
        } else {
            //Game has not started yet, redirect to landing page
            var locals = {
                startTime: dateStart.toISOString(),
                gameHasStarted: false
            };
            res.render('game_info_page', locals);
        }
    });

    

});

router.get('/about', function(req, res, next) {
    var db = req.app.get('db');
    db.Strings.get("DATETIME_START_UTC").then( dateStartStr => {
        var dateStart = new Date(dateStartStr);
        var dateNow = new Date(Date.now());
        if (isNaN(dateStart))
            dateStart = dateNow;
        var locals = {
            startTime: dateStart.toISOString(),
            gameHasStarted: (dateStart < dateNow)
        };
        res.render('game_info_page', locals);
    });
});

router.get('/laser', function(req, res) {

    var db = req.app.get('db');

    db.User.findUser(req.session.attendeeId).then( user => {
        if (!user) {
            res.status(401).render('error', { 
                errorText: "No User Record Found", 
                errorSubtext: "I could not locate a user record for you.  Please try again or contact the Gamemasters."
            });
        }
        else {
            if (user.solution1 && user.solution2 && user.solution3 && user.solution4 && user.solution5) {
                res.render('laser_meltdown');
            } else {
                var secQuestion1 = db.Strings.get("SECURITY_QUESTION_1");
                var secQuestion2 = db.Strings.get("SECURITY_QUESTION_2");
                var secQuestion3 = db.Strings.get("SECURITY_QUESTION_3");
                var secQuestion4 = db.Strings.get("SECURITY_QUESTION_4");
                var secQuestion5 = db.Strings.get("SECURITY_QUESTION_5");
                var dateStartPromise = db.Strings.get("DATETIME_START_UTC");
                var dateEndPromise = db.Strings.get("DATETIME_END_UTC");
                Promise.all([secQuestion1,secQuestion2,secQuestion3,secQuestion4,secQuestion5,dateStartPromise,dateEndPromise])
                .then( values => {
                    var dateStart = new Date(values[5]);
                    var dateEnd = new Date(values[6]);
                    var dateNow = new Date(Date.now());
                    var laserChargePercent = 60;
                    if (!isNaN(dateStart) && !isNaN(dateEnd)) {
                        if (dateNow < dateStart)
                            laserChargePercent = 10;
                        else if (dateNow > dateEnd)
                            laserChargePercent = 95;
                        else {
                            elapsedTime = (dateNow.getTime() - dateStart.getTime());
                            totalTime = (dateEnd.getTime() - dateStart.getTime());
                            laserChargePercent = Math.round(Math.round((elapsedTime / totalTime) * 10000) / 105);
                            if (laserChargePercent < 10) laserChargePercent = 10;
                        }
                    }

                    locals = {
                        securityQuestions: [
                            {
                                questionText: values[0],
                                alreadySolved: user.solution1
                            },
                            {
                                questionText: values[1],
                                alreadySolved: user.solution2
                            },
                            {
                                questionText: values[2],
                                alreadySolved: user.solution3
                            },
                            {
                                questionText: values[3],
                                alreadySolved: user.solution4
                            },
                            {
                                questionText: values[4],
                                alreadySolved: user.solution5
                            }
                        ],
                        laserChargePercent: laserChargePercent,
                        title: "Laser Management Console"
                    };
        
                    res.render('laser_mgmt_page', locals);
                })
            }
        }
    });
});

router.get('/blog/entry/:entryId', function(req, res, next) {
    var db = req.app.get('db');

    var date = new Date(Date.now());
    //Admin option allows querying for a datetime that isn't now
    if (req.query.d && req.session.isAdmin) {
        var forDate = new Date(req.query.d);
        if (!isNaN(forDate))
            date = forDate;
    }
    
    db.BlogPost.getPostIfActive(req.params.entryId, date).then( blogPost => {
        if (blogPost) {
            blogPost.isNew = false;
            var locals = {blog: {}};
            locals.blog = blogPost;
            res.render('blog_entry', locals);
            db.User.markBlogSeen(req.session.attendeeId, req.params.entryId);
        } else {
            res.status(404).render('error', { 
                errorText: "Sorry, I couldn't find what you were looking for.", 
                errorSubtext: "The page you tried to reach does not exist.  Please go back and try again."
            });
        }
    });
});

router.get('/leaderboard', function(req, res) {
    var db = req.app.get('db');
    var pageCountPromise = db.User.countLeaderboardPages();
    var userPromise =  db.User.findUser(req.session.attendeeId);
    var startPagePromise = db.User.getLeaderboardPageNumForUser(req.session.attendeeId);
    var datePromise = db.Strings.get("DATETIME_END_UTC");
    
    Promise.all([pageCountPromise, startPagePromise, datePromise, userPromise]).then( values => {
        var pageCount = values[0];
        var startPage = values[1];
        var user = values[3];
        
        var dateEnd = new Date(values[2]);
        var dateNow = new Date(Date.now());
        if (isNaN(dateEnd))
            dateEnd = dateNow;
        
        var locals = {};
        var firstName = (req.session.firstName) ? req.session.firstName : "";
        var lastName = (req.session.lastName) ? req.session.lastName : "";

        locals.nameOpt1 = firstName + " " + lastName;
        locals.nameOpt2 = firstName.charAt(0) + ". " + lastName;
        locals.nameOpt3 = "Anonymous";
        locals.currentNameOpt = user.displayNameFormat;
        locals.currentPage = startPage || "0";
        locals.pageCount = pageCount;
        locals.gameOver = (dateEnd <= dateNow);
        res.render('leaderboard', locals);
    });
});

router.get('/user/login', function(req, res) {

    var db = req.app.get('db');
    console.log("User login: id=" + req.query.attendeeId + 
                ", firstname=" + req.query.firstName +
                ", lastname=" + req.query.lastName);

    db.User.checkExists(req.query.attendeeId).then( exists => {
        if (!exists) {
            db.User.createUser(req.query.attendeeId, req.query.firstName, req.query.lastName).then( created => {
                if (created)
                    console.log("New User created: " + req.query.attendeeId);
            });
        }
    });
    
    req.session.attendeeId = req.query.attendeeId || "0";
    req.session.firstName = req.query.firstName || "";
    req.session.lastName = req.query.lastName || "";

    res.redirect('/');
});

router.get('/winner', function(req, res) {
    // var db = req.app.get('db');
    var db = req.app.get('db');
    var datePromise = db.Strings.get("DATETIME_END_UTC");
    var userPromise = db.User.findUser(req.session.attendeeId);

    Promise.all([datePromise, userPromise]).then( array => {
        var user;
        if (array[1])
            user = array[1];

        if (!user) {
            res.status(401).render('error', { 
                errorText: "No User Record Found", 
                errorSubtext: "I could not locate a user record for you.  Please try again or contact the Gamemasters."
            });
        } else {
            var dateEnd = new Date(array[0]);
            var dateNow = new Date(Date.now());
            if (isNaN(dateEnd))
                dateEnd = dateNow;

            var locals = {};
            locals.prizeLevel = user.prizeLevel;
            locals.scoresCalculating =  (dateEnd > dateNow);
            if (req.query.prizeLevel)
                locals.prizeLevel = req.query.prizeLevel;
            locals.hasClaimedSticker = user.hasClaimedSticker;
            res.render('winner_page', locals);
        }
    });
});
/* eslint-enable no-unused-vars */

module.exports = router;
