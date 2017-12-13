const Winners = require('../models/Winner');
const winnersService = require('../controllers/winners.services')({
  modelService: Winners
});

exports.getAll = (req, res) => {
  winnersService.getAll()
    .then((winners) => {
      const data = winners[0];
      const keyword = data.keyword;
      const email = data.email;
      const id = data._id;
      const retries = data.retries;
      if (data.retries < 6) {
        winnersService.retryTango(keyword, email, id, retries, res);
      } else {
        return Promise.reject('This document does not need a retry');
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
};
exports.insert = (req, res) =>
  winnersService.insert()
    .then((winners) => {
      res.json(winners);
    })
    .catch((err) => {
      res.status(500).send(err);
    });