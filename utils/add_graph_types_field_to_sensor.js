var mongoose = require('mongoose');
var async = require('async')


sensors = {}
sensors["barometer"] = ['last day', 'last week']
sensors["waves"] = ['last day']


mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {

  async.forEach(Object.keys(sensors), function(sensor, sensor_callback) {
    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': sensor, 'buoy_name': 'tabs225m09'}, function(err, sens){
       sens.update({"graph_types" : sensors[sensor]}, function() {
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
