var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');

module.exports = mongoose.model('User', UserSchema);
