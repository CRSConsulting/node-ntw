/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';
const Promise = require('bluebird');
const server = require('../server');
const mongoose = require('mongoose');
const _ = require('lodash');
const Client = require('node-rest-client').Client;
const Message = require('../models/Message');

const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
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
    it('should return Error: Invalid Token, #expiration date expired', (done) => {
      chai.request(server)
        .get('/api/message/verify')
        .query({ token: '3ee039d8-14ba-44f0-998f-3375dc35f8d4' })
        .end((err, res) => {
          res.should.have.status(500);
          const error = res.text;
          const message = 'Invalid Token';
          _.isEqual(error, message).should.be.true;
          done();
        });
    });
    it('should return turn token.isAuthenticated to true', (done) => {
      chai.request(server)
        .get('/api/message/verify')
        .query({ token: '94967d37-9d9a-4b51-bb98-63949e36499a' })
        .end((err, res) => {
        //   console.log('res===', res);
          res.should.have.status(404);
          //   const error = res.error;
          //   console.log('error', error);
          //   const message = 'Invalid Token';
          //   _.isEqual(error, message).should.be.true;
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

