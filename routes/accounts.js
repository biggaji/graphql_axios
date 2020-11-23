const { Router } = require('express');
const { verify } = require('../utils/verifyUser');
// controllers
const { settingspage } = require('../controller/accounts');

const router = Router();

router.get('/settings', verify, settingspage);

module.exports = router;