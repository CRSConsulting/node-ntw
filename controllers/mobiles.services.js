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
    getDups,
  };

  function getAll() {
    return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
  }

  function getDups() {
    return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  }
}

