import * as jwt from 'jsonwebtoken';

import { UserInstance } from "../../../models/UserModels";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { JWT_SECRET } from '../../../utils/utils';

export const tokenResolvers = {

  Mutation: {
    createToken: (parent, { email, password }, {db}: {db: DbConnection}) => {
      return db.User.findOne({
        where: { email: email },
        attributes: ['id', 'password']
      })
      .then((user: UserInstance) => {
        const errorMessage = 'Unautorized, wrong email or password';
        if (!user || !user.isPassword(user.get('password'), password)) { 
          throw new Error(errorMessage);
        }
        const payload = { sub: user.get('id')};

        return {
          token: jwt.sign(payload, JWT_SECRET)
        }
      })
    }
  }
}