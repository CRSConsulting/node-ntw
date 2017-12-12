const Promise = require('bluebird');
const iplocation = Promise.promisifyAll(require('iplocation'));


exports.checkIp = (req, res, next) => {
  let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  // MA IP
  ip = '69.43.65.102';
  // // NY IP
  // ip = '72.229.28.185';
  // // FL IP
  // ip = '96.31.78.217';
  iplocation(`${ip}`)
    .then((data) => {
      if (data.country_code.trim() !== 'US') { return res.render('pages/ip-error'); }
      if (data.region_name.trim() === 'New York') {
        return Promise.reject('New York is a invalid state');
      }
      if (data.region_name.trim() === 'Florida') {
        return Promise.reject('Florida is a invalid state');
      }
      next();
    })
    .catch((err) => {
      res.status(404).send(err);
    });
  // .catch(err => new Error(err))
};

