import * as Sequelize from 'sequelize';

import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { ModelsInterface } from '../interfaces/ModelsInterface';

export interface PostAttibutes {
  id?: number;
  title?: string;
  content?: string;
  author?: number;
  createdAt?: string;
  updateAt?: string;
}

export interface PostInstances extends Sequelize.Instance<PostAttibutes> {}

export interface PostModel extends BaseModelInterface, Sequelize.Model<PostInstances, PostAttibutes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PostModel => {
  const Post: PostModel = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo: {
      type: DataTypes.BLOB({ length: 'long'}),
      allowNull: false
    }
  }, {
    tableName: 'posts'
  });

  Post.associate = (models: ModelsInterface): void => {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        field: 'author',
        name: 'author',
      }
    })
  };

  return Post;
};