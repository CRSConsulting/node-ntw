function tokenService(options) {
  let Token;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Token = options.modelService;

  return {
    ping,
    getAll,
    getOne,
    insert,
    updateOne,
    removeOne
  };

  function ping() {
    return new Promise(((resolve, reject) => {
      resolve('pong from token.services');
    }));
  }

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
