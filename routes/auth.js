const router = require('express').Router();
const { enter,signin, dashboardControl } = require('../controller/auth');
const { verify } = require('../utils/verifyUser');

router.get('/signin', signin);
router.post('/enter',enter);
router.get('/dashboard',verify, dashboardControl)

module.exports = router;