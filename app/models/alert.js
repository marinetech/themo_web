var mongoose = require('mongoose');

// Alert Schema
var AlertSchema = mongoose.Schema({
	subscription: {
		type: String
	},
	email: {
		type: String
	},
	subscriber: {
		type: String
	}
});

// UserSchema.pre('save', function(next) {
//   var self = this;
//
// 	rand = Math.floor(Math.random() * 10000000)
// 	self.activation_code = rand.toString();
// 	next();
// });

var Alert = module.exports = mongoose.model('Alert', AlertSchema);
