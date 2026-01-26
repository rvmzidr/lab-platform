// Test Controller
// Provides endpoints to test authentication and role-based access control
// Three levels: public (no auth), protected (valid token), admin-only (admin role)

// Public Content Endpoint
// GET /api/test/public
// No authentication required - accessible to everyone
exports.publicContent = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Public content accessible to everyone',
    data: {
      content: 'This is public information about the Lab Platform. Anyone can view this without authentication.'
    }
  });
};

// Protected Content Endpoint
// GET /api/test/protected
// Requires valid JWT token - accessible to all authenticated users
exports.protectedContent = (req, res) => {
  // req.user is attached by verifyToken middleware
  return res.status(200).json({
    success: true,
    message: 'Protected content for authenticated users',
    data: {
      content: 'This is protected information. You are authenticated.',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        fullName: `${req.user.firstName} ${req.user.lastName}`
      }
    }
  });
};

// Admin-Only Content Endpoint
// GET /api/test/admin
// Requires valid JWT token AND admin role - accessible only to administrators
exports.adminContent = (req, res) => {
  // req.user is attached by verifyToken middleware
  // Role is verified by isAdmin middleware
  return res.status(200).json({
    success: true,
    message: 'Admin-only content for laboratory heads',
    data: {
      content: 'This is administrative information. Only Lab Head (admin) can access this.',
      admin: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        privileges: [
          'Manage all projects',
          'Approve purchase requests',
          'Supervise project managers',
          'Access scientific articles repository',
          'Manage user accounts'
        ]
      }
    }
  });
};
