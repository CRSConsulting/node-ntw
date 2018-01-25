// const bluebird = require('bluebird');
// const request = bluebird.promisifyAll(require('request'), {
//   multiArgs: true
// });
// const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('campaign/index', {
    title: 'Campaigns'
  });
};

exports.postCampaign = (req, res) => {
  console.log('start');
  req.assert('title', 'Phone number is required.').notEmpty();
  req.assert('venue', 'Message cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api');
  }
  // const message = {
  //   to: req.body.number,
  //   from: '+13472235148',
  //   body: req.body.message
  // };
  // twilio.sendMessage(message, (err, responseData) => {
  //   if (err) {
  //     return next(err.message);
  //   }
  //   req.flash('success', {
  //     msg: `Text sent to ${responseData.to}.`
  //   });
  //   res.redirect('/api/twilio');
  // });
};

/**
 * GET /api/twilio
 * Twilio API example.
 */
exports.getTwilio = (req, res) => {
  res.render('api/twilio', {
    title: 'Twilio API'
  });
};

/**
 * POST /api/twilio
 * Send a text message using Twilio.
 */
exports.postTwilio = (req, res, next) => {
  req.assert('number', 'Phone number is required.').notEmpty();
  req.assert('message', 'Message cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api/twilio');
  }

  const message = {
    to: req.body.number,
    from: '+13472235148',
    body: req.body.message
  };
  twilio.sendMessage(message, (err, responseData) => {
    if (err) {
      return next(err.message);
    }
    req.flash('success', {
      msg: `Text sent to ${responseData.to}.`
    });
    res.redirect('/api/twilio');
  });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', {
    msg: 'File was uploaded successfully.'
  });
  res.redirect('/api/upload');
};
