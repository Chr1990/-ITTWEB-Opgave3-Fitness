var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.get('/exercises/:workdoutId', isAuthenticated, function(req, res) {
	var workouts = mongoose.model('workouts');
	var query  = workouts.findOne({ '_id': req.params.workdoutId});
	
	query.exec(function(err, data) {
       //if (err) return console.error(err);
		var returnData = { 'workout': data};
		console.log(returnData);
		res.render('exercise', returnData);
    });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/workout', isAuthenticated, function(req, res) {
	var workouts = mongoose.model('workouts');
	
	workouts.find().where('userName').equals(req.user.username).exec(function(err, workoutsData) {
		var data = { 'workouts': workoutsData, 'user': req.user };
		res.render('workout', data);
	});
});

router.post('/workout/:workoutName', function(req, res) {
    var workouts = mongoose.model('workouts');
	
	var newWorkoutObj = {
		'userName': req.user.username,
		'workoutName': req.params.workoutName,
		'done': false,
		'exercises': [],
	}
	var newWorkout = new workouts(newWorkoutObj);
	newWorkout.save(function(error, obj) {
		res.end("yes");
	});
});

router.delete('/workout/:workoutId', function(req, res) {
	var workouts = mongoose.model('workouts');
	
	var deleteWorkoutIdObj = { '_id': mongoose.Types.ObjectId(req.params.workoutId) };
	workouts.findByIdAndRemove(deleteWorkoutIdObj, function(err, obj) {	
		res.end("yes");
	});
});

router.get('/certificate', isAuthenticated, function(req, res) {
	var workouts = mongoose.model('workouts');
	
	workouts.find().where('userName').equals(req.user.username).exec(function(err, workoutsData) {
		var data = { 'workouts': workoutsData, 'user': req.user };
		res.render('certificate', data);
	});
});

router.get('/ping', function(req, res) {
	res.status(200).send(req.user);
});

function isAuthenticated(req, res, next) {
    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user)
        return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/login');
}

module.exports = router;
