const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLSchema, GraphQLInt } = require('graphql');

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

//ROOT QUERY - baseline for all queries

const rootQuery = new GraphQLObjectType({
    name: "root",
    fields: {
        author: {
            type: AuthorType,
            args: {authorid: {type: GraphQLString}},
            resolve(parent,args,req) {
                //args.bookid
            }
        },
        book: {
            type: BookType,
            args: {bookid: {type: GraphQLString}},
            resolve(parent,args,req) {
                //args.bookid
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : rootQuery
})