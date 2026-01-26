-- Migration: Remove projectManager role
-- This migration removes the projectManager role and keeps only 'admin' and 'member'
-- All existing projectManager users will be converted to 'member' role

-- Step 1: Update all projectManager users to member
UPDATE users 
SET role = 'member' 
WHERE role = 'projectManager';

-- Step 2: Modify the ENUM to remove projectManager
-- MySQL doesn't support direct ENUM modification, so we need to:
-- a) Add a temporary column
-- b) Copy data
-- c) Drop old column
-- d) Rename new column

ALTER TABLE users ADD COLUMN role_new ENUM('admin', 'member') NOT NULL DEFAULT 'member';

UPDATE users SET role_new = 
  CASE 
    WHEN role = 'admin' THEN 'admin'
    ELSE 'member'
  END;

ALTER TABLE users DROP COLUMN role;
ALTER TABLE users CHANGE role_new role ENUM('admin', 'member') NOT NULL DEFAULT 'member';

-- Migration complete
