const {
  ReadPreference,
} = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
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
    transform,
    insertAll,
    convertHoursToTime
  };

  function transform(mobiles, uniqueMobiles, calendars) {
    console.log(mobiles.length);
    const donors = [];
    const updateIds = [];
    for (let i = 0; i < uniqueMobiles.length; i += 1) { // loop through unique combinations of email and keyword
      const baseKey = uniqueMobiles[i]._id.keyword.replace(/[0-9]/g, ''); // get base keyword
      const specificCalendars = calendars.filter(cal => cal.venue.keyword === baseKey && moment(uniqueMobiles[i]._id.date).diff(cal.startTime, 'days') === 0); // find event based on base keyword
      if (specificCalendars) {
        console.log('found calendars', specificCalendars);
        for (let m = 0; m < specificCalendars.length; m += 1) {
          const specificCalendar = specificCalendars[m];
          const drawingIndex = specificCalendar.drawings.findIndex(draw => draw.keyword === uniqueMobiles[i]._id.keyword); // find drawing index on full keyword
          if (drawingIndex >= 0) {
            const calUpdateDate = specificCalendar.updateDate ? specificCalendar.updateDate : '';
            const specificDrawing = specificCalendar.drawings[drawingIndex];
            const currentTime = specificDrawing.endTime.getTime();
            const triggerTime = new Date(currentTime - (15 * 60000));
            const specificMobiles = mobiles.filter(mobile => mobile.email === uniqueMobiles[i]._id.email && mobile.keyword === uniqueMobiles[i]._id.keyword && moment(mobile.donation_date).isBetween(triggerTime, specificDrawing.endTime)); // get all mobiles with keyword/email index
            if (specificMobiles.length > 0) {
              let chances = specificMobiles.reduce((r, a) => { // add chances based on collected amount
                if (a.collected_amount > 0) {
                  if (a.collected_amount >= 100) {
                    r += 20;
                  } else if (a.collected_amount >= 50) {
                    r += 5;
                  } else {
                    r += 1;
                  }
                }
                return r;
              }, 0);
              const zeroEntries = specificMobiles.filter(mobile => mobile.collected_amount === 0);
              chances += (zeroEntries.length < 20 ? zeroEntries.length : 20); // make sure only 20 total nonpaid entries get through
              const multipleEntries = chances !== 1;
              for (let x = 0; x < specificMobiles.length; x += 1) {
                updateIds.push(new ObjectId(specificMobiles[x]._id));

                donors.push({
                  keyword: specificMobiles[x].keyword,
                  donation_date: specificMobiles[x].transaction_date,
                  donation_amount: specificMobiles[x].collected_amount,
                  last_4: specificMobiles[x].last_4,
                  phone: specificMobiles[x].phone,
                  first_name: specificMobiles[x].first_name,
                  last_name: specificMobiles[x].last_name,
                  street_address: specificMobiles[x].street_address,
                  city: specificMobiles[x].city,
                  state: specificMobiles[x].state,
                  zip: specificMobiles[x].zip,
                  email: specificMobiles[x].email,
                  chances,
                  multiple_entries: multipleEntries,
                  venue: specificCalendar.venue.name,
                  venue_city: specificCalendar.venue.city,
                  venue_state: specificCalendar.venue.state,
                  event_start: specificCalendar.startTime,
                  prize_time: specificDrawing.time,
                  trigger_time: triggerTime,
                  artist: specificCalendar.name,
                  seat_grab: specificCalendar.seat_grab,
                  drawing_number: drawingIndex + 1,
                  prize_type: specificDrawing.prizeType,
                  prize_amount: specificDrawing.prizeAmount,
                  veteran: specificMobiles[x].i_am_a_veteran,
                  vet_related: specificMobiles[x].related_to_a_veteran,
                  thermometer: specificCalendar.thermometer,
                  update_event_date: calUpdateDate,
                  change_artist: specificCalendar.updateName ? specificCalendar.updateName : [],
                  cc_status: 'Y',
                });
              }
            }
          }
        }
      }
    }
    return [donors, updateIds];
  }

  function insertAll(data) {
    return Donor.insertMany(data);
  }

  /*
  convertHoursToTime
  */
  function convertHoursToTime(hour, minute) {
    let UTCHour = hour;
    let UTCampm = 'am';
    if (hour > 12) {
      UTCHour = hour - 12;
      UTCampm = 'pm';
    } else if (hour === 0) {
      UTCHour = 12;
    }
    let timeMinute = minute;
    if (minute < 10) {
      timeMinute = `0${minute}`;
    }
    let ESTHour = hour - 5;
    let ESTampm = 'pm';
    if (ESTHour < 0) {
      ESTHour = 12 + ESTHour;
    } else if (ESTHour < 12) {
      ESTampm = 'am';
    } else if (ESTHour > 12) {
      ESTHour -= 12;
    } else if (ESTHour === 0) {
      ESTHour = 12;
    }
    return `${ESTHour}:${timeMinute}${ESTampm} EST (${UTCHour}:${timeMinute}${UTCampm} UTC)`;
  }
}
