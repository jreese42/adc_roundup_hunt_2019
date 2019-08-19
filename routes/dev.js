var express = require('express');
var waitUntil = require('wait-until');
// var db = require('../modules/db');
var router = express.Router();

router.use((req, res, next) => {
  // authentication middleware
  
  // Use a default user/pass if unset, otherwise use the user/pass set in the environment
  var auth = {login: "admin", password: "admin"};
  if ((process.env.DEV_USER && process.env.DEV_PASS) && (process.env.DEV_USER != "" || process.env.DEV_PASS != ""))
    auth = {login: process.env.DEV_USER, password: process.env.DEV_PASS};

  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = new Buffer(b64auth, 'base64').toString().split(':');
  // Verify login and password are set and correct
  if (login && password && login === auth.login && password === auth.password) {
    // Access granted. Set this info in the session.
    req.session.isAdmin = true;
  }

  if (!req.session.isAdmin) {
    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="admin-dev"');
    res.status(401).send('Authentication required.');
  }
  else {
    return next();
  }
});

/* Logout of an admin session */
router.get('/logout', function(req, res) 
{
  var didLogOut = req.session.isAdmin? true:false;
  if (req.session.isAdmin)
    req.session.isAdmin = null;
    if (didLogOut) {
      res.set('WWW-Authenticate', 'Basic realm="admin-dev"');
      res.status(401).send('Authentication required.'); // custom message
    } else {
      res.send(false);
    }
});

router.get('/', function(req, res) 
{
  var db = req.app.get('db');
  var userPromise;
  if (req.session && req.session.attendeeId)
    userPromise = db.User.findUser(req.session.attendeeId);
  else
    userPromise = new Promise();
  
  userPromise.then( user => {
      locals = {
        Session: {
          attendeeId: req.session.attendeeId || 0,
          firstName: req.session.firstName || "",
          lastName: req.session.lastName || "",
        },
        User: user //Generally don't do this. Sending the full user to the client is just for debugging.
      };
      res.render('dev', locals);
  });
});

router.get('/editor', function(req, res) 
{
  var db = req.app.get('db');
  
  db.BlogPost.getList().then( blogList => {
      locals = {
        blogList: blogList
      };
      console.log("Blog List");
      console.log(blogList);
      res.render('blog_editor', locals);
  });
});

router.get('/strings', function(req, res) 
{
  var db = req.app.get('db');
  
  db.Strings.getList().then( stringList => {
      locals = {
        stringList: stringList
      };
      res.render('string_editor', locals);
  });
});

module.exports = router;
