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
        console.log(e);
        throw new Error('You need to be authenticated to access this route');
    }
}