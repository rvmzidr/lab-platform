-- Day 2 Database Migration Script for Lab Platform
-- Creates tables for Institution, Project, and PurchaseRequest
-- Compatible with MySQL/MariaDB in Laragon
-- Execute this script after creating the database and users table

-- =============================================================================
-- INSTITUTION TABLE
-- Represents research institutions that contain multiple projects
-- Managed by Admin/LabHead role
-- =============================================================================

CREATE TABLE IF NOT EXISTS institutions (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier for each institution',
  name VARCHAR(255) NOT NULL COMMENT 'Institution name - cannot be empty',
  address TEXT COMMENT 'Physical address of the institution',
  contactEmail VARCHAR(255) COMMENT 'Primary contact email for the institution',
  contactPhone VARCHAR(50) COMMENT 'Primary contact phone number',
  description TEXT COMMENT 'Additional information about the institution',
  isActive TINYINT(1) DEFAULT 1 COMMENT 'Whether the institution is currently active',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT chk_institution_name_not_empty CHECK (CHAR_LENGTH(TRIM(name)) > 0),
  CONSTRAINT chk_institution_email_format CHECK (contactEmail IS NULL OR contactEmail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Research institutions that contain projects';

-- Indexes for institutions
CREATE INDEX idx_institution_name ON institutions(name);
CREATE INDEX idx_institution_active ON institutions(isActive);

-- =============================================================================
-- PROJECT TABLE
-- Represents research projects within an institution
-- Managed by ProjectManager role and contain purchase requests
-- Relationship: Institution contains Projects
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier for each project',
  name VARCHAR(255) NOT NULL COMMENT 'Project name - cannot be empty',
  source VARCHAR(255) NOT NULL COMMENT 'Funding source or origin of the project',
  description TEXT COMMENT 'Detailed description of the project',
  startDate DATE COMMENT 'Project start date',
  endDate DATE COMMENT 'Project end date',
  budget DECIMAL(15, 2) COMMENT 'Total project budget',
  institutionId INT NOT NULL COMMENT 'Foreign key to institution',
  projectManagerId INT COMMENT 'Foreign key to user who manages this project',
  isActive TINYINT(1) DEFAULT 1 COMMENT 'Whether the project is currently active',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_project_institution FOREIGN KEY (institutionId) 
    REFERENCES institutions(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  CONSTRAINT fk_project_manager FOREIGN KEY (projectManagerId) 
    REFERENCES users(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  
  -- Data validation constraints
  CONSTRAINT chk_project_name_not_empty CHECK (CHAR_LENGTH(TRIM(name)) > 0),
  CONSTRAINT chk_project_source_not_empty CHECK (CHAR_LENGTH(TRIM(source)) > 0),
  CONSTRAINT chk_project_budget_positive CHECK (budget IS NULL OR budget >= 0),
  CONSTRAINT chk_project_dates CHECK (endDate IS NULL OR startDate IS NULL OR endDate >= startDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Research projects within institutions';

-- Indexes for projects
CREATE INDEX idx_project_name ON projects(name);
CREATE INDEX idx_project_institution ON projects(institutionId);
CREATE INDEX idx_project_manager ON projects(projectManagerId);
CREATE INDEX idx_project_active ON projects(isActive);
CREATE INDEX idx_project_dates ON projects(startDate, endDate);

-- =============================================================================
-- PURCHASE REQUEST TABLE
-- Represents purchase requests within a project with defined status lifecycle
-- Status transitions: DRAFT → PENDING → APPROVED/REJECTED → DELIVERED
-- Relationship: Project contains PurchaseRequests
-- =============================================================================

CREATE TABLE IF NOT EXISTS purchase_requests (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique identifier for each purchase request',
  itemName VARCHAR(255) NOT NULL COMMENT 'Name of the item to purchase',
  description TEXT COMMENT 'Detailed description of the item and purpose',
  quantity INT NOT NULL DEFAULT 1 COMMENT 'Quantity requested - must be positive',
  estimatedPrice DECIMAL(15, 2) NOT NULL COMMENT 'Estimated price per unit',
  totalPrice DECIMAL(15, 2) COMMENT 'Total price (quantity × estimatedPrice)',
  status ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'DELIVERED') NOT NULL DEFAULT 'DRAFT' 
    COMMENT 'Current status in the purchase request lifecycle',
  projectId INT NOT NULL COMMENT 'Foreign key to project',
  requestedById INT NOT NULL COMMENT 'Foreign key to user who created this request',
  reviewedById INT COMMENT 'Foreign key to Admin/LabHead who approved/rejected',
  reviewedAt DATETIME COMMENT 'Timestamp when approved/rejected',
  deliveredAt DATETIME COMMENT 'Timestamp when items were delivered',
  rejectionReason TEXT COMMENT 'Reason for rejection if status is REJECTED',
  notes TEXT COMMENT 'Additional notes or comments',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  CONSTRAINT fk_purchase_project FOREIGN KEY (projectId) 
    REFERENCES projects(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  
  CONSTRAINT fk_purchase_requester FOREIGN KEY (requestedById) 
    REFERENCES users(id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
  
  CONSTRAINT fk_purchase_reviewer FOREIGN KEY (reviewedById) 
    REFERENCES users(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  
  -- Data validation constraints
  CONSTRAINT chk_purchase_item_not_empty CHECK (CHAR_LENGTH(TRIM(itemName)) > 0),
  CONSTRAINT chk_purchase_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_purchase_price_positive CHECK (estimatedPrice >= 0),
  CONSTRAINT chk_purchase_total_positive CHECK (totalPrice IS NULL OR totalPrice >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Purchase requests within projects with status lifecycle';

-- Indexes for purchase_requests
CREATE INDEX idx_purchase_item ON purchase_requests(itemName);
CREATE INDEX idx_purchase_status ON purchase_requests(status);
CREATE INDEX idx_purchase_project ON purchase_requests(projectId);
CREATE INDEX idx_purchase_requester ON purchase_requests(requestedById);
CREATE INDEX idx_purchase_reviewer ON purchase_requests(reviewedById);
CREATE INDEX idx_purchase_dates ON purchase_requests(createdAt, reviewedAt, deliveredAt);
CREATE INDEX idx_purchase_project_status ON purchase_requests(projectId, status);

-- =============================================================================
-- STATUS LIFECYCLE DOCUMENTATION
-- =============================================================================
-- 
-- DRAFT: Initial state when created by Member or ProjectManager
--        Can be edited freely, not yet submitted for approval
--        Allowed transition: DRAFT → PENDING (when submitted)
--
-- PENDING: Request submitted and awaiting Admin/LabHead approval
--          Cannot be edited by requester anymore
--          Allowed transitions: 
--            - PENDING → APPROVED (approved by Admin)
--            - PENDING → REJECTED (rejected by Admin)
--
-- APPROVED: Request approved by Admin/LabHead, ready for procurement
--           Cannot be edited or cancelled
--           Allowed transition: APPROVED → DELIVERED (when items received)
--
-- REJECTED: Request rejected by Admin/LabHead
--           Terminal state, no further transitions allowed
--
-- DELIVERED: Items have been received and request is complete
--            Terminal state, no further transitions allowed
--
-- =============================================================================

-- Insert sample institution for testing (optional)
INSERT INTO institutions (name, address, contactEmail, contactPhone, description) 
VALUES 
  ('National Research Laboratory', '123 Science Avenue, Research City', 'contact@nrl.edu', '+1-555-0100', 'Leading research institution'),
  ('Innovation Institute', '456 Innovation Boulevard, Tech Park', 'info@innovation.org', '+1-555-0200', 'Technology and innovation research center')
ON DUPLICATE KEY UPDATE name=name;

-- Display success message
SELECT 'Day 2 migration completed successfully! Tables created: institutions, projects, purchase_requests' AS status;
