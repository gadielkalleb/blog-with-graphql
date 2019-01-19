import { makeExecutableSchema } from 'graphql-tools';

const users: object[] = [
  {
    id: 1,
    name: 'Jon',
    email: 'jon@gmail.com'
  },
  {
    id: 2,
    name: 'Dany',
    email: 'dany@gmail.com'
  },
];

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }
`;

const resolvers = {
  User: {
    id: (user: { id: number; }) => (user.id),
    name: (user: { name: string; }) => (user.name),
    email: (user: { email: string; }) => (user.email),
  },
  Query: {
    allUsers: () => users
  },
  Mutation: {
    createUser: (parent, args) => {
      const newUser = Object.assign({ id: users.length +1 }, args);
      users.push(newUser);
      return newUser;
    }
  }
};

export default makeExecutableSchema({ typeDefs, resolvers });