// This is used for demo purposes.

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  entriesToStart: Number,
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
