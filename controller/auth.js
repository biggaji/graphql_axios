const fetch = require('node-fetch');

const API_ENDPOINT = "http://localhost:4000/graphql";

exports.signin = async (req,res) => {
    res.render('signin');
}

exports.enter = async (req,res) => {
    // Get the data from
    // console.log(req.body)
    // res.send(req.body);
    const { username } = req.body;
    fetch(API_ENDPOINT, {
        method: "post",
        headers: {
            'Content-type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify({query:
        `mutation { 
            signin(username: "${username}"){
                    name
                    username
                    twitter_username
                }
            }`
        })
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        // res.send(data)
        res.redirect('/u/dashboard');
    })
    .catch(e => {
        res.send(e)
    })
}