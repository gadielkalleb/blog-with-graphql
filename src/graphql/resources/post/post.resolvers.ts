import { GraphQLResolveInfo } from "graphql";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { PostInstances } from "../../../models/PostModel";
import { Transaction } from "sequelize";
import { error } from "util";

const findByIdTransaction = (id, db) => {
  return new Promise((resolve, reject) => (
    db.sequelize.transaction((t: Transaction) => (
      db.Post.findById(parseInt(id)).then((post: PostInstances) => {
        if (!post) {
          reject({ error: new Error(`Post with id ${id} not found!`)} )
        }
        resolve({ post, t })
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
      })
    },

    post: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Post.findById(parseInt(id)).then((post: PostInstances) => {
        if (!post) throw new Error(`Post with id ${id} not found!`);
        return post;
      });
    },
  },

  Mutation: {
    createPost: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction((t: Transaction) => {
        return db.Post.create(input, { transaction: t });
      })
    },
    updatePost: (parent, { id, input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => (
      findByIdTransaction(id, db)
        .then(({post, t}) => post.update(input, { transaction: t }))
        .catch(({ error }) => {
          return error
        })
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
        .catch(({ error }) => {
          return error
        })
      
      // return db.sequelize.transaction((t: Transaction) => {
      //   return db.Post.findById(parseInt(id)).then((post: PostInstances) => {
      //     if (!post) throw new Error(`Post with id ${id} not found!`);
      //     return post.destroy({ transaction: t }).then(post => !!post)
      //   })
      // })
    },
  }
}
