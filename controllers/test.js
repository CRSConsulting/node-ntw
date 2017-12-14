const server = require('../server');
const Timeframe = require('../models/Timeframe');
const timeframeService = require('./timeframe.services')({
  modelService: Timeframe,
});


timeframeService.insertNow('FORT');
