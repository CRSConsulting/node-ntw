const {
  ReadPreference,
} = require('mongodb');


module.exports = tangosService;

function tangosService(options) {
  let Tango;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Tango = options.modelService;


  return {
    getAll,
    insert,
    getOne
  };

  function getAll() {
    return Tango.find();
  }

  function insert(data) {
    const tango = new Tango(data);
    return tango.save();
  }
  function getOne(queryCondition) {
    return Tango.findOne(queryCondition);
  }
}

