const tangoModel = require('../models/tango.model');
const tangosService = require('../services/tangos.services')({
  modelService: tangoModel, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});

module.exports = tangosController;

function tangosController() {
  return {
    insert,
  };

  function insert() {
    tangosService.insert();
  }
}
