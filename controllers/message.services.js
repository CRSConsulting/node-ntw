const sgMail = require('@sendgrid/mail');

const uuidv4 = require('uuid/v4');
const tokenModel = require('../models/Token');
const tokenService = require('./token.services')({
  modelService: tokenModel
});

function messageService(options) {
  let Message;

  if (!options.modelService) {
    throw new Error('Options.modelService is required');
  }

  Message = options.modelService;

  return {
    sendEmail,
    sendRetryEmail
  };


  function sendEmail(req) {
    const firstPlace = req.winners[0];
    const token = uuidv4(); // unique id generator
    const dateExpires = new Date();
    dateExpires.setHours(dateExpires.getHours() + 24); // 24 hour date expiration
    const tokenObj = {
      token_string: token,
      expiration_date: dateExpires,
      email: firstPlace.email,
      isAuthenticated: false,
      winnersList: req._id
    };
    // console.log('tokenObj', tokenObj);
    tokenService.insert(tokenObj);
    const toEmailObj = firstPlace.email;
    const subjectObj = `Hello: ${firstPlace.first_name}`;
    const textObj = `${'This is a email verfication. \n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + 'localhost:3000/' + 'api/message/verify' + '?token='}${decodeURIComponent(token)}\n\n` +
            'If you did not request this, please ignore this email.\n';

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'johnyu.programmer@gmail.com',
      from: 'test@example.com',
      subject: subjectObj,
      text: textObj
    };
    sgMail.send(msg);

    return { message: 'Email sent' };
  }

  function sendRetryEmail(req) {
    const toEmailObj = req.email;
    const subjectObj = `Hello: ${req.first_name}`;
    const textObj = `${`${'This is a email notification. \n\n' +
            'This winner has exceeded the 6 attempts to TangoAPI:\n\n'} ${req}`}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'john.crs.consulting@gmail.com',
      from: 'john@crs-consulting.com',
      subject: subjectObj,
      text: textObj
    };
    return sgMail.send(msg);
  }
}

module.exports = messageService;
