const server = require('../server');

const Timeframe = require('../models/Timeframe');
const timeframeService = require('./timeframe.services')({
  modelService: Timeframe,
});

const newTimer = {
  keyword: 'BRAVE',
  startTime: new Date(),
  used: false
};
timeframeService.insert(newTimer);
