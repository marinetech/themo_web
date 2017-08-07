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
      console.log("failed to create buoys collection");
      console.log(err.toString());
  }
});


// if the schema is already exists - drop it.
function drop_buoys_collection(callback) {
  console.log("dropping existing buoys data");
  mongoose.connection.db.dropCollection('buoys', function(err, result) {});
  callback();
}


// create the schema - every buoy has a list of sensors - every sensor wil have a list of measurments
function create_schema(callback) {
  console.log("recreating buoys data");

  // this is the schema for the sensors
  var sensorSchema = mongoose.Schema({
      name: String,
      description: String,
      manufacturer: String,
      model: String,
      calibratedOn: Date
  });

  // and this is the schema for the buoys (with embedded sensor schema)
  var buoySchema = mongoose.Schema({
      name: String,
      depth: Number,
      sensors: [sensorSchema]
  });


  // create buoy object from it's schema
  var Buoy = mongoose.model('Buoy', buoySchema);
  var shallow = new Buoy({
    name: 'Shallow',
    depth: 40
  });

  //sensors (info was taken from Shlomi's excel)
  var now = new Date();

  shallow.sensors.push({ name: 'adcp', description: 'Acoustic Doppler Current Profiler', manufacturer: 'Nortek', model: 'signature 250',  calibratedOn: now });
  shallow.sensors.push({ name: 'dcl', description: 'Near Surface Doppler Current Sensor', manufacturer: 'Aanderaa', model: 'DCS-4100R',  calibratedOn: now});
  shallow.sensors.push({ name: 'flntu', description: 'Fluorometer', manufacturer: 'WetLabs', model: 'flntu',  calibratedOn: now});
  shallow.sensors.push({ name: 'microcat', description: 'Conductivity and temperature sensor', manufacturer: 'Seabird Electronics', model: 'SBE37-SI Shallow Housing',  calibratedOn: now});
  shallow.sensors.push({ name: 's9', description: ' ULTI Modem Underwater Inductive Modem', manufacturer: 'Sound Nine', model: 'ULTI Modem',  calibratedOn: now});
  shallow.sensors.push({ name: 'metpak', description: 'All in one MET sensor', manufacturer: 'Gill', model: 'MetPak',  calibratedOn: now});
  shallow.sensors.push({ name: 'windsonic', description: 'Anemometer', manufacturer: 'Gill', model: 'Windsonic',  calibratedOn: now});
  shallow.sensors.push({ name: 'spp', description: 'Standard Precision Pyranometer (shortwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'SPP',  calibratedOn: now});
  shallow.sensors.push({ name: 'pir',description: 'Precision Infrared Radiometer (longwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'PIR',  calibratedOn: now});
  shallow.sensors.push({ name: 'mp101a', description: 'Temp/Humidity Sensor', manufacturer: 'TRDI', model: 'MP101A',  calibratedOn: now});
  shallow.sensors.push({ name: 'barometer', description: 'Barometric Pressure', manufacturer: 'Vaisala', model: 'PTB210',  calibratedOn: now});
  shallow.sensors.push({ name: 'waves', description: 'Waves', manufacturer: 'MicroStrain', model: '3DM-GX25',  calibratedOn: now});
  shallow.sensors.push({ name: 'internal', description: 'Internal Humidity and Temperature Sensor', manufacturer: 'PreCon', model: 'HS-2000',  calibratedOn: now});
  shallow.sensors.push({ name: 'gps', description: 'GPS Sensor', manufacturer: 'Garmin', model: 'Garmin 16HV',  calibratedOn: now});
  shallow.sensors.push({ name: 'compass', description: 'Compass', manufacturer: 'Honeywell', model: 'HMR3300R',  calibratedOn: now});


  // at this point the document is ready, so we can save it to DB
  shallow.save(function(err) {
    if (err) throw err;
    console.log('bouy was added: shallow');
  });

  callback();
}

// close connection
function close_db () {
  mongoose.connection.close();
}
