const {
  ReadPreference,
} = require('mongodb');


module.exports = timeframeService;

function timeframeService(options) {
  let Timeframe;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Timeframe = options.modelService;


  return {
    getAll,
    insert,
    getOne
  };

  function getAll() {
    return Timeframe.find();
  }

  function insert(data) {
    const timeframe = new Timeframe(data);
    return timeframe.save();
  }
  function getOne(queryCondition) {
    console.log(queryCondition);
    return Timeframe.findOne(queryCondition);
  }
}

