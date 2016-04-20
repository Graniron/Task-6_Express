var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var dataAccess = require('./dataAccess');
var HttpError = require('./error.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  console.log('Req headers', req.headers.authorization);
  if (req.headers.authorization === '123') {
    next();
  } else {
    throw new HttpError(401, 'Authentification error');
  }
});

// Routes
app.get('/users', function(req, res, next) {
  dataAccess.getUsers(function(err, users) {
    if (err && err.status) {
      return next(new HttpError(err.status, err.message));
    }
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

app.get('/users/:id', function(req, res, next) {
  var id = req.params.id;
  dataAccess.getUser(id, function(err, user) {
    if (err && err.status) {
      return next(new HttpError(err.status, err.message));
    }
    if (err) {
      return next(err);
    }
    res.send(user);
  });
});

app.post('/users', function(req, res, next) {
  var user = req.body;
  dataAccess.addUser(user, function(err, users) {
    if (err && err.status) {
      return next(new HttpError(err.status, err.message));
    }
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

app.delete('/users/:id', function(req, res, next) {
  var id = req.params.id;
  dataAccess.deleteUser(id, function(err, users) {
    if (err && err.status) {
      return next(new HttpError(err.status, err.message));
    }
    if (err) {
      return next(err);
    }
    res.send(users);    
  });
});

app.use(function(err, res, req, next) {
  if (err instanceof HttpError) {
    res.send(err.status, err.message);
  }
  res.send(err);
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});


