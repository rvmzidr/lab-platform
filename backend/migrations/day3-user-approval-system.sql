-- Day 3 Database Migration Script - User Approval System
-- Adds user status management fields to users table
-- Compatible with MySQL/MariaDB in Laragon
-- Execute this script after Day 2 migration

-- =============================================================================
-- ADD USER STATUS FIELDS TO USERS TABLE
-- =============================================================================

-- Add status column (PENDING, APPROVED, REJECTED, DISABLED)
ALTER TABLE users
ADD COLUMN status ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISABLED') NOT NULL DEFAULT 'PENDING'
COMMENT 'User account status for approval workflow'
AFTER role;

-- Add approval tracking fields
ALTER TABLE users
ADD COLUMN approvedById INT NULL
COMMENT 'ID of admin who approved/rejected this user'
AFTER status;

ALTER TABLE users
ADD COLUMN approvedAt TIMESTAMP NULL
COMMENT 'Timestamp when user was approved/rejected'
AFTER approvedById;

ALTER TABLE users
ADD COLUMN rejectionReason TEXT NULL
COMMENT 'Reason for account rejection if status is REJECTED'
AFTER approvedAt;

-- Add foreign key constraint for approvedById
ALTER TABLE users
ADD CONSTRAINT fk_user_approved_by FOREIGN KEY (approvedById)
REFERENCES users(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Create index for status queries
CREATE INDEX idx_user_status ON users(status);

-- =============================================================================
-- UPDATE EXISTING USERS
-- =============================================================================

-- Set existing admin user to APPROVED status
UPDATE users
SET status = 'APPROVED',
    approvedAt = CURRENT_TIMESTAMP
WHERE role = 'admin';

-- Set any other existing users to APPROVED (for backward compatibility)
UPDATE users
SET status = 'APPROVED',
    approvedAt = CURRENT_TIMESTAMP
WHERE role != 'admin' AND status = 'PENDING';

-- =============================================================================
-- STATUS LIFECYCLE DOCUMENTATION
-- =============================================================================
--
-- PENDING: New user registration, awaiting Lab Head approval
--          User CANNOT login until approved
--          Transition: PENDING → APPROVED (via admin approval)
--                     PENDING → REJECTED (via admin rejection)
--
-- APPROVED: User approved by Lab Head, can login and access system
--           Has full access according to their role
--           Transition: APPROVED → DISABLED (via admin action)
--
-- REJECTED: User registration rejected by Lab Head
--           User CANNOT login
--           Cannot re-register with same email (UNIQUE constraint)
--           Transition: REJECTED → APPROVED (via admin re-approval)
--
-- DISABLED: Previously approved user has been disabled
--           User CANNOT login
--           Transition: DISABLED → APPROVED (via admin re-enable)
--
-- =============================================================================

-- Verify the changes
SELECT 'Day 3 migration completed successfully! User approval system added.' AS status;

-- Display updated table structure
SHOW CREATE TABLE users;

-- Show current users with their status
SELECT id, firstName, lastName, email, role, status, approvedAt
FROM users
ORDER BY createdAt DESC;
