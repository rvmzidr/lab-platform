// Project Model
// Represents research projects within an institution
// Projects are managed by ProjectManager role and contain purchase requests

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Unique identifier for each project'
  },
  
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Project name - cannot be empty'
  },
  
  source: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Funding source or origin of the project'
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the project'
  },
  
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Project start date'
  },
  
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Project end date'
  },
  
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    },
    comment: 'Total project budget'
  },
  
  institutionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'institutions',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'Foreign key to institution (Institution contains Projects)'
  },
  
  projectManagerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    comment: 'Foreign key to user who manages this project (ProjectManager role)'
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the project is currently active'
  }
}, {
  tableName: 'projects',
  timestamps: true,
  comment: 'Research projects within institutions'
});

module.exports = Project;
