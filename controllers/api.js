// const bluebird = require('bluebird');
// const request = bluebird.promisifyAll(require('request'), {
//   multiArgs: true
// });
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('campaign/index', {
    title: 'Campaigns'
  });
};

console.log('hello world from postCampaign');

exports.postCampaign = (req, res) => {
  console.log('start');
  req.assert('title', 'Phone number is required.').notEmpty();
  req.assert('venue', 'Message cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/api');
  }
  console.log('req.body', req);
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
 * GET /api/lastfm
 * Last.fm API example.
 */
// exports.getLastfm = (req, res, next) => {
//   const lastfm = new LastFmNode({
//     api_key: process.env.LASTFM_KEY,
//     secret: process.env.LASTFM_SECRET
//   });
//   const artistInfo = () =>
//     new Promise((resolve, reject) => {
//       lastfm.request('artist.getInfo', {
//         artist: 'Roniit',
//         handlers: {
//           success: resolve,
//           error: reject
//         }
//       });
//     });
//   const artistTopTracks = () =>
//     new Promise((resolve, reject) => {
//       lastfm.request('artist.getTopTracks', {
//         artist: 'Roniit',
//         handlers: {
//           success: (data) => {
//             resolve(data.toptracks.track.slice(0, 10));
//           },
//           error: reject
//         }
//       });
//     });
//   const artistTopAlbums = () =>
//       new Promise((resolve, reject) => {
//         lastfm.request('artist.getTopAlbums', {
//           artist: 'Roniit',
//           handlers: {
//             success: (data) => {
//               resolve(data.topalbums.album.slice(0, 3));
//             },
//             error: reject
//           }
//         });
//       });
//   Promise.all([
//     artistInfo(),
//     artistTopTracks(),
//     artistTopAlbums()
//   ])
//   .then(([artistInfo, artistTopAlbums, artistTopTracks]) => {
//     const artist = {
//       name: artistInfo.artist.name,
//       image: artistInfo.artist.image.slice(-1)[0]['#text'],
//       tags: artistInfo.artist.tags.tag,
//       bio: artistInfo.artist.bio.summary,
//       stats: artistInfo.artist.stats,
//       similar: artistInfo.artist.similar.artist,
//       topAlbums: artistTopAlbums,
//       topTracks: artistTopTracks
//     };
//     res.render('api/lastfm', {
//       title: 'Last.fm API',
//       artist
//     });
//   })
//   .catch(next);
// };


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
