var mongoose = require('mongoose');
var Pet = require('../Models/pet');
var User = require('../Models/user');

module.exports = {
	dashboard: function(req, res){
		console.log(req);
		if(req.user.role === 'owner' && req.params.userId === req.user.username){
			// console.log('user id', req.user._id);
			User.findOne({_id : req.user._id}).populate('pets', null, 'pet').exec(function(err, user){
				// console.log('populated user', user.pets);
				res.render('owner', {loggedIn: !!req.user, user: user});
			})
				
		}
		else{
			res.redirect('/access/denied');
		}
	},
	log: function(req, res){
		// console.log(req.body);
		var logObject = {
			date: req.body.date,
			symptom: req.body.symptom,
			description: req.body.description
		};

		Pet.findOneAndUpdate({_id: req.body._id.replace(/"/g, "")}, {$push: {medicalHistory: logObject}}, {safe: true, upsert: true}, function(err, pet){
			// console.log(err);
			// console.log(pet);
			res.send(pet);
		});
	},
	schedule: function(req, res){
		Pet.findOneAndUpdate({_id: req.body._id.replace(/"/g, "")}, {$set: {schedule: req.body.schedule}}, function(err, pet){
			// console.log(err);
			// console.log(pet);
			res.send(pet);
		});
	}
}//END MODULE EXPORTS