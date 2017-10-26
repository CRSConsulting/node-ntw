// const CronJob = require('cron').CronJob;

// const mobileController = require('../controllers/mobile');

// const moment = require('moment');

// const job = new CronJob({
//   cronTime: '*/5 * * * * *',
//   onTick: () => {
//     if (typeof this.isCurrentlyExecuting === 'undefined') {
//       this.isCurrentlyExecuting = false;
//     }

//     if (this.isCurrentlyExecuting) {
//       console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job already running.  Canceling this execution.`, this);
//       return;
//     }

//     this.isCurrentlyExecuting = true;

//     console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is currently executing`);

//     setTimeout(() => {
//       function promise(index, keyword) {
//         return new Promise((resolve) => {
//         //   const delay = Math.random() * 10000; // between 0 and 5 seconds
//           const delay = 10000;
//           console.log(`${index}. Waiting ${delay}`);
//           setTimeout(() => {
//             const key = keyword.keyword;
//             mobileController.test(key);
//             console.log(`${index}. Done waiting ${delay}`);
//             resolve();
//           }, delay);
//         });
//       }
//       Promise.all([
//         promise(1, { keyword: 'seattle.v1', cronPattern: '*/1 * * * * *' }),
//         promise(2, { keyword: 'seattle.v2', cronPattern: '*/2 * * * * *' }),
//         promise(3, { keyword: 'seattle.v3', cronPattern: '*/3 * * * * *' }),
//         promise(4, { keyword: 'seattle.v4', cronPattern: '*/4 * * * * *' })
//       ])
//         .then(() => console.log('Promise.All done!'));
//       console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is done executing`);
//       this.isCurrentlyExecuting = false;
//     }, 10000);
//     // job.stop();
//   },
//   start: false,
//   timeZone: 'America/Los_Angeles'
// });

// module.exports = {
//   job
// };
