const {
  ReadPreference,
} = require('mongodb');


module.exports = userService;

function userService(options) {
  let User;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  User = options.modelService;


  return {
    getAll,
    insert,
    getOne,
    update,
    remove,
  };

  function getAll() {
    return User.find();
  }

  function insert(data) {
    const user = new User(data);
    return user.save();
  }

  function update(data) {
    return User.update({ _id: data._id }, { city: data.city, keyword: data.keyword, state: data.state }).exec();
  }

  function getOne(queryCondition) {
    return User.findOne(queryCondition);
  }

  function remove(id) {
    return User.remove({ _id: id });
  }
}

