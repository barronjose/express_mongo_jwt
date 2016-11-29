var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

/**
 * Server configuration
 */
var port = process.env.PORT || 3000;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// set body parser to get the body from the request or params
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use morgan to log all request into the console
app.use(morgan('dev'));

/**
 * Routes
 */
app.get('/', function onIndex(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

/**
 * API ROUTES
 */
var apiRoutes = express.Router();

// no middleware required

apiRoutes.post('/authenticate', function postAuth(req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err;
    var isAuthorized = !user || user.password !== req.body.password;

    if (!isAuthorized) {
      return res.status(401).send('Authentication failed. Incorrer user and/or password.');
    }

    var token = jwt.sign(user, app.get('superSecret'), {
      expiresIn: 1400
    });

    res.json({
      success: true,
      token: token
    });
  });
});

apiRoutes.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('Token not provided');
  }

  jwt.verify(token, app.get('superSecret'), function (err, decoded) {
    if (err) throw err;
    req.decoded = decoded;
    next();
  });
});

// Authenticated Routes

apiRoutes.get('/users', function getUsers(req, res) {
  User.find({}, function (err, users) {
    if (err) throw err;
    res.json(users);
  });
});

apiRoutes.get('/check', function getCheck(req, res) {
  res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happns at http://localhost:' + port);
