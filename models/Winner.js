const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const winnersSchema = new Schema({
  winners: [
    {
      first_name: String,
      last_name: String,
      email: String,
      phone: String
    }
  ]
});


module.exports = mongoose.model('Winners', winnersSchema);
