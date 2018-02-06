// This is used for demo purposes.

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  startAmount: Number,
  duration: Number
}, {
  collection: 'admin',
  read: 'nearest',
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
