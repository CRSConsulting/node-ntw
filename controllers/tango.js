const options = {
  user: process.env.TANGO_USER,
  password: process.env.TANGO_PASSWORD,
};

const client = require('node-rest-client-promise').Client(options);

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

client.getPromise('https://integration-api.tangocard.com/raas/v2/orders', args).then((data) => {
  console.log('data', data.data);
}).catch((err) => {
  console.log('err', err);
});
