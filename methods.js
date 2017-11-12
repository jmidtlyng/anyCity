var express = require('express'),
  mongo   = require('mongodb'),
  monk    = require('monk'),
  db      = monk('localhost:27017/anyCity');

var app = module.exports = express.Router();

app.use(function(req,res,next){
    req.db = db;
    next();
});

function createExercise(exerciseName, exerciseImageLink) {
  // set the collection
  var db = req.db;
  var collection = db.get('exercises');

  collection.insert({
    "username" : userName,
    "email" : userEmail
  }, function (err, doc) {
    if (err) {
      // if failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // if success send message
      res.send("great success.");
    }
  });
}
