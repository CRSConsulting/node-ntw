/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';
const Promise = require('bluebird');
const server = require('../server');
const mongoose = require('mongoose');
const _ = require('lodash');
const Message = require('../models/Message');

const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();
chai.use(require('chai-http'));

chai.use(chaiAsPromised);


describe('Message Controller **Update the DB before running these tests**', () => {
  describe('#ipController.checkIp, messageController.verifyEmail, tangoController.insertTango===> GET: /api/message/verify', () => {
    it('should return Error: Invalid Token', (done) => {
      chai.request(server)
        .get('/api/message/verify')
        .end((err, res) => {
          res.should.have.status(500);
          const error = res.text;
          const message = 'Invalid Token';
          _.isEqual(error, message).should.be.true;
          done();
        });
    });
    // This test is a reference to object #49 in token collection in ROBOMONGO
    it('should return Error: Invalid Token, #expiration date expired', (done) => {
      chai.request(server)
        .get('/api/message/verify')
        .query({ token: '0a1912f5-17da-4235-a30e-ffdff652fa8b' })
        .end((err, res) => {
          res.should.have.status(500);
          const error = res.text;
          const message = 'Invalid Token';
          _.isEqual(error, message).should.be.true;
          done();
        });
    });
    // This test is a reference to object #50 in token collection in ROBOMONGO, 
    it('should return turn token.isAuthenticated to true', (done) => {
      chai.request(server)
        .get('/api/message/verify')
        .query({ token: 'e4464c8f-1514-4bf9-95e0-3b9b88c01851' })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
//   describe('#tangoController.sendEmail===> POST: /api/message', () => {
//     it('should GET a tango by a given id', (done) => {
//       chai.request(server)
//         .post('/api/message')
//         .end((err, res) => {
//           res.should.have.status(500);
//           done();
//         });
//     });
//   });
});

