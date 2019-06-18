const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const http = require('http');

const usersRouter = require('../routes/users');
const foldersRouter = require('../routes/folders');
const listsRouter = require('../routes/lists');

const app = express();

app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'pug');

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

const server = app.listen(3000, function () {
  const port = server.address();
  console.log("Express server listening on port " + port.port);
});

//app.set('port', 3000);
//const server = http.createServer(app);
//server.listen(3000);

module.exports = app;
