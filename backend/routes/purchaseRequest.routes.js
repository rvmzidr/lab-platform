// Purchase Request Routes
// All routes require authentication (JWT)
// Different actions available based on role:
// - Admin/LabHead: full access (approve, reject, deliver, delete)
// - ProjectManager: manage requests for their projects
// - Member: create and submit requests

const router = require('express').Router();
const purchaseRequestController = require('../controllers/purchaseRequest.controller');
const { verifyToken, isAdmin } = require('../middlewares');

// GET /api/purchase-requests - Get all purchase requests with filtering
// Query params: status, projectId, requestedById, startDate, endDate
router.get('/', verifyToken, purchaseRequestController.getAllPurchaseRequests);

// GET /api/purchase-requests/:id - Get purchase request by ID
router.get('/:id', verifyToken, purchaseRequestController.getPurchaseRequestById);

// POST /api/purchase-requests - Create new purchase request (any authenticated user)
router.post('/', verifyToken, purchaseRequestController.createPurchaseRequest);

// PUT /api/purchase-requests/:id - Update purchase request (only DRAFT status)
router.put('/:id', verifyToken, purchaseRequestController.updatePurchaseRequest);

// POST /api/purchase-requests/:id/submit - Submit for approval (DRAFT → PENDING)
router.post('/:id/submit', verifyToken, purchaseRequestController.submitPurchaseRequest);

// POST /api/purchase-requests/:id/approve - Approve request (Admin only, PENDING → APPROVED)
router.post('/:id/approve', verifyToken, isAdmin, purchaseRequestController.approvePurchaseRequest);

// POST /api/purchase-requests/:id/reject - Reject request (Admin only, PENDING → REJECTED)
router.post('/:id/reject', verifyToken, isAdmin, purchaseRequestController.rejectPurchaseRequest);

// POST /api/purchase-requests/:id/deliver - Mark as delivered (Admin only, APPROVED → DELIVERED)
router.post('/:id/deliver', verifyToken, isAdmin, purchaseRequestController.markAsDelivered);

// DELETE /api/purchase-requests/:id - Delete purchase request (Admin only)
router.delete('/:id', verifyToken, isAdmin, purchaseRequestController.deletePurchaseRequest);

module.exports = router;
