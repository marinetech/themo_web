// graph controller

var mongoose = require('mongoose')
var sensors_model = require('../models/sensor');
var samples_model = require('../models/sample');
var data_table = require('../lib/data_table')


module.exports.controller = function(app, parser) {


  app.get('/graph', function(req, res) {
      //res.send(buoys_data)
      sensors_model.find( {graph_types: { $exists: true }}, function (err, sensors_data) {
        res.render('graph', {s_data: sensors_data});
      });
  });


  app.post('/graph', parser, function(req, res) {
    var requested_id = req.body["requested_id"]; //sensor_id
    console.log("requested_id: " + requested_id);
    var graph_type =  "daily";
    var s_date = req.body["s_date"];
    if (s_date === "") {s_date = "2000-01-01"};
    var e_date = req.body["e_date"];
    if (e_date === "") {e_date = "2100-01-01"};

    // samples_model.find( {sensor_id: requested_id, d_stamp: {$gte: s_date, $lte: e_date} } , function (err, samples) {
    samples_model.find( {sensor_id: requested_id, d_stamp: {$gte: s_date, $lte: e_date} }).sort('d_stamp').sort('t_stamp').exec(function (err, samples) {
      sensors_model.findById( requested_id, function (err, sensor) {
        data_table.gen_table(sensor, samples, graph_type, res)
      });
    });
  }); //end of post

} //end of controller
