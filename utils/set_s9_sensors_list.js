var mongoose = require('mongoose');
var async = require('async')


var s9_list = [ {'A016': 5}, {'A00B': 14}, {'A015': 23}, {'A00H': 32},
                            {'A00W': 41}, {'A00D': 50}, {'A00A': 59}, {'A00E': 68}, {'A00C': 77}, {'A00T': 86}, {'A017': 5}, {'A00S': 14}, {'A018': 23},
                            {'A00Y': 32},{'A00Q': 16}, {'A00H': 34}, {'A009': 43}, {'A00Z': 52}, {'A00P': 61}, {'A00S': 68}, {'A00R': 77}, {'A00M': 86} ];


mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {


    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': 's9', 'buoy_name': 'tabs225m09'}, function(err, sens){
       sens.update({"child_sensors" : s9_list}, function() {
         console.log("-I- done updating s9_list");
         mongoose.connection.close();
       })
    });


}); // db.once
