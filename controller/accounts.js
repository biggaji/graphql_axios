//settings control
const { db } = require('../configs/db');
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