var mongoose = require('mongoose');
var async = require('async')

sensors = {}
var chl_dark_count = 47;
var chl_sf = 0.0121;
var ntu_dark_count = 49;
var ntu_sf = 0.0061;

mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {
    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': "flntu", "buoy_name": "tabs225m09"}, function(err, sens){
       sens.update({"chl_dark_count" : chl_dark_count, "chl_sf": chl_sf, "ntu_dark_count": ntu_dark_count, "ntu_sf": ntu_sf}, function() {
         console.log("-I- done updating flntu consts");
         console.log("-I- db.close");
         mongoose.connection.close();
       })
    });
}); // db.once
