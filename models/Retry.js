const mongoose = require('mongoose');

const { Schema } = mongoose;

const retrySchema = new Schema({
  keyword: String,
  email: String,
  transaction_id: String,
  retries: Number,
  startTime: Date,
  amount: Number
}, {
  collection: 'retry',
  read: 'nearest',
});

const Retry = mongoose.model('retry', retrySchema);

module.exports = Retry;
