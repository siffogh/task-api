var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({});

module.exports = mongoose.model('Event',eventSchema);