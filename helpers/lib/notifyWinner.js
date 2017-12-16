const calls = require('../lib/calls');
const Message = require('../../models/Message');
const messageService = require('../../controllers/message.services')({
  modelService: Message
});
const Winners = require('../../models/Winner');
const winnersService = require('../../controllers/winners.services')({
  modelService: Winners
});

const Token = require('../../models/Token');
const tokenService = require('../../controllers/token.services')({
  modelService: Token
});

const getSessionToken = () => calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`);

exports.getSessionToken = getSessionToken;

const sendUserMessages = (sessionCall, winners, res) => {
  // console.log(sessionCall);
  const winner = winners.winners[winners.winnerIndex];
  const body = JSON.parse(sessionCall[0].slice(867));
  const sessionToken = body.user.session_token;
  // const phoneNumber = winner.phone;
  const phoneNumber = 6178204019;
  const message = 'YOU WON!! Thank you for your submission to our Brave Works Sweepstakes. Next, you will be sent an email verification request to verify your email to ensure we have the correct address where to send your prize. Depending on your submission of all the information required by law to collect your prize, your prize will be awarded via email within 48 hours after your email address verification. CONGRATULATIONS!';
  const sendText = calls.delay(Math.random() * 10000).then(() =>
    calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`))
    .catch((err) => {
      res.status(404).send('err', err);
    });
  const sendEmail = messageService.sendEmail(winners);
  return winners;
};

exports.sendUserMessages = sendUserMessages;

exports.moveToNextWinner = (token, res) => {
  const winners = token.winnersList;
  winners.winnerIndex += 1;
  const updateToken = token;
  const call = getSessionToken();
  Promise.all([call, winners])
    .then((promises) => {
      sendUserMessages(promises[0], promises[1], res);
    })
    .then(() => {
      winnersService.updateOne(winners);
    })
    .then(() => {
      return tokenService.updateOne({ _id: updateToken._id }, { attempted: true });
    })
    .then(token => console.log('newtoken', token))
    .catch((err) => {
      console.log(err);
      // res.status(500).send(err);
    });
};
