const Venue = require('../models/Venue');
const venueService = require('./venue.services')({
  modelService: Venue,
});

exports.post = (req, res) => {
  console.log(req.body);
  const newVenue = req.body;
  venueService.insert(newVenue)
    .then(venue => res.send(venue))
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};

exports.patch = (req, res) => {
  console.log(req.body);
  const updateVenue = req.body;
  const updateId = updateVenue.id;
  venueService.update(updateId, updateVenue)
    .then((venue) => {
      if (venue.nModified === 1) {
        updateVenue._id = updateId;
        res.send(updateVenue);
      } else {
        res.send({ msg: 'no update' });
      }
    })
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};

exports.delete = (req, res) => {
  console.log(req.body);
  const deleteId = req.body.id;
  venueService.remove(deleteId)
    .then((venue) => {
      res.send(venue);
    })
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};
