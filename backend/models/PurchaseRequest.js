// Purchase Request Model
// Represents purchase requests within a project with defined status lifecycle
// Status transitions: DRAFT → PENDING → APPROVED/REJECTED → DELIVERED (if APPROVED)
//
// STATUS LIFECYCLE DOCUMENTATION:
// - DRAFT: Initial state when created by Member or ProjectManager
//          Can be edited freely, not yet submitted for approval
//          Transition: DRAFT → PENDING (when submitted)
//
// - PENDING: Request submitted and awaiting Admin/LabHead approval
//            Cannot be edited by requester anymore
//            Transition: PENDING → APPROVED (approved by Admin)
//                       PENDING → REJECTED (rejected by Admin)
//
// - APPROVED: Request approved by Admin/LabHead, ready for procurement
//             Cannot be edited or cancelled
//             Transition: APPROVED → DELIVERED (when items are received)
//
// - REJECTED: Request rejected by Admin/LabHead
//             Terminal state, no further transitions allowed
//
// - DELIVERED: Items have been received and request is complete
//              Terminal state, no further transitions allowed

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define valid statuses as constants for reuse
const PurchaseRequestStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELIVERED: 'DELIVERED'
};

const PurchaseRequest = sequelize.define('PurchaseRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Unique identifier for each purchase request'
  },
  
  itemName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Name of the item to purchase - cannot be empty'
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the item and purpose'
  },
  
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    },
    comment: 'Quantity requested - must be positive'
  },
  
  estimatedPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'Estimated price per unit - must be non-negative'
  },
  
  totalPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Total price (quantity × estimatedPrice), calculated automatically'
  },
  
  status: {
    type: DataTypes.ENUM(
      PurchaseRequestStatus.DRAFT,
      PurchaseRequestStatus.PENDING,
      PurchaseRequestStatus.APPROVED,
      PurchaseRequestStatus.REJECTED,
      PurchaseRequestStatus.DELIVERED
    ),
    allowNull: false,
    defaultValue: PurchaseRequestStatus.DRAFT,
    comment: 'Current status in the purchase request lifecycle'
  },
  
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'projects',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'Foreign key to project (Project contains PurchaseRequests)'
  },
  
  requestedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    comment: 'Foreign key to user who created this request'
  },
  
  reviewedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    comment: 'Foreign key to Admin/LabHead who approved/rejected this request'
  },
  
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when the request was approved/rejected'
  },
  
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when the items were delivered'
  },
  
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason for rejection (if status is REJECTED)'
  },
  
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes or comments'
  }
}, {
  tableName: 'purchase_requests',
  timestamps: true,
  comment: 'Purchase requests within projects with status lifecycle',
  
  hooks: {
    // Automatically calculate total price before saving
    beforeValidate: (request) => {
      if (request.quantity && request.estimatedPrice) {
        request.totalPrice = request.quantity * request.estimatedPrice;
      }
    }
  }
});

// Export model and status constants
PurchaseRequest.Status = PurchaseRequestStatus;

module.exports = PurchaseRequest;
