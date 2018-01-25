const {
  ReadPreference,
} = require('mongodb');

const moment = require('moment');
// const promiseRetry = require('promise-retry');

module.exports = donorService;

function donorService(options) {
  let Donor;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Donor = options.modelService;

  return {
    transform
  }

  function transform(mobiles) {
    const donors = mobiles.map((y) => {

      mobiles.filter(mobile => // Get subsect of objects with specific keyword variant
        mobile.email === y.email,
        mobile.keyword === y.keyword,
        
      );
      const donor = {
        keyword: y.keyword,
        donation_date: moment(y.transaction_date).format('YYYYMMDD'),
        donation_amount: y.collected_amount,
        last_4: y.last_4,
        phone: y.phone,
        first_name: y.first_name,
        last_name: y.last_name,
        street_address: y.street_address,
        city: y.city,
        state: y.state,
        zip: y.zip,
        email: y.email,
        // pull chances
        // pull multiple_entries
        // pull venue
        // pull venue_city
        // event_date
        // event_start
        // prize_time
        transaction_time: moment(y.transaction_date).format('HH:mm:ss'),
        // artist
        // seat_grab
        // drawing_number
        // prize_type
        // prize_amount
        veteran: y.i_am_a_veteran,
        vet_related: y.related_to_a_veteran,
        // thermometer
        // update_event_date
        // change_artist
        // cc_status

      }
    })
  }
}