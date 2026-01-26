// Authentication Controller
// Handles user registration (signup) and login (signin) with JWT token generation

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authConfig = require('../config/auth.config');

// User Registration
// POST /api/auth/signup
// Body: { firstName, lastName, nationalId, email, password, role }
// Day 3: Creates users with PENDING status (admin cannot register via this endpoint)
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, nationalId, email, password, role } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !nationalId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: firstName, lastName, nationalId, email, password'
      });
    }
    
    // Validate role if provided (admin cannot register via public endpoint)
    const allowedRoles = ['projectManager', 'member'];
    const userRole = role || 'member'; // Default to member if not specified
    
    if (userRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be created through registration. Please contact the Lab Head.'
      });
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed values: ${allowedRoles.join(', ')}`
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. If your account was rejected, please contact the Lab Head.'
      });
    }
    
    // Check if national ID already exists
    const existingNationalId = await User.findOne({ where: { nationalId } });
    if (existingNationalId) {
      return res.status(409).json({
        success: false,
        message: 'National ID already registered'
      });
    }
    
    // Hash password using bcrypt (10 salt rounds for security)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user in database with PENDING status
    const newUser = await User.create({
      firstName,
      lastName,
      nationalId,
      email,
      password: hashedPassword,
      role: userRole,
      status: 'PENDING' // Default status for new registrations
    });
    
    // Return success response with user data (excluding password)
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending Lab Head approval. You will be able to login once approved.',
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        nationalId: newUser.nationalId,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// User Login
// POST /api/auth/signin
// Body: { email, password }
// Day 3: Checks user status - only APPROVED users can login
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with provided email'
      });
    }
    
    // Verify password using bcrypt
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Day 3: Check user account status before issuing token
    if (user.status !== 'APPROVED') {
      const statusMessages = {
        'PENDING': 'Your account is pending Lab Head approval. Please wait for approval to login.',
        'REJECTED': 'Your account registration was rejected. Please contact the Lab Head for more information.',
        'DISABLED': 'Your account has been disabled. Please contact the Lab Head.'
      };
      
      return res.status(403).json({
        success: false,
        message: statusMessages[user.status] || 'Account access denied',
        accountStatus: user.status,
        rejectionReason: user.status === 'REJECTED' ? user.rejectionReason : undefined
      });
    }
    
    // Generate JWT token with user ID
    // Token will be used for authentication in protected routes
    const token = jwt.sign(
      { id: user.id },              // Payload: user identifier
      authConfig.secret,            // Secret key from config
      { expiresIn: authConfig.expiresIn }  // Token expiration time
    );
    
    // Return success response with token and user profile
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,                      // JWT token for Authorization header
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          nationalId: user.nationalId,
          email: user.email,
          role: user.role,          // Include role for frontend access control
          status: user.status       // Include status for frontend display
        }
      }
    });
    
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};
