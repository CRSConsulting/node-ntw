const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const Promise = require('bluebird');
const cmd = require('node-cmd');
const mobilesService = require('./mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});

const tangoController = require('./tango');

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});
const randy = require('randy');
const fetch = require('node-fetch');
// const moment = require('moment');

exports.getAll = (req, res) =>
  mobilesService.getAll()
    .then((mobiles) => {
      res.json(mobiles);
    })
    .catch((err) => {
      res.status(500).send(err);
    });


exports.getKeywordAndInsert = (req, res) =>
  getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":"${req.params.keyword}"}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
    .then((mobiles) => {
      const body = JSON.parse(mobiles[0].slice(958));
      const { id } = body;
      function delay(t) {
        return new Promise(((resolve) => {
          setTimeout(resolve, t);
        }));
      }
      return delay(60000).then(() => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`)).catch((err) => {
        res.status(404).send('err', err);
      });
    })
    .then((mobiles) => {
      function dateTimeReviver(key, value) {
        let a;
        if (key === 'transaction_date' || key === 'donation_date') {
          a = new Date(`${value} UTC`);
          if (a) {
            return a;
          }
        }
        return value;
      }
      return JSON.parse(mobiles[0].slice(958), dateTimeReviver);
    })
    .then((jsonData) => {
      const data = jsonData;
      const newTimer = mobilesService.generateTimer(data);
      return Promise.all([data, newTimer]);
    })
    .then((promises) => {
      const data = promises[0];
      const timer = promises[1];
      Mobile.collection.insertMany(data, { ordered: false }, (err, mobiles) => {
        if (!err || err.code === 11000) {
          const amtInsert = mobiles.insertedCount || mobiles.nInserted;
          res.status(200).json({ entryResponse: mobiles, rowsAdded: `${amtInsert} new objects were inserted for ${req.params.keyword} out of ${data.length} grabbed objects.`, timerCreated: timer });
        } else {
          res.status(404).send(err);
        }
      });
    })
    .catch((err) => {
      res.status(404).send(err);
    });

exports.insertWinnerSMS = (req, res) =>
  mobilesService.findRunningRaffle(req.params.keyword)
    .then((foundTime) => {
      if (foundTime) {
        return Promise.all([mobilesService.getRaffleContestants(foundTime), foundTime]);
      }
      return Promise.reject('No Raffles need to be drawn at this instance');
    })
    .then((promises) => {
      const mobiles = promises[0];
      const time = promises[1];
      if (mobiles.length > 0) {
        const raffleArr = mobilesService.addWeightToRaffle(mobiles);
        const shuffle = randy.shuffle(raffleArr);
        const winner = randy.choice(shuffle);
        time.used = true;
        mobilesService.raffleComplete(time);
        return winner;
      }
      return Promise.reject('No PARTICIPANTS IN RAFFLE. SOMETHING HAS GONE WRONG');
    })
    .then((mobiles) => {
      const winner = mobiles;
      const call = getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`);
      return Promise.all([call, winner]);
    })
    .then((mobiles) => {
      const winner = mobiles[1];
      const body = JSON.parse(mobiles[0][0].slice(867));
      const sessionToken = body.user.session_token;
      // console.log('sessionToken', sessionToken);
      // const phoneNumber = winner.phone;
      const phoneNumber = 6178204019;
      const message = 'Congrats you have won!';
      function delay(t) {
        return new Promise(((resolve) => {
          setTimeout(resolve, t);
        }));
      }
      return delay(Math.random() * 10000).then(() =>
        getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`))
        .then((mobiles) => {
          // console.log('===========================================================================================');
          const body = JSON.parse(mobiles[0].slice(970));
          console.log('insertWinnerSMS==========================', body);
          res.json(body);
        })
        .catch((err) => {
          res.status(404).send('err', err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.getRaffleWinner = (req, res) =>
  mobilesService.getAll()
    .then((mobiles) => {
      const raffleArr = mobiles.reduce((r, a) => {
        if (a.collected_amount !== null) {
          const currency = a.collected_amount;
          const number = Number(currency.replace(/[^0-9\.-]+/g, ''));
          const chances = 1 + Math.floor(number / 10);
          for (let i = 0; i < chances; i += 1) {
            r.push(a);
          }
        }
        return r;
      }
        , []);
      const shuffle = randy.shuffle(raffleArr);
      const winner = randy.choice(shuffle);
      res.json(winner);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.findWinnerIfAvailable = (req, res) => {
  mobilesService.findRunningRaffle(req.params.keyword)
    .then((foundTime) => {
      if (foundTime) {
        return Promise.all([mobilesService.getRaffleContestants(foundTime), foundTime]);
      }
      return Promise.reject('No Raffles need to be drawn at this instance');
    })
    .then((promises) => {
      const mobiles = promises[0];
      const time = promises[1];
      console.log(mobiles.length);
      if (mobiles.length > 0) {
        const raffleArr = mobiles.reduce(
          (r, a) => {
            if (a.collected_amount && a.collected_amount !== null) {
              const currency = a.collected_amount;
              const number = Number(currency.replace(/[^0-9.-]+/g, ''));
              const chances = 1 + Math.floor(number / 10);
              for (let i = 0; i < chances; i += 1) {
                r.push(a);
              }
            }
            return r;
          }
          , []
        );
        console.log(raffleArr.length);
        const shuffle = randy.shuffle(raffleArr);
        const winner = randy.choice(shuffle);
        time.used = true;
        mobilesService.raffleComplete(time);
        res.json(winner);
      } else {
        res.status(500).send({ msg: 'NO PARTICIPANTS IN RAFFLE ERROR' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.master = (req, res, key) =>
  fetch(`http://localhost:3000/api/mobile/keyword/${key}`)
    .then((resp) => {
      resp.json();
    })
    .then(json => fetch('http://localhost:3000/api/mobile/sms'))
    .then((resp) => { 
      tangoController.insertTango({ keyword: resp }, res); 
      return resp.json(); 
    })
    .catch((err) => {
      res.status(500).send(err);
    });
