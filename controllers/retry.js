const Retry = require('../models/Retry');
const retryService = require('./retry.services')({
  modelService: Retry,
});

const Winner = require('../models/Winner');
const winnerService = require('./winners.services')({
  modelService: Winner,
});

const messageController = require('./message');
const tangoController = require('./tango');

const retryController = require('./retry');

exports.getAll = () => {
  retryService.getAll()
    .then((retry) => {
      if (retry[0] === undefined) { return console.log('No retries needed'); }
      retry.forEach((cur, i) => {
        if (cur.retries <= 6 && new Date(cur.retryTimes[cur.retries]).getTime() < new Date().getTime()) {
          console.log('retry in process...');
          return tangoController.insertTangoRetry(cur);
        }
        if (cur.isValid === true && cur.sendEmail === false) {
          const queryCondition = {
            _id: cur._id
          };
          const body = {
            sendEmail: true
          };
          // sendEmail sets to true, because we only want to send the email once
          const updateRetryObj = retryController.updateById(queryCondition, body);
          const sendEmail = messageController.sendRetryEmail(cur);
          console.log('check your email for retries that exceeded 6x');
          return Promise.all([updateRetryObj, sendEmail]);
        }
        return console.log('No retries needed');
      });
    })
    // .then(data => console.log('=======', data))
    .catch((err) => {
      console.log('Error: from exports.getAll :', err);
    });
};

exports.createTangoRetry = (req, res) => {
  winnerService.getOne({ _id: res.locals.winnersList })
    .then((winner) => {
      const winnerObj = winner.winners[winner.winnerIndex];
      const data = {
        first_name: winnerObj.first_name,
        last_name: winnerObj.last_name,
        keyword: winnerObj.keyword,
        // email: winner.email,
        email: 'ian@crs-consulting.com',
        retries: 0,
        retryTimes: retryService.createDateArray(new Date()),
        isValid: false,
        sendEmail: false
      };
      module.exports.insert(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};

exports.insert = (req, res) => {
  retryService.insert(req)
    .then(retry => retry)
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getOne = (req, res) => {
  const queryCondition = {
    email: req.email
  };
  retryService.getOne(queryCondition)
    .then((retry) => {
      const data = retry;
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.removeById = (req, res) => {
  retryService.removeOne(req)
    .then(retry => retry)
    .catch((err) => {
      console.log('err', err);
    });
};

exports.updateById = (queryCondition, body) => {
  retryService.updateOne(queryCondition, body)
    .then(retry => retry)
    .catch(err => console.log('err', err));
};
