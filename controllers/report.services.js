const {
  ReadPreference,
} = require('mongodb');

const Mobile = require('../models/Mobile');
const mobileService = require('./mobiles.services')({
  modelService: Mobile
});

module.exports = reportService;

function reportService(options) {
  let Report;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Report = options.modelService;


  return {
    getAll,
    getOne,
    getDups
  };

  function getAll() {
    return Report.find();
  }

  function getOne(queryCondition) {
    return Report.findOne(queryCondition);
  }

  function getDups() {
    return Mobile.aggregate([{ $group: { _id: { transaction_id: '$transaction_id', keyword: '$keyword', billing_transaction: '$billing_transaction', }, count: { $sum: 1, }, }, }, { $match: { count: { $gte: 2, }, }, }]);
  }
}
