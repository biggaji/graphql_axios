if (process.env.NODE_ENV = 'development') {
  require('dotenv').config();
}
const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('../graphql_axios/graphqlSchema/schema');
const app = express();
const exphbs = require('express-handlebars');
const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const accountsRouter = require('./routes/accounts')
const cookieParser = require('cookie-parser');
const session = require('express-session');

//template engine config
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

//public
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/u', authRouter);
app.use('/account', accountsRouter);

app.use('/graphql', async (req, res, next) =>
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true,
    pretty: true,
    context: {
      req,
      res
    }
  })(req, res, next)
);

app.listen(4000, () => {
  console.log('server running ------------>>>>>>>✨✨✨');
});