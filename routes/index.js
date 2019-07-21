var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', function(req, res, next) {
    res.render('game_info_page', { title: 'Express' });
});
/* eslint-enable no-unused-vars */

module.exports = router;
