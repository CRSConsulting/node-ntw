const Mobile = require('../models/Mobile');
const Promise = require('bluebird');
const cmd = require('node-cmd');
const mobilesService = require('./mobiles.services')({
  modelService: Mobile, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});

const { ReadPreference } = require('mongodb');

const mobileJSON = require('./test.single.json');
// const mobileJSON = require('./test.data.json');
// const mobileJSON = require('./mobile.many.data.json');

exports.getAll = (req, res) =>
  mobilesService.getAll()
    .then((mobiles) => {
      res.json(mobiles);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.getKeywordAndInsert = (req, res) =>
  getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":""}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
    .then((mobiles) => {
      const body = JSON.parse(mobiles[0].slice(958));
      const { id } = body;
      function delay(t) {
        return new Promise(((resolve) => {
          setTimeout(resolve, t);
        }));
      }
      return delay(1000).then(() => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`)).catch((err) => {
        res.status(404).send('err', err);
      });
    })
    .then((mobiles) => {
      // const jsonData = mobileJSON;
      const jsonData = JSON.parse(mobiles[0].slice(958));
      const data = [];

      for (let i = 0, n = jsonData.length; i < n; i++) {
        const mobile = new Mobile(jsonData[i]);
        data.push(mobile);
      }

      return Mobile.insertMany(data);
    })
    .then((mobiles) => {
      const transactionsObj = mobiles;
      const transactionsId = [];
      const transactions = transactionsObj.map(cur => transactionsId.push(cur.transaction_id));
      const dupsFound = mobilesService.getDups().then((value) => {
        const transObj = value;
        const dupsTransactionId = [];
        transObj.forEach(cur => dupsTransactionId.push(cur._id.transaction_id));
        return dupsTransactionId;
      }).catch((err) => {
        console.log('err', err);
      });
      return Promise.all([dupsFound, transactionsId]);
    })
    .then((mobiles) => {
      const dupsFound = mobiles[0].sort();
      const transactionsId = mobiles[1].sort();
      console.log('dupsFound', dupsFound);
      console.log('transactiondsId', transactionsId);
      res.status(200).json(mobiles);
    })
    .catch((err) => {
      res.status(404).send(err);
    });

exports.insertSMS = (req, res) =>
  getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`)
    .then((mobiles) => {
      const body = JSON.parse(mobiles[0].slice(867));
      const sessionToken = body.user.session_token;
      const phoneNumber = '6178204019';
      const message = 'Congrats you have won!';
      getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`)
        .then((mobiles) => {
          const body = JSON.parse(mobiles[0].slice(970));
          res.json(body);
        }).catch((err) => {
          res.status(500).send(err);
        });
    }).catch((err) => {
      res.status(500).send(err);
    });
