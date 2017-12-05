const {
  ReadPreference,
} = require('mongodb');
const Tango = require('../models/Tango');
const tangosService = require('./tangos.services')({
  modelService: Tango,
});

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
    tangosService.getOne({ keyword: data[0].keyword })
      .then((tango) => {
        const winners = new Winners({
          winners: data,
          prize: tango.prize,
          giftId: tango.giftId,
          winnerIndex: 0
        });
        return winners.save();
      });
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

