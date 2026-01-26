// Admin Routes
// User management endpoints (Admin/LabHead only)
// Day 3: User approval workflow

const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middlewares');

// All routes require Admin authentication
router.use(verifyToken);
router.use(isAdmin);

// GET /api/admin/users - Get all users (with optional filtering)
// Query params: status (PENDING, APPROVED, REJECTED, DISABLED), role
router.get('/users', adminController.getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', adminController.getUserById);

// PATCH /api/admin/users/:id/approve - Approve user (PENDING → APPROVED or REJECTED → APPROVED)
router.patch('/users/:id/approve', adminController.approveUser);

// PATCH /api/admin/users/:id/reject - Reject user (PENDING → REJECTED)
router.patch('/users/:id/reject', adminController.rejectUser);

// PATCH /api/admin/users/:id/disable - Disable user (APPROVED → DISABLED)
router.patch('/users/:id/disable', adminController.disableUser);

// PATCH /api/admin/users/:id/enable - Re-enable user (DISABLED → APPROVED)
router.patch('/users/:id/enable', adminController.enableUser);

// PATCH /api/admin/users/:id/promote - Change user role
router.patch('/users/:id/promote', adminController.promoteUser);

module.exports = router;
