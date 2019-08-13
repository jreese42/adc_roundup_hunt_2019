var express = require('express');
var waitUntil = require('wait-until');
var userObj = require('../modules/db/user.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) 
{
  userObj.createUser("Andy", "Barron");
  userObj.getUser(1).then( user => {
    console.log("User " + user.userId + ": " + user.firstName + " " + user.lastName);
    res.send("<h1>" + user.firstName + "</h1>");
    user.firstName = "Samantha";
    user.save().catch( error =>{
      console.log("error saving")
    })
  });
});

module.exports = router;
