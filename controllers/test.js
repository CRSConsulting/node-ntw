const Timeframe = require('../models/Timeframe');
const timeframeService = require('./timeframe.services')({
  modelService: Timeframe,
});

timeframeService.insertNow('BRAVE');
timeframeService.insertNow('MOLINE');
timeframeService.insertNow('FORT');
