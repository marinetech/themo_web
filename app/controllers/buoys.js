// buoys controller

var mongoose = require('mongoose')
var buoys_model = require('../models/buoy');
var sensors_model = require('../models/sensor');
var samples_model = require('../models/sample');
var dict = require("dict"); //npm install dict --save
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var async = require('async')
var mongotocsv = require('mongo-to-csv');


module.exports.controller = function(app, parser) {


  app.get('/buoys', function(req, res) {
      // mongoose.model('buoys') = buoys_model
      buoys_model.find(function (err, buoys_data) {
        //res.send(buoys_data)
        sensors_model.find( {"hidden": false}, function (err, sensors_data) {
          res.render('buoys', {b_data: buoys_data, s_data: sensors_data});
        });
      });
  });


  app.post('/buoys', parser, function(req, res) {
      var arr_sensors = req.body["list"].split(",");
      var s_date = req.body["s_date"];
      if (s_date === "") {s_date = "2000-01-01"}
      var e_date = req.body["e_date"];
      if (e_date === "") {e_date = "2100-01-01"}

      var dict_sensors = dict({});
      var dict_fields = dict({});

      csv_dir = __dirname + "/../../csv";
      zip_name = csv_dir + "/csv.zip";

      sensors_model.find( {} , function (err, sensors) {
        // create sensor map id => name
        for (var i = 0, len = sensors.length; i < len; i++) {
          key = JSON.stringify(sensors[i]["_id"])
          dict_sensors.set(key, sensors[i]["name"]);
          dict_fields.set(key, sensors[i]["fields_to_display"]);
        }

        // foreach sensor use mongoexport to cerate csv file
        // e.g. mongoexport --type=csv  -q '{ "sensor_id": "59b0ce8b57e69a661ad6eed4"}' -d themo -c samples -f sensor_name,d_stamp,t_stamp -o /home/ilan/projects/themo_web/app/controllers/../../csv/59b0ce8b57e69a661ad6eed4.csv
        async.forEach(arr_sensors, function(sensorId, sensor_callback) {
          var query = `'{ "sensor_id": "${sensorId}", "d_stamp": {$gte: "${s_date}", $lte: "${e_date}" }}'`
          var sort = `'{"d_stamp" : 1, "t_stamp" : 1}'`
          var current_sensor_name = dict_sensors.get(JSON.stringify(sensorId));
          var current_fields = dict_fields.get(JSON.stringify(sensorId));
          if (current_fields.length < 1) {
            current_fields = ['no_data']
          }
          let options = {
              database: 'themo', // required
              collection: 'samples', // required
              fields: current_fields,
              output: csv_dir + '/' + current_sensor_name + '.csv', // required
              allValidOptions: `-q ${query} --sort ${sort}`
          };
          mongotocsv.export(options, function (err, success) {
              console.log("error: " + err);
              console.log(success);
              sensor_callback()
          });
        }, function(err) {
          if (err) return sensor_callback(err);
          zipit(csv_dir, zip_name);
          res.download(zip_name, `Sensors_${Date.now()}.zip`, function(err) {
            if (err) {
              console.log("error while attempting to download csv");
            } else {
              clean_csv_area(csv_dir);
            }
          })
        });
      });


  }); // end of app.post
} //end of controller





zipit = function (csv_dir, zip_name) {
  var zip = new AdmZip();
  var files = fs.readdirSync(csv_dir);

  //console.log("files: " + files);

  for(var i in files) {
    if (path.extname(files[i]) === ".csv") {
      var input = fs.readFileSync(csv_dir + "/" + files[i]);
      //zip.addLocalFile(csv_dir + "/" + files[i]);
      zip.addFile(files[i], input, '', 0644);
    }
  }
  zip.writeZip(zip_name);
}


clean_csv_area = function(csv_dir) {
  var files = fs.readdirSync(csv_dir);
  for(var i in files) {
    fs.unlinkSync(path.join(csv_dir, files[i]), err => {});
  }
}
