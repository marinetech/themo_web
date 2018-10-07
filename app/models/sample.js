var mongoose = require("mongoose");

// this is the schema for the sensor
var sampleSchema = mongoose.Schema({
      sensor_name: String,
      sensor_id: String,
      d_stamp: String
  },{ strict: false });

var samples  = mongoose.model('samples', sampleSchema);
module.exports = samples
