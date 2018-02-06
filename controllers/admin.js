const Venue = require('../models/Venue');
const venueService = require('./venue.services')({
  modelService: Venue,
});

const User = require('../models/User');
const userService = require('./user.services')({
  modelService: User
});

const Admin = require('../models/Admin');
const adminService = require('./admin.services')({
  modelService: Admin
});
const Promise = require('bluebird');
// const cmd = require('node-cmd');


exports.index = (req, res) => {
  const adminData = adminService.get();
  const venues = venueService.getAllWithDrawings();

  const users = userService.getAll();
  const states = venueService.getStates();
  Promise.all([adminData, venues, users, states])
    .then((alldata) => {
      console.log(alldata[0]);
      res.render('pages/admin', {
        title: 'Admin',
        user: req.user,
        adminData: alldata[0],
        users: alldata[2],
        venues: alldata[1],
        userFrontend: JSON.stringify(alldata[2]),
        venueFrontend: JSON.stringify(alldata[1]),
        states: alldata[3]
      });
    });
};

exports.updateDrawingData = (req, res) => {
  console.log('hi');
  const adminData = req.body;
  if (!adminData.startAmount || !adminData.duration) {
    return res.send({ msg: 'Information missing from update' });
  }
  adminService.update(adminData)
    .then(update => res.send(update))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
