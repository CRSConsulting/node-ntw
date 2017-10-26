// const cron = require('node-cron');
// const mobileController = require('../controllers/mobile');

// const items = [
//   { name: mobileController.insertWinnerSMS(), cronPattern: '* * * * * *' },
//   { name: 'B', cronPattern: '*/2 * * * * *' },
//   { name: 'C', cronPattern: '*/5 * * * * *' }
// ];

// items.forEach((item) => {
//   cron.schedule(item.cronPattern, () => {
//     console.log(new Date(), item.name.then(data => console.log(data)).catch(err => console.log('err', err)));
//   });
// });