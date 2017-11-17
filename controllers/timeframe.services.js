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
    getOne,
    update
  };

  function getAll() {
    return Timeframe.find();
  }

  function insert(data) {
    const timeframe = new Timeframe(data);
    return timeframe.save();
  }

  function update(data) {
    return Timeframe.update({ _id: data._id }, { endTime: data.endTime, keyword: data.keyword }).exec();
  }

  function getOne(queryCondition) {
    return Timeframe.findOne(queryCondition);
  }
}

