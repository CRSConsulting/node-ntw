const router = require('express').Router();
const mobilesController = require('../controllers/mobiles.controller')();

module.exports = router;


router.get('/', mobilesController.getAll);
router.get('/keyword', mobilesController.getKeywordAndInsert);
router.post('/sms', mobilesController.insertSMS);

