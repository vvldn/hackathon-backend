var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


var mongooseClient = require("./bin/mongoose_client");
mongooseClient.connectDB(function () {
  console.log("db connection successful");
  },function (err) {
    console.log("Error"+err);
});
/*
var corsOptions = {
    origin : localhost\:([0-9]+)\/([a-zA-Z]+)
};
*/
// to enable CORS
//app.use(cors());


app.use(function(req,res,next){
    res.setHeader( "Access-Control-Allow-Origin", req.headers.origin || '*');
    res.setHeader( "Access-Control-Allow-Credentials", 'true');
    res.setHeader( "Access-Control-Allow-Methods", "GET,POST,DELETE");
    res.setHeader('Access-Control-Allow-Headers','*');
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const insightRouter  = require('./routes/insight_router');
const actionItemRouter = require('./routes/action_item_router');
const ticketRouter = require('./routes/ticket_router');
const ragRouter = require('./routes/rag_router');

app.use('/api/insights', insightRouter);
app.use('/api/action-items', actionItemRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/rag', ragRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
