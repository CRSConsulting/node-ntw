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

  function update(id, data) {
    delete data._id;
    User.findById(id, (err, doc) => {
      console.log('imhere');
      console.log(doc);
      if (err) {
        console.log(err);
        return err;
      }
      doc.password = data.password || doc.password;
      doc.perms = data.perms;
      doc.save((err, u) => {
        if (err) { console.log(err); }
        return u;
      });
    });
  }

  function getOne(queryCondition) {
    return User.findOne(queryCondition);
  }

  function remove(id) {
    return User.remove({ _id: id });
  }
}

