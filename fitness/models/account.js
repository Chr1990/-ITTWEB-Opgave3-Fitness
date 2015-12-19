var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);

/////////////////////////////////////////////

var workoutSchema = mongoose.Schema({
	userName: String,
	workoutName: String,
	done: Boolean,
	exercises:  Array
});

var exerciseSchema = mongoose.Schema({
	exerciseName: String,
	description: String,
	numberOfSets: Number,
	repetitionsOrTime: String
});

var workoutProgram = mongoose.model('workouts', workoutSchema);
var exercise = mongoose.model('exercises', exerciseSchema);
