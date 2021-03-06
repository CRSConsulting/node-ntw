const mongoose = require('mongoose');

const { Schema } = mongoose;

const mobileSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  shortcode: String,
  keyword: String,
  type: String,
  volunteer_fundraiser: String,
  team: String,
  alternative_team_id: String,
  transaction_date: Date,
  donation_date: String,
  collected_amount: String,
  pledged_amount: String,
  processing_fee: String,
  fee_rate: String,
  cc_type: String,
  last_4: String,
  phone: String,
  first_name: String,
  last_name: String,
  street_address: String,
  city: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  billing_status: String,
  billing_type: String,
  donation: String,
  transaction_id: String,
  source: String,
  form: String,
  form_payment_type: String,
  form_name: String,
  form_type: String,
  form_id: String,
  fulfillment_calls: String,
  fulfillment_texts: String,
  donation_notes: String,
  account: String,
  account_id: String,
  campaign_name: String,
  account_plan: String,
  account_plan_price: String,
  frequency: String,
  anonymous: String,
  billing_transaction: String,
  billing_transaction_reference: String,
  billing_response_code: String,
  parent_name: String,
  payment_gateway: String,
  are_you_a_veteran: String,
  raffle_count: String,
}, {
  collection: 'mobileCause',
  read: 'nearest',
});

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;
