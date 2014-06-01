var mongoose = require('mongoose');
var Pet = require('../Models/pet');
var User = require('../Models/user');

module.exports = {
	dashboard: function(req,res){
		if(req.user.role === 'veterinarian'){
			res.render('vet', {user: req.user});	
		}
		else{
			res.redirect('/access/denied');
		}
	},
	search: function(req, res){
		console.log('AJAX Request Body', req.body);
		Pet.find({name : req.body.petName}, function(err, pet){
			// console.log(pet);
			res.send(pet);
		});
	}
}