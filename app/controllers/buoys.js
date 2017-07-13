// buoys controller

var mongoose = require('mongoose')
var buoys_model = require('../models/buoy');
var sensors_model = require('../models/sensor');
var samples_model = require('../models/sample');


module.exports.controller = function(app, parser) {
/**
 * a home page route
 */
  app.get('/buoys', function(req, res) {
      // mongoose.model('buoys') = buoys_model
      buoys_model.find(function (err, buoys_data) {
        //res.send(buoys_data)
        sensors_model.find( function (err, sensors_data) {
          res.render('buoys', {b_data: buoys_data, s_data: sensors_data});
        });
      });
  });

  app.post('/graph', parser, function(req, res) {

      var arr_sensors = req.body["list"].split(",");
      for (var i = 0, len = arr_sensors.length; i < len; i++) {
        var query = "{sensor_id: '" + arr_sensors[i] + "'}"
        samples_model.find(query, function (err, samples) {
          for (var i = 0, len = samples.length; i < len; i++) {
            console.log(samples[i]);
          }
          res.send(samples[i])
        });
      }
  }); //end of app.post
} //end of controller


get_samples = function (err, buoys_data) {
    return samples_model.find()
}
