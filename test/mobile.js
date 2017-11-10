/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';

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

// Our parent block
describe('Mobile Controller', () => {
  describe.only('#Promises', () => {
    let servicePromise;
    let result;
    let mobilesObj;
    beforeEach(() => {
      servicePromise = () => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":"BRAVE3"}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`);
    });

    it('should be an Object', () => {
      const result = servicePromise();
      _.isObject(result).should.be.true;
    });
    // it('should work', () => servicePromise());
    it('should work and return data', () => servicePromise()
      .then((mobiles) => {
        const body = JSON.parse(mobiles[0].slice(958));
        const { id } = body;
        (body.id).should.equal(id);
        result = () => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`);
        _.isObject(result).should.be.true;
      }));
    it('should take 20000ms', (done) => {
      result();
      setTimeout(done, 20000);
    });
    it('should work and return mobilesObj', () => result()
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
        mobilesObj = JSON.parse(mobiles[0].slice(958), dateTimeReviver);
        if (mobilesObj.length === 0) {
          (mobilesObj.length).should.equal(0);
          return Promise.reject('NO objects receieved');
        }
        _.isObject(mobilesObj).should.be.true;
        return mobilesObj;
      }));
  });

  describe('#as promised', () => {
    it('should work', () => Promise.resolve().should.be.fulfilled); // change fullfilled to rejected and it will fail
    it('should fail', () => Promise.reject().should.be.rejected); // change rejected to fullfilled and it will fail
    it('1 plus 1 should equal 2', () => {
      (1 + 1).should.equal(2);
    });
    it('1 plus 1 should equal 2 even if a Promise delivers it', () => Promise.resolve(1 + 1).should.eventually.equal(2));
  });
});

