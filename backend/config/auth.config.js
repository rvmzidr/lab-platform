// JWT Configuration
// This module exports JWT settings for token generation and verification

require('dotenv').config();

module.exports = {
  // Secret key used for signing and verifying JWT tokens
  // IMPORTANT: Change this to a strong, random string in production
  secret: process.env.JWT_SECRET || 'lab_platform_secret_key_2026',
  
  // Token expiration time
  // Format: number + time unit (s=seconds, m=minutes, h=hours, d=days)
  // Example: '24h' = 24 hours, '7d' = 7 days
  expiresIn: process.env.JWT_EXPIRATION || '24h'
};
