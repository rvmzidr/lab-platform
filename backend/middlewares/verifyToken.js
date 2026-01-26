// Token Verification Middleware
// Extracts and verifies JWT token from Authorization header
// Attaches authenticated user ID to request object for downstream use

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  // Extract token from Authorization header
  // Expected format: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No authorization token provided'
    });
  }
  
  // Extract token part after "Bearer "
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization header format. Use: Bearer <token>'
    });
  }
  
  try {
    // Verify token signature and decode payload
    const decoded = jwt.verify(token, authConfig.secret);
    
    // Attach user ID to request object for use in controllers
    req.userId = decoded.id;
    
    // Optionally load full user object for convenience
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found for provided token'
      });
    }
    
    req.user = user;
    next();
    
  } catch (error) {
    // Token verification failed (expired, invalid signature, etc.)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

module.exports = verifyToken;
