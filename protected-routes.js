var express = require('express'),
    fs      = require('fs'),
    jwt     = require('express-jwt'),
    config  = require('./config'),
    yk = require('./yk'),
    aws = require('aws-sdk'),
    buffer  = require('buffer'),
    mongo   = require('mongodb'),
    monk    = require('monk'),
    db      = monk('localhost:27017/anyCity'),
    multer  = require('multer');

var app = module.exports = express.Router();

var upload = multer({ dest: 'uploads/' });

app.use(function(req,res,next){
    req.db = db;
    next();
});

var jwtCheck = jwt({
  secret: config.secret
});

app.use('/api/protected', jwtCheck);

app.post('/api/protected/exercises-return', function(req, res) {
  // set db and collection
  var db = req.db;
  var collection = db.get('exercises');

  // return all results
  collection.find({}, function(err, doc){
    res.status(201).send(doc);
  });
});

app.post('/api/protected/exercise-create', upload.single('image'), function(req, res){
  let exerciseName = req.body.name;
  // place in lower case for search
  exerciseName = exerciseName.toLowerCase();

  // get token with user info
  let encodedToken = req.body.token.split(".")[1];
  // decode user info for admin
  let decodedToken = new Buffer(encodedToken, 'base64').toString();
  // parse into json
  let tokenObj = JSON.parse(decodedToken);
  // set id of user to variable
  let adminId = tokenObj._id;

  // set db and collection
  var db = req.db;
  var collection = db.get('exercises');

  // is there an exercise with the same name
  var conflicts = collection.find({ $and: [{ name: exerciseName }, { $or: [{adminId: adminId}, {root: 1}] }] }).length;
  // if a record with the same name exits throw error
  if (conflicts > 0) {
    return res.status(400).send("This exercise already exists");
  } else {
    // set variable for image
    var image = req.file;

    // if user is master admin exercise is at root lever
    // var rootLevel = users.get({ _id: adminId }).superAdmin;
    var rootLevel = 1;

    var awsConfig = new aws.Config();

    aws.config.update({
      accessKeyId: yk.accessKeyId,
      secretAccessKey: yk.secretAccessKey,
      "region": "us-west-2"
    });

    var s3 = new aws.S3();

    let key = 'exercise-gifs/' + image.originalname;

    var params = {
      Bucket: 'any-city-fitness',
      Key: key,
      Body: fs.createReadStream(image.path),
      ACL: 'public-read'
    };

    s3.putObject(params, function(err, data) {
      if (err){
        console.log(err);
        return res.status(400).send("Failed to upload image to cdn");
      } else {
        collection.insert({
          "name" : exerciseName,
          "types" : JSON.parse(req.body.types),
          "linkName" : image.originalname,
          "adminId" : adminId,
          "root": rootLevel,
        }, function (err, doc) {
          if (err) {
            // if failed, return error
            console.log(err);
            return res.status(400).send("There was a problem adding the information to the database.");
          } else {
            // if success send message
            return res.status(201).send(doc);
          }
        });
      }
    });
  }
});

app.post('/api/protected/exercise-update', upload.single('image'), function(req, res) {
  // get token with user info
  let encodedToken = req.body.token.split(".")[1];
  // decode user info for admin
  let decodedToken = new Buffer(encodedToken, 'base64').toString();
  // parse into json
  let tokenObj = JSON.parse(decodedToken);
  // set id of user to variable
  let adminId = tokenObj._id;

  var id = req.body.id.toString();

  // set db and collection
  var db = req.db;
  var collection = db.get('exercises');

  // find exercise to delete
  var toUpdate = collection.findOne({ $and: [{ _id: id }, { adminId: adminId }] });
  toUpdate.then(function(record){
    if(record) {
      var exName = req.body.name ? req.body.name : record.name;
      var exTypes = req.body.types ? JSON.parse(req.body.types) : record.types;

      if(req.file) {
        var image = req.file;

        var awsConfig = new aws.Config();

        aws.config.update({
          accessKeyId: yk.accessKeyId,
          secretAccessKey: yk.secretAccessKey,
          "region": "us-west-2"
        });

        var s3 = new aws.S3();

        let deleteKey = 'exercise-gifs/' + record.linkName;

        let createKey = 'exercise-gifs/' + image.originalname;

        var deleteParams = {
          Bucket: 'any-city-fitness',
          Key: deleteKey,
        };

        var createParams = {
          Bucket: 'any-city-fitness',
          Key: createKey,
          Body: fs.createReadStream(image.path)
        };

        s3.deleteObject(deleteParams, function(err, data) {
          if (err){
            console.log(err);
            return res.status(400).send("Failed to remove image from cdn");
          } else {
            s3.putObject(createParams, function(err, data) {
              if(err) {
                console.log(err);
                return res.status(400).send("Failed to add replacement images to cdn");
              } else {
                collection.update({ "_id" : record._id},
                  { "name" : exName,
                    "types" : exTypes,
                    "linkName" : image.originalname,
                    "adminId" : record.adminId,
                    "root" : record.root
                  }
                );
              }
            });
          }
        });
      } else {
        collection.update({"_id" : record._id},
          { "name" : exName,
            "types" : exTypes,
            "linkName" : record.linkName,
            "adminId" : record.adminId,
            "root" : record.root
          }
        );
      }
    }
  });
});

app.post('/api/protected/exercise-delete', function(req, res) {
  // get token with user info
  let encodedToken = req.body.token.split(".")[1];
  // decode user info for admin
  let decodedToken = new Buffer(encodedToken, 'base64').toString();
  // parse into json
  let tokenObj = JSON.parse(decodedToken);
  // set id to variable
  var adminId = tokenObj._id.toString();

  var id = req.body.id.toString();

  // set db and collection
  var db = req.db;
  var collection = db.get('exercises');

  // find exercise to delete
  var toDelete = collection.findOne({ $and: [{ _id: id }, { adminId: adminId }] });

  toDelete.then(function(record){
    if(record) {
      var awsConfig = new aws.Config();

      aws.config.update({
        accessKeyId: yk.accessKeyId,
        secretAccessKey: yk.secretAccessKey,
        "region": "us-west-2"
      });

      var s3 = new aws.S3();

      let key = 'exercise-gifs/' + record.linkName;

      var params = {
        Bucket: 'any-city-fitness',
        Key: key
      };

      s3.deleteObject(params, function(err, data) {
        if (err){
          console.log(err);
          return res.status(400).send("Failed to remove image from cdn");
        } else {
          collection.remove({ $and: [{ _id: record._id }, { adminId: adminId }]}, function(err, doc) {
            if (err) {
              // if failed, return error
              res.status(400).send("There was a problem removing the exercise from the database.");
              console.log(err);
            } else {
              // if success send message
              res.status(201).send(doc);
            }
          });
        }
      });
    }
  });
});
