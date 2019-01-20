import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CommentInstance } from "../../../models/CommentModel";

export const commentResolvers = {

  Comment: {
    user: (comment, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.User.findById(comment.get('user'));
    },
    post: (comment, args, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.Post.findById(comment.get('post'));
    },
  },

  Query: {
    commentsByPost: (parent, { posdtId, first= 10, offset = 0 }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.Comment.findAll({
        where: { post: posdtId },
        limit: first,
        offset,
      })
    },
  },

  Mutation: {
    // createComment(input: CommentInput!): Comment
    // updateComment(id: ID!, input: CommentInput!): Comment
    // deleteComment(id: ID!): Boolean

    createComment: (parent, { input }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment.create(input, { transaction: t })
      })
    },

    updateComment: (parent, { id, input }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment
          .findById(parseInt(id))
          .then((comment: CommentInstance) => {
            if (!comment) throw new Error(`Comment with id ${id} not found!`);
            return comment.update(input, { transaction: t });
          })
      })
    },

    deleteComment: (parent, { id, input }, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Comment
          .findById(parseInt(id))
          .then((comment: CommentInstance) => {
            if (!comment) throw new Error(`Comment with id ${id} not found!`);
            return comment.destroy({ transaction: t }).then(comment => !!comment);
          })
      })
    },
  }
}