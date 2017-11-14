const Client = require('node-rest-client').Client;
const Tango = require('../models/Tango');
const tangosService = require('./tangos.services')({
  modelService: Tango,
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

exports.insertTango = (req, res) => {
  // console.log('req inserTango', req);
  const winner = req[0];
  const keywordLocation = req[1];
  const optionsAuth = {
    user: process.env.TANGO_USER_LIVE,
    password: process.env.TANGO_PASSWORD_LIVE,
  };
  const client = new Client(optionsAuth);
  // Hard coded the keyword word
  const queryCondition = {
    keyword: keywordLocation
  };

  console.log('queryCondition', queryCondition);
  
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
            email: winner.email,
            // email: 'ian@crs-consulting.com',
            firstName: winner.first_name,
            lastName: winner.last_name,
          },
          sendEmail: true,
          sender: {
            firstName: 'John',
            lastName: 'Yu',
          },
          utid: 'U666425'
          // utid: tango.giftId,
          // Amazon GC "U666425"
          // VISA GC "U426141"
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
          switch (response.statusCode) {
            case 404:
              res.status(404).send('Page not found.');
              break;

            case 500:
              res.status(500).send('Internal server error.');
              break;

            default:
              res.json(data);
              console.log(`Response status code: ${response.statusCode}`);
              console.log(data);
          }
        }
      }
      console.log(args);
      // dev endpoint 'https://integration-api.tangocard.com/raas/v2/orders'
      // prod endpoint https://api.tangocard.com/raas/v2/orders
      return client.post('https://api.tangocard.com/raas/v2/orders', args, handleResponse);
      // return client.get('https://integration-api.tangocard.com/raas/v2/catalogs?verbose=true', handleResponse);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};
