const express = require('express');
const router = express.Router();
const articleController = require('../controllers/article.controller');
const { verifyToken, isAdmin } = require('../middlewares');

/**
 * Article Routes - Day 6: Scientific Articles Feature
 * 
 * PUBLIC ROUTES (No authentication):
 * - GET /api/articles/public - Get all public published articles
 * - GET /api/articles/public/:id - Get specific article (if public and published)
 * - GET /api/articles/public/project/:projectId - Get public articles by project
 * - GET /api/articles/public/team/:teamId - Get public articles by team
 * 
 * AUTHENTICATED ROUTES (JWT required):
 * - GET /api/articles - Get all articles (members see published, admin sees all)
 * - GET /api/articles/:id - Get article by ID
 * - GET /api/articles/project/:projectId - Get articles by project
 * - GET /api/articles/team/:teamId - Get articles by team
 * 
 * ADMIN ROUTES (JWT + admin role):
 * - POST /api/articles - Create new article
 * - PUT /api/articles/:id - Update article
 * - DELETE /api/articles/:id - Delete article
 * - GET /api/articles/stats - Get article statistics
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Get all public articles with optional filters
// Query params: ?year=2025&teamId=1&search=nuclear&page=1&limit=10
router.get('/public', articleController.getPublicArticles);

// Get public articles by project
router.get('/public/project/:projectId', articleController.getArticlesByProject);

// Get public articles by team
router.get('/public/team/:teamId', articleController.getArticlesByTeam);

// ============================================
// AUTHENTICATED ROUTES (Members + Admin)
// ============================================

// Get all articles (filtered by role)
// Query params: ?status=published&visibility=public&teamId=1&projectId=2&year=2025&search=keyword&page=1&limit=20
router.get('/', verifyToken, articleController.getAllArticles);

// Get article by ID
router.get('/:id', verifyToken, articleController.getArticleById);

// Get articles by project (authenticated)
router.get('/project/:projectId', verifyToken, articleController.getArticlesByProject);

// Get articles by team (authenticated)
router.get('/team/:teamId', verifyToken, articleController.getArticlesByTeam);

// ============================================
// ADMIN ROUTES (Admin only)
// ============================================

// Create new article
router.post('/', verifyToken, isAdmin, articleController.createArticle);

// Update article
router.put('/:id', verifyToken, isAdmin, articleController.updateArticle);

// Delete article
router.delete('/:id', verifyToken, isAdmin, articleController.deleteArticle);

// Get article statistics
router.get('/admin/stats', verifyToken, isAdmin, articleController.getArticleStats);

module.exports = router;
