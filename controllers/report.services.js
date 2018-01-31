const {
  ReadPreference,
} = require('mongodb');

const Donor = require('../models/Donor');
const donorService = require('./donor.services')({
  modelService: Donor
});

module.exports = reportService;

function reportService(options) {
  let Report;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Report = options.modelService;


  return {
    getAll,
    getOne,
    getDonorReportData,
    getEntryTimeReportData,
    getEventReportData,
    getPrizeReportData,
    getTimeReportData,
    getVenueReportData
  };

  function getAll() {
    return Report.find();
  }

  function getOne(queryCondition) {
    return Report.findOne(queryCondition);
  }

  /* 
  get Donor report
  */
  function getDonorReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $match: {
            donation_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              email: '$email',
              prize_type: '$prize_type',
              prize_amount: '$prize_amount',
              drawing_number: '$drawing_number',
            },
            keywordAmount: { $sum: '$donation_amount' },
            keywordChances: { $first: '$chances' },
          }
        },
        {
          $group: {
            _id: {
              email: '$_id.email',
            },
            drawings: {
              $push: {
                prize_type: '$_id.prize_type',
                prize_amount: '$_id.prize_amount',
                drawing_number: '$_id.drawing_number',
                amount: '$keywordAmount',
                chances: '$keywordChances'

              },
            },
            totalAmount: { $sum: '$keywordAmount' },
            totalEntries: { $sum: '$keywordChances' }
          },
        },
      ]);
  }

  /* 
  get Entry Time report
  */
  function getEntryTimeReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $match: {
            donation_date: { $gte: start, $lte: end }
          }
        },
        {
          $project: {
            prize_time: 1,
            prize_type: 1,
            prize_amount: 1,
            drawing_number: 1,
            entryHour: { $hour: '$donation_date' },
            entryMinutes: { $minute: '$donation_date' },
            triggerHour: { $hour: '$trigger_time' },
            triggerMinutes: { $minute: '$trigger_time' },
          }
        },
        {
          $project: {
            prize_time: 1,
            prize_type: 1,
            prize_amount: 1,
            drawing_number: 1,
            entryTotalTimeOfDay: { $sum: [{ $multiply: ['$entryHour', 60] }, '$entryMinutes'] },
            triggerTotalTimeOfDay: { $sum: [{ $multiply: ['$triggerHour', 60] }, '$triggerMinutes'] },
          }
        },
        {
          $group: {
            _id: {
              prize_time: '$prize_time',
              prize_type: '$prize_type',
              prize_amount: '$prize_amount',
              drawing_number: '$drawing_number'
            },
            entryAvgTimeOfDay: { $avg: '$entryTotalTimeOfDay' },
            triggerAvgTimeOfDay: { $avg: '$triggerTotalTimeOfDay' },
          }
        },
        {
          $project: {
            prize_time: '$prize_time',
            prize_type: '$prize_type',
            prize_amount: '$prize_amount',
            drawing_number: '$drawing_number',
            entryAvgMinutes: { $trunc: { $mod: ['$entryAvgTimeOfDay', 60] } },
            entryAvgHours: { $trunc: { $divide: ['$entryAvgTimeOfDay', 60] } },
            triggerAvgMinutes: { $trunc: { $mod: ['$triggerAvgTimeOfDay', 60] } },
            triggerAvgHours: { $trunc: { $divide: ['$triggerAvgTimeOfDay', 60] } }
          }
        },
      ]);
  }

  /*
  Event Data
  */
  function getEventReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $match: {
            donation_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              venue: '$venue',
              artist: '$artist',
              year: { $year: '$event_start' },
              month: { $month: '$event_start' },
              day: { $dayOfMonth: '$event_start' },
              email: '$email'
            },

            chances: { $first: '$chances' }
          }
        },
        {
          $group: {
            _id: {
              venue: '$_id.venue',
              artist: '$_id.artist',
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            },
            totalAmount: { $sum: '$donation_amount' },
            totalEntries: { $sum: '$chances' }
          }
        },
      ]);
  }

  /*
  Prize Data
  */
  function getPrizeReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $match: {
            donation_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              prize_type: '$prize_type',
              prize_amount: '$prize_amount',
              drawing_number: '$drawing_number',
              email: '$email'
            },
            userAmounts: { $sum: '$donation_amount' },
            chances: { $first: '$chances' },
          }
        },
        {
          $group: {
            _id: {
              prize_type: '$prize_type',
              prize_amount: '$prize_amount',
              drawing_number: '$drawing_number',
            },
            totalAmount: { $sum: '$userAmounts' },
            totalEntries: { $sum: '$chances' }
          }
        },
      ]);
  }

  /*
  Time Data
  */
  function getTimeReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $match: {
            donation_date: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: {
              prize_time: '$prize_time',
              email: '$email'
            },
            userAmounts: { $sum: '$donation_amount' },
            chances: { $first: '$chances' },
          }
        },
        {
          $group: {
            _id: {
              prize_time: '$prize_time',
              drawing_number: '$drawing_number',
            },
            totalAmount: { $sum: '$userAmounts' },
            totalEntries: { $sum: '$chances' }
          }
        },
      ]);
  }

  /* 
  get Venue report
  */
  function getVenueReportData(start, end) {
    return Donor.aggregate(
      [
        {
          $group: {
            _id: {
              venue: '$venue',
              venue_city: '$venue_city',
              venue_state: '$venue_state',
              prize_type: '$prize_type',
              prize_amount: '$prize_amount',
              drawing_number: '$drawing_number',
            },
            keywordAmount: { $sum: '$donation_amount' },
            keywordChances: { $first: '$chances' },
          }
        },
        {
          $group: {
            _id: {
              venue: '$_id.venue',
              venue_city: '$_id.venue_city',
              venue_state: '$_id.venue_state',
            },
            drawings: {
              $push: {
                prize_type: '$_id.prize_type',
                prize_amount: '$_id.prize_amount',
                drawing_number: '$_id.drawing_number',
                amount: '$keywordAmount',
                chances: '$keywordChances'

              },
            },
            totalAmount: { $sum: '$keywordAmount' },
          },
        },
      ]);
  }
}
