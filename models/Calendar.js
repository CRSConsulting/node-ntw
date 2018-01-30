const mongoose = require('mongoose');

const { Schema } = mongoose;

const calendarSchema = new Schema({
  name: String,
  venue: {
    type: Schema.Types.ObjectId, ref: 'venue'
  },
  startTime: Date,
  endTime: Date,
  announcer: Boolean,
  seatGrab: Boolean,
  thermometer: Boolean,
  drawings: [{
    time: Date,
    endTime: Date,
    triggerTime: Date,
    keyword: String,
    used: { type: Boolean, default: false },
    prizeType: String,
    prizeAmount: Number
  }],
  updateName: String,
  updateDate: Date,
}, {
  collection: 'calendar',
  read: 'nearest',
});

const Calendar = mongoose.model('calendar', calendarSchema);

module.exports = Calendar;
 