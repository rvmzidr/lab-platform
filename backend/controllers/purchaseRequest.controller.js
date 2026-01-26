// Purchase Request Controller
// Handles all purchase request operations with status lifecycle management
// Status transitions: DRAFT → PENDING → APPROVED/REJECTED → DELIVERED
//
// Authorization rules:
// - Admin/LabHead: full access (create, approve, reject, deliver, delete)
// - ProjectManager: manage requests for their projects (create, submit, view)
// - Member: create draft requests, submit for approval

const { PurchaseRequest, Project, User } = require('../models');
const { Op } = require('sequelize');

// Status constants (must match model definition)
const Status = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELIVERED: 'DELIVERED'
};

// Valid status transitions
const VALID_TRANSITIONS = {
  [Status.DRAFT]: [Status.PENDING],
  [Status.PENDING]: [Status.APPROVED, Status.REJECTED],
  [Status.APPROVED]: [Status.DELIVERED],
  [Status.REJECTED]: [],
  [Status.DELIVERED]: []
};

// Helper function to validate status transition
const canTransition = (currentStatus, newStatus) => {
  const allowedStatuses = VALID_TRANSITIONS[currentStatus] || [];
  return allowedStatuses.includes(newStatus);
};

// Get all purchase requests with filtering
exports.getAllPurchaseRequests = async (req, res) => {
  try {
    const { status, projectId, requestedById, startDate, endDate } = req.query;
    
    // Build filter conditions
    const where = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    if (requestedById) where.requestedById = requestedById;
    
    // Date range filtering
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const purchaseRequests = await PurchaseRequest.findAll({
      where,
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source'],
          include: [{
            model: User,
            as: 'projectManager',
            attributes: ['id', 'firstName', 'lastName']
          }]
        },
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Purchase requests retrieved successfully',
      data: purchaseRequests
    });
  } catch (error) {
    console.error('Error fetching purchase requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve purchase requests',
      error: error.message
    });
  }
};

// Get purchase request by ID
exports.getPurchaseRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const purchaseRequest = await PurchaseRequest.findByPk(id, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'source', 'budget']
        },
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Purchase request retrieved successfully',
      data: purchaseRequest
    });
  } catch (error) {
    console.error('Error fetching purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve purchase request',
      error: error.message
    });
  }
};

// Create new purchase request (starts as DRAFT)
exports.createPurchaseRequest = async (req, res) => {
  try {
    const { itemName, description, quantity, estimatedPrice, projectId, notes } = req.body;
    const userId = req.userId; // From JWT middleware

    // Validate required fields
    if (!itemName || itemName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required and cannot be empty'
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    if (estimatedPrice === undefined || estimatedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estimated price is required and must be non-negative'
      });
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with ID ${projectId} not found`
      });
    }

    const purchaseRequest = await PurchaseRequest.create({
      itemName: itemName.trim(),
      description,
      quantity,
      estimatedPrice,
      totalPrice: quantity * estimatedPrice,
      status: Status.DRAFT,
      projectId,
      requestedById: userId,
      notes
    });

    // Fetch complete purchase request with associations
    const completePurchaseRequest = await PurchaseRequest.findByPk(purchaseRequest.id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name', 'source'] },
        { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Purchase request created successfully as DRAFT',
      data: completePurchaseRequest
    });
  } catch (error) {
    console.error('Error creating purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase request',
      error: error.message
    });
  }
};

// Update purchase request (only allowed in DRAFT status)
exports.updatePurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, description, quantity, estimatedPrice, notes } = req.body;

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    // Only DRAFT requests can be edited
    if (purchaseRequest.status !== Status.DRAFT) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit purchase request in ${purchaseRequest.status} status. Only DRAFT requests can be edited.`
      });
    }

    // Validate fields if provided
    if (itemName !== undefined && itemName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Item name cannot be empty'
      });
    }

    if (quantity !== undefined && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    if (estimatedPrice !== undefined && estimatedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Estimated price must be non-negative'
      });
    }

    // Calculate new total price if quantity or price changed
    const newQuantity = quantity !== undefined ? quantity : purchaseRequest.quantity;
    const newPrice = estimatedPrice !== undefined ? estimatedPrice : purchaseRequest.estimatedPrice;

    await purchaseRequest.update({
      itemName: itemName ? itemName.trim() : purchaseRequest.itemName,
      description: description !== undefined ? description : purchaseRequest.description,
      quantity: newQuantity,
      estimatedPrice: newPrice,
      totalPrice: newQuantity * newPrice,
      notes: notes !== undefined ? notes : purchaseRequest.notes
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request updated successfully',
      data: purchaseRequest
    });
  } catch (error) {
    console.error('Error updating purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase request',
      error: error.message
    });
  }
};

// Submit purchase request (DRAFT → PENDING)
exports.submitPurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    if (!canTransition(purchaseRequest.status, Status.PENDING)) {
      return res.status(400).json({
        success: false,
        message: `Cannot submit purchase request. Current status is ${purchaseRequest.status}. Only DRAFT requests can be submitted.`
      });
    }

    await purchaseRequest.update({
      status: Status.PENDING
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request submitted successfully and is now pending approval',
      data: purchaseRequest
    });
  } catch (error) {
    console.error('Error submitting purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit purchase request',
      error: error.message
    });
  }
};

// Approve purchase request (PENDING → APPROVED) - Admin only
exports.approvePurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // From JWT middleware

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    if (!canTransition(purchaseRequest.status, Status.APPROVED)) {
      return res.status(400).json({
        success: false,
        message: `Cannot approve purchase request. Current status is ${purchaseRequest.status}. Only PENDING requests can be approved.`
      });
    }

    await purchaseRequest.update({
      status: Status.APPROVED,
      reviewedById: userId,
      reviewedAt: new Date()
    });

    // Fetch updated request with associations
    const updatedRequest = await PurchaseRequest.findByPk(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request approved successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error approving purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve purchase request',
      error: error.message
    });
  }
};

// Reject purchase request (PENDING → REJECTED) - Admin only
exports.rejectPurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const userId = req.userId; // From JWT middleware

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    if (!canTransition(purchaseRequest.status, Status.REJECTED)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject purchase request. Current status is ${purchaseRequest.status}. Only PENDING requests can be rejected.`
      });
    }

    await purchaseRequest.update({
      status: Status.REJECTED,
      reviewedById: userId,
      reviewedAt: new Date(),
      rejectionReason: rejectionReason || 'No reason provided'
    });

    // Fetch updated request with associations
    const updatedRequest = await PurchaseRequest.findByPk(id, {
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'reviewer', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request rejected successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error rejecting purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject purchase request',
      error: error.message
    });
  }
};

// Mark purchase request as delivered (APPROVED → DELIVERED) - Admin only
exports.markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    if (!canTransition(purchaseRequest.status, Status.DELIVERED)) {
      return res.status(400).json({
        success: false,
        message: `Cannot mark as delivered. Current status is ${purchaseRequest.status}. Only APPROVED requests can be marked as delivered.`
      });
    }

    await purchaseRequest.update({
      status: Status.DELIVERED,
      deliveredAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Purchase request marked as delivered successfully',
      data: purchaseRequest
    });
  } catch (error) {
    console.error('Error marking purchase request as delivered:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark purchase request as delivered',
      error: error.message
    });
  }
};

// Delete purchase request (Admin only, or requester if still DRAFT)
exports.deletePurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseRequest = await PurchaseRequest.findByPk(id);

    if (!purchaseRequest) {
      return res.status(404).json({
        success: false,
        message: `Purchase request with ID ${id} not found`
      });
    }

    await purchaseRequest.destroy();

    res.status(200).json({
      success: true,
      message: 'Purchase request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting purchase request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete purchase request',
      error: error.message
    });
  }
};
