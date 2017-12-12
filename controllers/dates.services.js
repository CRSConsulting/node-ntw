const {
  ReadPreference,
} = require('mongodb');


module.exports = datesService;

function datesService(options) {
  let Date;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Date = options.modelService;


  return {
    getAll,
    insert,
    getOne
  };

  function getAll() {
    return Date.find();
  }

  function insert(data) {
    const date = new Date(data);
    return date.save();
  }
  function getOne(queryCondition) {
    return Date.findOne(queryCondition);
  }
}

