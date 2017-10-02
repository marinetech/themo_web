function gen_table(sensor, samples, graph_type, res) {

        requested_graph = sensor["name"] + "_" + graph_type; //e.g. barometer_daily

        switch(requested_graph) {
          case "barometer_daily":
              barometer_daily(sensor, samples, res);
              break;
          case "microcat_daily":
              microcat_daily(sensor, samples, res);
              break;
          case "dcs":
              console.log("dsc!!")
              break;
          default:
              console.log("No function was found for: " + requested_graph)
        }

}



function microcat_daily(sensor, samples, res) {
  var rows = '"rows": [ '
  var cols = '"cols": [{"type": "timeofday", "label": "time"}, \
                       {"type": "number", "label": "Salinity"}, \
                       {"type": "number", "label": "Conductivity"}, \
                       {"type": "number", "label": "Temprature"}]';

  for (var i = 0; i < samples.length; i++) {
      var t = samples[i]._doc.t_stamp;
      arr_timeofday = t.split(":").map(Number);
      var t_stamp = '{"v": [ ' + arr_timeofday + ' ]}';
      var salinity = '{"v":' + samples[i]._doc.Salinity + '}';
      var conductivity = '{"v":' + samples[i]._doc.Conductivity + '}';
      var temprature = '{"v":' + samples[i]._doc.Temprature + '}';
      row = '{"c": [' + t_stamp + ','  + salinity + ','  + conductivity + ','  + temprature + ' ]}';
      if (i > 0) {
        row = `, ${row}`
      }
      var rows = rows + row;
  }
  rows = `${rows} ]`;
  data_table = `{ ${cols},${rows} }`

  res.json(data_table);
}




function barometer_daily(sensor, samples, res) {

  var rows = '"rows": [ '
  var cols = '"cols": [{"type": "timeofday", "label": "time"}, {"type": "number", "label": "bars"}]';

  for (var i = 0; i < samples.length; i++) {
      var t = samples[i]._doc.t_stamp;
      arr_timeofday = t.split(":").map(Number);
      var t_stamp = '{"v": [ ' + arr_timeofday + ' ]}';
      var bars = '{"v":' + samples[i]._doc.BAROMETER + '}';
      row = '{"c": [' + t_stamp + ','  + bars + ' ]}';
      if (i > 0) {
        row = `, ${row}`
      }
      var rows = rows + row;
  }
  rows = `${rows} ]`;
  data_table = `{ ${cols},${rows} }`

  res.json(data_table);

}




module.exports.gen_table = gen_table
