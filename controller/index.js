const fetch = require('node-fetch');

const api_url = 'http://localhost:4000/graphql';

exports.indexControl = async (req,res) => {
    fetch(api_url,{
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
            'Accept': 'Application/json',
        },
        body : JSON.stringify({query: '\n query {\n author(authorid: "3e8c9e1e-692e-4dc0-969c-2f1b33296694") {\n name \n username \n }\n }\n'})
    })
    .then(resp => {
        return resp.json();
    })
    .then(data => {
        res.render('index',{user : data.data.author});
    })
}