const {
  ReadPreference,
} = require('mongodb');
const Calendar = require('../models/Calendar');
const calendarService = require('./calendar.services')({
  modelService: Calendar
});

const Tango = require('../models/Tango');
const tangoService = require('./tangos.services')({
  modelService: Tango
});

const randy = require('randy');
const zipcode = require('zippity-do-dah');
const moment = require('moment');

module.exports = mobilesService;

function mobilesService(options) {
  let Mobile;
  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Mobile = options.modelService;

  return {
    getAll,
    updateAll,
    generateTimer,
    getRaffleContestants,
    raffleComplete,
    addWeightToRaffle,
    selectFiveWinners,
    getAllGroupedByEmailAndDate,
    findRunningRaffle,
    getAllUnmoved
  };

  function getAll() {
    return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
  }

  function getAllUnmoved() {
    return Mobile.find({ moved: { $exists: false } }).read(ReadPreference.NEAREST);
  }

  function updateAll(removeIds) {
    return Mobile.update({ _id: { $in: removeIds } }, { moved: true }, { multi: true });
  }

  // function getDups() {
  //   return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  // }

  function generateTimer(jsonData, baseKey) {
    const startAmount = 5; // amount to trigger timer creation
    const test = calendarService.getAllofToday()
      .then((times) => {
        console.log(times);
        const calendar = times.find(cal => cal.venue.keyword === baseKey);
        if (!calendar) return { message: 'No drawings for keyword today' };
        const timeIndex = calendar.drawings.findIndex(drawing => moment(drawing).isBefore(new Date()) && drawing.used === false);
        if (!timeIndex) return { message: 'Not within timeframe window' };

        const time = calendar.drawings[timeIndex];
        if (time.endTime) return { message: 'Endtime already set' };
        const newTimer = time;
        const dataAfterStart = jsonData.filter(mobile => new Date(mobile.transaction_date).getTime() > new Date(time.time).getTime());
        if (dataAfterStart.length < startAmount) return { message: 'Not Enough To Start' };
        const uniqueKeys = [...new Set(dataAfterStart.map(item => // get list of keyword variants (e.g. BRAVE1, BRAVE2, etc..)
          item.keyword
        ))];
        for (let i = 0; i < uniqueKeys.length; i += 1) { // loop through all keyword variants to find if any have enough to create timer
          const specKeys = dataAfterStart.filter(mobile => // Get subsect of objects with specific keyword variant
            mobile.keyword === uniqueKeys[i]
          );
          
          if (specKeys.length >= startAmount) {
            const currentTime = new Date(specKeys[startAmount - 1].transaction_date).getTime();
            const end = currentTime + (15 * 60000);
            newTimer.endTime = end;
            newTimer.keyword = uniqueKeys[i];
            const tangoQueryCondition = {
              keyword: uniqueKeys[i]
            };
            const tango = tangoService.getOne(tangoQueryCondition);
            return Promise.all([calendar, tango, timeIndex]);
          }
        }
        return { message: 'Not enough to start' };
      })
      .then((all) => {
        if (all.message) return;

        const calendar = all[0];
        const tango = all[1];
        const timeIndex = all[2];
        calendar.drawings[timeIndex].prizeType = tango.prize_type;
        calendar.drawings[timeIndex].prizeAmount = tango.prize;
        calendarService.update(calendar);
        return calendar.drawings[timeIndex];
      });
    return Promise.all([test]);
  }

  function getRaffleContestants(timeframe) {
    return Mobile.find({ donation_date: { $lte: timeframe.endTime, $gte: timeframe.startTime }, keyword: timeframe.keyword });
  }

  function getAllGroupedByEmailAndDate() {
    return Mobile.aggregate(
      [
        {
          $group: {
            _id: {
              email: '$email',
              keyword: '$keyword',
              date: { $dateToString: { format: '%Y-%m-%d', date: '$donation_date' } },
            },
          }
        }
      ]);
  }

  function raffleComplete(cal, calIndex) {
    return calendarService.setDrawingToUsed(cal, calIndex);
  }

  function findRunningRaffle(keyword) {
    Calendar.findRunningRaffle()
      .then((calendars) => {
        const cal = calendars.find(calendar => calendar.venue.keyword === keyword);
        const index = cal.drawings.findIndex(drawing => drawing.used === false);
        return [cal, index];
      })
      .catch(err => console.log(err));
  }

  function addWeightToRaffle(unweighted) {
    const fiveMinimum = 50; // set minimum donation to get 5 chances
    const twentyMinimum = 100; // set minimum donation to get 20 chances
    const unpaidDupeMax = 20;
    return unweighted.reduce(
      (r, a) => {
        if (a.collected_amount && a.collected_amount !== null) { // if money was donated
          const number = a.collected_amount;
          let chances = 1;
          if (number >= twentyMinimum) {
            chances = 20;
          } else if (number >= fiveMinimum) {
            chances = 5;
          } else if (number === 0) {
            const multiEntries = r.filter(mobile => (mobile.phone === a.phone && mobile.collected_amount === 0)); // get count in weighted array of duplicate phone entries
            if (multiEntries.length === unpaidDupeMax) {
              chances = 0;
            }
            const multiEntriesEmail = r.filter(mobile => (mobile.email === a.email && mobile.collected_amount === 0)); // get count in weighted array of duplicate email entries
            if (multiEntriesEmail.length === unpaidDupeMax) {
              chances = 0;
            }
            const address = zipcode.zipcode(a.zipcode);
            if (!address.state || address.state === 'FL' || address.state === 'NY') {
              chances = 0;
            }
          }
          for (let i = 0; i < chances; i += 1) {
            r.push(a);
          }
        }
        return r;
      }
      , []
    );
  }


  function selectFiveWinners(mobiles) {
    const winnerArr = [];
    console.log(mobiles.length);
    for (let i = 0; i < 5; i++) {
      const shuffle = randy.shuffle(mobiles);
      const winner = randy.choice(shuffle);
      winnerArr.push({
        first_name: winner.first_name,
        last_name: winner.last_name,
        phone: winner.phone,
        email: winner.email,
        keyword: winner.keyword,
        isValid: false
      });
      mobiles = mobiles.filter(x => x.email !== winner.email && x.phone !== winner.phone);
      if (!mobiles[0]) {
        break;
      }
    }
    return winnerArr;
  }
}

