const Promise = require('bluebird');
const iplocation = Promise.promisifyAll(require('iplocation'));
const Token = require('../models/Token');
const tokenService = require('./token.services')({
  modelService: Token
});
const helpers = require('../helpers');

const notify = helpers.Notify;


// exports.checkIp = (req, res, next) => {
//   let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
//   // MA IP
//   ip = '69.43.65.102';
//   // // NY IP
//   // ip = '72.229.28.185';
//   // // FL IP
//   // ip = '96.31.78.217';
//   iplocation(`${ip}`)
//     .then((data) => {
//       if (data.country_code.trim() !== 'US') { return res.render('pages/ip-error'); }
//       if (data.region_name.trim() === 'New York') {
//         return Promise.reject('New York is a invalid state');
//       }
//       if (data.region_name.trim() === 'Florida') {
//         return Promise.reject('Florida is a invalid state');
//       }
//       next();
//     })
//     .catch((err) => {
//       res.status(404).send(err);
//     });
//   // .catch(err => new Error(err))
// };

exports.checkIp = (req, res, next) => {
  // const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  // console.log('current IP address :', ip);
  // MA IP
  const ip = '69.43.65.102';
  // // NY IP
  // const ip = '72.229.28.185';
  // // FL IP
  // ip = '96.31.78.217';
  // console.log('ip', ip);
  iplocation(`${ip}`)
    .then((data) => {
      if (data.country_code.length === 0 || data.country_code.trim() !== 'US' || data.region_name.trim() === 'New York' || data.region_name.trim() === 'Florida') {
        tokenService.updateOne({ token_string: req.query.token }, { attempted: true })
          .then((token) => {
            if (token) {
              notify.moveToNextWinner(token, res);
            }
          })
          .then(() => {
            res.render('pages/ip-error');
          });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

