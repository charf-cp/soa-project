const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const grpcClient = require('./grpcClient');                   // User service client
const verificationClient = require('./grpcVerificationClient'); // Verification service client
const ssiClient = require('./grpcSsiClient');                 // SSI service client

const app = express();
const PORT = 3000;

const schema = buildSchema(`
  type User {
    userId: String
    name: String
    email: String
  }

  type Verification {
    verified: Boolean
    message: String
  }

  type SSIResponse {
    userId: String
    name: String
    email: String
    verified: Boolean
    message: String
  }

  type Query {
    hello: String
    getUser(userId: String!): User
    verifyUser(userId: String!, credential: String!): Verification
    verifyFullIdentity(userId: String!, credential: String!): SSIResponse
  }
`);

const root = {
  hello: () => 'Hello from SSI Gateway 👋',

  getUser: ({ userId }) => {
    return new Promise((resolve, reject) => {
      grpcClient.GetUser({ userId }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  },

  verifyUser: ({ userId, credential }) => {
    return new Promise((resolve, reject) => {
      verificationClient.VerifyUser({ userId, credential }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  },

  verifyFullIdentity: ({ userId, credential }) => {
    return new Promise((resolve, reject) => {
      ssiClient.VerifyFullIdentity({ userId, credential }, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from SSI Gateway 👋' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
