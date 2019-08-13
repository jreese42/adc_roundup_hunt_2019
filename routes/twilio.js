var express = require('express');
var twilio = require('twilio');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var router = express.Router();

const shouldValidate = process.env.NODE_ENV !== 'test';

/* POST twilio endpoints. 
 * This uses twilio webhooks which are internally verified by twilio for authenticity, so no password is needed.
 */
/* eslint-disable no-unused-vars */
router.post('/voice', twilio.webhook({ validate: shouldValidate }), (req, res) => {
    const response = new VoiceResponse();

    response.say(
        `Thanks so much for finding my dog Edison, I owe you one!  I knew that Brian's loyal readers would be able to find him.  
        I don't know what I would do without him if I had lost him!  Gosh, now that I think about it,
        Brian was the person who suggested I name my dog Edison in the first place.  Edison always was Brian's
        favorite scientist.  I think he even uses Edison for some of his computer 
        passwords.  Anyway, I'll come pick Edison up now, you can leave him there.  Goodbye!`
    );
    res.set('Content-Type', 'text/xml');
    res.send(response.toString());
});

router.post('/sms', twilio.webhook({ validate: shouldValidate }), (req, res) => {
    const response = new MessagingResponse();
    const message = response.message();
    message.body('The number you are trying to reach does not support text messaging.  Please call this number instead.');

    res.set('Content-Type', 'text/xml');
    res.send(response.toString());
});
/* eslint-enable no-unused-vars */

module.exports = router;
