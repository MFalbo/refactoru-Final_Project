var mongoose = require('mongoose');
var Pet = require('../Models/pet');
var User = require('../Models/user');

module.exports = {
	dashboard: function(req, res){
		if(req.user.role === 'owner'){
			User.findOne({_id : req.user._id}).populate('pets', null, 'pet').exec(function(err, user){
				console.log('populated user', user.pets);
				res.render('owner', {user: user});
			})
				
		}
		else{
			res.redirect('/access/denied');
		}
	}
}