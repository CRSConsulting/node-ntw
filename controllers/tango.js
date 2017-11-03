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
  console.log('insertTango REQ: ', req);
  const optionsAuth = {
    user: process.env.TANGO_USER,
    password: process.env.TANGO_PASSWORD,
  };
  const client = new Client(optionsAuth);
  // Hard coded the keyword word
  const queryCondition = {
    keyword: 'BRAVE1'
  };

  tangosService.getOne(queryCondition)
    .then((tango) => {
      const keyword = tango;
      const args = {
        data: {
          accountIdentifier: 'ntw-one',
          amount: 1,
          customerIdentifier: 'test-customer',
          emailSubject: 'New Order',
          message: 'testing',
          recipient: {
            email: 'john.crs.consulting@gmail.com',
            firstName: '11:41 am',
            lastName: 'testing',
          },
          sendEmail: true,
          sender: {
            firstName: 'John',
            lastName: 'Yu',
          },
          utid: keyword.giftId,
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
        } else {
          switch (response.statusCode) {
            case 404:
              res.status(404).send('Page not found.');
              break;

            case 500:
              res.status(500).send('Internal server error.');
              break;

            default:
              console.log(`Response status code: ${response.statusCode}`);
          }
        }
      }
      return client.post('https://integration-api.tangocard.com/raas/v2/orders', args, handleResponse);
    })
    .catch((err) => {
      res.status(404).send('err', err);
    });
};
