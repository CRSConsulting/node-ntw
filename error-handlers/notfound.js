const logger = require('morgan');

function notFound(request, response) {
  logger(
    'Unhandled resource',
    {
      statusCode: 404,
      error: 'Unknown resource',
      resource: request.originalUrl
    }
  );
  return response
    .status(404)
    .render('pages/not-found');
}

module.exports = notFound;
