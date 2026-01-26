// Authentication Routes
// Handles user signup and signin endpoints

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/signup - User registration
// Body: { firstName, lastName, nationalId, email, password, role }
// Creates new user account with hashed password
router.post('/signup', authController.signup);

// POST /api/auth/signin - User login
// Body: { email, password }
// Returns JWT token and user profile on successful authentication
router.post('/signin', authController.signin);

module.exports = router;
