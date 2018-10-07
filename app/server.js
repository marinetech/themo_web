var express = require('express')
  , logger = require('morgan')
  , fs = require('fs')
  , app = express()
  , bodyParser = require('body-parser')
  , jsonParser = bodyParser.json()
  , urlencodedParser = bodyParser.urlencoded({ extended: false })
  , cookieParser = require('cookie-parser')
  , path = require('path')
  , passport = require('passport')
  , expressValidator = require('express-validator')
  , flash = require('connect-flash')
  , session = require('express-session');

global.appRoot = path.resolve(__dirname);

// connection to DB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
var promise = mongoose.connect(strConnection, {
  useMongoClient: true,
});
var db = mongoose.connection;


// app configuration
app.set('views', './app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/../bower_components'));

// // dynamically include routes (Controller)
// fs.readdirSync(global.appRoot + '/controllers').forEach(function (file) {
//   if(file.substr(-3) == '.js') {
//       route = require('./controllers/' + file);
//       route.controller(app, urlencodedParser);
//   }
// });

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//routes
buoys_route = require('./controllers/buoys.js');
buoys_route.controller(app, urlencodedParser);
var users = require('./controllers/users');
app.use('/users', users);

app.get('/', function (req, res, next) {
  try {
    res.render('homepage')
  } catch (e) {
    next(e)
  }
})

app.get('/login', function (req, res, next) {
  try {
    res.render('login', { title: 'Hey', message: 'Hello there!' })
  } catch (e) {
    next(e)
  }
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
