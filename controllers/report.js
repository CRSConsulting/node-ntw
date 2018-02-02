const Report = require('../models/Report');
const reportService = require('./report.services')({
  modelService: Report,
});
const Donor = require('../models/Donor');
const donorService = require('../controllers/donor.services')({
  modelService: Donor
});
const moment = require('moment');
// exports.index = (req, res) => {
//   winnersService.getAll()
//     .then((reports) => {
//       const display = { formAction: '/api/report/', title: 'Home', columnOne: null, columnTwo: null, columnThree: null, columnFour: null };
//       const items = [
//         { columnOne: null, columnTwo: null, columnThree: null, columnFour: null },
//         { columnOne: null, columnTwo: null, columnThree: null, columnFour: null },
//         { columnOne: null, columnTwo: null, columnThree: null, columnFour: null },
//         { columnOne: null, columnTwo: null, columnThree: null, columnFour: null },
//       ];
//       res.render('pages/test-table1', {
//         items, display
//       });
//     }).catch((err) => {
//       res.status(500).send(err);
//     });
// };

exports.venue = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  reportService.getVenueReportData(startTime, endTime)
    .then((reports) => {
      const display = { dateString, formAction: '/api/report/venue', title: 'Venues', columnOne: 'Venue Name', columnTwo: 'Total Monies Raised', columnThree: 'Best Performing Prize', columnFour: null };

      const items = reports.map((report) => {
        console.log(report);
        const columnThree = `Prize ${report.drawings[0].drawing_number}: $${report.drawings[0].prize_amount} ${report.drawings[0].prize_type}`;
        return {
          columnOne: `${report._id.venue} - ${report._id.venue_city}, ${report._id.venue_state}`,
          columnTwo: `$${report.totalAmount}`,
          columnThree
        };
      });
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.time = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  reportService.getTimeReportData(startTime, endTime)
    .then((reports) => {    
      console.log(reports);
      const display = { dateString, formAction: '/api/report/time', title: 'Time', columnOne: 'Drawing Start Time', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: null };
      const items = reports.map((report) => {
        const columnOne = donorService.convertHoursToTime(report._id.prize_hour, report._id.prize_minute);
        const columnTwo = `$${report.totalAmount}`;
        const columnThree = `${report.totalEntries}`;
        return {
          columnOne,
          columnTwo,
          columnThree,
        };
      });
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.prize = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  reportService.getPrizeReportData(startTime, endTime)
    .then((reports) => {
      const display = { dateString, formAction: '/api/report/prize', title: 'Raffle Prizes', columnOne: 'Prize # and Type', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: null };
      const items = reports.map((report) => {
        const columnOne = `Prize ${report._id.drawing_number}: $${report._id.prize_amount} ${report._id.prize_type}`;
        const columnTwo = `$${report.totalAmount}`;
        const columnThree = `${report.totalEntries}`;
        return {
          columnOne,
          columnTwo,
          columnThree,
        };
      });
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.events = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  console.log(startTime);
  console.log(endTime);
  reportService.getEventReportData(startTime, endTime)
    .then((reports) => {
      const items = reports.map((report) => {
        return {
          columnOne: `${report._id.venue}, ${report._id.artist}`,
          columnTwo: `$${report.totalAmount}`,
          columnThree: `${report.totalEntries}`,
          columnFour: `${report._id.month}/${report._id.day}/${report._id.year}`
        };
      });
      const display = { dateString, formAction: '/api/report/events', title: 'Events', columnOne: 'Event(Venue, Artist/Event)', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: 'Date' };
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.entry = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  reportService.getEntryTimeReportData(startTime, endTime)
    .then((reports) => {
      const items = reports.map((report) => {
        const columnOne = `Prize ${report._id.drawing_number}: $${report._id.prize_amount} ${report._id.prize_type}`;
        const mom = moment(report._id.prize_time);
        const columnTwo = donorService.convertHoursToTime(report._id.prize_time.getUTCHours(), mom.minutes());
        const columnThree = donorService.convertHoursToTime(report.triggerAvgHours, report.triggerAvgMinutes);
        const columnFour = donorService.convertHoursToTime(report.entryAvgHours, report.entryAvgMinutes);
        return {
          columnOne,
          columnTwo,
          columnThree,
          columnFour
        };
      });
      const display = { dateString, formAction: '/api/report/entry', title: 'Entry Time Averages', columnOne: 'Prize # and Type', columnTwo: 'Prize Start Time', columnThree: 'Average Trigger Start Time', columnFour: 'Average Entry Time' };
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
exports.donor = (req, res) => {
  let startTime = new Date(0);
  let endTime = new Date();
  let dateString = '';
  if (req.body.startTime) {
    startTime = new Date(req.body.startTime);
    dateString = `Showing results for activity starting on: ${req.body.startTime}`;
  }
  if (req.body.endTime) {
    endTime = new Date(req.body.endTime);
    if (dateString === '') {
      dateString = `Showing results for activity ending on ${req.body.endTime}`;
    } else {
      dateString += ` and ending on ${req.body.endTime}`;
    }
  }
  if (dateString != '') {
    dateString += '.';
  }
  reportService.getDonorReportData(startTime, endTime)
    .then((reports) => {
      const display = { dateString, formAction: '/api/report/donor', title: 'Donors (Multiple Entry)', columnOne: 'Donor Name', columnTwo: 'Prize # and Type in Order of Weight', columnThree: 'Total Monies Collected', columnFour: 'Total Number of Entries' };
      const items = reports.map((report) => {
        console.log(report);
        const columnTwo = report.drawings.reduce((str, draw) => {
          str += `Prize ${draw.drawing_number}: $${draw.prize_amount} ${draw.prize_type}, `;
          return str;
        }, '').slice(0, -2);
        return {
          columnOne: `${report.first_name} ${report.last_name} (${report._id.email})`,
          columnTwo,
          columnThree: `$${report.totalAmount}`,
          columnFour: `${report.totalEntries}`
        }
      });
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

// // POST METHODS

// exports.venuePost = (req, res) => {
//   console.log('venuePost req.body: ', req.body);
// };
// exports.timePost = (req, res) => {
//   console.log('timePost req.body: ', req.body);
// };
// exports.prizePost = (req, res) => {
//   console.log('prizePost req.body: ', req.body);
// };
// exports.eventsPost = (req, res) => {
//   console.log('eventsPost req.body: ', req.body);
// };
// exports.entryPost = (req, res) => {
//   console.log('entryPost req.body: ', req.body);
// };
// exports.donorPost = (req, res) => {
//   console.log('donorPost req.body: ', req.body);
// };
