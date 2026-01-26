const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Unique identifier for the article'
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: 'Title of the scientific article'
    },
    abstract: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Abstract or summary of the article'
    },
    authors: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: 'List of authors (comma-separated or formatted string)'
    },
    keywords: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Keywords for the article (comma-separated)'
    },
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date when the article was published'
    },
    journal: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Journal or conference name where the article was published'
    },
    doi: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Digital Object Identifier (DOI) for the article'
    },
    pdfUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to the PDF version of the article'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Publication status of the article'
    },
    visibility: {
      type: DataTypes.ENUM('public', 'members_only'),
      allowNull: false,
      defaultValue: 'members_only',
      comment: 'Visibility level - public or members only'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      comment: 'Author/submitter of the article (lab member)'
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'Associated research project (optional)'
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'teams',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'Associated research team (optional)'
    }
  }, {
    tableName: 'articles',
    timestamps: true,
    comment: 'Scientific articles published by the laboratory',
    indexes: [
      {
        name: 'idx_article_status',
        fields: ['status']
      },
      {
        name: 'idx_article_visibility',
        fields: ['visibility']
      },
      {
        name: 'idx_article_publication_date',
        fields: ['publicationDate']
      },
      {
        name: 'idx_article_user',
        fields: ['userId']
      },
      {
        name: 'idx_article_project',
        fields: ['projectId']
      },
      {
        name: 'idx_article_team',
        fields: ['teamId']
      }
    ]
  });

module.exports = Article;
