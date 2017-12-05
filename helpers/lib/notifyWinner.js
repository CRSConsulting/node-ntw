const calls = require('../').Calls;
const Message = require('../../models/Message');
const messageService = require('../../controllers/message.services')({
  modelService: Message
});
const Winners = require('../../models/Winners');
const winnersService = require('../../controllers/winners.services')({
  modelService: Winners
});

const getSessionToken = () => calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${process.env.MOBILE_TOKEN}", type="private"' -H "Accept: application/json" -H "Content-type:application/json" -X POST -d '{}'  https://app.mobilecause.com/api/v2/users/login_with_auth_token`);

exports.getSessionToken = getSessionToken;

const sendUserMessages = (sessionCall, winners, res) => {
  console.log('insertwinner 4th then()');
  console.log('winners', winners);
  const firstPlace = winners[0];
  console.log('====firstPlace====', firstPlace);
  const body = JSON.parse(sessionCall[0].slice(867));
  const sessionToken = body.user.session_token;
  // const phoneNumber = firstPlace.phone;
  const phoneNumber = 2034488493;
  const message = 'Congrats you have won!';
  const sendText = calls.delay(Math.random() * 10000).then(() =>
    calls.getAsync(`curl -v -D - -H 'Authorization: Token token="${sessionToken}", type="session"' -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"shortcode_string":"41444","phone_number":"${phoneNumber}","message":"${message}"' https://app.mobilecause.com/api/v2/messages/send_sms`))
    .catch((err) => {
      res.status(404).send('err', err);
    });
  const sendEmail = messageService.sendEmail(winners);
  return firstPlace;
};

exports.sendUserMessages = sendUserMessages;

exports.moveToNextWinner = (token, res) => {
  const winners = token.winnersList;
  winners.winnerIndex += 1;
  winnersService.updateOne(token.winnersList);
  const call = getSessionToken;
  Promise.all(call, winners)
    .then((token) => {
      sendUserMessages(token[0], token[1], res);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
