const Report = require('../models/Report');
const reportService = require('./report.services')({
  modelService: Report,
});
const Winners = require('../models/Winner');
const winnersService = require('../controllers/winners.services')({
  modelService: Winners
});

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
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/venue', title: 'Venues', columnOne: 'Venue Name', columnTwo: 'Total Monies Raised', columnThree: 'Best Performing Prize', columnFour: null };
      const items = [
        { columnOne: 'I-Wireless - Moline, IL', columnTwo: '$110,000.00', columnThree: '$500 Amazon Gift Card', columnFour: null },
        { columnOne: 'Allen Event Center - Dallas, TX', columnTwo: '$26,760.50', columnThree: '$750 Amazon Gift Card', columnFour: null },
        { columnOne: 'Bridgestone - Nashville, TN', columnTwo: '$15,520.00', columnThree: '$500 Visa Gift Card', columnFour: null },
        { columnOne: 'Allen Country War - Fort Wayne, IN', columnTwo: '$9,870.55', columnThree: '$1250 Visa Gift Card', columnFour: null },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.time = (req, res) => {
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/time', title: 'Time', columnOne: 'Drawing Start Time', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: null };
      const items = [
        { columnOne: '7:00pm EST (12:00am GMT)', columnTwo: '$110,000.00', columnThree: '10265', columnFour: null },
        { columnOne: '8:00pm EST (1:00am GMT)', columnTwo: '$26,760.50', columnThree: '8168', columnFour: null },
        { columnOne: '5:00pm EST (1:00am GMT)', columnTwo: '$15,520.00', columnThree: '984', columnFour: null },
        { columnOne: '7:30pm EST (12:30am GMT)', columnTwo: '$9,870.55', columnThree: '19183', columnFour: null },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.prize = (req, res) => {
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/prize', title: 'Raffle Prizes', columnOne: 'Prize # and Type', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: null };
      const items = [
        { columnOne: 'Prize 1, $500 Amazon Gift Card', columnTwo: '$110,000.00', columnThree: '10265', columnFour: null },
        { columnOne: 'Prize 3, $750 Amazon Gift Card', columnTwo: '$26,760.50', columnThree: '8168', columnFour: null },
        { columnOne: 'Prize 1, $500 Visa Gift Card', columnTwo: '$15,520.00', columnThree: '984', columnFour: null },
        { columnOne: 'Prize 2, $1250 Visa Gift Card', columnTwo: '$9,870.55', columnThree: '19183', columnFour: null },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.events = (req, res) => {
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/events', title: 'Events', columnOne: 'Event(Venue, Artist/Event)', columnTwo: 'Total Monies Raised', columnThree: 'Total Number of Entries', columnFour: 'Date' };
      const items = [
        { columnOne: 'Moline, Taylor Swift', columnTwo: '$110,000.00', columnThree: '10265', columnFour: '10/12/2017' },
        { columnOne: 'Moline, White Sox vs Dodgers', columnTwo: '$26,760.50', columnThree: '8168', columnFour: '11/12/2017' },
        { columnOne: 'Bridgestone, Tom Jones', columnTwo: '$15,520.00', columnThree: '984', columnFour: '11/20/2017' },
        { columnOne: 'Moline, Jack Johnson', columnTwo: '$9,870.55', columnThree: '19183', columnFour: '01/05/2018' },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.entry = (req, res) => {
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/entry', title: 'Entry Time Averages', columnOne: 'Prize # and Type', columnTwo: 'Prize Start Time', columnThree: 'Avgerage Trigger Start Time', columnFour: 'Average Entry Time' };
      const items = [
        { columnOne: 'Prize 1, $500 Amazon', columnTwo: '7:00pm EST (12:00am GMT)', columnThree: '7:00pm EST (12:00am GMT)', columnFour: '7:00pm EST (12:00am GMT)' },
        { columnOne: 'Prize 2, $750 Visa', columnTwo: '7:00pm EST (12:00am GMT)', columnThree: '7:00pm EST (12:00am GMT)', columnFour: '7:00pm EST (12:00am GMT)' },
        { columnOne: 'Prize 3, $1250 Amazon', columnTwo: '7:00pm EST (12:00am GMT)', columnThree: '7:00pm EST (12:00am GMT)', columnFour: '7:00pm EST (12:00am GMT)' },
        { columnOne: 'Prize 4, $1250 Visa', columnTwo: '7:00pm EST (12:00am GMT)', columnThree: '7:00pm EST (12:00am GMT)', columnFour: '7:00pm EST (12:00am GMT)' },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.donor = (req, res) => {
  winnersService.getAll()
    .then((reports) => {
      const display = { formAction: '/api/report/donor', title: 'Donors (Multiple Entry)', columnOne: 'Donor Name', columnTwo: 'Prize # and Type in Order of Weight', columnThree: 'Total Monies Collected', columnFour: 'Total Number of Entries' };
      const items = [
        { columnOne: 'John Doe', columnTwo: 'Prize 1, $500 AMZ, Prize 2, $750 VISA, Prize 3, $1250 AMZ', columnThree: '$120', columnFour: '5' },
        { columnOne: 'Someone Longnamed', columnTwo: 'Prize 1, $500 AMZ, Prize 2, $750 VISA, Prize 3, $1250 AMZ', columnThree: '$55', columnFour: '3' },
        { columnOne: 'John Yu', columnTwo: 'Prize 1, $500 AMZ, Prize 2, $750 VISA, Prize 3, $1250 AMZ', columnThree: '$354.50', columnFour: '10' },
        { columnOne: 'Allen Fake', columnTwo: 'Prize 1, $500 AMZ, Prize 2, $750 VISA, Prize 3, $1250 AMZ', columnThree: '$165', columnFour: '4' },
      ];
      res.render('pages/reports', {
        items, display
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
};

// POST METHODS

exports.venuePost = (req, res) => {
  console.log('venuePost req.body: ', req.body);
};
exports.timePost = (req, res) => {
  console.log('timePost req.body: ', req.body);
};
exports.prizePost = (req, res) => {
  console.log('prizePost req.body: ', req.body);
};
exports.eventsPost = (req, res) => {
  console.log('eventsPost req.body: ', req.body);
};
exports.entryPost = (req, res) => {
  console.log('entryPost req.body: ', req.body);
};
exports.donorPost = (req, res) => {
  console.log('donorPost req.body: ', req.body);
};
