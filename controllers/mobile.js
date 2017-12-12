const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const Promise = require('bluebird');
const cmd = require('node-cmd');

const mobilesService = require('./mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile,
});

const Message = require('../models/Message');
const messageService = require('./message.services')({
  modelService: Message
});
const Winner = require('../models/Winner');
const winnersService = require('./winners.services')({
  modelService: Winner
});

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});
const randy = require('randy');
const fetch = require('node-fetch');

exports.getAll = (req, res) =>
  mobilesService.getAll()
    .then((mobiles) => {
      res.json(mobiles);
    })
    .catch((err) => {
      res.status(500).send(err);
    });


exports.getKeywordAndInsert = (req, res) =>
  getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":"${req.params.keyword}"}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
    .then((mobiles) => {
      // console.log('getKeywordAndInsert(), 1st then()');
      const body = JSON.parse(mobiles[0].slice(958));
      const { id } = body;
      function delay(t) {
        return new Promise(((resolve) => {
          setTimeout(resolve, t);
        }));
      }
      return delay(20000).then(() => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`)).catch((err) => {
        res.status(404).send('err', err);
      });
    })
    .then((mobiles) => {
      // console.log('getKeywordAndInsert(), 2nd then()');
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
      const mobilesObj = JSON.parse(mobiles[0].slice(958), dateTimeReviver);

      if (mobilesObj.length === 0) {
        return Promise.reject('NO objects receieved');
      }
      return mobilesObj;
    })
    .then((jsonData) => {
      // console.log('getKeywordAndInsert(), 3rd then()');
      const data = jsonData;
      const newTimer = mobilesService.generateTimer(data, req.params.keyword);
      return Promise.all([data, newTimer]);
    })
    .then((promises) => {
      // console.log('getKeywordAndInsert(), 4th then()');
      const data = promises[0];
      const timer = promises[1];
      Mobile.collection.insertMany(data, { ordered: false }, (err, mobiles) => {
        if (!err || err.code === 11000) {
          const amtInsert = mobiles.insertedCount || mobiles.nInserted;

          res.status(200).json({ rowsAdded: `${amtInsert} new objects were inserted for ${req.params.keyword} out of ${data.length} grabbed objects.`, timerCreated: timer });
        } else {
          res.status(404).send(err);
        }
      });
    })
    .catch((err) => {
      res.status(405).send(err);
    });

exports.insertWinnerSMS = (req, res) =>
  mobilesService.findRunningRaffle(req.params.keyword)
    .then((foundTime) => {
      // console.log('insertwinner 1st then()');
      if (foundTime) {
        const getRaffle = mobilesService.getRaffleContestants(foundTime);
        return Promise.all([getRaffle, foundTime]);
      }
      return Promise.reject('No Raffles need to be drawn at this instance');
    })
    .then((promises) => {
      // console.log('insertwinner 2nd then()');
      const mobiles = promises[0];
      const time = promises[1];
      if (mobiles.length > 0) {
        // console.log(`Selecting winner out of ${mobiles.length} contestants`);
        const raffleArr = mobilesService.addWeightToRaffle(mobiles);
        // console.log(`Weighted arr has ${raffleArr.length} contestants`);
        const winners = mobilesService.selectFiveWinners(raffleArr);
        mobilesService.raffleComplete(time);
        // console.log('insertWinnerSMS checking for selectFiveWinners :', winners);
        return winners;
      }
      return Promise.reject('No PARTICIPANTS IN RAFFLE. SOMETHING HAS GONE WRONG');
    })
    .then((mobiles) => {
      return winnersService.insert(mobiles);
    })
    .then((mobiles) => {
      // console.log('insertwinner third then()');
      const winner = mobiles;
      const call = getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`);
      return Promise.all([call, winner]);
    })
    .then((mobiles) => {
      // console.log('insertwinner 4th then()');
      const winners = mobiles[1];
      const firstPlace = winners.winners[0];
      console.log('firstPlace', firstPlace);
      const body = JSON.parse(mobiles[0][0].slice(867));
      const sessionToken = body.user.session_token;
      // const phoneNumber = firstPlace.phone;
      const phoneNumber = 6178204019;
      const message = 'Congrats you have won!';
      function delay(t) {
        return new Promise(((resolve) => {
          setTimeout(resolve, t);
        }));
      }
      const sendText = delay(Math.random() * 10000).then(() =>
        getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`))
        .catch((err) => {
          res.status(404).send('err', err);
        });
      const sendEmail = messageService.sendEmail(winners);
      return firstPlace;
    })
    .then((mobiles) => {
      res.json(mobiles);
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
      res.status(500).send(err);
    });
};
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

exports.master = (req, res) => {
  fetch(`http://localhost:3000/api/mobile/keyword/${req}`)
    .then(handleErrors)
    .then((res) => {
      res.json();
    })
    .then((json) => {
      return fetch(`http://localhost:3000/api/mobile/sms/${req}`);
    })
    .then(handleErrors)
    .catch((err) => {
      console.log('exports.master catch() :', err);
    });
};

