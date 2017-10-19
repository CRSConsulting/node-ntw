const Client = require('node-rest-client').Client;


exports.insertTango = (req, res) => {
  const optionsAuth = {
    user: process.env.TANGO_USER,
    password: process.env.TANGO_PASSWORD,
  };
  const client = new Client(optionsAuth);
  const args = {
    data: {
      accountIdentifier: 'ntw-one',
      amount: 10,
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
      utid: 'U561593',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  function handleResponse(data, response) {
    if (response.statusCode === 201) {
      res.json(data);
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
};
