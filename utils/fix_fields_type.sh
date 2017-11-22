mongo
use themo


# fix barometer
db.samples.find({'sensor_name': 'barometer'}).forEach( function (x) {
  x.BAROMETER = parseFloat(x.BAROMETER);
  db.samples.save(x);
});
db.samples.find({'sensor_name': 'barometer'}).pretty()

#fix microcat
db.samples.find({'sensor_name': 'microcat'}).forEach( function (x) {
  x.Salinity = parseFloat(x.Salinity);
  x.Conductivity = parseFloat(x.Conductivity);
  x.Temperature = parseFloat(x.Temperature);
  db.samples.save(x);
});
db.samples.find({'sensor_name': 'microcat'}).pretty()
--------------------------------------------------------------------------------
microcat typo fix - Temprature => Temperature

1) change add_display_field_to_sensors and rerun
2) for future records change microcat parser
3) for existing documents:
      db.samples.update({'sensor_name':'microcat'}, {$rename: {"Temprature": "Temperature"}}, false, true);



#fix s9 - Temprature => Temperature
1) change add_display_field_to_sensors and rerun
2) for future records change microcat parser
3) for existing documents:
      db.samples.update({'sensor_name':'s9'}, {$rename: {"temprature": "temperature"}}, false, true);

#fix humidity
db.samples.find({'sensor_name': 'mp101a_humidity'}).forEach( function (x) {
  x.AvgLinearAdjVal = parseFloat(x.AvgLinearAdjVal);
  x.external_humidity_AvgVal = parseFloat(x.external_humidity_AvgVal);
  x.AvgVolt = parseFloat(x.AvgVolt);
  db.samples.save(x);
});


#fix mp101a_temperatue
db.samples.find({'sensor_name': 'mp101a_temprature'}).forEach( function (x) {
  x.AvgLinearAdjVal = parseFloat(x.AvgLinearAdjVal);
  x.external_temperature_AvgVal = parseFloat(x.external_temperature_AvgVal);
  x.AvgVolt = parseFloat(x.AvgVolt);
  db.samples.save(x);
});


#fix microstrain
db.samples.find({'sensor_name': 'waves'}).forEach( function (x) {
  x.dominant_period = parseFloat(x.dominant_period);
  x.mean_period = parseFloat(x.mean_period);
  x.significant_height = parseFloat(x.significant_height);
  db.samples.save(x);
});

#fix metpak
db.samples.find({'sensor_name': 'metpak'}).forEach( function (x) {
  x.humidity = parseFloat(x.humidity);
  x.dewpoint = parseFloat(x.dewpoint);
  x.pressure = parseFloat(x.pressure);
  x.wind_direction = parseFloat(x.wind_direction);
  x.wind_speed = parseFloat(x.wind_speed);
  x.temperature = parseFloat(x.temperature);
  db.samples.save(x);
});


#fix windsonic
db.samples.find({'sensor_name': 'windsonic'}).forEach( function (x) {
  x.north = parseFloat(x.north);
  x.east = parseFloat(x.east);
  x.winddirection = parseFloat(x.winddirection);
  x.magnitude_1 = parseFloat(x.magnitude_1);
  x.magnitude_2 = parseFloat(x.magnitude_2);
  x.gustdirection = parseFloat(x.gustdirection);
  db.samples.save(x);
});


#fix dcs
db.samples.find({'sensor_name': 'dcs'}).forEach( function (x) {
  x["Direction[DegM]"] = parseFloat(x["Direction[DegM]"]);
  x["East[cm/s]"] = parseFloat(x["East[cm/s]"]);
  x["Temperature[DegC]"] = parseFloat(x["Temperature[DegC]"]);
  x["Heading[DegM]"] = parseFloat(x["Heading[DegM]"]);
  x["North[cm/s]"] = parseFloat(x["North[cm/s]"]);
  x["Abs_Speed[cm/s]"] = parseFloat(x["Abs_Speed[cm/s]"]);
  x["Abs_Tilt[Deg]"] = parseFloat(x["Abs_Tilt[Deg]"]);
  x["DCS_MEASUREMENT"] = parseFloat(x["DCS_MEASUREMENT"]);
  x["Strength[dB]"] = parseFloat(x["Strength[dB]"]);
  x["Max_Tilt[Deg]"] = parseFloat(x["Max_Tilt[Deg]"]);
  x["Std_Tilt[Deg]"] = parseFloat(x["Std_Tilt[Deg]"]);
  x["SP_Std[cm/s]"] = parseFloat(x["SP_Std[cm/s]"]);
  x["Tilt_Y[Deg]"] = parseFloat(x["Tilt_Y[Deg]"]);
  x["Tilt_X[Deg]"] = parseFloat(x["Tilt_X[Deg]"]);
  db.samples.save(x);
});
