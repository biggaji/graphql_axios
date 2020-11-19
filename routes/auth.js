const router = require('express').Router();
const { enter,signin } = require('../controller/auth');

router.get('/signin', signin);
router.post('/enter',enter);

module.exports = router;