const { Router } = require('express');
// controllers
const { indexControl } = require('../controller/index');

const router = Router();

router.get('/',indexControl);

module.exports = router;