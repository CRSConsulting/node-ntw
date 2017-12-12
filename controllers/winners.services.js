const {
  ReadPreference,
} = require('mongodb');


module.exports = winnersService;

function winnersService(options) {
  let Winners;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Winners = options.modelService;


  return {
    getAll,
    insert,
    getOne,
    removeOne,
    updateOne
  };

  function getAll() {
    return Winners.find();
  }

  function insert(data) {
    const winners = new Winners(data);
    return winners.save();
  }
  function getOne(queryCondition) {
    return Winners.findOne(queryCondition);
  }

  function removeOne(queryCondition) {
    return Winners.findOneAndRemove(queryCondition);
  }

  function updateOne(data) {
    return Winners.update({ _id: data._id }, { winnerIndex: data.winnerIndex }).exec();
  }
}

