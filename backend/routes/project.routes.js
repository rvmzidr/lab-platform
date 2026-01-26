// Project Routes
// All routes require authentication (JWT)
// Admin/LabHead has full access, ProjectManager can manage their projects

const router = require('express').Router();
const projectController = require('../controllers/project.controller');
const { verifyToken, isAdmin } = require('../middlewares');

// GET /api/projects - Get all projects (with optional filtering)
// Query params: institutionId, projectManagerId, isActive
router.get('/', verifyToken, projectController.getAllProjects);

// GET /api/projects/:id - Get project by ID
router.get('/:id', verifyToken, projectController.getProjectById);

// POST /api/projects - Create new project (Admin only for now)
router.post('/', verifyToken, isAdmin, projectController.createProject);

// PUT /api/projects/:id - Update project (Admin only for now)
router.put('/:id', verifyToken, isAdmin, projectController.updateProject);

// DELETE /api/projects/:id - Delete project (Admin only)
router.delete('/:id', verifyToken, isAdmin, projectController.deleteProject);

module.exports = router;
