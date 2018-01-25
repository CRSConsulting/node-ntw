const mongoose = require('mongoose');

const { Schema } = mongoose;

const reportSchema = new Schema({
  date: String,
  time: String,
}, {
  collection: 'report',
  read: 'nearest',
});

const Report = mongoose.model('report', reportSchema);

module.exports = Report;
