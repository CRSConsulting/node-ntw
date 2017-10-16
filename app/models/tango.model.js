const mongoose = require('mongoose');

const { Schema } = mongoose;

const tangoSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  accountIdentifier: { type: String, required: true },
  amount: { type: Number, required: true },
  customerIdentifier: { type: String, required: true },
  emailSubject: { type: String, required: true },
  message: { type: String, required: true },
  recipient: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  sendEmail: { type: Boolean },
  sender: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  utid: { type: String, required: true },
}, {
  collection: 'tango',
  read: 'nearest',
});

const Tango = mongoose.model('Tango', tangoSchema);

module.exports = Tango;
