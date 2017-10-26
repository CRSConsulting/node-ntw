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
//       mobileController.test();
//       console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is done executing`);
//       this.isCurrentlyExecuting = false;
//     }, 1000);
//     // job.stop();
//   },
//   start: false,
//   timeZone: 'America/Los_Angeles'
// });

// module.exports = {
//   job
// };
