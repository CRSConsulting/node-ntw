const Mobile = require('../models/Mobile');
const mobilesService = require('./mobiles.services')({
    modelService: Mobile,
});

const Donor = require('../models/Donor');
const donorService = require('./donor.services')({
    modelService: Donor,
});
exports.transformAll = (req, res) => {
    mobilesService.getAll()
    .then((mobiles) => {
        const donors = donorService.transform(mobiles);
    })
};