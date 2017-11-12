// load all dependencies
var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    fs              = require('fs'),
    bodyParser      = require('body-parser');

// express is server side application
var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// respond to user with error
app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

// set dev logger
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}
// different router
// app.use(require('./anonymous-routes'));   use later -JM
app.use(require('./protected-routes'));
app.use(require('./user-routes'));

// set server port to 3001
var port = process.env.PORT || 3001;
// run server at designated port
http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
