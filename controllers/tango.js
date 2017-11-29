const Client = require('node-rest-client').Client;
const Tango = require('../models/Tango');
const tangosService = require('./tangos.services')({
  modelService: Tango,
});

const retryController = require('./retry');

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

exports.insertTango = (req, res) => {
  const winner = req[0];
  const keywordLocation = req[1];
  const optionsAuth = {
    user: process.env.TANGO_USER_LIVE,
    password: process.env.TANGO_PASSWORD_LIVE,
  };
  const client = new Client(optionsAuth);
  const queryCondition = {
    keyword: keywordLocation
  };
  const currentTime = new Date();
  function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  tangosService.getOne(queryCondition)
    .then((tango) => {
      console.log(tango);
      const args = {
        data: {
          accountIdentifier: 'ntwaccount',
          amount: 0.01,
          customerIdentifier: 'ntwcustomer',
          emailSubject: 'Congrats you have won a giftcard!',
          message: 'Hello World',
          recipient: {
            email: 'john@crs-consulting.com',
            firstName: 'John',
            lastName: 'Yu',
          },
          sendEmail: true,
          sender: {
            firstName: 'John',
            lastName: 'Yu',
          },
          utid: tango.giftId,
          // utid: null,
          // Amazon GC "U666425"
          // VISA GC "U426141"
          // VISA Prepaid GC "U677579"
        },
        headers: {
          'Content-Type': 'application/json',
        }
      };
      function handleResponse(data, response) {
        if (response.statusCode === 201) {
          const recipient = { email: `${data.recipient.email}` };
          console.log('recipient', recipient);
          res.json(recipient);
        } else {
          const data = {
            keyword: keywordLocation,
            email: winner.email,
            transaction_id: winner.transaction_id,
            retries: 1,
            startTime: AddMinutesToDate(currentTime, 10)
          };
          console.log('else statement tangoController.insertTango()');
          retryController.insert(data);
          switch (response.statusCode) {
            case 404:
              console.log('404, check from tango.js');
              res.status(404).send('Page not found.');
              break;

            case 500:
              console.log('500, check from tango.js');
              res.status(500).send('Internal server error.');
              break;

            default:
              console.log(`Response status code: ${response.statusCode}`);
              res.json(response.statusCode);
          }
        }
      }
      const tangoCard = client.post('https://integration-api.tangocard.com/raas/v2/orders', args, handleResponse);
      return Promise.all([tangoCard]);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

exports.insertTangoRetry = (keywordLocation, email, id, retries, res) => {
  console.log('tangoController, insertTangoRetry email:', email);
  console.log('tangoController, insertTangoRetry keywordLocation:', keywordLocation);
  const optionsAuth = {
    user: process.env.TANGO_USER,
    password: process.env.TANGO_PASSWORD,
  };
  const client = new Client(optionsAuth);
  const queryCondition = {
    keyword: keywordLocation
  };
  tangosService.getOne(queryCondition)
    .then((tango) => {
      console.log('tangoController, insertTangoRetry calling tangosService.getOne:', tango);
      const args = {
        data: {
          accountIdentifier: 'ntw-one',
          amount: 1,
          customerIdentifier: 'test-customer',
          emailSubject: 'Congrats you have won a giftcard!',
          message: 'Hello World',
          recipient: {
            email: 'john@crs-consulting.com',
            firstName: 'John',
            lastName: 'Yu',
          },
          sendEmail: true,
          sender: {
            firstName: 'John',
            lastName: 'Yu',
          },
          utid: tango.giftId,
          // utid: null,
          // Amazon GC "U666425"
          // VISA GC "U426141"
          // VISA Prepaid GC "U677579"
        },
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const queryCondition = {
        _id: id
      };
      const body = {
        retries: (retries + 1)
      };
      function handleResponse(data, response) {
        if (response.statusCode === 201) {
          const recipient = { email: `${data.recipient.email}` };
          retryController.removeById(queryCondition);
          res.status(200).send(recipient);
        } else {
          retryController.updateById(queryCondition, body);
          switch (response.statusCode) {
            case 404:
              console.log('404, check from tango.js');
              res.status(404).send('Page not found.');
              break;

            case 500:
              console.log('500, check from tango.js');
              res.status(500).send('Internal server error.');
              break;

            default:
              console.log(`Response status code: ${response.statusCode}`);
              res.send({ errorCode: response.statusCode, Attempt: `${body.retries}` });
          }
        }
      }
      const tangoCard = client.post('https://integration-api.tangocard.com/raas/v2/orders', args, handleResponse);
      return Promise.all([tangoCard]);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};
