const mongoose = require('mongoose');

const { Schema } = mongoose;

const calendarSchema = new Schema({
  name: String,
  venue: String,
  startTime: Date,
  endTime: Date,
  announcer: Boolean,
  seatGrab: Boolean,
  thermometer: Boolean,
  drawings: [{
    time: Date,
    used: { type: Boolean, default: false }
  }], 
}, {
  collection: 'calendar',
  read: 'nearest',
});

const Calendar = mongoose.model('calendar', calendarSchema);

module.exports = Calendar;
 