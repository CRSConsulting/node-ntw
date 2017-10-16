const router = require('express').Router();
const tangosController = require('../controllers/tangos.controller')();

module.exports = router;

router.post('/', tangosController.insert);
