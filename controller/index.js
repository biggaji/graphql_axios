const fetch = require('node-fetch');

const api_url = 'http://localhost:4000/graphql';

exports.indexControl = async (req,res) => {
    try {
        const user = await req.cookies.isLoggedin;
        if(!user) {
            res.render('index');
        } else {
            res.redirect('/u/dashboard');
        }
    } catch (error) {
        console.log(error)
    }
}