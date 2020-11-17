if(process.env.NODE_ENV='development') {
  require('dotenv').config();
}
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('../graphql_axios/graphqlSchema/schema');
const app = express();

const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/graphql', (req,res,next) => 
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql:true,
    pretty: true,
    context: {
      req,
      res
    }
  })(req,res,next)
);

app.listen(4000, () => {
    console.log('server running ------------>>>>>>>✨✨✨✔✔');
});