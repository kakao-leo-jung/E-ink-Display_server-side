var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());

/*

    여기서 라우팅 한다.
    app.use('/원하는받을URL경로', 변수);

*/
/*********************************************/
/* 메인 '/' 라우팅 */
var routes = require('./routes/index');
app.use('/', routes);
/*********************************************/
/* 로그인 '/loginToken' 라우팅 */
var login = require('./routes/login');
app.use('/loginToken', login);
/*********************************************/
/* 유저 정보 '/users' 라우팅 */
var users = require('./routes/users');
app.use('/users', users);
/*********************************************/
/* 달력 정보 '/calendar' 라우팅 */
var calendar = require('./routes/calendar');
app.use('/calendar', calendar);
/*********************************************/
/*********************************************/
/* Todo 정보 '/Todo' 라우팅 */
var todo = require('./routes/todo');
app.use('/todo', todo);
/*********************************************/
/*********************************************/
/* News 정보 '/news' 라우팅 */
var news = require('./routes/news');
app.use('/news', news);
/*********************************************/
/*********************************************/
/* Weather 정보 '/weather' 라우팅 */
var weather = require('./routes/weather');
app.use('/weather', weather);
/*********************************************/

/*

    ./bin/dbConnect.js 에서 작성한
    커스텀 DB 커넥터로 DB 연결

    1. user_auth : 사용자 인증 DB 에 연결

*/
var dbConnect = require('./bin/dbConnect');
dbConnect('user_auth');

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
