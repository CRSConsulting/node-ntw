const Mobile = require('../models/Mobile');
const Timeframe = require('../models/Timeframe');
const Promise = require('bluebird');
const cmd = require('node-cmd');
const mobilesService = require('./mobiles.services')({
  timeService: Timeframe,
  modelService: Mobile, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});

const Token = require('../models/Token');
const tokenService = require('./token.services')({
  modelService: Token
});

const tangoController = require('./tango');

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
const zipcode = require('zipcode');
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
          console.log('err insertMany', err);
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
        const test = mobilesService.getRaffleContestants(foundTime);
        return Promise.all([test, foundTime]);
      }
      return Promise.reject('No Raffles need to be drawn at this instance');
    })
    .then((promises) => {
      // console.log('insertwinner 2nd then()');
      // const mobiles = promises[0];
      const mobiles = [{ _id: '5a0a2729280b84915a0b0c55',
        shortcode: '41444',
        keyword: 'BRAVE3',
        type: 'Fundraising',
        volunteer_fundraiser: null,
        team: '',
        alternative_team_id: '',
        transaction_date: '2017-11-13T22:53:00.000Z',
        donation_date: 'Mon Nov 13 2017 14:53:00 GMT-0800 (PST)',
        collected_amount: '$0.00',
        pledged_amount: null,
        processing_fee: null,
        fee_rate: null,
        cc_type: null,
        last_4: null,
        phone: '11178204719',
        first_name: 'first',
        last_name: 'first',
        street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
        city: 'doisuhfodsbnfosfndslf',
        state: 'CA',
        zip: '90007',
        email: 'johasdadssadsad45555n1@crs-consulting.com',
        gender: null,
        billing_status: 'completed',
        billing_type: 'non-payment',
        donation: '33598519',
        transaction_id: '2017701',
        source: 'non_pay',
        form: 'No Purchase Necessary (General)',
        form_payment_type: 'non-payment',
        form_name: 'No Purchase Necessary',
        form_type: 'general',
        form_id: '64497',
        fulfillment_calls: '0',
        fulfillment_texts: '0',
        donation_notes: '',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00',
        frequency: 'One Time',
        anonymous: 'No',
        billing_transaction: null,
        billing_transaction_reference: null,
        billing_response_code: null,
        parent_name: '',
        payment_gateway: null,
        veteran: null,
        i_am_a_veteran: null,
        related_to_a_veteran: null,
        veteran2: null,
        veteran_2: null,
        accept: null,
        info: null,
        vet_2: null,
        a: null,
        vet2: null,
        question_2_vet: null,
        question_2: null,
        createdAt: '2017-11-29T19:06:59.176Z' },
      { _id: '5a0a2729280b84915a0b0c56',
        shortcode: '41444',
        keyword: 'BRAVE3',
        type: 'Fundraising',
        volunteer_fundraiser: null,
        team: '',
        alternative_team_id: '',
        transaction_date: '2017-11-13T22:54:00.000Z',
        donation_date: 'Mon Nov 13 2017 14:53:00 GMT-0800 (PST)',
        collected_amount: '$0.00',
        pledged_amount: null,
        processing_fee: null,
        fee_rate: null,
        cc_type: null,
        last_4: null,
        phone: '12178344019',
        first_name: 'second',
        last_name: 'second',
        street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
        city: 'doisuhfodsbnfosfndslf',
        state: 'CA',
        zip: '90007',
        email: 'joh346fsdsddssdfn2@crs-consulting.com',
        gender: null,
        billing_status: 'completed',
        billing_type: 'non-payment',
        donation: '33598535',
        transaction_id: '2017707',
        source: 'non_pay',
        form: 'No Purchase Necessary (General)',
        form_payment_type: 'non-payment',
        form_name: 'No Purchase Necessary',
        form_type: 'general',
        form_id: '64497',
        fulfillment_calls: '0',
        fulfillment_texts: '0',
        donation_notes: '',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00',
        frequency: 'One Time',
        anonymous: 'No',
        billing_transaction: null,
        billing_transaction_reference: null,
        billing_response_code: null,
        parent_name: '',
        payment_gateway: null,
        veteran: null,
        i_am_a_veteran: null,
        related_to_a_veteran: null,
        veteran2: null,
        veteran_2: null,
        accept: null,
        info: null,
        vet_2: null,
        a: null,
        vet2: null,
        question_2_vet: null,
        question_2: null,
        createdAt: '2017-11-29T19:06:59.177Z' },
      { _id: '5a0a2729280b84915a0b0c57',
        shortcode: '41444',
        keyword: 'BRAVE3',
        type: 'Fundraising',
        volunteer_fundraiser: null,
        team: '',
        alternative_team_id: '',
        transaction_date: '2017-11-13T22:56:00.000Z',
        donation_date: 'Mon Nov 13 2017 14:55:00 GMT-0800 (PST)',
        collected_amount: '$0.00',
        pledged_amount: null,
        processing_fee: null,
        fee_rate: null,
        cc_type: null,
        last_4: null,
        phone: '13178204019',
        first_name: 'thirdOne',
        last_name: 'thirdOne',
        street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
        city: 'doisuhfodsbnfosfndslf',
        state: 'CA',
        zip: '90007',
        email: 'john3dfggdfgdf@crs-consulting.com',
        gender: null,
        billing_status: 'completed',
        billing_type: 'non-payment',
        donation: '33598628',
        transaction_id: '2017711',
        source: 'non_pay',
        form: 'No Purchase Necessary (General)',
        form_payment_type: 'non-payment',
        form_name: 'No Purchase Necessary',
        form_type: 'general',
        form_id: '64497',
        fulfillment_calls: '0',
        fulfillment_texts: '0',
        donation_notes: '',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00',
        frequency: 'One Time',
        anonymous: 'No',
        billing_transaction: null,
        billing_transaction_reference: null,
        billing_response_code: null,
        parent_name: '',
        payment_gateway: null,
        veteran: null,
        i_am_a_veteran: null,
        related_to_a_veteran: null,
        veteran2: null,
        veteran_2: null,
        accept: null,
        info: null,
        vet_2: null,
        a: null,
        vet2: null,
        question_2_vet: null,
        question_2: null,
        createdAt: '2017-11-29T19:06:59.177Z' },
      { _id: '5a0a2729280b84915a0b0c58',
        shortcode: '41444',
        keyword: 'BRAVE3',
        type: 'Fundraising',
        volunteer_fundraiser: null,
        team: '',
        alternative_team_id: '',
        transaction_date: '2017-11-13T22:56:00.000Z',
        donation_date: 'Mon Nov 13 2017 14:56:00 GMT-0800 (PST)',
        collected_amount: '$0.00',
        pledged_amount: null,
        processing_fee: null,
        fee_rate: null,
        cc_type: null,
        last_4: null,
        phone: '14178204049',
        first_name: 'fourthOne',
        last_name: 'fourthOne',
        street_address: '!9-08rerewfndslkfdklsnfklsdnfklsdflkndslkfn',
        city: 'doisuhfodsbnfosfndslf',
        state: 'CA',
        zip: '90007',
        email: 'john342432432324@crs-consulting.com',
        gender: null,
        billing_status: 'completed',
        billing_type: 'non-payment',
        donation: '33598698',
        transaction_id: '2017712',
        source: 'non_pay',
        form: 'No Purchase Necessary (General)',
        form_payment_type: 'non-payment',
        form_name: 'No Purchase Necessary',
        form_type: 'general',
        form_id: '64497',
        fulfillment_calls: '0',
        fulfillment_texts: '0',
        donation_notes: '',
        account: 'National Trust for Our Wounded',
        account_id: '7585',
        campaign_name: 'BRIDGESTONE ARENA',
        account_plan: 'Paid',
        account_plan_price: '$499.00',
        frequency: 'One Time',
        anonymous: 'No',
        billing_transaction: null,
        billing_transaction_reference: null,
        billing_response_code: null,
        parent_name: '',
        payment_gateway: null,
        veteran: null,
        i_am_a_veteran: null,
        related_to_a_veteran: null,
        veteran2: null,
        veteran_2: null,
        accept: null,
        info: null,
        vet_2: null,
        a: null,
        vet2: null,
        question_2_vet: null,
        question_2: null,
        createdAt: '2017-11-29T19:06:59.180Z' }];
      // console.log('mobiles :', mobiles);
      const time = promises[1];
      // if (mobiles.length > 0) {
      //   const raffleArr = mobilesService.addWeightToRaffle(mobiles);
      //   const shuffle = randy.shuffle(raffleArr);
      //   const winner = randy.choice(shuffle);
      //   time.used = true;
      //   mobilesService.raffleComplete(time);
      //   return winner;
      // }
      if (mobiles.length > 0) {
        console.log(`Selecting winner out of ${mobiles.length} contestants`);
        const raffleArr = mobilesService.addWeightToRaffle(mobiles);
        console.log(`Weighted arr has ${raffleArr.length} contestants`);
        const winners = mobilesService.selectFiveWinners(raffleArr);
        mobilesService.raffleComplete(time);
        console.log('insertWinnerSMS checking for selectFiveWinners :', winners);
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
      console.log(err);
      res.status(500).send(err);
    });
};
function handleErrors(response) {
  // console.log('response', response.ok);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

exports.master = (req, res) => {
  fetch(`http://localhost:3000/api/mobile/keyword/${req}`)
    .then(handleErrors)
    .then((response) => {
      console.log('1st fetch');
      response.json();
    })
    .then((json) => {
      console.log('2nd fetch');
      fetch(`http://localhost:3000/api/mobile/sms/${req}`);
    })
    .then(handleErrors)
    .catch((err) => {
      console.log('err master function', err);
      // res.status(500).send(err);
    });
};

