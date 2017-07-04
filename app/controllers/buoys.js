// buoys controller

var mongoose = require('mongoose')
var buoys_model = require('../models/buoy');


module.exports.controller = function(app) {
/**
 * a home page route
 */
  app.get('/buoys', function(req, res) {
      // mongoose.model('buoys') = buoys_model
      buoys_model.find(function (err, buoys_data) {
        //res.send(buoys_data)
        res.render('buoys', {data: buoys_data});
      });
  });

  app.post('/graph', function(req, res) {
      res.render('graph');      
  });


}
