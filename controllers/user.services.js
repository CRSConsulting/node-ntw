const {
  ReadPreference,
} = require('mongodb');

const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

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

  function update(id, data, callback) {
    delete data._id;
    delete data.confirmPassword;
    if (data.password) {
      console.log('password update');
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
          return err;
        }
        bcrypt.hash(data.password, salt, null, (err, hash) => {
          if (err) {
            console.log(err);
            return err;
          }
          console.log('made it here');
          console.log(hash);
          data.password = hash;
          console.log(data);
          return callback(User.update({ _id: id }, data).exec());
        });
      });
    } else {
      return callback(User.update({ _id: id }, data).exec());
    }
  }

  function getOne(queryCondition) {
    return User.findOne(queryCondition);
  }

  function remove(id) {
    return User.remove({ _id: id });
  }
}

