var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('./authenticate');

var routes = require('./routes/index');
var users = require('./routes/users');
var news = require('./routes/news');
var tests = require('./routes/tests');

var config = require('./config');

// ---------------------------------------------------------------------

var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");
});

var app = express();

console.log('< STARTING>');
console.log('THIS:         ' + config.this);
console.log('DATABASE_URI: ' + config.mongoUrl);
console.log('APP_SECRET:   ' + config.secretKey);
console.log('PORT:         ' + config.port);
console.log('FCLIENT_KEY:  ' + config.facebook.clientID);
console.log('FCLIENT_SEC:  ' + config.facebook.clientSecret);
console.log('FCALLBACK:    ' + config.facebook.callbackURL);
console.log('</STARTING>');

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use(config.api+'/users', users);
app.use(config.api+'/news', news);
app.use(config.api+'/tests', tests);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
