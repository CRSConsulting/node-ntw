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
    .then(calendar => res.send(calendar))
    .catch((err) => {
      console.log('oops');
      console.log(err);
      res.send(err);
    });
};