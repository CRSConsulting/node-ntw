process.env.NODE_ENV = 'test';

const chai = require('chai');

chai.should();
const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const mobilesService = require('../controllers/mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});
const { getWeather } = require('../controllers/getWeather.js');
const sinon = require('sinon');
const request = require('request');
const mongoose = require('mongoose');
const _ = require('lodash');

describe.only('mobileService', () => {
  describe('#getAll', () => {
    it('should return a list of data', (done) => {
      mobilesService.getAll()
        .then((result) => {
          _.isArray(result);
          done();
        })
        .catch(done);
    });
  });
  describe('#findExistingRaffle', () => {
    it('should return a list of data', (done) => {
      mobilesService.findExistingRaffle('BRAVE')
        .then((result) => {
          _.isArray(result);
          _.isEqual('BRAVE', result.keyword);
          done();
        })
        .catch(done);
    });
  });
  describe('#generateTimer', () => {
    it('should return a Error Message: Not Enough to Start', (done) => {
      const data = [{ shortcode: '41444',
        keyword: 'BRAVE5',
        type: 'Fundraising',
        transaction_date: '2017-11-12T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        collected_amount: '$0.00',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        gender: null,
        billing_status: 'completed',
        billing_type: 'non-payment',
        donation: '33468533',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }];

      mobilesService.generateTimer(data, 'BRAVE')
        .then((result) => {
          console.log('result', result);
          const error = result[0].message;
          const message = 'Not Enough To Start';
          _.isString(error).should.be.true;
          _.isEqual(error, message).should.be.true;
          done();
        })
        .catch(done);
    });
  });
  describe('#generateTimer', () => {
    it('should return a newTimer', (done) => {
      const data = [{ shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }];

      mobilesService.generateTimer(data, 'BRAVE')
        .then((result) => {
          _.isObject(result).should.be.true;
          done();
        })
        .catch(done);
    });
  });
  describe('#generateTimer', () => {
    it('should return a Error Message: Endtime already set', (done) => {
      const data = [{ shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }, { shortcode: '41444',
        keyword: 'BRAVE3',
        transaction_date: '2017-11-14T14:00:00.000Z',
        donation_date: '2017-11-10T22:35:00.000Z',
        phone: '12225559999',
        first_name: 'Fian',
        last_name: 'Lian',
        street_address: '8 Street',
        city: 'Ridge',
        state: 'CA',
        zip: '90027',
        email: 'mil@mail.com',
        transaction_id: '2008537',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00'
      }];

      mobilesService.generateTimer(data, 'BRAVE')
        .then((result) => {
          const error = result[0].message;
          const message = 'Endtime already set';
          _.isString(error).should.be.true;
          _.isEqual(error, message).should.be.true;
          done();
        })
        .catch(done);
    });
  });
});
