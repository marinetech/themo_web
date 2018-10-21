var express = require('express');
var router = express.Router();
var Alert = require('../models/alert');
var Sensor = require('../models/sensor');

// Register Form
router.get('/', isAuthenticated, function (req, res) {
	// var user = req.user;
	Sensor.find( {"hidden": false}, function (err, sensors_data) {
		// res.render('buoys', {b_data: buoys_data, s_data: sensors_data});
		res.render('alert', {firstname:  req.user.firstname, s_data: sensors_data});
	});
});

router.post('/addnewalert', isAuthenticated, function (req, res) {
	var sensor = req.body.sensor;
	var field = req.body.field;
	var trigger = req.body.trigger;
	var threshold1 = req.body.threshold1;
	var threshold2 = req.body.threshold2;

	console.log(req.body);

	var expression = "";
	switch(trigger) {
    case "1":
        expression = "$$VAL > " + threshold1
        break;
    case "2":
        expression = "$$VAL < " + threshold1
        break;
    case "3":
        expression = " < $$VAL in range(" + get_min(threshold1, threshold2) + ", " + get_max(threshold1, threshold2) + ")";
        break;
		case "4":
        expression = " < $$VAL in range(" + get_min(threshold1, threshold2) + ", " + get_max(threshold1, threshold2) + ")";
        break;
    default:
        expression = "$$VAL";
	}

	subscription = sensor + "_" + trigger;
	email = req.user.email;

	var newAlert = new Alert({
		expression: expression,
		subscription: subscription,
		email: email
	});
	newAlert.save();
})

router.post('/getFields', isAuthenticated, function (req, res) {
	var sensor_id = req.body.sensor_id;
	Sensor.getSensorById(sensor_id, (err, fields) => {
		res.send(fields);
	})
})

router.post('/getSensors', isAuthenticated, function (req, res) {
	var buoy_name = req.body.buoy_name;
	Sensor.getSensorslist(buoy_name, (err, sensors) => {
		res.send(sensors);
	})
})


module.exports = router;


function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/users/login");
    }
}


function get_min(val1, val2) {
	if (parseFloat(val1) < parseFloat(val2)) {
		return val1;
	} else {
		return val2;
	}
}

function get_max(val1, val2) {
	if (parseFloat(val1) > parseFloat(val2)) {
		return val1;
	} else {
		return val2;
	}
}
