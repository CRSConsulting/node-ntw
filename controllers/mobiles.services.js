const {
  ReadPreference,
} = require('mongodb');


module.exports = mobilesService;

function mobilesService(options) {
  let Mobile;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Mobile = options.modelService;

  return {
    getAll,
    insert,
    delay,
    getDups,
    removeOne,
  };

  function getAll() {
    return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
  }

  function insert(jsonData) {
    const mobileData = jsonData;
    const data = [];

    mobileData.forEach((cur) => {
      const mobile = new Mobile(cur);
      data.push(mobile);
    });
    return Mobile.insertMany(data);
  }

  function delay(t) {
    return new Promise(((resolve) => {
      setTimeout(resolve, t);
    }));
  }

  function getDups() {
    return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  }

  function removeOne(queryCondition) {
    return Mobile.findOneAndRemove(queryCondition);
  }
}

