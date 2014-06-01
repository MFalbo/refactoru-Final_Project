var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');

passportConfig = require('./config/passport');

var indexController = require('./Controllers/indexController.js');
var authenticationController = require('./Controllers/authenticationController');

var Pet = require('./Models/pet');
var User = require('./Models/user');

mongoose.connect('mongodb://localhost/betterPets');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.use(cookieParser());
app.use(flash());
app.use(session({secret: 'secret'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);

app.post('/auth/login', authenticationController.processLogin);
app.post('/auth/signup', authenticationController.processSignup);
app.get('/auth/logout', authenticationController.logout);

app.post('/pet/create', function(req, res){
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
		console.log(pet);
		if(err) return console.error(err);

		User.update({_id : req.user._id} , {$push: { pets : pet._id}}, function(err, user){
			console.log('user id',req.user._id);
			console.log('pet id', pet._id);
			res.redirect('/owner/' + req.user.username);
		});
	});

	console.log('req.user', req.user);
	console.log('req.body', req.body);
	// res.send(req.body);
});

// Access Error/Denial Routes
app.get('/access/error', function(req, res){
	res.render('error');
});
app.get('/access/denied', function(req, res){
	res.render('denied');
})

// All Routes after this line require a user to be logged in
app.use(passportConfig.ensureAuthenticated);

// Owner Role Routes
// app.get('/owner', function(req, res){          Created base owner route to test ensureAuthenticated function
// 	res.render('owner', {user: req.user});
// });
app.get('/owner/:userId', function(req, res){
	if(req.user.role === 'owner'){
		User.findOne({_id : req.user._id}).populate('pets', null, 'pet').exec(function(err, user){
			console.log('populated user', user.pets);
			res.render('owner', {user: user});
		})
			
	}
	else{
		res.redirect('/access/denied');
	}
});

// Sitter Role Routes
app.get('/sitter/:userId', function(req,res){
	if(req.user.role === 'sitter'){
		res.render('sitter', {user: req.user});
	}
	else{
		res.redirect('/access/denied');
	}
});

// Vet Role Routes
app.get('/veterinarian/:userId', function(req,res){
	if(req.user.role === 'veterinarian'){
		res.render('vet', {user: req.user});	
	}
	else{
		res.redirect('/access/denied');
	}
});

app.post('/veterinarian/search', function(req, res){
	console.log('AJAX Request Body', req.body);
	Pet.find({name : req.body.petName}, function(err, pet){
		// console.log(pet);
		res.send(pet);
	});
});

var server = app.listen(3106, function() {
	console.log('Express server listening on port ' + server.address().port);
});
