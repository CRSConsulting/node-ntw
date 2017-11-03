const mongoose = require('mongoose');

const { Schema } = mongoose;

const dateSchema = new Schema({
  date: String,
  time: String,
}, {
  collection: 'date',
  read: 'nearest',
});

const Date = mongoose.model('date', dateSchema);

module.exports = Date;
