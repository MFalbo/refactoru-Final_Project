var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');

passportConfig = require('./config/passport');

// -------------------------------------Require all Route Controllers--------------------------------
var indexController = require('./controllers/indexController.js');
var authenticationController = require('./controllers/authenticationController');
var ownerController = require('./controllers/ownerController');
var veterinarianController = require('./controllers/veterinarianController');
var sitterController = require('./controllers/sitterController');
var accessController = require('./controllers/accessController');
var petController = require('./controllers/petController');

// --------------------------------------------Require Models-----------------------------------------------
var Pet = require('./Models/pet');
var User = require('./Models/user');

// ------------------------------------Connect Mongoose to Project Database--------------------------
mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/betterPets');

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

// ----------------------------------------------ROUTES---------------------------------------------------

// Home Page Route
app.get('/', indexController.index);

// All User Authentication Routes
app.post('/auth/login', authenticationController.processLogin);
app.post('/auth/signup', authenticationController.processSignup);
app.get('/auth/logout', authenticationController.logout);

// All Pet Routes
app.post('/pet/create', petController.create);

// Access Error/Denial Routes
app.get('/access/error', accessController.error);
app.get('/access/denied', accessController.denied);

// ------------------------------All Routes after this line require a user to be logged in------------------------
app.use(passportConfig.ensureAuthenticated);

// Owner Role Routes
app.get('/owner/:userId', ownerController.dashboard);
app.post('/owner/log', ownerController.log);
app.post('/owner/schedule', ownerController.schedule);

// Sitter Role Routes
app.get('/sitter/:userId', sitterController.dashboard);

// Vet Role Routes
app.get('/veterinarian/:userId', veterinarianController.dashboard);
app.post('/veterinarian/search', veterinarianController.search);

// -----------------------------------------Establish Server Port-----------------------------------------
var server = app.listen(process.env.PORT || 3106, function() {
	console.log('Express server listening on port ' + server.address().port);
});
