const mongoose = require('mongoose')
;

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  firstName: String,
  lastName: String,
  body: { type: String, required: true },

});


module.exports = mongoose.model('Message', messageSchema);
