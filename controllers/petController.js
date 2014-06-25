var mongoose = require('mongoose');
var Pet = require('../Models/pet');
var User = require('../Models/user');

module.exports = {
	create: function(req, res){
		// export to pet controller and include pet model
		var pet = new Pet({
			name: req.body.name,
			age: req.body.age,
			species: req.body.species,
			breed: req.body.breed,
			rfidChip: req.body.rfid,
			rabiesTag: req.body.rabies,
			owner: {
				firstName: req.user.firstName,
				lastName: req.user.lastName
			}
		});

		pet.save(function(err, pet){
			// console.log(pet);
			if(err) return console.error(err);

			User.update({_id : req.user._id} , {$push: { pets : pet._id}}, function(err, user){
				// console.log('user id',req.user._id);
				// console.log('pet id', pet._id);
				res.redirect('/owner/' + req.user.username);
			});
		});

		// console.log('req.user', req.user);
		// console.log('req.body', req.body);
		// res.send(req.body);
	},
	delete: function(req, res){
		console.log("connection to server side of /pet/delete when remove pet button clicked");
		console.log("ID of 'deleted' pet", req.body._id);
		User.findOneAndUpdate({"username": req.user.username}, {$pull: {pets: req.body._id}}, function(err, owner){
			console.log('owner\'s pets', owner.pets);

		});

		Pet.remove({_id: req.body._id.replace(/"/g, "")}, function(err, pet){
			res.send('response from /pet/delete', pet);
		});
	}
}