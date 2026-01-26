// Main Server File
// Orchestrates database connection, model synchronization, admin seeding, route mounting, and server startup

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const { User, Institution, Project, PurchaseRequest } = require('./models');
const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const institutionRoutes = require('./routes/institution.routes');
const projectRoutes = require('./routes/project.routes');
const purchaseRequestRoutes = require('./routes/purchaseRequest.routes');
const adminRoutes = require('./routes/admin.routes');
const publicRoutes = require('./routes/public.routes');
const articleRoutes = require('./routes/article.routes');

// Import bcrypt for seeding admin user
const bcrypt = require('bcryptjs');

// Initialize Express application
const app = express();

// Middleware Configuration
// CORS: Enable Cross-Origin Resource Sharing for frontend communication
app.use(cors({
  origin: true, // Accept all origins in development
  credentials: true
}));

// JSON Body Parser: Parse incoming request bodies in JSON format
app.use(express.json());

// URL-encoded Body Parser: Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Mount Routes
// Authentication routes: /api/auth/signup, /api/auth/signin
app.use('/api/auth', authRoutes);

// Test routes: /api/test/public, /api/test/protected, /api/test/admin
app.use('/api/test', testRoutes);

// Day 2 Business Domain Routes
// Institution routes: /api/institutions
app.use('/api/institutions', institutionRoutes);

// Project routes: /api/projects
app.use('/api/projects', projectRoutes);

// Purchase Request routes: /api/purchase-requests
app.use('/api/purchase-requests', purchaseRequestRoutes);

// Day 3 Admin Routes
// Admin user management: /api/admin/users
app.use('/api/admin', adminRoutes);

// Day 3 Public Routes (no authentication required)
// Public lab information: /api/public/lab-info, /api/public/teams
app.use('/api/public', publicRoutes);

// Day 6 Article Routes
// Scientific articles: /api/articles (GET, POST, PUT, DELETE)
app.use('/api/articles', articleRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lab Platform Backend API',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth (POST /signup, POST /signin)',
      test: '/api/test (GET /public, GET /protected, GET /admin)',
      public: '/api/public (GET /lab-info, GET /teams)',
      institutions: '/api/institutions (GET, POST, PUT, DELETE)',
      projects: '/api/projects (GET, POST, PUT, DELETE)',
      purchaseRequests: '/api/purchase-requests (GET, POST, PUT, DELETE, POST /submit, /approve, /reject, /deliver)',
      articles: '/api/articles (GET /public, GET /, GET /:id, POST, PUT, DELETE)'
    }
  });
});

// Global Error Handling Middleware
// Catches any unhandled errors and returns consistent JSON response
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Database Synchronization and Server Startup
const PORT = process.env.PORT || 3000;

// Function to seed default admin user
async function seedAdminUser() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ where: { email: 'admin@lab.com' } });
    
    if (!adminExists) {
      // Create default admin user for immediate testing
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        firstName: 'Lab',
        lastName: 'Administrator',
        nationalId: 'ADMIN001',
        email: 'admin@lab.com',
        password: hashedPassword,
        role: 'admin',
        status: 'APPROVED'
      });
      
      console.log('✓ Default admin user created:');
      console.log('  Email: admin@lab.com');
      console.log('  Password: admin123');
      console.log('  Role: admin (LabHead)');
    } else {
      console.log('✓ Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');
    
    // Synchronize models with database (creates tables if they don't exist)
    // IMPORTANT: Using { alter: false } to prevent "too many keys" error
    // All schema changes should be done via SQL migration scripts
    await sequelize.sync({ alter: false });
    console.log('✓ Database models synchronized (using existing schema)');
    
    // Seed default admin user
    await seedAdminUser();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🚀 Lab Platform Backend Server Running`);
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📚 Available Endpoints:');
      console.log('   POST   /api/auth/signup    - User registration');
      console.log('   POST   /api/auth/signin    - User login');
      console.log('   GET    /api/test/public    - Public content (no auth)');
      console.log('   GET    /api/test/protected - Protected content (auth required)');
      console.log('   GET    /api/test/admin     - Admin content (admin role required)');
      console.log('\n');
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
