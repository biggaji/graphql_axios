//settings control
const { db } = require('../configs/db');
// const multer = require('multer');
// const upload = multer({});
const fs = require('fs');

exports.settingspage = async (req, res) => {
    const { authorid } = req.user;

    db.query('SELECT * FROM author WHERE authorid = $1', [authorid])
        .then(user => {
            res.render('settings', { user: user.rows[0], pagename: "Account Settings" });
        })
        .catch(e => {
            res.render('settings', { error: e, pagename: "Account Settings" });
        })
}

// upload user profile image
exports.upload_avatar = async (req, res) => {

    const { authorid } = req.user;
    //store the image somewhere
    const file = 'C:\\Users\\user\\Desktop\\graphql_axios\\graphql_axios';
    const avatar = `${req.file.originalname}`;

    //store into db
    db.query('UPDATE author SET avatar = $1 WHERE authorid = $2 RETURNING avatar', [avatar, authorid])
        .then(avatar => {
            res.redirect('/u/dashboard');
        })
        .catch(e => { console.log(e); res.redirect('/u/signin') });
    // res.sendFile(`${file}//public//uploads//${req.file.originalname}`);
}