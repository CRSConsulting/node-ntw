const mongoose = require('mongoose');

const { Schema } = mongoose;

const mobileSchema = new Schema({
  keyword: String,
  donation_date: Date,
  donation_amount: String,
  last_4: String,
  phone: String,
  first_name: String,
  last_name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String,
  email: String,
  chances: String,
  multiple_entries: String,
  venue: String,
  venue_city: String,
  venue_state: String,
  event_date: String,
  event_start: Date,
  prize_time: Date,
  transaction_time: Date,
  artist: String,
  seat_grab: Boolean,
  drawing_number: Number,
  prize_type: String,
  prize_amount: Number,
  veteran: String,
  vet_related: String,
  thermometer: Boolean,
  announcer: Boolean,
  update_event_date: Date,
  change_artist: String,
  cc_status: String
}, {
  collection: 'mobileCause',
  read: 'nearest',
});

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;
