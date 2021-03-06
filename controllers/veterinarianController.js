var mongoose = require('mongoose');
var Pet = require('../Models/pet');
var User = require('../Models/user');

module.exports = {
	dashboard: function(req,res){
		if(req.user.role === 'veterinarian' && req.params.userId === req.user.username){
			res.render('vet', {loggedIn: !!req.user, user: req.user});	
		}
		else{
			res.redirect('/access/denied');
		}
	},
	search: function(req, res){
		// console.log('AJAX Request Body', req.body);
		Pet.find({name : req.body.petName, 'owner.lastName': req.body.ownerName}, function(err, pet){
			// console.log(pet);
			res.send(pet);
		});
	}
}