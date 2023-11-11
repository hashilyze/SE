// Import
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysqlConfig = require('./database/config.json');
// Router
var indexRouter = require('./routes/index');
var formatRouter = require('./routes/formatRouter');
var categoryRouter = require('./routes/categoryRouter');
var userRouter = require('./routes/userRouter');
var postRouter = require('./routes/postRouter');
var basketRouter = require('./routes/basketRouter');
var authRouter = require('./routes/authRouter');
var payRouter = require('./routes/payRouter');
var testRouter = require('./routes/testRouter');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "default",
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(mysqlConfig),
}));

app.use('/', indexRouter);
app.use('/format', formatRouter);
app.use('/category', categoryRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/basket', basketRouter);
app.use('/auth', authRouter);
app.use('/pay', payRouter);
app.use('/test', testRouter);



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