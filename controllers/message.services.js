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
      winnersList: req._id,
      attempted: false
    };
    tokenService.insert(tokenObj);
    const toEmailObj = firstPlace.email;
    const subjectObj = `Hello: ${firstPlace.first_name}`;
    const textObj = `${'http://' + 'localhost:3000/' + 'api/message/verify' + '?token='}${decodeURIComponent(token)}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'johnyu.programmer@gmail.com',
      from: 'noreply@braveworks.org',
      subject: subjectObj,
      template_id: '7393b5ed-4a09-4b93-8e0e-1c74e36444f6',
      html: textObj,
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
