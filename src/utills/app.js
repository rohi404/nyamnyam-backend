var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var http = require('http');

var usersRouter = require('../routes/users');
var foldersRouter = require('../routes/folders');
var listsRouter = require('../routes/lists');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static("./apidoc"));
app.use('/users', usersRouter);
app.use('/folders', foldersRouter);
app.use('/lists', listsRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', 3000);
var server = http.createServer(app);
server.listen(3000);

module.exports = app;
