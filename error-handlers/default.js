const logger = require('morgan');

function defaultErrorHandler(error, request, response, next) {
  logger('Uncaught error', { statusCode: 500, error });
  console.log(error);
  console.log('made it here');
  return response
    .status(500)
    .render('pages/default-error');
}

module.exports = defaultErrorHandler;
