const {
  ReadPreference,
} = require('mongodb');


module.exports = calendarService;

function calendarService(options) {
  let Calendar;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Calendar = options.modelService;


  return {
    getAll,
    insert,
    getOne,
    update,
    remove,
    getTimes
  };

  function getAll() {
    return Calendar.find();
  }

  function insert(data) {
    const calendar = new Calendar(data);
    return calendar.save();
  }

  function update(id, data) {
    delete data.id;
    return Calendar.update({ _id: id }, data).exec();
  }

  function getOne(queryCondition) {
    return Calendar.findOne(queryCondition);
  }

  function remove(id) {
    return Calendar.remove({ _id: id });
  }

  function getTimes() {
    const quarterHours = ['00', '15', '30', '45'];
    const times = [];
    for (let i = 0; i < 24; i++) {
      let hour = i;
      if (i === 0) {
        hour = 12;
      }
      if (i > 12) {
        hour = i - 12;
      }
      const ampm = i >= 12 ? ' PM' : ' AM';
      quarterHours.forEach((y) => {
        times.push(`${hour}:${y}${ampm}`);
      });
    }
    return times;
  }
}

