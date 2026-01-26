// User Model
// Represents all users in the lab platform system (Admin/LabHead, Project Managers, Members)
// The 'role' field controls access to projects, purchase requests, and scientific articles

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Unique identifier for each user'
  },
  
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User first name from UML diagram'
  },
  
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'User last name from UML diagram'
  },
  
  nationalId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Unique national identification number'
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'User email address for authentication and communication'
  },
  
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Bcrypt hashed password for secure authentication'
  },
  
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    allowNull: false,
    defaultValue: 'member',
    comment: `User role controlling access permissions:
      - admin: LabHead from UML, has full access to all resources, can validate purchase requests and supervise projects
      - member: Can view assigned projects and articles, limited access`
  },
  
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISABLED'),
    allowNull: false,
    defaultValue: 'PENDING',
    comment: `User account status for approval workflow:
      - PENDING: New registration awaiting Lab Head approval, cannot login
      - APPROVED: Approved by Lab Head, can login and access system
      - REJECTED: Registration rejected by Lab Head, cannot login or re-register
      - DISABLED: Previously approved user has been disabled, cannot login`
  },
  
  approvedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    comment: 'ID of admin who approved/rejected this user'
  },
  
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when user was approved/rejected'
  },
  
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for account rejection if status is REJECTED'
  }
}, {
  tableName: 'users',
  timestamps: true, // Adds createdAt and updatedAt fields automatically
  comment: 'Stores all user accounts with role-based access control and approval workflow for the lab platform'
});

module.exports = User;
