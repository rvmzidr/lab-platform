const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expertise: {
    type: DataTypes.TEXT
  },
  objectives: {
    type: DataTypes.TEXT
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'teams',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Team;
