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
    var db = req.app.get('db');
    db.Strings.get("TWILIO_TWIML_VOICE_RESPONSE").then( responseTwiml => {
        res.set('Content-Type', 'text/xml');
        res.send(responseTwiml); //This assumes TWILIO_TWIML_VOICE_RESPONSE is properly formatted TwiML
    });
});

router.post('/sms', twilio.webhook({ validate: shouldValidate }), (req, res) => {
    var db = req.app.get('db');
    db.Strings.get("TWILIO_TWIML_SMS_RESPONSE").then( responseString => {
        const response = new MessagingResponse();
        const message = response.message();
        message.body(responseString);

        res.set('Content-Type', 'text/xml');
        res.send(response.toString());
    });
});
/* eslint-enable no-unused-vars */

module.exports = router;
