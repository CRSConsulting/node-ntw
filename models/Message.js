const mongoose = require('mongoose')
;

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  first_name: String,
  last_name: String,
  body: String,

});


module.exports = mongoose.model('Message', messageSchema);
