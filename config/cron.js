const CronJob = require('cron').CronJob;

const mobileController = require('../controllers/mobile');
const moment = require('moment');

// create a mobileService function here to retrieve the keywords
// use those keywords as params in the function below

// create a service function to retrieve the timeZone as well

const job = new CronJob({
  cronTime: '*/5 * * * * *',
  onTick: () => {
    if (typeof this.isCurrentlyExecuting === 'undefined') {
      this.isCurrentlyExecuting = false;
    }

    if (this.isCurrentlyExecuting) {
      console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job already running.  Canceling this execution.`, this);
      return;
    }

    this.isCurrentlyExecuting = true;

    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is currently executing`);

    setTimeout(() => {
      function promise(index, query) {
        return new Promise((resolve) => {
          const delay = Math.random() * 10000;
          // const delay = 10000;
          console.log(`${index}. Waiting ${delay}`);
          setTimeout(() => {
            const key = query.keyword;
            mobileController.master(key);
            console.log(`${index}. Done waiting ${delay}`);
            resolve();
          }, delay);
        }).catch((err) => {
          console.log('err cron.js', err);
          // res.status(500).send(err);
        });
      }
      Promise.all([
        promise(1, { keyword: 'BRAVE3' }),
        // promise(2, { keyword: 'MOLINE2' }),
        // promise(3, { keyword: 'MOLINE3' }),
        // promise(4, { keyword: 'MOLINE5' })
      ])
        .then(() => console.log('Promise.All done!'));
      console.log(`${moment().format('YYYY-MM-DD HH:mm:ss.SS - ')}Job is done executing`);
      this.isCurrentlyExecuting = false;
    }, 10000);
    job.stop();
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

module.exports = {
  job
};
