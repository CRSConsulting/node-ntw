const Retry = require('../models/Retry');
const retryService = require('./retry.services')({
  modelService: Retry,
});

const messageController = require('./message');

// const retryController = require('./retry');

const tangoController = require('./tango');

exports.getAll = () => {
  retryService.getAll()
    .then((retry) => {
      if (retry[0] === undefined) { return console.log('No retries needed'); }
      retry.forEach((cur, i) => {
        if (cur.retries <= 6 && cur.isValid === false) {
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
          const updateRetryObj = module.exports.updateById(queryCondition, body);
          const sendEmail = messageController.sendRetryEmail(cur);
          console.log('check your email for retries that exceeded 6x');
          return Promise.all([updateRetryObj, sendEmail]);
        }
        return console.log('No retries needed');
      });
    })
    .then(data => console.log('=======', data))
    .catch((err) => {
      console.log('Error: from exports.getAll :', err);
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
