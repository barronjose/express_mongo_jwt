var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  admin: Boolean
}, {
  timestamps: {
    createdAt: 'created_at',
    'updatedAt': 'updated_at'
  }
});
