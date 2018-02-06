const {
  ReadPreference,
} = require('mongodb');


module.exports = adminService;

function adminService(options) {
  let Admin;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Admin = options.modelService;


  return {
    get,
    update,
  };

  function get() {
    return Admin.findOne();
  }

  function update(data) {
    return Admin.update({}, { startAmount: data.startAmount, duration: data.duration }).exec();
  }

}

