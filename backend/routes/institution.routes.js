// Institution Routes
// All routes require authentication (JWT)
// Only Admin/LabHead can perform institution operations

const router = require('express').Router();
const institutionController = require('../controllers/institution.controller');
const { verifyToken, isAdmin } = require('../middlewares');

// GET /api/institutions - Get all institutions
router.get('/', verifyToken, institutionController.getAllInstitutions);

// GET /api/institutions/:id - Get institution by ID
router.get('/:id', verifyToken, institutionController.getInstitutionById);

// POST /api/institutions - Create new institution (Admin only)
router.post('/', verifyToken, isAdmin, institutionController.createInstitution);

// PUT /api/institutions/:id - Update institution (Admin only)
router.put('/:id', verifyToken, isAdmin, institutionController.updateInstitution);

// DELETE /api/institutions/:id - Delete institution (Admin only)
router.delete('/:id', verifyToken, isAdmin, institutionController.deleteInstitution);

module.exports = router;
