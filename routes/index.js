var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */


router.get('/', function(req, res, next) {

    var db = req.app.get('db');
    //TODO: Cache this list?

    var date = new Date(Date.now());
    //Admin option allows querying for a datetime that isn't now
    if (req.query.d && req.session.isAdmin) {
        var forDate = new Date(req.query.d);
        if (!isNaN(forDate))
            date = forDate;
    }
    console.log("Date in request")
    console.log(date)
    console.log(date.toISOString())
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

});

router.get('/about', function(req, res, next) {
    res.render('game_info_page');
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
            locals = {
                correct_solutions: [user.solution1, user.solution2, user.solution3,
                                    user.solution4, user.solution5, user.solution6]
            }
            res.render('laser_mgmt_page', locals);
        }
    });
});

router.get('/blog/entry/:entryId', function(req, res, next) {
    if (req.params.entryId < blog_posts.length) {
        var locals = {blog: {}};
        locals.blog = blog_posts[req.params.entryId];
        res.render('blog_entry', locals);
    }
    else {
        res.status(404).render('error', { 
            errorText: "Sorry, I couldn't find what you were looking for.", 
            errorSubtext: "The page you tried to reach does not exist.  Please go back and try again."
        });
    }
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
/* eslint-enable no-unused-vars */

module.exports = router;
