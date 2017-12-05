const Promise = require('bluebird');
const tokenModel = require('../models/Token');
const tokenService = require('../controllers/token.services')({
  modelService: tokenModel
});


const helpers = require('../helpers');

const notify = helpers.Notify;

exports.getAll = (req, res) =>
  tokenService.getAll()
    .then((token) => {
      console.log('tokenService.getAll()', token);
      res.json(token);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.getExpired = (req, res) =>
  tokenService.getExpired()
    .then((token) => {
      if (token) {
        notify.moveToNextWinner(token,res);
      }
      return Promise.reject('No tokens have expired');
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