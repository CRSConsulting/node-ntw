const {
  ReadPreference,
} = require('mongodb');

// const promiseRetry = require('promise-retry');

module.exports = retryService;

function retryService(options) {
  let Retry;
  const retryIntervals = [0, 5, 30, 4 * 60, 24 * 60, 48 * 60];

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Retry = options.modelService;


  return {
    getAll,
    insert,
    getOne,
    removeOne,
    updateOne,
    createDateArray
  };

  function getAll() {
    return Retry.find();
  }

  function insert(data) {
    const retry = new Retry(data);
    return retry.save();
  }
  function getOne(queryCondition) {
    console.log('queryCondition', queryCondition);
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

  function createDateArray(currentTime) {
    const tangoSendTime = new Date(currentTime.getTime() + (48 * 60 * 60000));
    const retryDates = retryIntervals.map(interval => new Date(tangoSendTime.getTime() + (interval * 60000)));
    return retryDates;
  }
}
