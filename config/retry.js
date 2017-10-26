// const Promise = require('bluebird');
// const retry = require('bluebird-retry');

// let count = 0;
// function myfunc() {
//   console.log(`myfunc called ${  ++count  } times`);
//   if (count < 10) {
//     return Promise.reject(new Error('fail the first two times'));
//   }
//   return Promise.resolve('succeed the third time');
// }

// retry(myfunc, { max_tries: 10, interval: 2000 })
//   .then((result) => {
//     console.log(result);
//   });
