// Reset Admin Password Script
// Run this script to reset the admin password to 'admin123'

require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const { User } = require('./models');

async function resetAdminPassword() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✓ Database connection established');
    
    // Find admin user
    const admin = await User.findOne({ where: { email: 'admin@lab.com' } });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      // Create new admin if doesn't exist
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        firstName: 'Lab',
        lastName: 'Administrator',
        nationalId: 'ADMIN001',
        email: 'admin@lab.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✓ Admin user created successfully');
    } else {
      console.log('✓ Admin user found. Resetting password...');
      
      // Reset password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('✓ Admin password reset successfully');
    }
    
    console.log('\n📧 Email: admin@lab.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
