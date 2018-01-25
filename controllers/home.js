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

exports.reports = (req, res) => {
  res.render('pages/reports', {
    title: 'Reports',
    user: req.user,
    vegetables: [
      'carrot',
      'potato',
      'beet'
    ]
  });
};