const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    status: () => ({
      timestamp: new Date().toISOString(),
      message: 'Server is running',
      isRunning: true,
    }),
  },
  Mutation: {
    updateStatus: (_, { message }) => ({
      timestamp: new Date().toISOString(),
      message,
      isRunning: true,
    }),
  },
};

module.exports = resolvers;
