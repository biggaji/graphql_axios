const { db } = require('../configs/db');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLInt, GraphQLError } = require('graphql');
const { generateuuid } = require('../utils/generateuuid');

//create a graphql object type

//author type
const AuthorType = new GraphQLObjectType({
    name: "author",
    fields: () => ({
        authorid : {type : GraphQLString},
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        date_of_birth: {type:GraphQLString},
        twitter_username: {type: GraphQLString}
    })
});

//book type
const BookType = new GraphQLObjectType({
    name: "book",
    fields: () => ({
        bookid: {type: GraphQLString},
        name: {type: GraphQLString},
        authorid: {type: GraphQLString},
        year: {type: GraphQLInt}
    })
});

//ROOT QUERY - baseline for all queries the resolvers

const rootQuery = new GraphQLObjectType({
    name: "root",
    fields: {
        author: {
            type: AuthorType,
            args: {authorid: {type: GraphQLString}},
            async resolve(parent,args,req) {
               let author = await db.query('SELECT * FROM Author WHERE authorid = $1', [args.authorid]);
               return author.rows[0];
            }
        },
        book: {
            type: BookType,
            args: {bookid: {type: GraphQLString}},
            async resolve(parent,args,req) {
                let book = await db.query('SELECT * FROM books WHERE bookid = $1', [args.bookid]);
                return book.rows[0];
            }
        }
    }
});

/**
 * @param {object} mutation - Graphql mutations for performing crud operations
 * @returns {object} data - Expected to return an array of objects
 */

//Mutations
const Mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        createAuthor: {
            type : AuthorType,
            args: {
                name : {type : new GraphQLNonNull(GraphQLString)},
                username : {type : new GraphQLNonNull(GraphQLString)},
                date_of_birth : {type : new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,args,request) {
                //dbwork
                //generate authorid using generateuuid()
                const authorid = generateuuid();
                const { name, username, date_of_birth } = args;
                const author = await db.query('INSERT INTO author (authorid,name,username,date_of_birth) VALUES($1,$2,$3,$4) RETURNING name, username, date_of_birth',[authorid,name,username,date_of_birth])
                return author.rows[0];
            }
        },
        createBook: {
            type: BookType,
            args: {
                name: { type : new GraphQLNonNull(GraphQLString)},
                year_of_release: { type: new GraphQLNonNull(GraphQLInt)}
            },
            async resolve(parent,args,req){
                const bookid = generateuuid();
                const { authorid } = req.user;
                const { name, year_of_release } = req.user;
                const book = await db.query('INSERT INTO books (bookid,name,year_of_release,authorid) VALUES($1,$2,$3,$4) RETURNING *', [bookid,name,year_of_release,authorid]);
                return book.rows[0];
            }
        },
        signin: {
            type: AuthorType,
            args: {
                username : {type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,args,{ res },info){
                //check if user is available
                const { username } = args;
                const user = await db.query('SELECT * FROM author WHERE username = $1',[username]);
                if(user.rows[0].username !== username) {
                    throw new GraphQLError('No user with that username');
                } else {
                    return user.rows[0];
                }
            }
        },
        addTwitterHandle: {
            type: AuthorType,
            args: {twitter_username : {type: new GraphQLNonNull(GraphQLString)}},
            async resolve(parent,args,{req, res},info) {
                //Store handle inside db where authorid = authorid
                const { twitter_username } = args;
                const { authorid } = req.user;
                db.query('INSERT INTO author(twitter_handle) VALUES($1) WHERE authorid = $2',[twitter_username,authorid])
                .then(twitter => {
                    return twitter.rows[0]
                })
                .catch(err => {
                    throw new GraphQLError("An error occured when inserting twitter handle", err);
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : rootQuery,
    mutation: Mutation
})