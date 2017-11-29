const mongoose = require('mongoose');

const { Schema } = mongoose;

const venueSchema = new Schema({
  venue: String,
  prize: Number,
  giftId: String
}, {
  collection: 'tango',
  read: 'nearest',
});

const Occasion = mongoose.model('occasion', occasionSchema);

module.exports = Occasion;
