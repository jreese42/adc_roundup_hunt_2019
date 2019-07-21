var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware')

var indexRouter = require('./routes/index');
var twilioRouter = require('./routes/twilio');

var app = express();

//SASS middleware. Ideally, SASS is precompiled to css, but this is easier for dev.
//See the "compile-sass" build script in package.json, and remember to remove this for release.
//This version serves css on the fly, compiling it upon request so that changes
//will be reflected without restarting.  The compiled css should be committed to the repo so this
//can be easily removed for release.
app.use(sassMiddleware({
        src: path.join(__dirname, 'sass'),
        dest: path.join(__dirname, 'public', 'stylesheets'),
        prefix:  '/stylesheets', //a request for public/stylesheets/*.css should route back to sass/*.css
        debug: true
    })
);

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/twilio', twilioRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
