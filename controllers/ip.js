const Promise = require('bluebird');
const iplocation = Promise.promisifyAll(require('iplocation'));
const Token = require('../models/Token');
const tokenService = require('./token.services')({
  modelService: Token
});
const helpers = require('../helpers');

const notify = helpers.Notify;

exports.checkIp = (req, res, next) => {
  const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log('current IP address :', ip);
  // // MA IP
  // ip = '69.43.65.102';
  // // NY IP
  // ip = '72.229.28.185';
  // // FL IP
  // ip = '96.31.78.217';
  iplocation(`${ip}`)
    .then((data) => {
      console.log('data', data);
      console.log('data.region_name', data.region_name.trim());
      if (data.country_code.trim() !== 'US' || data.region_name.trim() === 'New York' || data.region_name.trim() === 'Florida') {
        tokenService.updateOne({ token_string: req.query.token }, { attempted: true }).then((token) => {
          if (token) {
            notify.moveToNextWinner(token, res);
          }
        });
        Promise.reject('Your request has come from an invalid location');
      }

      next();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

