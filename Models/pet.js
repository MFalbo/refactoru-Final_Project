var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var petSchema = mongoose.Schema({
	name: String,
	age: Number,
	owner: Object,
	species: String,
	breed: String,
	rfidChip: String,
	rabiesTag: String,
	certifications: [String],
	avatar: String,
	schedule: [],
	considerations: Object,
	medicalHistory: []
});

// Our pet model
var Pet = mongoose.model('pet', petSchema);

module.exports = Pet;