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
        console.log(e.name + " " + e.message);
        res.send('You need to be authenticated to Login first in order to access this route');
    }
}