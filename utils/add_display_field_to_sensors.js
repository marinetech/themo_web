var mongoose = require('mongoose');
var async = require('async')


sensors = {}
var dcs_fields = ['d_stamp','t_stamp','Direction[DegM]','East[cm/s]','Temperature[DegC]','Heading[DegM]','North[cm/s]','Abs_Speed[cm/s]','Abs_Tilt[Deg]','Ping_Count','DCS_MEASUREMENT','Strength[dB]','Max_Tilt[Deg]','Std_Tilt[Deg]','SP_Std[cm/s]','Tilt_Y[Deg]','Tilt_X[Deg]'];
sensors["dcs"] = dcs_fields

var flntu_fields = ['d_stamp','t_stamp','chlorophyll_concentration','turbidity_units']
sensors["flntu"] = flntu_fields

var microcat_fields = ['d_stamp','t_stamp','Salinity','Conductivity','Temperature']
sensors["microcat"] = microcat_fields

var s9_fields = ['d_stamp','t_stamp','s9_id', 'depth', 'temperature']
sensors["s9"] = s9_fields

var metpak_fields = ['d_stamp','t_stamp','temperature','humidity','dewpoint','wind_direction','wind_speed','pressure']
sensors["metpak"] = metpak_fields

var windsonic_fields = ['d_stamp','t_stamp','north','east','magnitude_1','magnitude_2','gustdirection','winddirection']
sensors["windsonic"] = windsonic_fields

var mp101a_humidity_fields = ['d_stamp','t_stamp','external_humidity_AvgVal','AvgVolt','AvgLinearAdjVal']
sensors["mp101a_humidity"] = mp101a_humidity_fields

var mp101a_temprature_fields = ['d_stamp','t_stamp','external_temperature_AvgVal','AvgVolt','AvgLinearAdjVal']
sensors["mp101a_temprature"] = mp101a_temprature_fields

var barometer_fields = ['d_stamp','t_stamp','BAROMETER']
sensors["barometer"] = barometer_fields

var waves_fields = ['d_stamp','t_stamp','dominant_period','significant_height','mean_period']
sensors["waves"] = waves_fields


mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {

  async.forEach(Object.keys(sensors), function(sensor, sensor_callback) {
    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': sensor, 'buoy_name': 'tabs225m09'}, function(err, sens){
       sens.update({"fields_to_display" : sensors[sensor]}, function() {
         console.log("-I- done updating " + sensor);
         sensor_callback()
       })
    });
  }, function(err) {
    if (err) return sensor_callback(err);
    console.log("-I- db.close");
    mongoose.connection.close();
  });

}); // db.once
