var express = require('express');
var waitUntil = require('wait-until');
var foo = require('../modules/db/user.js');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) 
{
  //foo.deleteRow(1);
  //foo.countRow();
  foo.hi().then( user => {
    console.log("User " + user.userId + ": " + user.firstName + " " + user.lastName);
    res.send("<h1>" + user.firstName + "</h1>");
    user.firstName = "Samantha";
    user.save().catch( error =>{
      console.log("error saving")
    })
  });

  console.log("test");

  // console.log(user);
  //initDatabase.printLog();
  //initDatabase.createDatabase();
  //var error = initDatabase.databaseConnection();
  //console.log(error.result);
  //initDatabase.createUserTable();
  //initDatabase.addRowToUserTable();
  //initDatabase.useSql();
  //user.findAll().then(function(users) {
  //  console.log(users);
  //});

  //User.findOne().then(function (user) {
  //  console.log(user.get('firstName'));
  //});
  //console.log("hello world");
//  console.log(req.query);
  
});

module.exports = router;
