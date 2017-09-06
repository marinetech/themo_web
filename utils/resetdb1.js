var mongoose = require('mongoose');
var sync = require('synchronize');
var dateFormat = require('dateformat');

var async = require('async')



mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

//   // run asynch tasks in synch.
//   try {
//     sync.fiber(function() {
//         sync.await( drop_buoys_collection( sync.defer() ) );
//         sync.await( create_schema( sync.defer() ) );
//         sync.await( close_db() );
//     });
//   } catch(err) {
//       console.log("failed to create the themo schema");
//       console.log(err.toString());
//   }
// });


  async.series( [drop_buoys_collection, create_schema, close_db] );

});






// if the schema is already exists - drop it.
function drop_buoys_collection(callback) {
  console.log("dropping existing buoys data");
  mongoose.connection.db.dropCollection('buoys', function(err, result) {
      mongoose.connection.db.dropCollection('sensors', function(err, result) {
          mongoose.connection.db.dropCollection('samples', function(err, result) {
            callback(null);
          });
      });
  });
}


// create the schema - every buoy has a list of sensors - every sensor wil have a list of measurments
function create_schema(callback) {
  console.log("recreating buoys data");

  // and this is the schema for the buoys (with embedded sensor schema)
  var buoy_model = require('../app/models/buoy');

  // create buoy object from it's schema
  //var Buoy = mongoose.model('Buoy', buoy_model);
  var tabs225m09 = new buoy_model ({
    name: 'tabs225m09',
    depth: 124
  });
  //
  // this is the schema for the sensors
  var sensor_model = require('../app/models/sensor');


  //sensors (info was taken from Shlomi's excel)
  var now = new Date();
  var sensors = [];

  sensors.push({ name: 'adcp', description: 'Acoustic Doppler Current Profiler', manufacturer: 'Nortek', model: 'signature 250',  buoy_name: 'tabs225m09', calibratedOn: now });
  sensors.push({ name: 'dcs', description: 'Near Surface Doppler Current Sensor', manufacturer: 'Aanderaa', model: 'DCS-4100R',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'flntu', description: 'Fluorometer', manufacturer: 'WetLabs', model: 'flntu',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'microcat', description: 'Conductivity and temperature sensor', manufacturer: 'Seabird Electronics', model: 'SBE37-SI tabs225m09 Housing',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 's9', description: ' ULTI Modem Underwater Inductive Modem', manufacturer: 'Sound Nine', model: 'ULTI Modem',  buoy_name: 'tabs225m09', calibratedOn: now });
  sensors.push({ name: 'metpak', description: 'All in one MET sensor', manufacturer: 'Gill', model: 'MetPak',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'windsonic', description: 'Anemometer', manufacturer: 'Gill', model: 'Windsonic',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'spp', description: 'Standard Precision Pyranometer (shortwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'SPP',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'pir',description: 'Precision Infrared Radiometer (longwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'PIR',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'mp101a_humidity', description: 'External Temp/Humidity Sensor', manufacturer: 'TRDI', model: 'MP101A',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'mp101a_temprature', description: 'External Temp/Humidity Sensor', manufacturer: 'TRDI', model: 'MP101A',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'barometer', description: 'Barometric Pressure', manufacturer: 'Vaisala', model: 'PTB210',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'waves', description: 'Waves', manufacturer: 'MicroStrain', model: '3DM-GX25',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'internal', description: 'Internal Humidity and Temperature Sensor', manufacturer: 'PreCon', model: 'HS-2000',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'gps', description: 'GPS Sensor', manufacturer: 'Garmin', model: 'Garmin 16HV',  buoy_name: 'tabs225m09', calibratedOn: now});
  sensors.push({ name: 'compass', description: 'Compass', manufacturer: 'Honeywell', model: 'HMR3300R',  buoy_name: 'tabs225m09', calibratedOn: now});


  // // at this point the document is ready, so we can save it to DB
  tabs225m09.save(function(err) {
    if (err) throw err;
    console.log('bouy was added: tabs225m09');
    i = 0;
    sensors.forEach(function(element) {
      //console.log(element["name"]);
      var sensor = new sensor_model(element);
      sensor.save(function(err) {
        if (err) throw err;
        console.log(' -- sensor was added: ' + element["name"]);
        i++;
        if (i === 16) callback(null);
      });
    });
  });
}


function add_s9_sensors() {

  console.log();
  console.log('adding s9 sensors');

  var sensor_model = require('../app/models/sensor');

  //callback();
}

// close connection
function close_db () {
  console.log('Closing connection to db')
  mongoose.connection.close();
}
