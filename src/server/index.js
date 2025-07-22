const { ApolloServer } = require('apollo-server');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Authentication and other context setup will go here
    return { /* context object */ };
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
