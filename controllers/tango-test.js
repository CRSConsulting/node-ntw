const Client = require('node-rest-client').Client;
const Tango = require('../models/Tango');
const tangosService = require('./tangos.services')({
  modelService: Tango,
});
const Winner = require('../models/Winner');
const winnerService = require('./winners.services')({
  modelService: Winner,
});
const retryController = require('./retry');
const Retry = require('../models/Retry');
const retryService = require('./retry.services')({
  modelService: Retry,
});

exports.getAll = (req, res) => {
  tangosService.getAll()
    .then((tangos) => {
      const data = tangos;
      res.json(data);
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.insert = (req, res) => {
  tangosService.insert(req.body)
    .then((tangos) => {
      const data = tangos;
      res.json(data);
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.getOne = (req, res) => {
  const queryCondition = {
    keyword: req.params.id
  };

  tangosService.getOne(queryCondition)
    .then((tango) => {
      const data = tango;
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};


exports.insertTangoRetry = (retryObj) => {
  const optionsAuth = {
    user: process.env.TANGO_USER_LIVE,
    password: process.env.TANGO_PASSWORD_LIVE,
  };
  const client = new Client(optionsAuth);
  const queryCondition = {
    keyword: retryObj.keyword
  };
  tangosService.getOne(queryCondition)
    .then((tango) => {
      const args = {
        data: {
          accountIdentifier: 'ntwaccount',
          amount: 1,
          customerIdentifier: 'ntwcustomer',
          emailSubject: 'Congrats you have won a giftcard!',
          message: 'Congrats',
          recipient: {
            // email: retryObj.email,
            email: 'ian@crs-consulting.com',
            firstName: retryObj.first_name,
            lastName: retryObj.last_name,
          },
          sendEmail: true,
          sender: {
            firstName: 'NTW',
            lastName: '',
          },
          // utid: null,
          utid: tango.giftId,
          // Amazon GC "U666425"
          // VISA GC "U426141"
          // VISA Prepaid GC "U677579"
        },
        headers: {
          'Content-Type': 'application/json',
        }
      };
      function handleResponse(data, response) {
        const queryCondition = {
          _id: retryObj._id
        };
        if (response.statusCode === 201) {
          const recipient = { email: `${data.recipient.email}` };
          console.log(`Tango gift card sented to email: ${data.recipient.email}`);
          retryController.removeById(queryCondition);
        } else if (retryObj.retries === 5) {
          const body = {
            isValid: true
          };
          retryController.updateById(queryCondition, body);
        } else {
          console.log(data);
          const body = {
            retries: (retryObj.retries + 1)
          };
          retryController.updateById(queryCondition, body);
          switch (response.statusCode) {
            case 404:
              console.log('404, check from tango.js');
              // res.status(404).send('Page not found.');
              break;

            case 500:
              console.log('500, check from tango.js');
              // res.status(500).send('Internal server error.');
              break;

            default:
              console.log(`Failed from tangoRetry, Response status code: ${response.statusCode}`);
                        // res.send({ errorCode: response.statusCode, Attempt: `${body.retries}` });
          }
        }
      }
      const tangoCard = client.post('https://api.tangocard.com/raas/v2/orders', args, handleResponse);
      return Promise.all([tangoCard]);
    })
    .catch((err) => {
      console.log('err', err);
    });
};