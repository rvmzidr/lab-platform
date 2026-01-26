-- Day 3 User Approval System Migration - FIXED VERSION
-- This script is safe to run multiple times (idempotent)
-- It checks if columns exist before adding them

USE lab_platform;

-- Drop procedure if it exists
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- Create procedure to add column only if it doesn't exist
DELIMITER $$

CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(128),
    IN columnName VARCHAR(128),
    IN columnDefinition VARCHAR(512)
)
BEGIN
    DECLARE columnExists INT;
    
    SELECT COUNT(*) INTO columnExists
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'lab_platform'
    AND TABLE_NAME = tableName
    AND COLUMN_NAME = columnName;
    
    IF columnExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' ADD COLUMN ', columnName, ' ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER ;

-- Add status column if it doesn't exist
CALL AddColumnIfNotExists('users', 'status', 
    "ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISABLED') NOT NULL DEFAULT 'PENDING' COMMENT 'User account status'");

-- Add approvedById column if it doesn't exist
CALL AddColumnIfNotExists('users', 'approvedById', 
    "INT NULL COMMENT 'ID of admin who approved/rejected this user'");

-- Add approvedAt column if it doesn't exist
CALL AddColumnIfNotExists('users', 'approvedAt', 
    "TIMESTAMP NULL COMMENT 'When user was approved'");

-- Add rejectionReason column if it doesn't exist
CALL AddColumnIfNotExists('users', 'rejectionReason', 
    "TEXT NULL COMMENT 'Reason for rejection if status is REJECTED'");

-- Add foreign key constraint if it doesn't exist
SET @fk_exists = (SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'lab_platform' 
    AND TABLE_NAME = 'users' 
    AND CONSTRAINT_NAME = 'fk_users_approver');

SET @sql_fk = IF(@fk_exists = 0,
    'ALTER TABLE users ADD CONSTRAINT fk_users_approver FOREIGN KEY (approvedById) REFERENCES users(id) ON DELETE SET NULL',
    'SELECT "Foreign key already exists" AS message');

PREPARE stmt_fk FROM @sql_fk;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;

-- Note: Index on status column skipped to avoid "too many keys" error
-- The table already has maximum allowed indexes (64)
-- Status filtering will still work, just slightly slower on large datasets

-- Update existing admin user to APPROVED status (if not already)
UPDATE users 
SET status = 'APPROVED', 
    approvedAt = NOW()
WHERE email = 'admin@lab.com' 
AND status != 'APPROVED';

-- Clean up procedure
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;

-- Display summary
SELECT 
    'Migration completed successfully!' AS Status,
    (SELECT COUNT(*) FROM users WHERE status = 'APPROVED') AS ApprovedUsers,
    (SELECT COUNT(*) FROM users WHERE status = 'PENDING') AS PendingUsers;
