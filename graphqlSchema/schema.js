const { db } = require('../configs/db');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLInt } = require('graphql');
const { generateuuid } = require('../utils/generateuuid');

//create a graphql object type

//author type
const AuthorType = new GraphQLObjectType({
    name: "author",
    fields: () => ({
        authorid : {type : GraphQLString},
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        date_of_birth: {type:GraphQLString}
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
        }
    }
})

module.exports = new GraphQLSchema({
    query : rootQuery,
    mutation: Mutation
})