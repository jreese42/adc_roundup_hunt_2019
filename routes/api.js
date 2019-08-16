var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */

/* for_me and for_userid just specify which user is making a request, then forward to next */
var for_me = (req, res, next) => {
    req.user = {attendeeId: req.session.attendeeId};
    next();
}

var for_userid = (req, res, next) => {
    console.log("you route")
    req.user = {attendeeId: req.params.attendeeId};
    console.log(req.user);
    next();
}

/* get a full user object 
 * Also creates the user if it doesn't exist
 */
var get_user = (req, res) => {
    var db = req.app.get('db');
    db.User.findUserByAttendeeId(req.user.attendeeId, req.session.firstName, req.session.lastName)
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
    console.log(firstName + " " + lastName);
    if (!firstName || !lastName) {
        res.send({error: "Missing Arguments"});
    } else {
        db.User.findUserByAttendeeId(req.user.attendeeId, firstName, lastName)
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

router.get('/user/me/', [for_me, get_user]);
router.get('/user/:attendeeId/', [for_userid, get_user]);

router.get('/user/me/exists', [for_me, check_user_exists]);
router.get('/user/:attendeeId/exists', [for_userid, check_user_exists]);

router.all('/user/me/create', [for_me, create_user]);
router.all('/user/:attendeeId/create', [for_userid, create_user]);

// router.post('/user/me/', [for_me]);
// router.post('/user/:attendeeId/', [for_userid]);

router.all('/user/me/delete', [for_me, delete_user]);
router.all('/user/:attendeeId/delete', [for_userid, delete_user]);


/* eslint-enable no-unused-vars */

module.exports = router;
