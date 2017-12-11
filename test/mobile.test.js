/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';

const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const Promise = require('bluebird');
const server = require('../server');
const mongoose = require('mongoose');
const randy = require('randy');
const _ = require('lodash');
const cmd = require('node-cmd');

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});
const mobilesService = require('../controllers/mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile,
});

const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();
chai.use(chaiAsPromised);


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
            _.isError(Error);
          }
        });
      })
    );
  });
  describe('#exports.insertWinnerSMS', () => {
    let mobileCause;
    beforeEach(() => {
      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      mobileCause = () => new Promise((resolve, reject) => {
        const foundTime = { _id: '5a0153ff5a581a79820c67a1',
          keyword: 'BRAVE3',
          startTime: '2017-11-13T14:00:00.000Z',
          used: false,
          __v: 0,
          endTime: '2017-11-13T23:11:00.000Z' };
        return resolve(foundTime);
      });
    });

    it('should send winner a text message ', () => mobileCause()
      .then((foundTime) => {
        if (foundTime) {
          _.isObject(foundTime).should.be.true;
          const test = mobilesService.getRaffleContestants(foundTime).should.be.fulfilled;
          return Promise.all([test, foundTime]).should.be.fulfilled;
        }
        return Promise.reject('No Raffles need to be drawn at this instance');
      })
      .then((promises) => {
        const mobiles = promises[0];
        _.isObject(mobiles).should.be.true;
        const time = promises[1];
        _.isObject(time).should.be.true;
        if (mobiles.length > 0) {
          const raffleArr = mobilesService.addWeightToRaffle(mobiles);
          _.isObject(raffleArr).should.be.true;
          const shuffle = randy.shuffle(raffleArr);
          _.isObject(shuffle).should.be.true;
          const winner = randy.choice(shuffle);
          _.isObject(winner).should.be.true;
          time.used = true;
          mobilesService.raffleComplete(time).should.be.fulfilled;
          return winner;
        }
        return Promise.reject('No PARTICIPANTS IN RAFFLE. SOMETHING HAS GONE WRONG').should.be.rejected;
      })
      .then((mobiles) => {
        const winner = mobiles;
        _.isObject(winner).should.be.true;
        const call = getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`).should.be.fulfilled;
        return Promise.all([call, winner]).should.be.fulfilled;
      })
      .then((mobiles) => {
        const winner = mobiles[1];
        _.isObject(winner).should.be.true;
        const body = JSON.parse(mobiles[0][0].slice(867));
        _.isObject(winner).should.be.true;
        const sessionToken = body.user.session_token;
        _.isString(sessionToken);
        const phoneNumber = winner.phone;
        _.isString(phoneNumber);
        const message = 'Congrats you have won!';
        _.isString(message);
        function delay(t) {
          return new Promise(((resolve) => {
            setTimeout(resolve, t);
          }));
        }
        return delay(Math.random() * 10000).then(() =>
          getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`)).should.be.fulfilled;
        // .then((mobiles) => {
        //   // return tangoController.insertTango([winner, winner.keyword], res).should.be.fulfilled;
        // });
      })
    );
  });
});

describe('Mobile Controller API URL Testing', () => {
  describe('#mobileController.getAll===> GET: /api/mobile', () => {
    it('should GET all the mobile', (done) => {
      chai.request(server)
        .get('/api/mobile')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.be.a('Array');
          done();
        });
    }).timeout(10000);
  });
  describe('#mobileController.getKeywordAndInsert===> GET: /api/mobile/keyword/:keyword', () => {
    it('should GET keyword, insert into db', (done) => {
      chai.request(server)
        .get('/api/mobile/keyword/BRAVE')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.be.a('object');
          done();
        });
    }).timeout(120000);
  });
  describe('#mobileController.insertWinnerSMS===> GET: /api/mobile/sms/:keyword', () => {
    it('should return Error: No Raffles need to be drawn at this instance', (done) => {
      chai.request(server)
        .get('/api/mobile/sms/BRAVE')
        .end((err, res) => {
          res.should.have.status(500);
          const error = res.text;
          const message = 'No Raffles need to be drawn at this instance';
          _.isEqual(error, message).should.be.true;
          done();
        });
    }).timeout(10000);
  });
  describe('#mobileController.findWinnerIfAvailable===> GET: /api/mobile/raffle/:keyword', () => {
    it('should return Error: No Raffles need to be drawn at this instance', (done) => {
      chai.request(server)
        .get('/api/mobile/raffle/BRAVE')
        .end((err, res) => {
          res.should.have.status(500);
          const error = res.text;
          const message = 'No Raffles need to be drawn at this instance';
          _.isEqual(error, message).should.be.true;
          done();
        });
    }).timeout(5000);
  });
  // describe('#mobileController.master', () => {
  //   it('should GET all the mobile', (done) => {
  //     chai.request(server)
  //       .get('/api/mobile/master')
  //       .end((err, res) => {
  //         console.log('===', res.text);
  //         if (err) done(err);
  //         res.should.have.status(200);
  //         res.body.should.have.be.a('Array');
  //         done();
  //       });
  //   }).timeout(80000);
  // });
});
