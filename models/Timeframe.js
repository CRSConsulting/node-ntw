const mongoose = require('mongoose');

const { Schema } = mongoose;

const timeframeSchema = new Schema({
  keyword: String,
  startTime: Date,
  endTime: Date,
  used: Boolean,  
}, {
  collection: 'timer',
  read: 'nearest',
});

const Timer = mongoose.model('Timeframe', timeframeSchema);

module.exports = Timer;
