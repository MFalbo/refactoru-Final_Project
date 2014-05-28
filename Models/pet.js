var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var petSchema = mongoose.Schema({
	name: String,
	age: Number,
	breed: String,
	rfidChip: String,
	rabiesTag: String,
	certifications: [String],
	avatar: String,
	schedule: Object,
	considerations: Object
});

// Our user model
var Pet = mongoose.model('pet', petSchema);

module.exports = Pet;