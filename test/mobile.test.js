/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';

const server = require('../server');
const Mobile = require('../models/Mobile');
// const User = require('../models/User');
const Timeframe = require('../models/Timeframe');
const sinon = require('sinon');
require('sinon-mongoose');
const Promise = require('bluebird');
const cmd = require('node-cmd');

const mobilesService = require('../controllers/mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile,
});

const tangoController = require('../controllers/tango');

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});

const _ = require('lodash');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();

chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

chai.use(chaiAsPromised);

const mongoose = require('mongoose');
// Our parent block
describe('Mobile Controller', () => {
  describe('#exports.getKeywordAndInsert', () => {
    let mobileCause;
    beforeEach(() => {
      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      mobileCause = () => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":499534}' "https://app.mobilecause.com/api/v2/reports/results.json?"`);
    });

    it('should work and return data', () => mobileCause()
      .then((mobiles) => {
        function dateTimeReviver(key, value) {
          _.isString(key).should.be.true;
          let a;
          if (key === 'transaction_date' || key === 'donation_date') {
            a = new Date(`${value} UTC`);
            _.isDate(a).should.be.true;
            if (a) {
              _.isDate(a).should.be.true;
              return a;
            }
          }
          return value;
        }
        const mobilesObj = JSON.parse(mobiles[0].slice(958), dateTimeReviver);
        _.isObject(mobilesObj).should.be.true;
        if (mobilesObj.length === 0) {
          _.isInteger(mobilesObj.length).should.be.true;
          return Promise.reject('NO objects receieved').should.be.rejected;
        }
        return mobilesObj;
      })
      .then((jsonData) => {
        const data = jsonData;
        _.isObject(data).should.be.true;
        const newTimer = mobilesService.generateTimer(data).should.be.fulfilled;
        _.isObject(newTimer).should.be.true;
        return Promise.all([data, newTimer.should.be.fulfilled]).should.be.fulfilled;
      })
      .then((promises) => {
        const data = promises[0];
        _.isObject(data).should.be.true;
        const timer = promises[1];
        _.isObject(timer).should.be.true;
        Mobile.collection.insertMany(data, { ordered: false }, (err, mobiles) => {
          _.isObject(mobiles).should.be.true;
          if (!err || err.code === 11000) {
            _.isEqual(mobiles.insertedCount, mobiles.nInserted).should.be.true;
            const amtInsert = mobiles.insertedCount || mobiles.nInserted;
            _.isInteger(amtInsert).should.be.true;
            _.isInteger(data.length).should.be.true;
            _.isString(timer[0].message).should.be.true;
            // res.status(200).json({ rowsAdded: `${amtInsert} new objects were inserted for keyword out of ${data.length} grabbed objects.`, timerCreated: timer });
          } else {
            console.log('insertMany fail');
            // res.status(404).send(err);
          }
        });
      })
    );
  });
  describe('#exports.insertWinnerSMS', () => {
    let servicePromise;
    beforeEach(() => {
      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      servicePromise = () => mobilesService.findRunningRaffle('BRAVE3');
    });

    it('should work and return data', () => servicePromise()
      .then((mobiles) => {
        console.log('mobiles', mobiles);
        mobilesService.findRunningRaffle('BRAVE3').then(data => console.log('data', data));
      })
    );
  });
});

