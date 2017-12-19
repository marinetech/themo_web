var mongoose = require('mongoose');
var async = require('async')


sensors = {}
var dcs_display_name = "Current Velocity"
var dsc_description = "Near Surface Doppler Current Sensor"
dsc_description += "\n(depth: 1m)"
var dsc_model = "AANDERAA -	DCS-4830 Z-Pulse"
var dcs_fields = [dcs_display_name, dsc_description, dsc_model];
sensors["dcs"] = dcs_fields

var flntu_display_name = "Fluorescence"
var flntu_description = "Fluorometer - Chlorophyll(μg/L) & Turbidity(NTU)"
flntu_description += "\n(depth: 1m)"
var flntu_model = "Wet Labs - ECOFLNTUS"
var flntu_fields = [flntu_display_name, flntu_description, flntu_model]
sensors["flntu"] = flntu_fields

var microcat_display_name = "Salinity"
var microcat_description = "Measures salinity(PSU), conductivity(S/m) & temprature(C)"
microcat_description += "\n(depth: 1m)"
var microcat_model = "Seabird Electronics	- SBE37-SI [microcat]"
var microcat_fields = [microcat_display_name, microcat_description, microcat_model]
sensors["microcat"] = microcat_fields

var s9_display_name = "Sea temprature"
var s9_description = "Measures temprature(C) in different depths - "
s9_description += "\n(5m - 85m in steps of 10m)"
var s9_model = "Sound-nine Ulti-Modem MCIL4M"
var s9_fields = [s9_display_name, s9_description, s9_model]
sensors["s9"] = s9_fields

var metpak_display_name = "Weather Station"
var metpak_description = "External temprature(C) & humidity(RH%), wind velocity(Metres/second), pressure(millibars)"
metpak_description += "\n(installed 3m above sea)"
var metpak_model = "Gill - MetPak"
var metpak_fields = [metpak_display_name, metpak_description, metpak_model]
sensors["metpak"] = metpak_fields

var windsonic_display_name = "Anemometer"
var windsonic_description = "Measures wind velocity (Metres/second) - installed 3m above sea"
var windsonic_model = "Gill - WindSonic"
var windsonic_fields = [windsonic_display_name,windsonic_description,windsonic_model]
sensors["windsonic"] = windsonic_fields

var humidity_display_name = "humidity"
var humidity_description = "External humidity(RH%) - installed 3m above sea"
var humidity_model = "Rotronics - mp101a"
var mp101a_humidity_fields = [humidity_display_name,humidity_description,humidity_model]
sensors["mp101a_humidity"] = mp101a_humidity_fields

var temprature_display_name = "Temprature"
var temprature_description = "External temprature(C) - installed 3m above sea"
var temprature_model = "Rotronics - mp101a"
var mp101a_temprature_fields = [temprature_display_name, temprature_description, temprature_model]
sensors["mp101a_temprature"] = mp101a_temprature_fields

var barometer_display_name = "Barometer"
var barometer_description = "Barometric pressure(millibars) - installed 3m above sea"
var barometer_model = "Vaisala - PTB210"
var barometer_fields = [barometer_display_name,barometer_description,barometer_model]
sensors["barometer"] = barometer_fields

var waves_display_name = "Sea waves"
var waves_description = "waves higth(Meters)"
var waves_model = "Lord MicroStrain	- 3DM-GX25"
var waves_fields = [waves_display_name,waves_description,waves_model]
sensors["waves"] = waves_fields

var adcp_display_name = "ADCP"
var adcp_description = "Acoustic Doppler Current Profiler"
var adcp_model = "signature 250"
var adcp_fields = [adcp_display_name,adcp_description,adcp_model]
sensors["adcp"] = adcp_fields


mongoose.Promise = global.Promise; // solution for mongoose Promise warrning
var strConnection = 'mongodb://127.0.0.1/themo';
console.log("connecting to themo db...");
mongoose.connect(strConnection);
var db = mongoose.connection;

db.once('open', function() {

  async.forEach(Object.keys(sensors), function(sensor, sensor_callback) {
    var sensor_model = require('../app/models/sensor');
    sensor_model.findOne({'name': sensor, 'buoy_name': 'tabs225m09'}, function(err, sens){
       sens.update({"display_name" : sensors[sensor][0], "description": sensors[sensor][1], "model": sensors[sensor][2]}, function() {
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
