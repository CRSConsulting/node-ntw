/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home',
    user: req.user,
    vegetables: [
      'carrot',
      'potato',
      'beet'
    ]
  });
};

exports.denied = (req, res) => {
  res.render('pages/permission-denied', {
    title: 'Permission Denied',
    user: req.user,
  });
};

