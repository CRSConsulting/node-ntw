const {
    ReadPreference,
  } = require('mongodb');
  
  
  module.exports = mobilesService;
  
  function mobilesService(options) {
    const Mobile
  
    if(!options.modelService) {
      throw new Error('Options.modelService is required');
    }
  
    Mobile = options.modelService;
  
    return {
      getAll,
      insert,
    };
  
    function getAll() {
      return Mobile.find({}).limit(1000).read(ReadPreference.NEAREST);
    }
  
    function insert(jsonData) {
      const mobileData = jsonData;
      const data = [];
  
      mobileData.forEach((cur) => {
        const mobile = new Mobile(cur);
        data.push(mobile);
      });
      return Mobile.insertMany(data);
    }
  }
  