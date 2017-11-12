var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    mongo   = require('mongodb'),
    monk    = require('monk'),
    db      = monk('localhost:27017/anyCity');

var app = module.exports = express.Router();

app.use(function(req,res,next){
    req.db = db;
    next();
});

// use make jason-web-token allowing auth that expires in 5 hours
// key, secret, options
function createToken(user) {
  // if user is not an admin, omit the admin field
  if(!user.admin) {
    return jwt.sign(_.omit(user, 'password', 'admin'), config.secret, { expiresIn: 60*60*5 });
  } else {
    return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
  }
}

function getUserScheme(req) {
  // declare username, type, and search(class) variables
  var username;
  var type;
  var userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    // set username, type, and search vars
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    // if change to email later
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

// log in user for session
app.post('/sessions/create', function(req, res) {
  // set db and collection to be used
  var db = req.db;
  var collection = db.get('users');

  // figure out if front-end has been set to username or email as user type
  // returns username, type(email/username), and search method
  var userScheme = getUserScheme(req);

  // if either username or password is missing return error
  if (!userScheme.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  // declare and initialize user variable for search result
  // var user = _.find(users, userScheme.userSearch);
  var user = {};
  // is user logging in with email or user name?
  if(userScheme.type === 'email'){
    // find matching user email in db
    user = collection.findOne({ email: userScheme.username },function(e,docs){
      // set user object to user variable
      return(docs);
    })
  } else if(userScheme.type === 'username') {
    // find matching username in database
    user = collection.findOne({ username: userScheme.username },function(e,docs){
      // set user object to user variable
      return(docs);
    })
  }

  // wait for promise to be resolved and then set up user
  user.then(function(user){
    // if search results in no user match send error
    if (!user) {
      return res.status(401).send("The username or password don't match");
    }

    // if the username is found but the password doesnt match send error
    if (user.password !== req.body.password) {
      return res.status(401).send("The username or password don't match");
    }

    // generate a token for the user and pass it back as the result with 201-ok
    res.status(201).send({
      id_token: createToken(user)
    });
  })
});
