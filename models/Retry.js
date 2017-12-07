const mongoose = require('mongoose');

const { Schema } = mongoose;

const retrySchema = new Schema({
  first_name: String,
  last_name: String,
  keyword: String,
  email: String,
  transaction_id: String,
  retries: Number,
  retryTimes: [Date],
  startTime: Date,
  amount: Number,
  isValid: Boolean,
  sendEmail: Boolean
}, {
  collection: 'retry',
  read: 'nearest',
});

const Retry = mongoose.model('retry', retrySchema);

module.exports = Retry;
