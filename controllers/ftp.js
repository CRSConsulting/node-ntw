const json2csv = require('json2csv');
const Promise = require('bluebird');
const fs = require('fs');

Promise.promisifyAll(fs);

const Mobile = require('../models/Mobile');
const mobilesService = require('./mobiles.services')({
  modelService: Mobile
});


// const JSFtp = require('jsftp');
// const ftp = new JSFtp({
//   host: '67.225.219.184',
//   user: 'nodeftp@testing.com',
//   pass: 'nodeFTP111'
// });
exports.writeFile = (req, res) => {
  mobilesService.getAll()
    .then((dataObj) => {
      return new Promise(((resolve, reject) => {
        const jsonData = JSON.stringify(dataObj);
        
        //   const fields = ['car', 'price', 'color'];
        //   const myCars = [
        //     {
        //       car: 'Audi',
        //       price: 40000,
        //       color: 'blue'
        //     }, {
        //       car: 'BMW',
        //       price: 35000,
        //       color: 'black'
        //     }, {
        //       car: 'Porsche',
        //       price: 60000,
        //       color: 'green'
        //     }
        //   ];
        //   const csv = json2csv({ data: myCars, fields });
        const fields = ['createdAt',
          'shortcode',
          'keyword',
          'type',
          'volunteer_fundraiser',
          'team',
          'alternative_team_id',
          'transaction_date',
          'donation_date',
          'collected_amount',
          'pledged_amount',
          'processing_fee',
          'fee_rate',
          'cc_type',
          'last_4',
          'phone',
          'first_name',
          'last_name',
          'street_address',
          'city',
          'state',
          'zip',
          'email',
          'gender',
          'billing_status',
          'billing_type',
          'donation',
          'transaction_id',
          'source',
          'form',
          'form_payment_type',
          'form_name',
          'form_type',
          'form_id',
          'fulfillment_calls',
          'fulfillment_texts',
          'donation_notes',
          'account',
          'account_id',
          'campaign_name',
          'account_plan',
          'account_plan_price',
          'frequency',
          'anonymous',
          'billing_transaction',
          'billing_transaction_reference',
          'billing_response_code',
          'parent_name',
          'payment_gateway',
          'are_you_a_veteran',
          'raffle_count', ];
        // const fields = ['_id', 'shortcode', 'keyword', 'type', 'volunteer_fundraiser', 'team', 'alternative_team_id', 'transaction_date', 'donation_date', 'collected_amount', 'pledged_amount', 'processing_fee', 'fee_rate', 'cc_type', 'last_4', 'phone', 'first_name', 'last_name', 'street_address', 'city', 'state', 'zip', 'email', 'gender', 'billing_status', 'billing_type', 'donation', 'transaction_id', 'source', 'form', 'form_payment_type', 'form_name', 'form_type', 'form_id', 'fulfillment_calls', 'fulfillment_texts', 'donation_notes', 'account', 'account_id', 'campaign_name', 'account_plan', 'account_plan_price', 'frequency', 'anonymous', 'billing_transaction', 'billing_transaction_reference', 'billing_response_code', 'parent_name', 'payment_gateway', 'veteran', 'i_am_a_veteran', 'related_to_a_veteran', 'veteran2', 'veteran_2', 'accept', 'info', 'vet_2', 'a', 'vet2', 'question_2_vet', 'question_2', 'createdAt'];
        const csv = json2csv({ data: jsonData, fields });
        fs.writeFile('file.csv', csv, (err) => {
          console.log('err', err);
          if (err) reject(err);
          else resolve(csv);
        });
      }));
    })
    .then((ftp) => {
      console.log('ftp', ftp);
      res.json('success!');
    })
    .catch((err) => {
      console.log('err', err);
    });
};

