const mongoose = require('mongoose');

const { Schema } = mongoose;

const tangoSchema = new Schema({
  keyword: String,
  venue: String,
  prize: Number,
  giftId: String
}, {
  collection: 'tango',
  read: 'nearest',
});

const Tango = mongoose.model('tango', tangoSchema);

module.exports = Tango;
