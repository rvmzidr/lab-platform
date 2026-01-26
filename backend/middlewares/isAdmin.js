// Admin Role Check Middleware
// Verifies that authenticated user has 'admin' role
// Must be used after verifyToken middleware

const isAdmin = (req, res, next) => {
  // Check if user object exists (should be attached by verifyToken middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login first.'
    });
  }
  
  // Verify user has admin role (LabHead from UML diagram)
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  // User is admin, proceed to next middleware/controller
  next();
};

module.exports = isAdmin;
