var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var mailer = require('../lib/send_mail');

// Register Form
router.get('/register', function (req, res) {
	res.render('register');
});

// Register User
router.post('/register', function (req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'last name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		console.log(errors)
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ email: {
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, objUser) {
				if (objUser) {
					console.log("email is already in use: " + objUser)
					res.render('register', {
						mail: mail
					});
				}
				else {
					var newUser = new User({
						firstname: firstname,
						lastname: lastname,
						email: email,
						password: password,
						activation_code: Math.floor(Math.random() * 10000000)
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
					send_verification_mail(email,newUser.activation_code);
         	req.flash('success_msg', 'You are registered and can now login', 'test');
					res.redirect('login');
				}
			});
	}
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// activation
router.get('/activate/:id', function (req, res) {
	User.findOne({ activation_code: req.params.id }, function (err, objUser) {
				if (!objUser) {
					console.log("-E- Account was already is already activated");
					res.render('login');
				}
				else {
					objUser.active = true
					objUser.activation_code = ''
					objUser.save()
					console.log("Activated successfully !!!");
					req.flash('success_msg', 'Activated successfully !!!', 'test');
					res.render('login');
				}
			});
}); //end of get('activate')

passport.use(new LocalStrategy({
	usernameField: 'email'
}, function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) {
				console.log("errr!!!!!!!!!!!!!!!");
				throw err;
			}
			if (!user) {
				console.log("Unknown User !!!!!!!!!!");
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					console.log("isMatch !!!!!!!!!!");
					return done(null, user);
				} else {
					console.log("is NOT Match !!!!!!!!!!");
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/users/register',
			failureFlash: true
	}), function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

function send_verification_mail(email, activation) {
	var from = "themo@univ.haifa.ac.il";
	var subject = "[DO NOT REPLY] - THEMO Account Confirmation";
	var body = "Thank you for your interest in THEMO web site.\n\n";
	body += "In order to complete you resistration please use the following link:\n";
	// body += "http://themo.haifa.ac.il/users/activate/" + activation;
	body += "http://localhost:3000/users/activate/" + activation;
	mailer.send_mail(from, email, subject, body);
}
