const helpers = require('../helpers');

const calls = helpers.Calls;
const notify = helpers.Notify;

const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const Promise = require('bluebird');
// const cmd = require('node-cmd');

const mobilesService = require('./mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile,
});

const Message = require('../models/Message');
const messageService = require('./message.services')({
  modelService: Message
});


const Tango = require('../models/Tango');
const tangosService = require('./tangos.services')({
  modelService: Tango,
});

const Winner = require('../models/Winner');
const winnersService = require('./winners.services')({
  modelService: Winner
});

// const getAsync = Promise.promisify(cmd.get, {
//   multiArgs: true,
//   context: cmd,
// });
const randy = require('randy');
const fetch = require('node-fetch');
const moment = require('moment');

exports.getAll = (req, res) =>
  mobilesService.getAll()
    .then((mobiles) => {
      res.json(mobiles);
    })
    .catch((err) => {
      res.status(500).send(err);
    });


exports.getKeywordAndInsert = (req, res) =>
  calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":"${req.params.keyword}", "start_date": "${moment().format('MM/DD/YYYY')}"}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
    .then((mobiles) => {
      console.log('getKeywordAndInsert(), 1st then()');
      const body = JSON.parse(mobiles[0].slice(958));
      const { id } = body;
      return calls.delay(20000).then(() => calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`)).catch((err) => {
        res.status(404).send(err);
      });
    })
    .then((mobiles) => {
      console.log('getKeywordAndInsert(), 2nd then()');
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
      // console.log('JSONs RECEIVED', jsonData.length);
      // console.log('JSON for ', req.params.keyword);
      console.log('getKeywordAndInsert(), 3rd then()');
      const data = jsonData;
      const newTimer = mobilesService.generateTimer(data, req.params.keyword);
      return Promise.all([data, newTimer]);
    })
    .then((promises) => {
      console.log('getKeywordAndInsert(), 4th then()');
      const data = promises[0];
      const timer = promises[1];
      Mobile.collection.insertMany(data, { ordered: false }, (err, mobiles) => {
        if (!err || err.code === 11000) {
          const amtInsert = mobiles.insertedCount || mobiles.nInserted;
          res.status(200).json({ rowsAdded: `${amtInsert} new objects were inserted for ${req.params.keyword} out of ${data.length} grabbed objects.`, timerCreated: timer });
        } else {
          console.log('err insertMany', err);
          res.status(404).send(err);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(405).send(err);
    });

exports.insertWinnerSMS = (req, res) =>
  mobilesService.findRunningRaffle(req.params.keyword)
    .then((foundTime) => {
      console.log('insertwinner 1st then()');
      if (foundTime) {
        const getRaffle = mobilesService.getRaffleContestants(foundTime);
        return Promise.all([getRaffle, foundTime]);
      }
      return Promise.reject('No Raffles need to be drawn at this instance');
    })
    .then((promises) => {
      console.log('insertwinner 2nd then()');
      const mobiles = promises[0];
      const time = promises[1];
      if (mobiles.length > 0) {
        console.log(`Selecting winner out of ${mobiles.length} contestants`);
        const raffleArr = mobilesService.addWeightToRaffle(mobiles);
        console.log(`Weighted arr has ${raffleArr.length} contestants`);
        const winners = mobilesService.selectFiveWinners(raffleArr);
        mobilesService.raffleComplete(time);
        const tangoData = tangosService.getOne({ keyword: mobiles[0].keyword });
        console.log('insertWinnerSMS checking for selectFiveWinners :', winners);
        return Promise.all([tangoData, winners]);
      }
      return Promise.reject('No PARTICIPANTS IN RAFFLE. SOMETHING HAS GONE WRONG');
    })
    .then((mobiles) => {
      console.log('insertwinner 3rd then()');
      const tangoData = mobiles[0];
      const winners = mobiles[1];
      console.log(mobiles);
      const winner = {
        winners,
        prize: tangoData.prize,
        giftId: tangoData.giftId,
        winnerIndex: 0
      };
      return winnersService.insert(winner);
    })
    .then((mobiles) => {
      console.log('insertwinner 4th then()');
      const winners = mobiles;
      const call = notify.getSessionToken();
      return Promise.all([call, winners]);
    })
    .then(mobiles => notify.sendUserMessages(mobiles[0], mobiles[1], res))
    .then((mobiles) => {
      console.log('insertwinner 6th then()');
      res.json(mobiles);
    })
    .catch((err) => {
      console.log('err', err);
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
        console.log(`Running raffle out of ${mobiles.length} contestants`);
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
    .then(json => fetch(`http://localhost:3000/api/mobile/sms/${req}`))
    .then(handleErrors)
    .catch((err) => {
      console.log('exports.master catch() :', err);
    });
};

