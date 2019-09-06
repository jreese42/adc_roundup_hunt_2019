var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */


router.get('/', function(req, res, next) {
    var db = req.app.get('db');

    db.Strings.get("DATETIME_START_UTC").then( dateStartStr => {
        var date = new Date(Date.now());
        //Admin option allows querying for a datetime that isn't now
        if (req.query.d && req.session.isAdmin) {
            var forDate = new Date(req.query.d);
            if (!isNaN(forDate))
                date = forDate;
        }
        var dateStart = new Date(dateStartStr);
        if (isNaN(dateStart) || date >= dateStart) {
            //Game is on! Send the blog page.
            db.BlogPost.getActivePosts(date).then( blogList => {
                var locals = {
                    blog_posts: []
                };
            
                for (var i=0; i<blogList.length; i++){
                    blogList[i].entryUrl = "/blog/entry/" + blogList[i].blogId;
                    blogList[i].isNew = false;
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
                Promise.all([secQuestion1,secQuestion2,secQuestion3,secQuestion4,secQuestion5])
                .then( securityQuestions => {
                    locals = {
                        securityQuestions: [
                            {
                                questionText: securityQuestions[0],
                                alreadySolved: user.solution1
                            },
                            {
                                questionText: securityQuestions[1],
                                alreadySolved: user.solution2
                            },
                            {
                                questionText: securityQuestions[2],
                                alreadySolved: user.solution3
                            },
                            {
                                questionText: securityQuestions[3],
                                alreadySolved: user.solution4
                            },
                            {
                                questionText: securityQuestions[4],
                                alreadySolved: user.solution5
                            }
                        ],
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
    var startPagePromise = db.User.getLeaderboardPageNumForUser(req.session.attendeeId);
    
    Promise.all([pageCountPromise, startPagePromise]).then( values => {
        var pageCount = values[0];
        var startPage = values[1];
        var locals = {};
        var firstName = (req.session.firstName) ? req.session.firstName : "";
        var lastName = (req.session.lastName) ? req.session.lastName : "";

        locals.nameOpt1 = firstName + " " + lastName;
        locals.nameOpt2 = firstName.charAt(0) + ". " + lastName;
        locals.nameOpt3 = "Anonymous";
        locals.currentPage = startPage || "0";
        locals.pageCount = pageCount;
        res.render('leaderboard', locals);
    });
});

router.get('/user/login', function(req, res) {

    var db = req.app.get('db');

    db.User.checkExists(req.query.attendeeId).then( exists => {
        if (!exists) {
            db.User.createUser(req.query.attendeeId, req.query.firstName, req.query.lastName).then( created => {
                if (created)
                    console.log("New User created: " + req.query.attendeeId);
            });
        }
    });
    
    req.session.attendeeId = req.query.attendeeId || 0;
    req.session.firstName = req.query.firstName || "";
    req.session.lastName = req.query.lastName || "";

    res.redirect('/');
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
        } else {
            res.status(404).render('error', { 
                errorText: "Sorry, I couldn't find what you were looking for.", 
                errorSubtext: "The page you tried to reach does not exist.  Please go back and try again."
            });
        }
    });
});

router.get('/winner', function(req, res) {
    // var db = req.app.get('db');
    var db = req.app.get('db');

    db.User.findUser(req.session.attendeeId).then( user => {
        if (!user) {
            res.status(401).render('error', { 
                errorText: "No User Record Found", 
                errorSubtext: "I could not locate a user record for you.  Please try again or contact the Gamemasters."
            });
        } else {
            var locals = {};
            locals.prizeLevel = user.prizeLevel;
            if (req.query.prizeLevel)
                locals.prizeLevel = req.query.prizeLevel
            console.log("Prize level is " + user.prizeLevel);
            console.log(user)
            res.render('winner_page', locals);
        }
    });
});
/* eslint-enable no-unused-vars */

module.exports = router;
