// Test Routes
// Demonstrates authentication and role-based access control flow
// Three endpoints: public, protected (requires token), admin-only (requires admin role)

const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const { verifyToken, isAdmin } = require('../middlewares');

// GET /api/test/public - Public endpoint
// No authentication required - accessible to everyone
router.get('/public', testController.publicContent);

// GET /api/test/protected - Protected endpoint
// Requires valid JWT token in Authorization header
// Middleware chain: verifyToken extracts user from token
router.get('/protected', verifyToken, testController.protectedContent);

// GET /api/test/admin - Admin-only endpoint
// Requires valid JWT token AND admin role
// Middleware chain: verifyToken -> isAdmin -> controller
router.get('/admin', verifyToken, isAdmin, testController.adminContent);

module.exports = router;
