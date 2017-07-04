//buoys model

var mongoose = require("mongoose");

// this is the schema for the sensor
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

var buoys  = mongoose.model('buoys', buoySchema);
module.exports = buoys;
