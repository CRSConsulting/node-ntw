/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
// process.env.NODE_ENV = 'test';

const server = require('../server');
const Mobile = require('../models/Mobile');
// const User = require('../models/User');
const Timeframe = require('../models/Timeframe');
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

const randy = require('randy');
const fetch = require('node-fetch');

const _ = require('lodash');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();
chai.use(require('chai-http'));
chai.use(require('chai-json-schema'));

chai.use(chaiAsPromised);

const request = require('supertest');
const express = require('express');
// const app = express();

// create agent for tests
const agent = chai.request.agent(server);

const mongoose = require('mongoose');
// Our parent block
describe('Mobile Controller', () => {
  describe.only('#Promises', () => {
    let servicePromise;
    beforeEach(() => {
      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      servicePromise = () => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":499534}' "https://app.mobilecause.com/api/v2/reports/results.json?"`);
    });

    it('should work and return data', () => servicePromise()
      .then((mobiles) => {
        function dateTimeReviver(key, value) {
          let a;
          if (key === 'transaction_date' || key === 'donation_date') {
            a = new Date(`${value} UTC`);
            if (a) {
              return a;
            }
          }
          return value;
        }
        const mobilesObj = JSON.parse(mobiles[0].slice(958), dateTimeReviver);
        if (mobilesObj.length === 0) {
          return Promise.reject('NO objects receieved');
        }
        return mobilesObj;
      })
      .then((jsonData) => {
        const data = jsonData;
        _.isObject(data).should.be.true;
        console.log('data', data);
        const newTimer = mobilesService.generateTimer(data);
        console.log('newTimer is a empty OBJ for some reason', newTimer);
        _.isObject(newTimer).should.be.true;
        return Promise.all([data, newTimer]).should.be.fulfilled;
      })
      .then((promises) => {
        const data = promises[0];
        _.isObject(data).should.be.true;
        const timer = promises[1];
        _.isObject(timer).should.be.true;
        Mobile.collection.insertMany(data, { ordered: false }, (err, mobiles) => {
          console.log('Mobile.collection.insertMany', mobiles);
          if (!err || err.code === 11000) {
            const amtInsert = mobiles.insertedCount || mobiles.nInserted;
            console.log('amtInsert', amtInsert);
            console.log('data.length', data.length);
            console.log('timerCreated', timer);
            // res.status(200).json({ rowsAdded: `${amtInsert} new objects were inserted for keyword out of ${data.length} grabbed objects.`, timerCreated: timer });
          } else {
            console.log('insertMany fail');
            // res.status(404).send(err);
          }
        });
      })
    );
    // it('should work', () => {

    // });
  });

  describe('#as promised', () => {
    it('should work', () => Promise.resolve().should.be.fulfilled); // change fullfilled to rejected and it will fail
    it('should fail', () => Promise.reject().should.be.rejected); // change rejected to fullfilled and it will fail
    it('1 plus 1 should equal 2', () => {
      (1 + 1).should.equal(2);
    });
    it('1 plus 1 should equal 2 even if a Promise delivers it', () => Promise.resolve(1 + 1).should.eventually.equal(2));
  });

  describe('/GET api/mobile/keyword/:keyword', () => {
    it('should insert and return data', (done) => {
      const keyword = {
        id: 'MOLINE1'
      };
      agent.get(`/api/mobile/keyword/:${keyword.id}`)
        .send(keyword)
        .end((err, res) => {
          // console.log('res', res);
          if (err) {
            return done(err);
          }
          // res.should.have.status(200);
          res.should.be.a('object');
          done();
        });
    });
  });
});

