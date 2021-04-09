var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mysql = require("mysql");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");

var app = express();

var connection = mysql.createConnection({
  host: '144.91.116.216',
  user: 'sczzpt_admin', 
  password: ',b-D66s&{K2a',
  database: 'sczzpt_database'
})

connection.connect()

let name = 'third'
let type = 'POPULAR'
let period = 'DAY'
let date = null

let insert = `INSERT INTO Evaluation (name, type, period, date) VALUES ('${name}', '${type}', '${period}', '${date}')`

console.log(insert)

connection.query(insert, (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  // get inserted id
  console.log('Todo Id:' + results.insertId);
});


/*connection.query('select * from test', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows)
})*/

connection.end()



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);

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
