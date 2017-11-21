
module.exports = messagesService;
const sendgrid = require('sendgrid');
const uuid = require('node-uuid');
const tokenModel = require('../models/token');
const tokenService = require('./token.service')({
  modelService: tokenModel
});

function messagesService() {
  const helper = sendgrid.mail;
  const fromEmail = new helper.Email('c26test@mailinator.com');

  return {
    sendContact,
    sendRegister,
    sendPublicRegister,
    sendPassword
  };

  function sendContact(reqBody) {
    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs

    const toEmail = new helper.Email('c26test@mailinator.com');
    const subject = reqBody.subject;
    const content = new helper.Content('text/plain', reqBody.content);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

    const sg = sendgrid(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
    return sg.API(request);
  }

  function sendPublicRegister(reqBody) {
    const token = uuid.v1(); // unique id generator
    const dateExpires = new Date();
    dateExpires.setHours(dateExpires.getHours() + 24); // 24 hour date expiration
    const tokenObj = {
      token_string: token,
      expiration_date: dateExpires,
      email: reqBody.email
    };
    tokenService.insert(tokenObj);

    const toEmail = new helper.Email(reqBody.email);
    const subject = `Hello: ${reqBody.username}`;
    const content = new helper.Content('text/plain', `${'This is a email verfication. \n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + 'localhost:8080/' + 'register' + '?token='}${ token}&email=${ decodeURIComponent(reqBody.email)}\n\n` +
            'If you did not request this, please ignore this email.\n');
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

    const sg = sendgrid(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
    return sg.API(request);
  }

  function sendRegister(reqBody) {
    const token = uuid.v1(); // unique id generator
    const dateExpires = new Date();
    dateExpires.setHours(dateExpires.getHours() + 24); // 24 hour date expiration
    const tokenObj = {
      token_string: token,
      expiration_date: dateExpires,
      email: reqBody.email
    };
    tokenService.insert(tokenObj);

    const toEmail = new helper.Email(reqBody.email);
    const subject = `Hello: ${reqBody.username}`;
    const content = new helper.Content('text/plain', `${'This is a email verfication. \n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + 'localhost:8080/admin#' + '/register/' + '?token='}${token}&email=${decodeURIComponent(reqBody.email)}\n\n` +
            'If you did not request this, please ignore this email.\n');
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

    const sg = sendgrid(process.env.SENDGRID_API_KEY);
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });
    return sg.API(request);
  }

  function sendPassword(req) {
    const reqBody = req.body;
    const host = req.headers.host;
    return User.findOne({
      'local.email': reqBody.email
    })
      .then((user) => {
        if (user) {
          const token = uuid.v1();
          const dateExpires = new Date();
          dateExpires.setHours(dateExpires.getHours() + 3);
          const tokenObj = {
            token_string: token,
            expiration_date: dateExpires,
            lost_user: user._id
          };
          return tokenService.insert(tokenObj);
        }
        return Promise.resolve('User not found');
      })
      .then((token) => {
        if (typeof token === 'string') return token;
        const toEmail = new helper.Email(reqBody.email);
        const subject = 'Forgot your password to PrintCollab?';
        const content = new helper.Content('text/html',
          `
                <b>Forgot your password?</b><a href="http://${host}/recovery/${token.token_string}">Click here!</a>
                `);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);

        const sg = sendgrid(process.env.SENDGRID_API_KEY);
        const request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });
        return sg.API(request);
      });
  }
}
