var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var SessionStore = require('connect-session-sequelize')(session.Store);

var sassMiddleware;
if (process.env.NODE_ENV !== 'production') {
    try {
        sassMiddleware = require('node-sass-middleware');
        console.log("Running with node-sass-middleware");
    }
    catch (e) {
        console.log("Running without node-sass-middleware");
    }
} else {
    console.log("Running without node-sass-middleware");
}

var indexRouter = require('./routes/index');
var twilioRouter = require('./routes/twilio');
var devRouter = require('./routes/dev');
var apiRouter = require('./routes/api');

var app = express();

app.set('db', require('./modules/db'));

/* eslint-disable no-undef */

//SASS middleware. Ideally, SASS is precompiled to css, but this is easier for dev.
//See the "compile-sass" build script in package.json
//This version serves css on the fly, compiling it upon request so that changes
//will be reflected without restarting.  The compiled css should be committed to the repo because
//this middleware is automatically disabled when deployed.
if (sassMiddleware) {
    app.use(sassMiddleware({
        src: path.join(__dirname, 'sass'),
        dest: path.join(__dirname, 'public', 'stylesheets'),
        prefix:  '/stylesheets', //a request for public/stylesheets/*.css should route back to sass/*.css
        debug: true
    })
    );
}

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var sessionStore = new SessionStore({
    db: app.get('db').sequelize
});

app.use(session({
    secret: 'aTtsPUsapSnYChdO99vzR7YjXuxS90',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

sessionStore.sync();

app.use('/', indexRouter);
app.use('/api/twilio', twilioRouter);
app.use('/api', apiRouter);
app.use('/user', twilioRouter);
app.use('/admin', devRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
/* eslint-disable no-unused-vars */
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (err.status == 404) {
        res.render('error', { 
            errorText: "Sorry, I couldn't find what you were looking for.", 
            errorSubtext: "The page you tried to reach does not exist.  Please go back and try again."
        });
    } else {
        res.render('error', { 
            errorText: "Sorry, something went wrong.", 
            errorSubtext: "A server error ocurred.  It's probably your fault. Please go back and try again, then contact the Gamemasters."
        });
    }
});
/* eslint-enable no-unused-vars */
/* eslint-enable no-undef */

module.exports = app;
