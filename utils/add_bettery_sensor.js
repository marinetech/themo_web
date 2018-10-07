var mongoose = require('mongoose');
var sync = require('synchronize');
var dateFormat = require('dateformat');

mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  // run asynch tasks in synch.
  try {
    sync.fiber(function() {
        // sync.await( drop_buoys_collection( sync.defer() ) );
        sync.await( add_battery( sync.defer() ) );
        // sync.await( create_schema_tabs225m10( sync.defer() ) );
        sync.await( close_db() );
    });
  } catch(err) {
      console.log("failed to create the themo schema");
      console.log(err.toString());
  }
});

// create the schema - every buoy has a list of sensors - every sensor wil have a list of measurments
function add_battery(callback) {
  console.log("adding new sensor - battery");

  // this is the schema for the sensors
  var sensor_model = require('../app/models/sensor');


  //sensors (info was taken from Shlomi's excel)
  var now = new Date();
  var sensors = [];

  sensors.push({ name: 'battery', description: 'battery level', manufacturer: 'GERG', model: '',  buoy_name: 'tabs225m09', calibratedOn: now});

  sensors.forEach(function(element) {
    //console.log(element["name"]);
    var sensor = new sensor_model(element);
    sensor.save(function(err) {
      if (err) throw err;
      console.log(' -- sensor was added: ' + element["name"]);
    });
  });

  callback();
}


// close connection
function close_db () {
  mongoose.connection.close();
}
