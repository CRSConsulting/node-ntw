const {
  ReadPreference,
} = require('mongodb');

const tangoController = require('./tango');
// const promiseRetry = require('promise-retry');

module.exports = retryService;

function retryService(options) {
  let Retry;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Retry = options.modelService;


  return {
    getAll,
    insert,
    getOne,
    removeOne,
    updateOne
  };

  function getAll() {
    return Retry.find();
  }

  function insert(data) {
    const retry = new Retry(data);
    return retry.save();
  }
  function getOne(queryCondition) {
    return Retry.findOne(queryCondition);
  }

  function removeOne(queryCondition) {
    return Retry.findOneAndRemove(queryCondition);
  }

  function updateOne(queryCondition, doc) {
    return Retry.findOneAndUpdate(queryCondition, doc, {
      new: true
    });
  }
}
