const fetch = require('node-fetch');

const api_url = 'http://localhost:4000/graphql';

exports.indexControl = async (req,res) => {
    try {
        const loggeduser = await req.cookies.isLoggedin;
        const loggedOut = await req.cookies.isLoggedOut;
        // console.log(user)
        if(loggedOut) {
            res.render('index');
        } else if (loggeduser) {
            res.redirect('/u/dashboard');
        } else {
            res.redirect("/index");
        }
    } catch (error) {
        console.log(error)
    }
}