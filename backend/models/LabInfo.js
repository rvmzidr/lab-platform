const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LabInfo = sequelize.define('LabInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  short_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  presentation: {
    type: DataTypes.TEXT
  },
  context: {
    type: DataTypes.TEXT
  },
  objectives: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  website: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'lab_info',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = LabInfo;
