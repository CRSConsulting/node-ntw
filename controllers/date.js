const Client = require('node-rest-client').Client;
const Date = require('../models/Date');
const datesService = require('./dates.services')({
  modelService: Date,
});

exports.index = (req, res) => {
  res.render('date', {
    title: 'Date',
    user: req.user,
    vegetables: [
      'carrot',
      'potato',
      'beet'
    ]
  });
};

exports.getAll = (req, res) => {
  datesService.getAll()
    .then((tangos) => {
      const data = tangos;
      res.render('pages/test-table', data);
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.insert = (req, res) => {
  datesService.insert(req.body)
    .then((tangos) => {
      const data = tangos;
      res.json(data);
    }).catch((err) => {
      res.status(500).send(err);
    });
};

exports.getOne = (req, res) => {
  const queryCondition = {
    keyword: req.params.id
  };

  datesService.getOne(queryCondition)
    .then((tango) => {
      const data = tango;
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
