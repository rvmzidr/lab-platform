// Admin User Management Controller
// Handles user approval workflow and role management (Admin only)
// Day 3: User status lifecycle management

const { User } = require('../models');
const { Op } = require('sequelize');

// Get all users with optional status filtering
// GET /api/admin/users?status=PENDING
exports.getAllUsers = async (req, res) => {
  try {
    const { status, role } = req.query;
    
    // Build filter conditions
    const where = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] }, // Never return passwords
      include: [{
        model: User,
        as: 'approver',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [
        ['status', 'ASC'], // PENDING first
        ['createdAt', 'DESC']
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: User,
        as: 'approver',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: error.message
    });
  }
};

// Approve user (PENDING → APPROVED or REJECTED → APPROVED)
// PATCH /api/admin/users/:id/approve
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId; // From JWT middleware

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    // Prevent approving admin accounts
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be approved through this endpoint'
      });
    }

    // Check current status
    if (user.status === 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    await user.update({
      status: 'APPROVED',
      approvedById: adminId,
      approvedAt: new Date(),
      rejectionReason: null // Clear rejection reason if re-approving
    });

    // Fetch updated user with approver details
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: User,
        as: 'approver',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user',
      error: error.message
    });
  }
};

// Reject user (PENDING → REJECTED)
// PATCH /api/admin/users/:id/reject
// Body: { rejectionReason }
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.userId; // From JWT middleware

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be rejected'
      });
    }

    if (user.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject user with status ${user.status}. Only PENDING users can be rejected.`
      });
    }

    await user.update({
      status: 'REJECTED',
      approvedById: adminId,
      approvedAt: new Date(),
      rejectionReason: rejectionReason || 'No reason provided'
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: User,
        as: 'approver',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'User rejected successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user',
      error: error.message
    });
  }
};

// Disable user (APPROVED → DISABLED)
// PATCH /api/admin/users/:id/disable
exports.disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { disableReason } = req.body;
    const adminId = req.userId;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be disabled'
      });
    }

    if (user.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: `Cannot disable user with status ${user.status}. Only APPROVED users can be disabled.`
      });
    }

    await user.update({
      status: 'DISABLED',
      approvedById: adminId,
      approvedAt: new Date(),
      rejectionReason: disableReason || 'Account disabled by administrator'
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: 'User disabled successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable user',
      error: error.message
    });
  }
};

// Re-enable user (DISABLED → APPROVED)
// PATCH /api/admin/users/:id/enable
exports.enableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.userId;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    if (user.status !== 'DISABLED') {
      return res.status(400).json({
        success: false,
        message: `Cannot enable user with status ${user.status}. Only DISABLED users can be re-enabled.`
      });
    }

    await user.update({
      status: 'APPROVED',
      approvedById: adminId,
      approvedAt: new Date(),
      rejectionReason: null
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: 'User re-enabled successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error enabling user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable user',
      error: error.message
    });
  }
};

// Promote user role (Member → ProjectManager)
// PATCH /api/admin/users/:id/promote
// Body: { newRole }
exports.promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin role cannot be changed'
      });
    }

    const allowedRoles = ['projectManager', 'member'];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed values: ${allowedRoles.join(', ')}`
      });
    }

    if (user.role === newRole) {
      return res.status(400).json({
        success: false,
        message: `User already has role: ${newRole}`
      });
    }

    await user.update({
      role: newRole
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: `User role changed to ${newRole} successfully`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change user role',
      error: error.message
    });
  }
};
