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

  shallow.sensors.push({ name: 'ADCP', manufacturer: 'TRDI', model: 'signature 250',  calibratedOn: now });
  shallow.sensors.push({ name: 'Near Surface Doppler Current Sensor', manufacturer: 'Aanderaa', model: 'DCS-4100R',  calibratedOn: now});
  shallow.sensors.push({ name: 'CDOM,Chl, turbidity, Wiper', manufacturer: 'WetLabs', model: 'Triplet w/CDOM/Chlorophyll/Turbidity/Wiper',  calibratedOn: now});
  shallow.sensors.push({ name: 'Conductivity/Temperature (MICROCAT)', manufacturer: 'Seabird Electronics', model: 'SBE37-SI Shallow Housing',  calibratedOn: now});
  shallow.sensors.push({ name: 'Sound nine Enduro Inducive T/P Sensors', manufacturer: 'Sound Nine', model: 'Enduro APT',  calibratedOn: now});
  shallow.sensors.push({ name: 'Sound Nine ULTI Modem', manufacturer: 'Sound Nine', model: 'ULTI Modem',  calibratedOn: now});
  shallow.sensors.push({ name: 'Conductivity/Temperature', manufacturer: 'Seabird Electronics', model: 'SBE37-IMP Deep housing',  calibratedOn: now});
  shallow.sensors.push({ name: 'CDOM/Chlorophyll/Turbidity', manufacturer: 'Wet Labs', model: 'ECO Triplet',  calibratedOn: now});
  shallow.sensors.push({ name: 'All in one MET sensor', manufacturer: 'Gill', model: 'MetPak',  calibratedOn: now});
  shallow.sensors.push({ name: 'Anemometer', manufacturer: 'Gill', model: 'Windsonic',  calibratedOn: now});
  shallow.sensors.push({ name: 'Standard Precision Pyranometer (shortwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'SPP',  calibratedOn: now});
  shallow.sensors.push({ name: 'Precision Infrared Radiometer (longwave Iradiance)', manufacturer: 'Eppley Laboratories', model: 'PIR',  calibratedOn: now});
  shallow.sensors.push({ name: 'Temp/Humidity', manufacturer: 'TRDI', model: 'MP101A',  calibratedOn: now});
  shallow.sensors.push({ name: 'Barometric Pressure', manufacturer: 'Vaisala', model: 'PTB210',  calibratedOn: now});
  shallow.sensors.push({ name: 'Waves', manufacturer: 'MicroStrain', model: '3DM-GX25',  calibratedOn: now});
  shallow.sensors.push({ name: 'Internal Temperature/Humidity', manufacturer: 'PreCon', model: 'HS-2000',  calibratedOn: now});
  shallow.sensors.push({ name: 'GPS Tracker', manufacturer: 'Xeos', model: 'Onyx',  calibratedOn: now});
  shallow.sensors.push({ name: 'GPS Sensor', manufacturer: 'Garmin', model: 'Garmin 16HV',  calibratedOn: now});
  shallow.sensors.push({ name: 'Compass', manufacturer: 'Honeywell', model: 'HMR3300R',  calibratedOn: now});
  shallow.sensors.push({ name: 'bats FAST5.4/5.8', manufacturer: 'BATS', model: 'FAST5.4/5.8',  calibratedOn: now});

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
