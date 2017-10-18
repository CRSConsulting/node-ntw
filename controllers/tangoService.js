const ReadPreference = require('mongodb').ReadPreference;
const Client = require('node-rest-client').Client;

module.exports = tangosService;

function tangosService(options) {
  let Tango;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Tango = options.modelService;

  return {
    insert,
  };

  function insert() {
    const options_auth = {
      user: process.env.TANGO_USER,
      password: process.env.TANGO_PASSWORD,
    };
    const client = new Client(options_auth);
    const args = {
      data: {
        accountIdentifier: 'ntw-one',
        amount: 10,
        customerIdentifier: 'test-customer',
        emailSubject: 'New Order',
        message: 'testing',
        recipient: {
          email: 'john.crs.consulting@gmail.com',
          firstName: '1pm Tuesday',
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
    let dataObj;
    client.post('https://integration-api.tangocard.com/raas/v2/orders', args, (data, response) => {
      dataObj = data;
      console.log('dataObj', dataObj);
    }).on('error', (err) => {
      console.log('something went wrong on the request', err.request.options);
    });
    // handling client error events
    client.on('error', (err) => {
      console.error('Something went wrong on the client', err);
    });
  }
}
