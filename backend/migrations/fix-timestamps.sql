-- Fix Timestamp Columns for All Tables
-- Resolves error: Field 'createdAt' doesn't have a default value
-- Execute this script if tables are already created

-- =============================================================================
-- FIX INSTITUTIONS TABLE
-- =============================================================================

ALTER TABLE institutions 
MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================================================
-- FIX PROJECTS TABLE
-- =============================================================================

ALTER TABLE projects 
MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================================================
-- FIX PURCHASE_REQUESTS TABLE
-- =============================================================================

ALTER TABLE purchase_requests 
MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- =============================================================================
-- FIX USERS TABLE (if needed)
-- =============================================================================

ALTER TABLE users 
MODIFY createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
MODIFY updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Verify the changes
SELECT 'Timestamp columns fixed successfully for all tables!' AS status;

-- Display table structures to verify
SHOW CREATE TABLE institutions;
SHOW CREATE TABLE projects;
SHOW CREATE TABLE purchase_requests;
