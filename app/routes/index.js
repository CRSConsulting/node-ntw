const express = require('express');

const router = express.Router();
const mobileRoutes = require('./mobiles.routes');
const tangoRoutes = require('./tangos.routes');


// register routes
router.use('/mobile', mobileRoutes);
router.use('/tango', tangoRoutes);

router.use('/*', (req, res) => {
  res.sendStatus(404);
});

router.use((err, req, res, next) => {
  if (!err) {
    return next();
  }
  console.error(err.stack);
  res.sendStatus(500);
});

module.exports = router;
