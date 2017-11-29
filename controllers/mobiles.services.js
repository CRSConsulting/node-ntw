const {
  ReadPreference,
} = require('mongodb');
const Timeframe = require('../models/Timeframe');
const timeframeService = require('./timeframe.services')({
  modelService: Timeframe
});
const randy = require('randy');

module.exports = mobilesService;

function mobilesService(options) {
  let Mobile;
  // let Timeframe;
  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  if (!options.timeService) {
    throw new Error('Options.timeService is required');
  }

  Mobile = options.modelService;
  // Timeframe = options.timeService;

  return {
    getAll,
    getDups,
    generateTimer,
    findRunningRaffle,
    getRaffleContestants,
    findExistingRaffle,
    raffleComplete,
    addWeightToRaffle,
    selectFiveWinners
  };

  function getAll() {
    return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
  }

  function getDups() {
    return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  }

  function findExistingRaffle(kw) {
    return Timeframe.findOne({ startTime: { $lte: new Date() }, used: false, keyword: new RegExp(`^${kw}`) });
  }

  function generateTimer(jsonData, baseKey) {
    const startAmount = 3; // amount to trigger timer creation
    const test = findExistingRaffle(baseKey)
      .then((time) => {
        if (!time) return { message: 'Not within timeframe window' };
        if (time.endTime) return { message: 'Endtime already set' };
        const newTimer = time;
        const dataAfterStart = jsonData.filter(mobile => new Date(mobile.transaction_date).getTime() > new Date(time.startTime).getTime());
        if (dataAfterStart.length < startAmount) return { message: 'Not Enough To Start' };
        const uniqueKeys = [...new Set(jsonData.map(item => // get list of keyword variants (e.g. BRAVE1, BRAVE2, etc..)
          item.keyword
        ))];
        for (let i = 0; i < uniqueKeys.length; i += 1) { // loop through all keyword variants to find if any have enough to create timer
          const specKeys = dataAfterStart.filter(mobile => // Get subsect of objects with specific keyword variant
            mobile.keyword === uniqueKeys[i]
          );
          if (specKeys.length >= startAmount) {
            const currentTime = new Date(specKeys[startAmount - 1].transaction_date).getTime();
            const end = currentTime + (15 * 60000);
            // const end = new Date(specKeys[startAmount - 1].transaction_date.getTime() + (15 * 60000));
            // end is 15 minutes after transaction date of startAmount object
            // count = 0;
            // set end time and specific keyword
            newTimer.endTime = end;
            newTimer.keyword = uniqueKeys[i];
            timeframeService.update(newTimer);
            return newTimer;
          }
          return { message: 'Not enough to start' };
        }
      });
    return Promise.all([test]);
  }

  function findRunningRaffle(kw) {
    return Timeframe.findOne({ endTime: { $exists: true, $lte: new Date() }, used: false, keyword: new RegExp(`^${kw}`) });
  }

  function getRaffleContestants(timeframe) {
    return Mobile.find({ transaction_date: { $lte: timeframe.endTime, $gte: timeframe.startTime }, keyword: timeframe.keyword });
  }

  function raffleComplete(time) {
    return Timeframe.update({ _id: time._id }, { used: true }).exec();
  }

  function addWeightToRaffle(unweighted) {
    const fiveMinimum = 50; // set minimum donation to get 5 chances
    const twentyMinimum = 100; // set minimum donation to get 20 chances
    const unpaidDupeMax = 20;
    return unweighted.reduce(
      (r, a) => {
        if (a.collected_amount && a.collected_amount !== null) { // if money was donated
          const currency = a.collected_amount;
          const number = Number(currency.replace(/[^0-9.-]+/g, '')); // convert dollar to number
          let chances = 1;
          if (number >= twentyMinimum) {
            chances = 20;
          } else if (number >= fiveMinimum) {
            chances = 5;
          } else if (number === 0) {
            const multiEntries = r.filter(mobile => (mobile.phone === a.phone && mobile.collected_amount === '$0.00')); // get count in weighted array of duplicate phone entries
            if (multiEntries.length === unpaidDupeMax) {
              chances = 0;
            }
            const multiEntriesEmail = r.filter(mobile => (mobile.email === a.email && mobile.collected_amount === '$0.00')); // get count in weighted array of duplicate email entries
            if (multiEntriesEmail.length === unpaidDupeMax) {
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
    for (let i = 0; i < 5; i++) {
      const shuffle = randy.shuffle(mobiles);
      const winner = randy.choice(shuffle);
      winnerArr.push({
        first_name: winner.first_name,
        last_name: winner.last_name,
        phone: winner.phone,
        email: winner.email
      });
      mobiles = mobiles.filter(x => x.email !== winner.email && x.phone !== winner.phone);
      if (!mobiles[0]) {
        break;
      }
    }
    return winnerArr;
  }
}

