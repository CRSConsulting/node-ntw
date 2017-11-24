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
    removeOne
  };

  function getAll() {
    return Token.find();
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
