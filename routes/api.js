var express = require('express');
var router = express.Router();

/* eslint-disable no-unused-vars */

var authenticator = (req, res, next) => {
    if (!req.session.isAdmin) {
      // Access denied...
      res.status(401).send('Authentication required'); // custom message
    }
    else {
      return next();
    }
}

/* for_me and for_userid just specify which user is making a request, then forward to next */
var for_me = (req, res, next) => {
    req.user = {attendeeId: req.session.attendeeId};
    next();
}

var for_userid = (req, res, next) => {
    req.user = {attendeeId: req.params.attendeeId};
    next();
}

/* get a full user object 
 * Also creates the user if it doesn't exist
 */
var get_user = (req, res) => {
    var db = req.app.get('db');
    db.User.findUser(req.user.attendeeId)
    .then( user => {
        res.send(user);
    });
}

/* create a new user object 
 * Also creates the user if it doesn't exist
 */
var check_user_exists = (req, res) => {
    var db = req.app.get('db');
    db.User.checkExists(req.user.attendeeId)
    .then( exists => {
        res.send(exists);
    });
}

/* create a new user object 
 */
var create_user = (req, res) => {
    var db = req.app.get('db');

    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    if (!firstName || !lastName) {
        res.send({error: "Missing Arguments"});
    } else {
        db.User.createUser(req.user.attendeeId, firstName, lastName)
        .then( user => {
            res.send(user);
        });
    }
}

var delete_user = (req, res) => {
    var db = req.app.get('db');
    db.User.deleteUser(req.user.attendeeId)
    .then( numDestroyed => {
        var success = (numDestroyed > 0);
        res.send(success);
    });
}

var get_name = (req, res) => {
    var db = req.app.get('db');
    db.User.findUser(req.user.attendeeId)
    .then( user => {
        res.send(user.fullName);
    });
}

var set_custom_name = (req, res) => {
    var db = req.app.get('db');
    db.User.setFullName(req.user.attendeeId, req.body.name)
    .then( result => {
        res.send(result);
    });
}

var set_displaynameformat = (req, res) => {
    var db = req.app.get('db');
    db.User.setDisplayNameFormat(req.user.attendeeId, req.body.displayNameFormat)
    .then( result => {
        res.send(result);
    });
}

var submit_password = (req, res) => {
    var db = req.app.get('db');
    db.User.submitPassword(req.user.attendeeId, req.body.solutionId, req.body.password)
    .then( result => {
        res.send(result);
    });
}

var create_post = (req, res) => {
    var db = req.app.get('db');
    db.BlogPost.createPost(
        req.body.title,
        req.body.subtitle,
        req.body.author,
        req.body.dateStr,
        req.body.timeStr,
        req.body.imagePath,
        req.body.releaseTime,
        req.body.text)
    .then( result => {
        res.send(result);
    });
}

var get_blogData = (req, res) => {
    var db = req.app.get('db');
    db.BlogPost.getPost(req.params.blogId)
    .then( result => {
        res.send(result);
    });
}

var update_blogPost = (req, res) => {
    var db = req.app.get('db');
    db.BlogPost.updatePost(
        req.params.blogId,
        req.body.title,
        req.body.subtitle,
        req.body.author,
        req.body.dateStr,
        req.body.timeStr,
        req.body.imagePath,
        req.body.releaseTime,
        req.body.text)
    .then( result => {
        res.send(result);
    });
}

var delete_blogPost = (req, res) => {
    var db = req.app.get('db');
    db.BlogPost.deletePost(req.params.blogId)
    .then( result => {
        res.send(result);
    });
}

var create_string = (req, res) => {
    var db = req.app.get('db');
    db.Strings.create(
        req.body.referenceName,
        req.body.value)
    .then( result => {
        res.send(result);
    });
}

var get_string = (req, res) => {
    var db = req.app.get('db');
    db.Strings.get(req.params.referenceName)
    .then( result => {
        res.send(result);
    });
}

var set_string = (req, res) => {
    var db = req.app.get('db');
    db.Strings.set(
        req.params.referenceName,
        req.body.value)
    .then( result => {
        res.send(result);
    });
}

var delete_string = (req, res) => {
    var db = req.app.get('db');
    db.Strings.delete(req.params.referenceName)
    .then( result => {
        res.send(result);
    });
}

router.get('/user/me/', [for_me, get_user]);
router.get('/user/:attendeeId/', [for_userid, get_user]);

router.get('/user/me/exists', [for_me, check_user_exists]);
router.get('/user/:attendeeId/exists', [for_userid, check_user_exists]);

router.post('/user/me/create', [authenticator, for_me, create_user]);
router.post('/user/:attendeeId/create', [authenticator, for_userid, create_user]);

router.post('/user/me/delete', [authenticator, for_me, delete_user]);
router.post('/user/:attendeeId/delete', [authenticator, for_userid, delete_user]);

//Full Name
router.get('/user/me/name', [for_me, get_name]);
router.get('/user/:attendeeId/name', [for_userid, get_name]);

router.post('/user/me/name', [authenticator, for_me, set_custom_name]);
router.post('/user/:attendeeId/name', [authenticator, for_userid, set_custom_name]);

//Set Name Display Option
router.post('/user/me/displayNameFormat', [for_me, set_displaynameformat]);
router.post('/user/:attendeeId/displayNameFormat', [authenticator, for_userid, set_displaynameformat]);

//Submit password
router.post('/user/me/submitPassword', [for_me, submit_password]);
router.post('/user/:attendeeId/submitPassword', [authenticator, for_userid, submit_password]);

//Create new blog
router.post('/blog/createNew', [authenticator, create_post]);
//Get Blog Data
router.get('/blog/:blogId', [authenticator, get_blogData]);
//Update post
router.post('/blog/:blogId', [authenticator, update_blogPost]);
//Delete post
router.post('/blog/:blogId/delete', [authenticator, delete_blogPost]);

//string
router.post('/string/create', [authenticator, create_string]);
router.get('/string/:referenceName', [authenticator, get_string]);
router.post('/string/:referenceName', [authenticator, set_string]);
router.post('/string/:referenceName/delete', [authenticator, delete_string]);

/* eslint-enable no-unused-vars */

module.exports = router;
