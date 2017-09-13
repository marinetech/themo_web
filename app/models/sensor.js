//sensor model

var mongoose = require("mongoose");

// this is the schema for the sensor
var sensorSchema = mongoose.Schema({
    name: String,
    display_name: String,
    description: String,
    manufacturer: String,
    model: String,
    buoy_name: String,
    calibratedOn: Date,
    hidden: Boolean,

    // to be used for sound-nine
    child_sensors: [],

    // to be  used for flntu - Dark Counts/Scale Factor constants for Chlorophyll & Nephelometric Turbidity unit.
    chl_dark_count: Number,
    chl_sf: Number,
    ntu_dark_count: Number,
    ntu_sf: Number,

    // to be used on fields that have to be displayed in the web signature
    fields_to_display: [String]
});

var sensors  = mongoose.model('sensors', sensorSchema);
module.exports = sensors;
