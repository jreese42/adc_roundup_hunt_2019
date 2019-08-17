var express = require('express');
var router = express.Router();

/* eslint-disable no-unused-vars */

router.use((req, res, next) => {
    if ( (req.method == "POST") && !req.session.isAdmin) {
      // Access denied...
      res.status(401).send('Authentication required'); // custom message
    }
    else {
      return next();
    }
});

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
    console.log(firstName + " " + lastName);
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

router.get('/user/me/', [for_me, get_user]);
router.get('/user/:attendeeId/', [for_userid, get_user]);

router.get('/user/me/exists', [for_me, check_user_exists]);
router.get('/user/:attendeeId/exists', [for_userid, check_user_exists]);

router.post('/user/me/create', [for_me, create_user]);
router.post('/user/:attendeeId/create', [for_userid, create_user]);

router.post('/user/me/delete', [for_me, delete_user]);
router.post('/user/:attendeeId/delete', [for_userid, delete_user]);

//Full Name
router.get('/user/me/name', [for_me, get_name]);
router.get('/user/:attendeeId/name', [for_userid, get_name]);

router.post('/user/me/name', [for_me, set_custom_name]);
router.post('/user/:attendeeId/name', [for_userid, set_custom_name]);

//Set Name Display Option
router.post('/user/me/displayNameFormat', [for_me, set_displaynameformat]);
router.post('/user/:attendeeId/displayNameFormat', [for_userid, set_displaynameformat]);



/* eslint-enable no-unused-vars */

module.exports = router;
