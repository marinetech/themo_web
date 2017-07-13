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
        sync.await( drop_buoys_collection( sync.defer() ) );
        sync.await( create_schema( sync.defer() ) );
        sync.await( close_db() );
    });
  } catch(err) {
      console.log("failed to create the themo schema");
      console.log(err.toString());
  }
});


// if the schema is already exists - drop it.
function drop_buoys_collection(callback) {
  console.log("dropping existing buoys data");
  mongoose.connection.db.dropCollection('buoys', function(err, result) {});
  mongoose.connection.db.dropCollection('sensors', function(err, result) {});
  mongoose.connection.db.dropCollection('samples', function(err, result) {});
  callback();
}


// create the schema - every buoy has a list of sensors - every sensor wil have a list of measurments
function create_schema(callback) {
  console.log("recreating buoys data");



  // and this is the schema for the buoys (with embedded sensor schema)
  var buoy_model = require('../app/models/buoy');


  // create buoy object from it's schema
  //var Buoy = mongoose.model('Buoy', buoy_model);
  var shallow = new buoy_model ({
    name: 'shallow',
    depth: 40
  });
  //
  // // at this point the document is ready, so we can save it to DB
  shallow.save(function(err) {
    if (err) throw err;
    console.log('bouy was added: shallow');
  });


  // this is the schema for the sensors
  var sensor_model = require('../app/models/sensor');


  //sensors (info was taken from Shlomi's excel)
  var now = new Date();
  var sensors = [];

  sensors.push({ name: 'adcp', description: 'Acoustic Doppler Current Profiler', manufacturer: 'Nortek', model: 'signature 250',  buoy_name: 'shallow', buoy_name: 'shallow', calibratedOn: now });
  sensors.push({ name: 'dcl', description: 'Near Surface Doppler Current Sensor', manufacturer: 'Aanderaa', model: 'DCS-4100R',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'flntu', description: 'Fluorometer', manufacturer: 'WetLabs', model: 'flntu',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'microcat', description: 'Conductivity and temperature sensor', manufacturer: 'Seabird Electronics', model: 'SBE37-SI Shallow Housing',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 's9', description: ' ULTI Modem Underwater Inductive Modem', manufacturer: 'Sound Nine', model: 'ULTI Modem',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'metpak', description: 'All in one MET sensor', manufacturer: 'Gill', model: 'MetPak',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'windsonic', description: 'Anemometer', manufacturer: 'Gill', model: 'Windsonic',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'spp', description: 'Standard Precision Pyranometer (shortwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'SPP',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'pir',description: 'Precision Infrared Radiometer (longwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'PIR',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'mp101a', description: 'Temp/Humidity Sensor', manufacturer: 'TRDI', model: 'MP101A',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'barometer', description: 'Barometric Pressure', manufacturer: 'Vaisala', model: 'PTB210',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'waves', description: 'Waves', manufacturer: 'MicroStrain', model: '3DM-GX25',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'internal', description: 'Internal Humidity and Temperature Sensor', manufacturer: 'PreCon', model: 'HS-2000',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'gps', description: 'GPS Sensor', manufacturer: 'Garmin', model: 'Garmin 16HV',  buoy_name: 'shallow', calibratedOn: now});
  sensors.push({ name: 'compass', description: 'Compass', manufacturer: 'Honeywell', model: 'HMR3300R',  buoy_name: 'shallow', calibratedOn: now});

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
