const jwt = require('jsonwebtoken');

exports.verify = async (req,res,next) => {
    try {
        //get token

        const token = await req.headers.authorization || req.cookies.x_user;
        //validate token

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (e) {
        res.redirect('/u/signin');
    }
}