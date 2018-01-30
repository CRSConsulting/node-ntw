const mongoose = require('mongoose');

const { Schema } = mongoose;

const venueSchema = new Schema({
  name: String,
  keyword: String,
  city: String,
  state: String
}, {
  collection: 'venue',
  read: 'nearest',
});

const Venue = mongoose.model('venue', venueSchema);

module.exports = Venue;
