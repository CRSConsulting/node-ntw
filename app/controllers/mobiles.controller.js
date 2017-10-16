const mobileModel = require('../models/mobile.model');
const mobilesService = require('../services/mobiles.services')({
  modelService: mobileModel, // passing in this model object is allowed b/c we pass in 'options' to our serivce
});
const Promise = require('bluebird');
const cmd = require('node-cmd');

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});

const mobileObj = require('../services/test-data/mobile.data');
const mobileJSON = require('../services/test-data/mobile.many.data');

module.exports = mobilesController;

function mobilesController() {
  return {
    getAll,
    getKeywordAndInsert,
    insertSMS,
  };

  function getAll(req, res) {
    mobilesService.getAll()
      .then((mobiles) => {
        res.json(mobiles);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  function delay(t) {
    return new Promise(((resolve) => {
      setTimeout(resolve, t);
    }));
  }

  function getKeywordAndInsert(req, res) {
    getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":""}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
      .then((mobiles) => {
        const body = JSON.parse(mobiles[0].slice(958));
        const {
          id,
        } = body;
        return delay(1000).then(() => getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id":${id}}' "https://app.mobilecause.com/api/v2/reports/results.json?"`)).catch((err) => {
          res.status(404).send('Failed to retrieve transactions');
        });
      })
      .then((mobiles) => {
        // const jsonData = mobileJSON;
        const jsonData = JSON.parse(mobiles[0].slice(958));
        return mobilesService.insert(jsonData);
      })
      .then((mobiles) => {
        res.status(200).send(`Inserted total documents: ${mobiles.length}`);
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  }

  function insertSMS(req, res) {
    // const queryCondition = req;
    getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}",
    type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`)
      .then((mobiles) => {
        const body = JSON.parse(mobiles[0].slice(867));
        const sessionToken = body.user.session_token;
        const phoneNumber = '6178204019';
        const message = 'Testing until we break this sms API';
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
  }
}
