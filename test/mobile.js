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
    let testArr = [1,2,3,4,5,6,7,8,9,10];
    const mobiles = [];
    const t = 1;
    let tbool = false;
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
    it('should make array smaller each iteration', () => {
      let winnerArr = [];
      for (let i =1; i < 6; i++) {
        const shuffle = randy.shuffle(testArr);
        const winner = randy.choice(shuffle);
        winnerArr.push(winner);
        testArr = testArr.filter(x => x !== winner);
        (testArr.length).should.equal(10 - i);
      }
      winnerArr = [...new Set(winnerArr)];
      (winnerArr.length).should.equal(5);
    });
  });
  describe('test winner picker',() => {
    let mobiles = [{
      _id: '5a0a2729280b84915a0b0c55',
      shortcode: '41444',
      keyword: 'BRAVE3',
      type: 'Fundraising',
      volunteer_fundraiser: null,
      team: '',
      alternative_team_id: '',
      transaction_date: '2017-11-13T22:53:00.000Z',
      donation_date: 'Mon Nov 13 2017 14:53:00 GMT-0800 (PST)',
      collected_amount: '$0.00',
      pledged_amount: null,
      processing_fee: null,
      fee_rate: null,
      cc_type: null,
      last_4: null,
      phone: '11178204719',
      first_name: 'first',
      last_name: 'first',
      street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
      city: 'doisuhfodsbnfosfndslf',
      state: 'CA',
      zip: '90007',
      email: 'johasdadssadsad45555n1@crs-consulting.com',
      gender: null,
      billing_status: 'completed',
      billing_type: 'non-payment',
      donation: '33598519',
      transaction_id: '2017701',
      source: 'non_pay',
      form: 'No Purchase Necessary (General)',
      form_payment_type: 'non-payment',
      form_name: 'No Purchase Necessary',
      form_type: 'general',
      form_id: '64497',
      fulfillment_calls: '0',
      fulfillment_texts: '0',
      donation_notes: '',
      account: 'National Trust for Our Wounded',
      account_id: '7585',
      campaign_name: 'BRIDGESTONE ARENA',
      account_plan: 'Paid',
      account_plan_price: '$499.00',
      frequency: 'One Time',
      anonymous: 'No',
      billing_transaction: null,
      billing_transaction_reference: null,
      billing_response_code: null,
      parent_name: '',
      payment_gateway: null,
      veteran: null,
      i_am_a_veteran: null,
      related_to_a_veteran: null,
      veteran2: null,
      veteran_2: null,
      accept: null,
      info: null,
      vet_2: null,
      a: null,
      vet2: null,
      question_2_vet: null,
      question_2: null,
      createdAt: '2017-11-29T19:06:59.176Z'
    },
    {
      _id: '5a0a2729280b84915a0b0c56',
      shortcode: '41444',
      keyword: 'BRAVE3',
      type: 'Fundraising',
      volunteer_fundraiser: null,
      team: '',
      alternative_team_id: '',
      transaction_date: '2017-11-13T22:54:00.000Z',
      donation_date: 'Mon Nov 13 2017 14:53:00 GMT-0800 (PST)',
      collected_amount: '$0.00',
      pledged_amount: null,
      processing_fee: null,
      fee_rate: null,
      cc_type: null,
      last_4: null,
      phone: '12178344019',
      first_name: 'second',
      last_name: 'second',
      street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
      city: 'doisuhfodsbnfosfndslf',
      state: 'CA',
      zip: '90007',
      email: 'joh346fsdsddssdfn2@crs-consulting.com',
      gender: null,
      billing_status: 'completed',
      billing_type: 'non-payment',
      donation: '33598535',
      transaction_id: '2017707',
      source: 'non_pay',
      form: 'No Purchase Necessary (General)',
      form_payment_type: 'non-payment',
      form_name: 'No Purchase Necessary',
      form_type: 'general',
      form_id: '64497',
      fulfillment_calls: '0',
      fulfillment_texts: '0',
      donation_notes: '',
      account: 'National Trust for Our Wounded',
      account_id: '7585',
      campaign_name: 'BRIDGESTONE ARENA',
      account_plan: 'Paid',
      account_plan_price: '$499.00',
      frequency: 'One Time',
      anonymous: 'No',
      billing_transaction: null,
      billing_transaction_reference: null,
      billing_response_code: null,
      parent_name: '',
      payment_gateway: null,
      veteran: null,
      i_am_a_veteran: null,
      related_to_a_veteran: null,
      veteran2: null,
      veteran_2: null,
      accept: null,
      info: null,
      vet_2: null,
      a: null,
      vet2: null,
      question_2_vet: null,
      question_2: null,
      createdAt: '2017-11-29T19:06:59.177Z'
    },
    {
      _id: '5a0a2729280b84915a0b0c57',
      shortcode: '41444',
      keyword: 'BRAVE3',
      type: 'Fundraising',
      volunteer_fundraiser: null,
      team: '',
      alternative_team_id: '',
      transaction_date: '2017-11-13T22:56:00.000Z',
      donation_date: 'Mon Nov 13 2017 14:55:00 GMT-0800 (PST)',
      collected_amount: '$0.00',
      pledged_amount: null,
      processing_fee: null,
      fee_rate: null,
      cc_type: null,
      last_4: null,
      phone: '13178204019',
      first_name: 'thirdOne',
      last_name: 'thirdOne',
      street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
      city: 'doisuhfodsbnfosfndslf',
      state: 'CA',
      zip: '90007',
      email: 'john3dfggdfgdf@crs-consulting.com',
      gender: null,
      billing_status: 'completed',
      billing_type: 'non-payment',
      donation: '33598628',
      transaction_id: '2017711',
      source: 'non_pay',
      form: 'No Purchase Necessary (General)',
      form_payment_type: 'non-payment',
      form_name: 'No Purchase Necessary',
      form_type: 'general',
      form_id: '64497',
      fulfillment_calls: '0',
      fulfillment_texts: '0',
      donation_notes: '',
      account: 'National Trust for Our Wounded',
      account_id: '7585',
      campaign_name: 'BRIDGESTONE ARENA',
      account_plan: 'Paid',
      account_plan_price: '$499.00',
      frequency: 'One Time',
      anonymous: 'No',
      billing_transaction: null,
      billing_transaction_reference: null,
      billing_response_code: null,
      parent_name: '',
      payment_gateway: null,
      veteran: null,
      i_am_a_veteran: null,
      related_to_a_veteran: null,
      veteran2: null,
      veteran_2: null,
      accept: null,
      info: null,
      vet_2: null,
      a: null,
      vet2: null,
      question_2_vet: null,
      question_2: null,
      createdAt: '2017-11-29T19:06:59.177Z'
    },
    {
      _id: '5a0a2729280b84915a0b0c58',
      shortcode: '41444',
      keyword: 'BRAVE3',
      type: 'Fundraising',
      volunteer_fundraiser: null,
      team: '',
      alternative_team_id: '',
      transaction_date: '2017-11-13T22:56:00.000Z',
      donation_date: 'Mon Nov 13 2017 14:56:00 GMT-0800 (PST)',
      collected_amount: '$0.00',
      pledged_amount: null,
      processing_fee: null,
      fee_rate: null,
      cc_type: null,
      last_4: null,
      phone: '14178204049',
      first_name: 'fourthOne',
      last_name: 'fourthOne',
      street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
      city: 'doisuhfodsbnfosfndslf',
      state: 'CA',
      zip: '90007',
      email: 'john342432432324@crs-consulting.com',
      gender: null,
      billing_status: 'completed',
      billing_type: 'non-payment',
      donation: '33598698',
      transaction_id: '2017712',
      source: 'non_pay',
      form: 'No Purchase Necessary (General)',
      form_payment_type: 'non-payment',
      form_name: 'No Purchase Necessary',
      form_type: 'general',
      form_id: '64497',
      fulfillment_calls: '0',
      fulfillment_texts: '0',
      donation_notes: '',
      account: 'National Trust for Our Wounded',
      account_id: '7585',
      campaign_name: 'BRIDGESTONE ARENA',
      account_plan: 'Paid',
      account_plan_price: '$499.00',
      frequency: 'One Time',
      anonymous: 'No',
      billing_transaction: null,
      billing_transaction_reference: null,
      billing_response_code: null,
      parent_name: '',
      payment_gateway: null,
      veteran: null,
      i_am_a_veteran: null,
      related_to_a_veteran: null,
      veteran2: null,
      veteran_2: null,
      accept: null,
      info: null,
      vet_2: null,
      a: null,
      vet2: null,
      question_2_vet: null,
      question_2: null,
      createdAt: '2017-11-29T19:06:59.180Z'
    }];
    it('should give 4 winners', () => {
      const winnerArr = [];
      console.log(mobiles.length);
      for (let i = 0; i < 5; i++) {
        const shuffle = randy.shuffle(mobiles);
        const winner = randy.choice(shuffle);
        winnerArr.push({
          first_name: winner.first_name,
          last_name: winner.last_name,
          phone: winner.phone,
          email: winner.email
        });
        mobiles = mobiles.filter(x => x.email !== winner.email && x.phone !== winner.phone);
        console.log(mobiles);
        if (mobiles.length === 0) break;
      }
      (winnerArr.length).should.equal(4);
    });
  })
});
