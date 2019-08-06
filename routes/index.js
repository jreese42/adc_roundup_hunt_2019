var express = require('express');
var router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', function(req, res, next) {
    var locals = {
        blog_posts: [
            {
                title: "Does Anyone Have Any Laser Parts?",
                subtitle: "Asking for a friend",
                imagePath: "img/puppy1.jpg", 
                dateString: "September 27, 2019", 
                timeString: "10:56 am", 
                author: "bbg", 
                teaserText: "So the original laser company I was working with on my Super Duper Laser Ray Gun (SDLRG) was acquired by another larger company … a company called Alarm.com. They also acquired the laser parts that I need to complete my SDLRG, so I attempted...",
                isNew: false
            },
            {
                title: "Does Anyone Have Any Laser Parts???",
                subtitle: "Asking for a friend",
                imagePath: "img/puppy1.jpg", 
                dateString: "September 27, 2019", 
                timeString: "10:56 am", 
                author: "bbg", 
                teaserText: "So the original laser company I was working with on my Super Duper Laser Ray Gun (SDLRG) was acquired by another larger company … a company called Alarm.com. They also acquired the laser parts that I need to complete my SDLRG, so I attempted...",
                isNew: false
            },
            {
                title: "The Title",
                subtitle: "The subtitle",
                imagePath: "img/puppy1.jpg", 
                dateString: "Morched 33 2024", 
                timeString: "98:98 pm", 
                author: "bbg", 
                teaserText: "This is the teaser",
                isNew: true
            },
            {
                title: "First Blog Post Please Ignore",
                subtitle: "Just testing for now",
                imagePath: "img/puppy1.jpg", 
                dateString: "September 27, 2019", 
                timeString: "10:56 am", 
                author: "bbg", 
                teaserText: "So the original laser company I was working with on my Super Duper Laser Ray Gun (SDLRG) was acquired by another larger company … a company called Alarm.com. They also acquired the laser parts that I need to complete my SDLRG, so I attempted...",
                isNew: false
            },
        ]
    };

    res.render('blog', locals);
});

router.get('/about', function(req, res, next) {
    res.render('game_info_page');
});
/* eslint-enable no-unused-vars */

module.exports = router;
