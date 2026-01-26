// Institution Model
// Represents research institutions that contain multiple projects
// Institutions are managed by Admin/LabHead role

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Institution = sequelize.define('Institution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Unique identifier for each institution'
  },
  
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Institution name - cannot be empty'
  },
  
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Physical address of the institution'
  },
  
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Primary contact email for the institution'
  },
  
  contactPhone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Primary contact phone number'
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional information about the institution'
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the institution is currently active'
  }
}, {
  tableName: 'institutions',
  timestamps: true,
  comment: 'Research institutions that contain projects'
});

module.exports = Institution;
