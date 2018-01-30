const Venue = require('../models/Venue');
const venueService = require('./venue.services')({
  modelService: Venue,
});
const Calendar = require('../models/Calendar');
const calendarService = require('./calendar.services')({
  modelService: Calendar,
}); 


exports.index = (req, res) => {
  const calendars = calendarService.getAll();
  const venues = venueService.getAll();
  const times = calendarService.getTimes();
  Promise.all([calendars,venues,times])
    .then((all) => {
      res.render('pages/calendar', {
        title: 'Calendar',
        user: req.user,
        venues: all[1],
        venueList: JSON.stringify(all[1]),
        calendars: JSON.stringify(all[0]),
        times: all[2]
      });
    })
    
};

exports.post = (req, res) => {
  console.log(req.body);
  const newCalendar = req.body;
  calendarService.insert(newCalendar)
    .then(calendar => res.send(calendar))
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};

exports.patch = (req, res) => {
  console.log(req.body);
  const updateCalendar = req.body;
  const updateId = updateCalendar.id;
  calendarService.update(updateId, updateCalendar)
    .then(calendar => res.send(calendar))
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};