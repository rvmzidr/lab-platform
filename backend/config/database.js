// Database configuration using environment variables
// This module exports Sequelize instance configured for MySQL connection with Laragon

const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL configuration for Laragon
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name for the lab platform
  process.env.DB_USER,     // Database username
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST,           // Database host address (localhost for Laragon)
    port: process.env.DB_PORT || 3306,   // Database port (default MySQL port)
    dialect: 'mysql',                     // Database type
    logging: false,                       // Disable SQL query logging (set to console.log for debugging)
    pool: {
      max: 5,                             // Maximum number of connections in pool
      min: 0,                             // Minimum number of connections in pool
      acquire: 30000,                     // Maximum time (ms) to get connection before error
      idle: 10000                         // Maximum time (ms) a connection can be idle
    }
  }
);

console.log('Using MySQL database (Laragon)');

module.exports = sequelize;
