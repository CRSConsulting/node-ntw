// /* global it, describe, beforeEach, before */
// // During the test the env variable is set to test

// // Mocha wants DONE to be a synchronous callback, return as a promise
// // process.env.NODE_ENV = 'test';

// const server = require('../server');
// // const User = require('../models/User');
// const Promise = require('bluebird');
// const cmd = require('node-cmd');
// const zip = require('zippity-do-dah');
// const tokenModel = require('../models/Token');
// const tokenService = require('../controllers/token.services')({
//   modelService: tokenModel
// });


// const tangoController = require('../controllers/tango');

// const getAsync = Promise.promisify(cmd.get, {
//   multiArgs: true,
//   context: cmd,
// });

// const randy = require('randy');
// const fetch = require('node-fetch');

// const _ = require('lodash');
// const chai = require('chai');

// const expect = chai.expect();
// const should = chai.should();

// const request = require('supertest');
// const express = require('express');
// // const app = express();

// // create agent for tests
// const mongoose = require('mongoose');
// // Our parent block
// describe('Token Service', () => {
//   // function dateTimeReviver(key, value) {
//   //   let a;
//   //   if (key === 'transaction_date' || key === 'donation_date') {
//   //     a = new Date(`${value} UTC`);
//   //     if (a) {
//   //       return a;
//   //     }
//   //   }
//   //   return value;
//   // }
//   // describe('test Raffle', () => {
//   //   it('should generate timer', () => {
//   //     console.time('forLength');
//   //     const uniqueKeys = [...new Set(braveJSON.map(item => // get list of keyword variants (e.g. BRAVE1, BRAVE2, etc..)
//   //       item.keyword
//   //     ))];
//   //     for (let i = 0; i < uniqueKeys.length; i += 1) { // loop through all keyword variants to find if any have enough to create timer
//   //       const specKeys = braveJSON.filter(mobile => // Get subsect of objects with specific keyword variant
//   //         mobile.keyword === uniqueKeys[i]
//   //       );
//   //       if (specKeys.length >= 20) {
//   //         console.timeEnd('forLength');
//   //         return;
//   //       }
//   //     }
//   //   });
//   //   it('should generate timer reduction', () => {
//   //     console.time('reduceLength');
//   //     const redArr = [];
//   //     for (let i = 0; i < braveJSON.length; i += 1) {
//   //       const obj = braveJSON[i];
//   //       if (redArr[obj.keyword]) {
//   //         redArr[obj.keyword].push(obj);
//   //         if (redArr[obj.keyword].length >= 20) {
//   //           console.timeEnd('reduceLength');
//   //           return;
//   //         }
//   //       } else {
//   //         redArr[obj.keyword] = [obj];
//   //       }
//   //     }
//   //   });
//   //   it('should display user weighting', (done) => {
//   //     console.time('individuals');
//   //     Mobile.find({ donation_date: { $lte: new Date()}, keyword: 'BRAVE2' })
//   //       .then((mobiles) => {
//   //         return mobilesService.addWeightToRaffle(mobiles);
//   //       })
//   //       .then((mobiles) => {
//   //         const individuals = mobiles.reduce(
//   //           (r, a) => {
//   //             if (a.email == '') {
//   //               console.log(a);
//   //             }
//   //             if (r[a.email]) {
//   //               r[a.email] += 1;
//   //             } else {
//   //               r[a.email] = 1;
//   //             }
//   //             return r;
//   //           }
//   //           , []
//   //         );
//   //         console.log(individuals);
//   //         console.timeEnd('individuals');
//   //         done();
//   //       });
//   //   });
//   // });
//   describe('grab subdocument', () => {
//     let useToken;
//     before((done) => {
//       tokenService.getOne({ email: 'fishjim2@ail.com' })
//         .then((token) => {
//           useToken = token;
//           done();
//         });
//     });
//     it('should get token from Before statement', () => {
//       (useToken.email).should.equal('fishjim2@ail.com');
//     });
//     it('should find token by ID', (done) => {
//       tokenService.getOne({ _id: useToken._id })
//         .then((token) => {
//           (token.email).should.equal('fishjim2@ail.com');
//           done();
//         });
//     });
//     it('should update Token by ID', (done) => {
//       tokenService.updateOne({ _id: useToken._id }, { attempted: true })
//         .then((token) => {
//           (token.attempted).should.equal(true);
//           done();
//         });
//     });
//   });
//   it('should get a token', (done) => {
//     tokenService.getOne({ email: 'fishjim2@ail.com' })
//       .then((token) => {
//         (token.attempted).should.equal(false);
//         (token.token_string).should.equal('061ea228-58df-4436-91bc-789798d6d451');
//         done();
//       });
//   });
// });
