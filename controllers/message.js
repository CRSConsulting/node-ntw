const Message = require('../models/Message');
const messageService = require('./message.services')({
  modelService: Message
});
const Token = require('../models/Token');
const tokenService = require('./token.services')({
  modelService: Token
});


exports.sendEmail = (req, res) =>
  messageService.sendEmail(req)
    .then((message) => {
      console.log('send email ctrl: ', message);
      res.json(message);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

exports.verifyEmail = (req, res, next) =>
  tokenService.getOne({ token_string: req.query.token })
    .then((token) => {
      const dateNow = Date.now();
      if (token && (dateNow < token.expiration_date)) {
        const updateAuth = {
          isAuthenticated: true
        };
        tokenService.updateOne({ token_string: req.query.token }, updateAuth).then((token) => {
          if (token.isAuthenticated === true) {
            console.log('token', token);
            // res.json('Your email has been verified');
            next();
          } else {
            return Promise.reject('Invalid Token');
          }
        })
          .catch((err) => {
            res.status(400).send('err', err);
          });
      } else {
        return Promise.reject('Invalid Token');
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
