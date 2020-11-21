const router = require('express').Router();
const { enter,signin, dashboardControl,add_twitter_handle, twit_handle, logout } = require('../controller/auth');
const { verify } = require('../utils/verifyUser');

router.get('/signin', signin);
router.post('/enter',enter);
router.get('/dashboard',verify, dashboardControl)
router.get('/utwitter', verify,twit_handle);
router.post('/twit', verify, add_twitter_handle);
router.post('/logout', verify,logout);

module.exports = router;