/* global it, describe, beforeEach, before */
// During the test the env variable is set to test

// Mocha wants DONE to be a synchronous callback, return as a promise
process.env.NODE_ENV = 'test';
const Promise = require('bluebird');
const server = require('../server');
const mongoose = require('mongoose');
const _ = require('lodash');
const Client = require('node-rest-client').Client;
const Tango = require('../models/Tango');

const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect();
const should = chai.should();
chai.use(require('chai-http'));

chai.use(chaiAsPromised);


describe('Tango Controller', () => {
  describe('#tangoController.getAll===> GET: /api/tango', () => {
    it('should GET all the tango', (done) => {
      chai.request(server)
        .get('/api/tango')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.should.have.be.a('Array');
          done();
        });
    });
  });
  describe('#tangoController.getOne===> GET: /api/tango/:id', () => {
    it('should GET a tango by a given id', (done) => {
      const tango = new Tango({
        keyword: 'BRAVE1',
        venue: 'BRIDGESTONE ARENA',
        prize: 500,
        giftId: 'U666425'
      });
      tango.save()
        .then((tango) => {
          chai.request(server)
            .get(`/api/tango/${tango.keyword}`)
            .end((err, res) => {
              if (err) done(err);
              res.should.have.status(200);
              res.body.should.have.property('keyword', tango.keyword);
              done();
            });
        })
        .catch(error => done(error));
    });
  });
});

