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
        sensors_model.find( function (err, sensors_data) {
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

      csv_dir = __dirname + "/../../csv";
      zip_name = csv_dir + "/csv.zip";

      // async.forEach(arr_sensors, function(sensorId, sensor_callback) {
      //   samples_model.find( {sensor_id: sensorId, d_stamp: {$gte: s_date, $lte: e_date} }, function (err, samples) {
      //     if (samples.length < 1) {
      //       create_empty_csv(sensorId, csv_dir, sensor_callback);
      //     } else {
      //       create_csv(samples, csv_dir, sensor_callback);
      //     }
      //   }) //samples_model.find
      // }, function(err) {
      //   if (err) return sensor_callback(err);
      //   zipit(csv_dir, zip_name);
      //   res.download(zip_name, 'sensors.zip', function(err) {
      //     if (err) {
      //       console.log("error while attemting to download csv");
      //     } else {
      //       clean_csv_area(csv_dir);
      //     }
      //   })
      // });


      // mongoexport --type=csv  -q '{ "sensor_id": "59b0ce8b57e69a661ad6eed4"}' -d themo -c samples -f sensor_name,d_stamp,t_stamp -o /home/ilan/projects/themo_web/app/controllers/../../csv/59b0ce8b57e69a661ad6eed4.csv
      async.forEach(arr_sensors, function(sensorId, sensor_callback) {
        var query = `'{ "sensor_id": "${sensorId}" }'`
        let options = {
            database: 'themo', // required
            collection: 'samples', // required
            fields: ['sensor_name','d_stamp', 't_stamp'], // required
            output: csv_dir + '/' + sensorId + '.csv', // required
            allValidOptions: `-q ${query}`
        };
        mongotocsv.export(options, function (err, success) {
            console.log(err);
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


clean_str = function (str) {
  return str.replace(/{|}|"/g, '')
}


create_csv = function (samples, csv_dir, callback) {

    var dict_csv = dict({});
    var arr_csv_headers = []
    var arr_csv_lines = []
    var sensor_name = samples[0]["sensor_name"];

    console.log("start onvert bson to dictionary")
    //convert bson to dictionary
    for (var i = 0; i < samples.length; i++) { //for each sample in samples
      arr_samples = JSON.stringify(samples[i]).split(","); // store in arr_samples - each element is a key/value pair
      for (var j = 0; j < arr_samples.length; j++) { // foreach key/value pair
        arr_temp = arr_samples[j].split(":"); // split key from value
        if (dict_csv.has(arr_temp[0])) { // and store in a dictionary
          val = dict_csv.get(arr_temp[0]) + "," + arr_temp.slice(1, arr_temp.length).join(":")
          dict_csv.set(arr_temp[0], val);
        } else {
          dict_csv.set(arr_temp[0], arr_temp.slice(1, arr_temp.length).join(":"));
        }
      }
    }
    console.log("end onvert bson to dictionary")

    console.log("start headers")
    //prepare headers for CSV
    arr_first_sample = JSON.stringify(samples[0]).split(",");
    for (var j = 0; j < arr_first_sample.length; j++) {
      arr_csv_headers.push(clean_str(arr_first_sample[j].split(":")[0]));
    }
    console.log("end headers")


    console.log("start prepare lines")
    // prepare data lines for CSV
    arr_line = []
    for (var k = 0; k < samples.length; k++) {
      dict_csv.forEach(function (value, key) {
        arr_line.push(clean_str(value.split(",")[0]));
        dict_csv.set(key, value.split(",").slice(1).join());
      });
      arr_csv_lines.push(arr_line);
      arr_line = []
    }
    console.log("end prepare lines")

    // // write headers and lines to csv
    // csv_name = path.join(csv_dir, sensor_name + ".csv");
    // fs.writeFileSync(csv_name, arr_csv_headers.join() );
    // for (var i =0; i < arr_csv_lines.length; i++) {
    //     fs.appendFileSync(csv_name, "\n" + arr_csv_lines[i].join() );
    // }
    //
    // callback()

    // write headers and lines to csv
    csv_name = path.join(csv_dir, sensor_name + ".csv");
    fs.writeFile(csv_name, arr_csv_headers.join(), function() {
      var lines = "";
      for (var i =0; i < arr_csv_lines.length; i++) {
          lines = lines + "\n" + arr_csv_lines[i].join();
      }

      fs.appendFile(csv_name, lines, function() {
        callback()
      });
    });
}


create_empty_csv = function (sensor_id, csv_dir, callback) {
    sensors_model.findById(sensor_id, function (err, sensor) {
    var sensor_name = sensor["name"];
    var csv_name = path.join(csv_dir, sensor_name + ".csv");
    fs.writeFileSync(csv_name, "no_data" );
    callback();
  });
}
