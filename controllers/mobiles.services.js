const {
  ReadPreference,
} = require('mongodb');


module.exports = mobilesService;

function mobilesService(options) {
  let Mobile;
  let Timeframe;
  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  if (!options.timeService) {
    throw new Error('Options.timeService is required');
  }

  Mobile = options.modelService;
  Timeframe = options.timeService;

  return {
    getAll,
    getDups,
    generateTimer,
    findRunningRaffle,
    getRaffleContestants,
    raffleComplete,
    addWeightToRaffle
  };

  function getAll() {
    return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
  }

  function getDups() {
    return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  }

  function findExistingRaffle(kw, start) {
    return Timeframe.count({ endTime: { $gte: start }, used: false, keyword: kw });
  }

  // function generateTimer(jsonData) {
  //   // console.log('generaTimer', jsonData);
  //   const startAmount = 3;
  //   let tf = {};
  //   if (jsonData.length < startAmount) return {};
  //   const uniqueKeys = [...new Set(jsonData.map(item => item.keyword))];
  //   console.log(uniqueKeys);
  //   for (let i = 0; i < uniqueKeys.length; i += 1) {
  //     const specKeys = jsonData.filter(mobile => (mobile.keyword === uniqueKeys[i]));
  //     console.log('speckeyslength', specKeys.length, uniqueKeys[i]);
  //     if (specKeys.length >= startAmount) {
  //       const start = new Date(specKeys[startAmount].transaction_date);
  //       const end = new Date(specKeys[startAmount].transaction_date.getTime() + (15 * 60000));
  //       tf = new Timeframe({
  //         keyword: uniqueKeys[i],
  //         startTime: start,
  //         endTime: end,
  //         used: false,
  //       });
  //       findExistingRaffle(uniqueKeys[i], start)
  //       .then((count) => {
  //         if (count === 0) {
  //           Timeframe.create(tf);
  //         }
  //       });
  //     }
  //   }
  //   return typeof tf !== 'undefined' ? tf : {};
  // }

  function generateTimer(jsonData) {
    // console.log('generaTimer', jsonData);
    const startAmount = 3; // amount to trigger timer creation
    let tf = {};
    if (jsonData.length < startAmount) return {};
    const uniqueKeys = [...new Set(jsonData.map(item => item.keyword))]; // get array of unique keywords
    console.log(uniqueKeys);
    for (let i = 0; i < uniqueKeys.length; i += 1) {
      const specKeys = jsonData.filter(mobile => (mobile.keyword === uniqueKeys[i])); // get count of objects with keyword
      console.log('speckeyslength', specKeys.length, uniqueKeys[i]);
      if (specKeys.length >= startAmount) {
        const start = new Date(specKeys[0].transaction_date);
        const end = new Date(specKeys[startAmount - 1].transaction_date.getTime() + (15 * 60000));
        findExistingRaffle(uniqueKeys[i], start)
          .then(insertTimeframe(i, start, end));
      }
    }
    return typeof tf !== 'undefined' ? tf : {};

    function insertTimeframe(i, start, end) {
      return (count) => {
        if (count === 0) {
          tf = new Timeframe({
            keyword: uniqueKeys[i],
            startTime: start,
            endTime: end,
            used: false,
          });
          Timeframe.create(tf);
        }
      };
    }
  }
  function findRunningRaffle(kw) {
    return Timeframe.findOne({ endTime: { $lte: new Date() }, used: false, keyword: new RegExp(`^${kw}`) });
  }

  // function getRaffleContestants(timeframe) {
  //   return Mobile.find({ transaction_date: { $lte: timeframe.endTime, $gte: timeframe.startTime }, keyword: timeframe.keyword });
  // }

  function getRaffleContestants(timeframe) {
    return Mobile.find({ transaction_date: { $lte: timeframe.endTime, $gte: timeframe.startTime }, keyword: timeframe.keyword });
  }

  // function getRaffleContestants(timeframe) {
  //   return Mobile.find({ transaction_date: { $lte: timeframe.endTime, $gte: timeframe.startTime }, keyword: timeframe.keyword });
  // }
  
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
          if (number > twentyMinimum) {
            chances = 20;
          } else if (number > fiveMinimum) {
            chances = 5;
          } else if (number === 0) {
            const multiEntries = r.filter(mobile => (mobile.phone === a.phone)); // get count in weighted array of duplicate phone entries
            if (multiEntries.length === unpaidDupeMax) chances = 0;
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
}

