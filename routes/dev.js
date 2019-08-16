var express = require('express');
var waitUntil = require('wait-until');
// var db = require('../modules/db');
var router = express.Router();

router.use((req, res, next) => {
  // authentication middleware
  
  // Use a default user/pass if unset, otherwise use the user/pass set in the environment
  let auth = {login: "admin", password: "admin"};
  if ((process.env.DEV_USER && process.env.DEV_PASS) && (process.env.DEV_USER == "" || process.env.DEV_PASS == ""))
    auth = {login: process.env.DEV_USER, password: process.env.DEV_PASS};

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted...
    return next();
  }

  // Access denied...
  res.set('WWW-Authenticate', 'Basic realm="401"'); // change this
  res.status(401).send('Authentication required.'); // custom message
});

/* GET users listing. */
router.get('/', function(req, res, next) 
{
  var db = req.app.get('db');
  console.log("Getting user for ID " + req.session.attendeeId);
  db.User.findUserByAttendeeId(req.session.attendeeId, req.session.firstName, req.session.lastName)
  .then( user => {
      locals = {
        user: {
          attendeeId: req.session.attendeeId,
          fullName: user.fullName,
          displayOption: user.displayNameFormat
        }
      };
      res.render('dev', locals);
  });
});

module.exports = router;
