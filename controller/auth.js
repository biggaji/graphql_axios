const fetch = require('node-fetch');
const {db} = require('../configs/db');
const jwt = require('jsonwebtoken');

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
                    authorid
                }
            }`
        })
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        if(data.data.signin === null) {
            res.redirect('/u/signin');
        } else {
            //sign user with jwt
            const user = data.data.signin
            // console.log(user)
            const signeduser = jwt.sign({authorid : user.authorid, username: user.username}, process.env.JWT_SECRET,{expiresIn : 3600 * 24});
            
            //store user in the cookie
            res.cookie("x_user", signeduser, {maxAge : 86400, httpOnly: true});
            res.cookie("isLoggedin", true);
            res.redirect('/u/dashboard');
        }
    })
    .catch(e => {
            res.redirect('/u/signin');
    });
}

//Dashboard controller

exports.dashboardControl = async (req,res) => {
    //get user data from the req.user
    const { authorid } = req.user;

    //find the user based on the authorid

    db.query('SELECT name, username, twitter_handle FROM author WHERE authorid = $1', [authorid])
    .then(author => {
        const authorData = author.rows[0];
        res.render('dashboard', {user: authorData})
    })
    .catch(e => {
        res.render('signin', {error: e})
    })
}

//get Twitter handle

exports.twit_handle = async (req,res) => {
    res.render('addtwitter');
}

//Add twitter handle

exports.add_twitter_handle = async (req,res) => {
    //get the twitter_handle fro req.body
    const { twitter_handle } = req.body;
    const { authorid } = req.user;
    
    //insert into db based on authorid

    db.query('UPDATE author SET twitter_handle = $1 WHERE authorid = $2 RETURNING twitter_handle',[twitter_handle,authorid])
    .then(th => {
        res.redirect('/u/dashboard');
    })
    .catch(e => {
        res.redirect('/u/utwitter');
    });
}