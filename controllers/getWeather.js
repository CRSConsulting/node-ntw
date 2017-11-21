const request = require('request');

const getURL = (city, state) => '';

const parseBody = body => new Promise((success, failure) => {
  try {
    const result = JSON.parse(body);
    success(result);
  } catch (err) {
    failure(err);
  }
});

const requestIt = url => new Promise((success, failure) => {
  request.get(url, (err, req, body) => (err ? failure(err) : success(body)));
});

const getWeather = (city, state) => requestIt(getURL(city, state)).then(parseBody);

module.exports = {
  getWeather
};
