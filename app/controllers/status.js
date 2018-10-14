var express = require('express');
var router = express.Router();
var Sample = require('../models/sample');
var async = require('async');
const rp = require('request-promise');
const cheerio = require('cheerio');

var report = {};

// Register Form
router.get('/', function (req, res) {
	arr_funcs = [];
	arr_funcs.push(get_last_barometer);
	arr_funcs.push(get_last_communication_time);
	arr_funcs.push(get_last_battery_docs);
	arr_funcs.push(get_last_s9);
	arr_funcs.push(get_last_microcat);
	arr_funcs.push(get_last_windsonic);
	arr_funcs.push(get_last_metpak);
	arr_funcs.push(get_last_adcp);
	arr_funcs.push(get_last_dcs);
	arr_funcs.push(get_last_flntu);
	arr_funcs.push(get_last_microstrain);
	arr_funcs.push(get_last_humidity);
	arr_funcs.push(get_last_external_temperature);
	arr_funcs.push(get_last_ais);
	async.parallel(arr_funcs, function(err) {
		// console.log(report);
		res.render('status', {report: report} )
	})
});

module.exports = router;

// ---------------  Helpers to build a single object that contain full status report

function get_last_communication_time(callback) {
	console.log("-I- running get_last_communication_time");
	Sample.findOne({}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		iso_date =  extract_ISO_date(doc)
		report.lastcomm = iso_date.toString();
		callback()
	});
}

function get_last_battery_docs(callback) {
	console.log("-I- running get_last_battery_docs");
	async.forEach(['1','2','3'], function(b_id, cb) {
        // console.log('bid: ' + b_id);
				Sample.findOne({'sensor_name': 'battery', 'battery_id': b_id}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
							iso_date =  extract_ISO_date(doc)
							bid = "battery" + b_id;
							level = doc._doc.level;
							// console.log("level: " + level);
							report[bid] = {level : level, date: iso_date.toString()};
							cb();
						})

    }, function(err) {
        if (err) return next(err);
        callback()
    })}

function get_last_barometer(callback) {
	console.log("-I- running get_last_barometer");
	Sample.findOne({'sensor_name': 'barometer'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var barometer = {};
		try {
			barometer.iso_date =  extract_ISO_date(doc).toString();
			barometer.pressure = doc._doc.BAROMETER;
		} catch (e) {
			console.log("-W- failed to fetch last brometer doc");
		} finally {
			report.barometer = barometer;
			callback()
		}
	});
}

function get_last_s9(callback) {
	console.log("-I- running get_last_s9");
	var s9_report = {}
	Sample.findOne({'sensor_name': 's9'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		latest_d_stamp = doc._doc.d_stamp
		latest_t_stamp = doc._doc.t_stamp
		s9_report.latest = extract_ISO_date(doc).toString();
		Sample.find({'sensor_name': 's9', 'd_stamp' : latest_d_stamp, 't_stamp' : latest_t_stamp}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, docs) {
			s9_report.num_of_sensors = docs.length;
			var arr_sensors = [];
			for (var i = 0; i < docs.length; i++) {
				sensor_info = {s9_id : docs[i]._doc.s9_id, temp : docs[i]._doc.temperature, depth : docs[i]._doc.depth};
				arr_sensors.push(sensor_info);
			}
			s9_report.sensors = arr_sensors;
			report.s9 = s9_report;
			callback();
		})
})}

function get_last_microcat(callback) {
	console.log("-I- running get_last_microcat");
	Sample.findOne({'sensor_name': 'microcat'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var microcat = {};
		try {
			microcat.iso_date =  extract_ISO_date(doc).toString();
			microcat.salinity =  doc._doc.Salinity;
			microcat.conductivity =  doc._doc.Conductivity;
			microcat.temperature =  doc._doc.Temperature;
		} catch (e) {
			console.log("-W- failed to fetch last microcat doc");
		} finally {
			report.microcat = microcat;
		}
		callback()
	});
}

function get_last_windsonic(callback) {
	console.log("-I- running get_last_windsonic");
	Sample.findOne({'sensor_name': 'windsonic'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var windsonic = {};
		try {
			windsonic.iso_date =  extract_ISO_date(doc).toString();
			windsonic.winddirection =  doc._doc.winddirection;
			windsonic.magnitude =  doc._doc.magnitude_1;
		} catch (e) {
			console.log("-W- failed to fetch last windsonic doc");
		} finally {
				report.windsonic = windsonic;
				callback()
		}
	});
}

function get_last_metpak(callback) {
	console.log("-I- running metpak");
	Sample.findOne({'sensor_name': 'metpak'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var metpak = {};
		try {
			metpak.iso_date =  extract_ISO_date(doc).toString();
			metpak.winddirection =  doc._doc.wind_direction;
			metpak.speed =  doc._doc.wind_speed;
			metpak.temperature =  doc._doc.temperature;
			metpak.humidity =  doc._doc.humidity;
		} catch (e) {
			console.log("-W- failed to fetch last metpak doc");
		} finally {
			report.metpak = metpak;
			callback()
		}
	});
}

function get_last_adcp(callback) {
	console.log("-I- running adcp");
	Sample.findOne({'sensor_name': 'adcp'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var adcp = {};
		try {
		adcp.iso_date =  extract_ISO_date(doc).toString();
		} catch (e) {
			console.log("-W- failed to fetch last adcp doc");
		} finally {
			report.adcp = adcp;
			callback()
		}
	});
}

function get_last_dcs(callback) {
	console.log("-I- running dcs");
	Sample.findOne({'sensor_name': 'dcs'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var dcs = {};
		try {
			dcs.iso_date =  extract_ISO_date(doc).toString();
		} catch (e) {
			console.log("-W- failed to fetch last dcs doc");
		} finally {
			report.dcs = dcs;
			callback()
		}
	});
}

function get_last_flntu(callback) {
	console.log("-I- running flntu");
	Sample.findOne({'sensor_name': 'flntu'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var flntu = {};
		try {
			flntu.iso_date =  extract_ISO_date(doc).toString();
		} catch (e) {
			console.log("-W- failed to fetch last flntu doc");
		} finally {
			report.flntu = flntu;
			callback()
		}
	});
}

function get_last_microstrain(callback) {
	console.log("-I- running microtrain");
		Sample.findOne({'sensor_name': 'waves'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
			var waves = {};
			try {
				waves.iso_date =  extract_ISO_date(doc).toString();
				waves.mean_period =  doc._doc.mean_period;
				waves.dominant_period =  doc._doc.dominant_period;
				waves.significant_height =  doc._doc.significant_height;
				waves.iso_date =  extract_ISO_date(doc).toString();
			} catch (e) {
				console.log("-W- failed to fetch last microtrain doc");
			} finally {
				report.waves = waves;
				callback();
			}
	});
}

function get_last_humidity(callback) {
	console.log("-I- running c");
		Sample.findOne({'sensor_name': 'mp101a_humidity'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
			var humidity = {};
			try {
				humidity.iso_date =  extract_ISO_date(doc).toString();
				humidity.humidity =  doc._doc.AvgLinearAdjVal;
			} catch (e) {
				console.log("-W- failed to fetch last humidity doc");
			} finally {
				report.humidity = humidity;
				callback()
			}
	});
}

function get_last_external_temperature(callback) {
	Sample.findOne({'sensor_name': 'mp101a_temprature'}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		var temperature = {};
		try {
			temperature.iso_date =  extract_ISO_date(doc).toString();
			temperature.temperature =  doc._doc.AvgLinearAdjVal;
		} catch (e) {
			console.log("-W- failed to fetch last temprature doc");
		} finally {
			report.temperature = temperature;
			callback()
		}
		});
}

function get_last_ais(callback) {
	console.log("-I- running last_ais");

	var options = {
	  uri: `https://www.marinetraffic.com/en/ais/details/ships/shipid:5689729/mmsi:244010235/vessel:THEMO%20BOUY`,
	  transform: function (body) {
	    return cheerio.load(body);
	  }
	};

	rp(options)
    .then(($) => {
      $('.group-ib').each(function(i, elem) {
        if ($(this).text().indexOf('Position Received:') >= 0) {
            report.ais = $(this).text().replace(/ +(?= )/g,'').trim().replace("\n", "");
          }
      });
			// callback();
    } //end of .then()

	).catch(() => {report.ais = '';callback();} ).finally( () => {callback();} )}

function extract_ISO_date(doc) {
	date_str =  doc._doc.d_stamp + 'T' + doc._doc.t_stamp + 'Z';
	return new Date(date_str)
}
