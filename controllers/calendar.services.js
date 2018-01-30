const {
  ReadPreference,
} = require('mongodb');

const moment = require('moment');

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
    getTimes,
    getAllofToday,
    getAllWithVenues,
    findRunningRaffle,
    setDrawingToUsed
  };

  function getAll() {
    return Calendar.find();
  }

  function setDrawingToUsed(cal, calIndex) {
    const drawId = cal[calIndex]._id;
    return Calendar.update({
      _id: cal._id,
      'drawings._id': drawId
    },
    { $set: { 'drawings.$.used': true } })

  }

  function getAllofToday() {
    const start = moment().startOf('day'); // set to 12:00 am today
    const end = moment().endOf('day'); // set to 23:59 pm today
    return Calendar.find({ startTime: { $gte: start, $lte: end }, 'drawings.time': { $lte: new Date() } }).populate('venue');
  }

  function findRunningRaffle(kw) {
    return Calendar.find({ 'drawings.endTime': { $exists: true, $lte: new Date() }, used: false, keyword: new RegExp(`^${kw}`) }).populate('venue');
  }

  function getAllWithVenues() {
    return Calendar.find().populate('venue');
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

