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
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();

const request = require('supertest');
const express = require('express');
// const app = express();

// create agent for tests
const braveJSON = require('../brave.json');
const mongoose = require('mongoose');
// Our parent block
describe('Mobile Controller', () => {
  // function dateTimeReviver(key, value) {
  //   let a;
  //   if (key === 'transaction_date' || key === 'donation_date') {
  //     a = new Date(`${value} UTC`);
  //     if (a) {
  //       return a;
  //     }
  //   }
  //   return value;
  // }
  // describe('test Raffle', () => {
  //   it('should generate timer', () => {
  //     console.time('forLength');
  //     const uniqueKeys = [...new Set(braveJSON.map(item => // get list of keyword variants (e.g. BRAVE1, BRAVE2, etc..)
  //       item.keyword
  //     ))];
  //     for (let i = 0; i < uniqueKeys.length; i += 1) { // loop through all keyword variants to find if any have enough to create timer
  //       const specKeys = braveJSON.filter(mobile => // Get subsect of objects with specific keyword variant
  //         mobile.keyword === uniqueKeys[i]
  //       );
  //       if (specKeys.length >= 20) {
  //         console.timeEnd('forLength');
  //         return;
  //       }
  //     }
  //   });
  //   it('should generate timer reduction', () => {
  //     console.time('reduceLength');
  //     const redArr = [];
  //     for (let i = 0; i < braveJSON.length; i += 1) {
  //       const obj = braveJSON[i];
  //       if (redArr[obj.keyword]) {
  //         redArr[obj.keyword].push(obj);
  //         if (redArr[obj.keyword].length >= 20) {
  //           console.timeEnd('reduceLength');
  //           return;
  //         }
  //       } else {
  //         redArr[obj.keyword] = [obj];
  //       }
  //     }
  //   });
  //   it('should display user weighting', (done) => {
  //     console.time('individuals');
  //     Mobile.find({ donation_date: { $lte: new Date()}, keyword: 'BRAVE2' })
  //       .then((mobiles) => {
  //         return mobilesService.addWeightToRaffle(mobiles);
  //       })
  //       .then((mobiles) => {
  //         const individuals = mobiles.reduce(
  //           (r, a) => {
  //             if (a.email == '') {
  //               console.log(a);
  //             }
  //             if (r[a.email]) {
  //               r[a.email] += 1;
  //             } else {
  //               r[a.email] = 1;
  //             }
  //             return r;
  //           }
  //           , []
  //         );
  //         console.log(individuals);
  //         console.timeEnd('individuals');
  //         done();
  //       });
  //   });
  // });
  describe('modify mobiles', () => {
    const mobiles = [];
    before((done) => {
      mobilesService.getPreChangeMobiles().then((obj) => { 
        _.forEach(obj, a => mobiles.push(a.toJSON()));
        done(); 
      });
    });
    it('should return objects with 62 keys from the database', () => {
      _.forEach(mobiles, (a) => {
        (a).should.be.an('object');
        (Object.keys(a).length).should.equal(62);
      });
      (mobiles).should.be.an('array');
      // (mobiles).should.deep.include({ keyword: 'BRAVE1' }); 
    });
    it('should strip objects down to 20 keys',() => {
      const newMobiles = mobilesService.removeUnnecessaryFields(mobiles);
      _.forEach(newMobiles, (a) => {
        (a).should.be.an('object');
        (Object.keys(a).length).should.equal(20);
      });
    });
  });
});
