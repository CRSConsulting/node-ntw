// const schedule = require('node-schedule');
const mobileController = require('../controllers/mobile');
const express = require('express');
// const job = schedule.scheduleJob('*/1 * * * *', () => {
//   function delay(t) {
//     return new Promise(((resolve) => {
//       setTimeout(resolve, t);
//     }));
//   }
//   return delay(2000).then(() => mobileController.getKeywordAndInsert()).catch((err) => {
//     console.log('err', err);
//   });
// });
const app = express();


for (let i = 1; i < 10; i++) {
  setTimeout(() => {
    // mobileController.getKeywordAndInsert();
    mobileController.getKeywordAndInsert('hello');
  }, 10000);
}
