const Promise = require('bluebird');
const Mobile = require('../models/Mobile');
const mobilesService = require('./mobiles.services')({
  modelService: Mobile,
});

const Donor = require('../models/Donor');
const donorService = require('./donor.services')({
  modelService: Donor,
});

const Calendar = require('../models/Calendar');
const calendarService = require('./calendar.services')({
  modelService: Calendar,
});

exports.transformAll = (req, res) => {
  const calendars = calendarService.getAllWithVenues();
  const mobiles = mobilesService.getAllUnmoved();
  const uniqueMobiles = mobilesService.getAllGroupedByEmailAndDate();
  Promise.all([mobiles, uniqueMobiles, calendars])
    .then((all) => {
      const returnArr = donorService.transform(all[0], all[1], all[2]);
      return returnArr;
    })
    .then((all) => {
      const donors = donorService.insertAll(all[0]);
      console.log(all[1]);
      console.log('donors', all[0].length);
      return Promise.all([donors, all[1]]);
    })
    .then((all) => {
      const mobiles = mobilesService.updateAll(all[1]);
      return Promise.all([all[0], mobiles]);
    })
    .then((all) => {
      console.log(all[1]);
      res.send(all[0]);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};