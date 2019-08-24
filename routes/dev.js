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
      res.status(401).send('Logged out.'); // custom message
    } else {
      res.send(false);
    }
});

router.get('/', function(req, res) 
{
    res.render('dev');
});

router.get('/editor', function(req, res) 
{
  var db = req.app.get('db');
  
  db.BlogPost.getList().then( blogList => {
      locals = {
        blogList: blogList
      };
      res.render('dev_blog_editor', locals);
  });
});

router.get('/strings', function(req, res) 
{
  var db = req.app.get('db');
  
  db.Strings.getList().then( stringList => {
      locals = {
        stringList: stringList
      };
      res.render('dev_string_editor', locals);
  });
});

router.get('/database', function(req, res) 
{
  res.render('dev_db_mgmt');
});

module.exports = router;
