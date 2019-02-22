import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { Query } from './query';
import { Mutation } from './mutation';

import { userTypes } from './resources/user/user.schema';
import { postTypes } from './resources/post/post.schema';
import { commentTypes } from './resources/comment/comment.schema';
import { tokenTypes } from './resources/token/token.schema';

import { userResolvers } from './resources/user/user.resolvers';
import { postResolvers } from './resources/post/post.resolvers';
import { commentResolvers } from './resources/comment/comment.resolvers';
import { tokenResolvers } from './resources/token/token.resolvers';

const resolvers = merge(
  commentResolvers,
  postResolvers,
  tokenResolvers,
  userResolvers
)

const SchemaDefinition = `
  type Schema {
    query: Query
    mutation: Mutation
  }
`;

export default makeExecutableSchema(
  { 
    typeDefs: [
      SchemaDefinition,
      Query,
      Mutation,
      commentTypes,
      postTypes,
      tokenTypes,
      userTypes,
    ],
    resolvers
  }
);
