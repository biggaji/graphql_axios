const { Router } = require('express');
const { verify } = require('../utils/verifyUser');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const file = 'C:\\Users\\user\\Desktop\\graphql_axios\\graphql_axios';
        cb(null, 'C:\\Users\\user\\Desktop\\graphql_axios\\graphql_axios/public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
// controllers
const { settingspage, upload_avatar } = require('../controller/accounts');

const router = Router();

router.get('/settings', verify, settingspage);
router.post('/upload_avatar', verify, upload.single('avatar'), upload_avatar);

module.exports = router;