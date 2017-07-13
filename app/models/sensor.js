//sensor model

var mongoose = require("mongoose");

// this is the schema for the sensor
var sensorSchema = mongoose.Schema({
    name: String,
    description: String,
    manufacturer: String,
    model: String,
    buoy_name: String,
    calibratedOn: Date
});

var sensors  = mongoose.model('sensors', sensorSchema);
module.exports = sensors;
