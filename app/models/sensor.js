//sensor model

var mongoose = require("mongoose");

// this is the schema for the sensor
var sensorSchema = mongoose.Schema({
    name: String,
    description: String,
    manufacturer: String,
    model: String,
    buoy_name: String,
    calibratedOn: Date,

    // to be used for sound-nine
    child_sensors: [],

    // to be  used for flntu - Dark Counts/Scale Factor constants for Chlorophyll & Nephelometric Turbidity unit.
    chl_dark_count: Number,
    chl_sf: Number,
    ntu_dark_count: Number,
    ntu_sf: Number
});

var sensors  = mongoose.model('sensors', sensorSchema);
module.exports = sensors;
