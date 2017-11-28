const cmd = require('node-cmd');
const Promise = require('bluebird');
const server = require('../server');
const fs = require('fs');

const getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});
//getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN_PRIVATE}"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"keyword":"BRAVE"}' "https://app.mobilecause.com/api/v2/reports/transactions.json?"`)
getAsync(`curl -v -D - -H 'Authorization: Token token="PzzDk1SVAykYFbp4z3Jq"' -H "Accept: application/json" -H "Content-type: application/json" -X GET -d '{"id": 499526 }' "https://app.mobilecause.com/api/v2/reports/results.json?"`)
  .then((mobiles) => {
    console.log(mobiles);
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
    fs.writeFile('brave.json', mobiles[0].slice(958), (err) => {
      console.log(err);
    });
  });

