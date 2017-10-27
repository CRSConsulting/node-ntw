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

  function generateTimer(jsonData) {
    // console.log('generaTimer', jsonData);
    const startAmount = 3;
    let tf = {};
    if (jsonData.length < startAmount) return {};
    const uniqueKeys = [...new Set(jsonData.map(item => item.keyword))];
    console.log(uniqueKeys);
    for (let i = 0; i < uniqueKeys.length; i += 1) {
      const specKeys = jsonData.filter(mobile => (mobile.keyword === uniqueKeys[i]));
      console.log('speckeyslength', specKeys.length, uniqueKeys[i]);
      if (specKeys.length >= startAmount) {
        const start = new Date(specKeys[startAmount].transaction_date);
        const end = new Date(specKeys[startAmount].transaction_date.getTime() + (15 * 60000));
        tf = new Timeframe({
          keyword: uniqueKeys[i],
          startTime: start,
          endTime: end,
          used: false,
        });
        findExistingRaffle(uniqueKeys[i], start)
        .then((count) => {
          if (count === 0) {
            Timeframe.create(tf);
          }
        });
      }
    }
    return typeof tf !== 'undefined' ? tf : {};
  }
}

