const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token_string: {
    type: String,
    required: true
  },
  expiration_date: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  isAuthenticated: {
    type: Boolean,
    required: true
  },
  attempted: {
    type: Boolean,
    required: true
  },
  winnersList: {
    type: Schema.Types.ObjectId,
    ref: 'Winners'
  }
});

module.exports = mongoose.model('Token', tokenSchema);
