const logger = require('morgan');

function defaultErrorHandler(error, request, response, next) {
  logger('Uncaught error', { statusCode: 500, error });
  return response
    .status(500)
    .render('pages/default-error');
}

module.exports = defaultErrorHandler;
