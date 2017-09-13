var mongoose = require('mongoose');
var async = require('async')


sensors = {}
sensors["dcs"] = false
sensors["flntu"] = false
sensors["microcat"] = false
sensors["s9"] = false
sensors["metpak"] = false
sensors["windsonic"] = false
sensors["mp101a_humidity"] = false
sensors["mp101a_temprature"] = false
sensors["barometer"] = false
sensors["adcp"] = true
sensors["spp"] = true
sensors["pir"] = true


mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {

  async.forEach(Object.keys(sensors), function(sensor, sensor_callback) {
    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': sensor, 'buoy_name': 'tabs225m09'}, function(err, sens){
       sens.update({"hidden" : sensors[sensor]}, function() {
         console.log("-I- done updating " + sensor);
         sensor_callback()
       })
    });
  }, function(err) {
    if (err) return sensor_callback(err);
    console.log("-I- db.close");
    mongoose.connection.close();
  });

}); // db.once
