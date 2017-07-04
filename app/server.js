var express = require('express')
  , logger = require('morgan')
  , fs = require('fs')
  , app = express()
  , template_homepage = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
  , template_buoys = require('jade').compileFile(__dirname + '/source/templates/buoys.jade')

// connection to DB
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;


// app configuration
app.set('views', './app/views')
app.set('view engine', 'pug')
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
//app.use(app.router);
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/../bower_components'));

// dynamically include routes (Controller)
fs.readdirSync(__dirname + '/controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});



app.get('/', function (req, res, next) {
  try {
    //var html = template_homepage({ title: 'Home' })
    //res.send(html)
    res.render('homepage', { title: 'Hey', message: 'Hello there!' })
  } catch (e) {
    next(e)
  }
})

app.get('/graph', function (req, res, next) {
  try {
    //var html = template_homepage({ title: 'Home' })
    //res.send(html)
    res.render('graph', { title: 'Hey', message: 'Hello there!' })
  } catch (e) {
    next(e)
  }
})


// app.get('/buoys', function (req, res, next) {
//   try {
//     //var html = template_buoys({ title: 'buoys' })
//     //res.send(html)
//     //res.render('buoys', { title: 'Hey', message: 'Hello there!' })
//     res.send(ctrl_buoy.list.toString());
//
//     ctrl_buoy
//
//   } catch (e) {
//     next(e)
//   }
// })

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
