const Retry = require('../models/Retry');
const retryService = require('./retry.services')({
  modelService: Retry,
});

exports.getAll = (req, res) => {
  retryService.getAll()
    .then((retry) => {
      const data = retry[0];
      const keyword = data.keyword;
      const email = data.email;
      const id = data._id;
      const retries = data.retries;
      if (data.retries < 6) {
        retryService.retryTango(keyword, email, id, retries, res);
      } else {
        return Promise.reject('This document does not need a retry');
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.insert = (req, res) => {
  retryService.insert(req)
    .then((retry) => {
      console.log('retry', retry);
    }).catch((err) => {
      console.log('err', err);
      res.status(500).send(err);
    });
};

exports.getOne = (req, res) => {
  const queryCondition = {
    keyword: req.params.id
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
    .then((retry) => {
      res.send(retry);
    })
    .catch((err) => {
      console.log('err', err);
      res.status(500).send(err);
    });
};

exports.updateById = (queryCondition, body, res) => {
  retryService.updateOne(queryCondition, body)
    .then((retry) => {
      res.send(retry);
    })
    .catch(err => console.log('err', err));
};
