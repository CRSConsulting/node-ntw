const tokenModel = require('../models/Token');
const tokenService = require('../controllers/token.services')({
  modelService: tokenModel
});

exports.getAll = (req, res) =>
  tokenService.getAll()
    .then((token) => {
      console.log('tokenService.getAll()', token);
      res.json(token);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.insert = (req, res) =>
  tokenService.insert()
    .then((token) => {
      console.log('tokenService.getAll()', token);
      res.json(token);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
