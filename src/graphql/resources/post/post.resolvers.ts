import { GraphQLResolveInfo } from "graphql";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstances } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { error } from "util";
import { handleError } from "../../../utils/utils";

const findByIdTransaction = (id, db) => {
  return new Promise((resolve) => (
    db.sequelize.transaction((t: Transaction) => (
      db.Post.findById(parseInt(id)).then((post: PostInstances) => {
        resolve(post)
      })
    ))
  ))
}

export const postResolvers = { 
  Post: {
    author: (post, args, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.User.findById(post.get('author'));
    },
    comments: (post, { first= 10, offset= 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Comment.findAll({
        where: { post: post.get('id')},
        limit: first,
        offset: offset,
      })
    },
  },

  Query: {
    posts: (parent, { first= 10, offset= 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Post.findAll({
        limit: first,
        offset: offset,
      }).catch(handleError);
    },

    post: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Post.findById(parseInt(id)).then((post: PostInstances) => {
        if (!post) throw new Error(`Post with id ${id} not found!`);
        return post;
      }).catch(handleError);
    },
  },

  Mutation: {
    createPost: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.create(input, { transaction: t });
      }).catch(handleError)
    },
    updatePost: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => (
      findByIdTransaction(id, db)
        .then(({post, t}) => post.update(input, { transaction: t }))
        .catch(handleError)
      // db.sequelize.transaction((t: Transaction) => (
      //   db.Post.findById(parseInt(id)).then((post: PostInstances) => {
      //     if (!post) throw new Error(`Post with id ${id} not found!`);
      //     return post.update(input, { transaction: t })
      //   })
      // ))
    ),
    deletePost: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      findByIdTransaction(id, db)
        .then(({post, t}) => post.destroy({ transaction: t }).then(post => !!post))
        .catch(handleError)
      
      // return db.sequelize.transaction((t: Transaction) => {
      //   return db.Post.findById(parseInt(id)).then((post: PostInstances) => {
      //     if (!post) throw new Error(`Post with id ${id} not found!`);
      //     return post.destroy({ transaction: t }).then(post => !!post)
      //   })
      // })
    },
  }
}
