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

// app.use(passportConfig.enusreAuthenticated);

app.get('/owner/:userId', function(req, res){
	res.render('owner', {user: req.user});
});

app.get('/sitter/:userId', function(req,res){
	res.render('sitter', {user: req.user});
});

app.get('/veterinarian/:userId', function(req,res){
	res.render('vet', {user: req.user});
});

var server = app.listen(3106, function() {
	console.log('Express server listening on port ' + server.address().port);
});
