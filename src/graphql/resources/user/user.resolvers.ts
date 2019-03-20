import { Transaction } from "sequelize";
import { GraphQLResolveInfo } from "graphql";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UserInstance } from "../../../models/UserModels";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolve";
import { AuthUser } from "../../../interfaces/AuthUserInterface";

const findByIdUser = (db, { id }) => {
  return new Promise((resolve) => {
    return db.User
      .findById(id)
      .then((user: UserInstance) => {
        if(!user) {
          throwError(!user, `User with id ${id} not found!`);
        }
        return resolve(user);
      })
  })
}

export const userResolvers = {

  User: {

    posts: (user, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.Post.findAll({
        where: { author: user.get('id') },
        limit: first,
        offset: offset
      }).catch(handleError)
    },

  },

  Query: {

    users: (parent, { first = 10, offset = 0 }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.User.findAll({
        limit: first,
        offset: offset
      }).catch(handleError);
    },

    user: (parent, { id }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      const userId = { id: parseInt(id) };
      return findByIdUser(db, userId)
        .then((user: UserInstance) => user)
        .catch(handleError);
    },

    currentUser: compose(...authResolvers)
      ((parent, args, { db, authUser }: { db: DbConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
        return findByIdUser(db, authUser)
          .then((user: UserInstance) => user)
          .catch(handleError)
      }),
  },

  Mutation: {

    createUser: (parent, { input }, { db }: { db: DbConnection }, info: GraphQLResolveInfo) => {
      return db.sequelize.transaction(
        (t: Transaction) => {
          return db.User.create(input, { transaction: t })
        })
        .catch(handleError);
    },

    updateUser: compose(...authResolvers)
      ((parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
        return db.sequelize.transaction(
          (t: Transaction) =>
            findByIdUser(db, authUser)
              .then((user: UserInstance) =>
                user.update(input, { transaction: t }))
        )
          .catch(handleError)
      }),

    updateUserPassword: compose(...authResolvers)
      ((parent, { input }, { db, authUser }: { db: DbConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
        return db.sequelize.transaction(
          (t: Transaction) => {
            return findByIdUser(db, authUser)
              .then((user: UserInstance) =>
                user.update(input, { transaction: t })
                  .then((user: UserInstance) => !!user))
          })
          .catch(handleError)
      }),

    deleteUser: compose(...authResolvers)
      ((parent, args, { db, authUser }: { db: DbConnection, authUser: AuthUser }, info: GraphQLResolveInfo) => {
        return db.sequelize.transaction(
          (t: Transaction) => {
            return findByIdUser(db, authUser)
              .then((user: UserInstance) =>
                user.destroy({ transaction: t })
                  .then((user: any) => !!user))
          })
          .catch(handleError)
      }),

  }

}