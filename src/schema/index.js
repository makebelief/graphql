const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    """
    A simple greeting query
    """
    hello: String!
    
    """
    Get the current server status
    """
    status: ServerStatus!
  }

  type Mutation {
    """
    Update the server status
    """
    updateStatus(message: String!): ServerStatus!
  }

  type ServerStatus {
    """
    Current server timestamp
    """
    timestamp: String!
    
    ""
    Server status message
    """
    message: String!
    
    """
    Indicates if the server is running
    """
    isRunning: Boolean!
  }
`;

module.exports = typeDefs;
