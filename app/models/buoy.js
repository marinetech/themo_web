//buoys model

var mongoose = require("mongoose");

// and this is the schema for the buoys (with embedded sensor schema)
var buoySchema = mongoose.Schema({
    name: String,
    depth: Number,
});

var buoys  = mongoose.model('buoys', buoySchema);
module.exports = buoys;
