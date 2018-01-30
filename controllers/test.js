const server = require('../server');
const Report = require('../models/Donor');
const reportService = require('../controllers/report.services')({
  modelService: Report
});

console.log('hello');
const startTime = new Date(0);
const endTime = new Date();
reportService.getEventReportData(startTime, endTime)
  .then((reports) => {
    console.log('hi');
    console.log(reports);
  })
  .catch(err => console.log(err));