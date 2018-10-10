var express = require('express');
var router = express.Router();
var Sample = require('../models/sample');
var async = require('async');

var report = {};

// Register Form
router.get('/', function (req, res) {
	arr_funcs = [];
	arr_funcs.push(get_last_barometer);
	arr_funcs.push(get_last_communication_time);
	arr_funcs.push(get_last_battery_docs);
	arr_funcs.push(get_last_s9);

	async.parallel(arr_funcs, function(err) {
		console.log(report);
		res.render('status', {report: report} )
	})
});

module.exports = router;

// ---------------  Helpers to build a single object that contain full status report

function get_last_communication_time(callback) {
	console.log("-I- running get_last_communication_time");
	Sample.findOne({}, {}, { sort: { 'd_stamp' : -1,  't_stamp' : -1} }, function(err, doc) {
		iso_date =  extract_ISO_date(doc)
		report.lastcomm = iso_date.toUTCString();
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
							report[bid] = {level : level, date: iso_date.toUTCString()};
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
		barometer.iso_date =  extract_ISO_date(doc).toString();
		barometer.pressure = doc._doc.BAROMETER;
		report.barometer = barometer;
		callback()
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
				sensor_info = {s9_id : docs[i].s9_id, temp : docs[i].temperature, depth : docs[i].depth};
				arr_sensors.push(sensor_info);
			}
			s9_report.sensors = arr_sensors;
			report.s9 = s9_report;
			callback();
		})
})}



function extract_ISO_date(doc) {
	date_str =  doc._doc.d_stamp + 'T' + doc._doc.t_stamp + 'Z';
	return new Date(date_str)
}
