const Winners = require('../models/Winner');
const winnersService = require('../controllers/winners.services')({
  modelService: Winners
});

exports.getAll = (req, res) =>
  winnersService.getAll()
    .then((winners) => {
      res.json(winners);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.insert = (req, res) =>
  winnersService.insert()
    .then((winners) => {
      res.json(winners);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
