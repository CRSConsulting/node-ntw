function tokenService(options) {
  let Token;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Token = options.modelService;

  return {
    getAll,
    getOne,
    insert,
    updateOne,
    removeOne,
    getExpired
  };

  function getAll() {
    return Token.find();
  }

  function getExpired() {
    return Token.find({ expiration_date: { $lte: new Date() } }).populate('winnersList');
  }

  function getOne(queryCondition) {
    return Token.findOne(queryCondition);
  }

  function insert(document) {
    const token = new Token(document);
    return token.save();
  }

  function updateOne(queryCondition, doc) {
    return Token.findOneAndUpdate(queryCondition, doc, {
      new: true
    });
  }

  function removeOne(queryCondition) {
    return Token.findOneAndRemove(queryCondition);
  }
}


module.exports = tokenService;
