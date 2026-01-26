# Day 3 Setup Guide - User Approval System + Role-Based Dashboards

## Overview
Day 3 implements a complete user approval workflow where new registrations create **PENDING** users who cannot login until approved by the Lab Head. Also implements role-based dashboard views.

---

## 🔴 CRITICAL: Run SQL Migration First!

Before starting the application, you **MUST** execute the SQL migration script in Laragon:

### Steps:
1. Open Laragon
2. Click **"Database"** → **"phpMyAdmin"** (or use MySQL terminal)
3. Select database: `lab_platform`
4. Go to **SQL** tab
5. Open file: `backend/migrations/day3-user-approval-system.sql`
6. Copy all SQL content and paste into SQL editor
7. Click **"Go"** to execute

### What this migration does:
- Adds `status` column: ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISABLED')
- Adds `approvedById` column: Foreign key to users table (who approved this user)
- Adds `approvedAt` column: Timestamp of approval
- Adds `rejectionReason` column: Text field for rejection explanation
- Updates existing admin user to `APPROVED` status
- Creates index on status column for performance

---

## Backend Changes Summary

### 1. User Model (`backend/models/User.js`)
**New Fields:**
- `status`: User account status (default: PENDING)
- `approvedById`: ID of admin who approved/rejected the user
- `approvedAt`: Timestamp when user was approved
- `rejectionReason`: Reason if user was rejected

**Self-Referential Relationship:**
```javascript
// In models/index.js
db.User.belongsTo(db.User, { 
  as: 'approver', 
  foreignKey: 'approvedById' 
});
```

### 2. Authentication Changes (`backend/controllers/auth.controller.js`)

**Signup Endpoint Changes:**
- New registrations automatically set `status: 'PENDING'`
- Cannot register with `role: 'admin'` (returns 403 error)
- Only existing admins can promote users to admin via admin panel

**Signin Endpoint Changes:**
- Before issuing JWT, checks `user.status`
- PENDING users: "Account awaiting approval"
- REJECTED users: "Account rejected: {reason}"
- DISABLED users: "Account disabled by administrator"
- Only APPROVED users can login successfully

### 3. New Admin Controller (`backend/controllers/admin.controller.js`)

Provides 7 endpoints for user management:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users (optional ?status=PENDING filter) |
| GET | `/api/admin/users/:id` | Get single user details with approver info |
| PATCH | `/api/admin/users/:id/approve` | Approve PENDING user → APPROVED |
| PATCH | `/api/admin/users/:id/reject` | Reject PENDING user with reason |
| PATCH | `/api/admin/users/:id/disable` | Disable APPROVED user (temporary block) |
| PATCH | `/api/admin/users/:id/enable` | Re-enable DISABLED user |
| PATCH | `/api/admin/users/:id/promote` | Change user role (member ↔ projectManager ↔ admin) |

**Authorization:** All endpoints require:
1. Valid JWT token (verifyToken middleware)
2. Admin role (isAdmin middleware)

### 4. New Routes (`backend/routes/admin.routes.js`)
Mounted at `/api/admin` in `server.js`

---

## Frontend Changes Summary

### 1. New Welcome/Landing Page (`frontend/src/app/components/welcome/`)
- First page users see at route `/welcome`
- Two large clickable cards:
  - **Lab Head Login** → navigates to `/login`
  - **Register** → navigates to `/register`
- Beautiful gradient background with responsive design

### 2. New Register Component (`frontend/src/app/components/register/`)
**Features:**
- Form fields: firstName, lastName, nationalId, email, password, confirmPassword
- Role dropdown: Project Manager or Lab Member (Admin not shown)
- Client-side validation:
  - All fields required
  - Password min 6 characters
  - Password confirmation must match
  - Email format validation
- On success: Shows "Awaiting approval" message, redirects to login after 3s
- Link to login page for existing users

**Important Note:** After registration, users **cannot login** until admin approves them!

### 3. New Admin Users Management (`frontend/src/app/components/admin-users/`)
**Features:**
- Table showing all users with:
  - Name, Email, National ID, Role, Status
  - Who approved the user (approver name)
  - Registration date
- Status filter dropdown (All/PENDING/APPROVED/REJECTED/DISABLED)
- Search bar (by name or email)
- Status badges color-coded:
  - PENDING = Orange
  - APPROVED = Green
  - REJECTED = Red
  - DISABLED = Gray

**Action Buttons by Status:**
- **PENDING users:**
  - ✓ Approve → changes to APPROVED
  - ✗ Reject → opens modal to enter rejection reason
  
- **APPROVED users:**
  - 🔒 Disable → temporarily blocks login
  - ⬆ Change Role → opens modal to select new role
  
- **REJECTED users:**
  - ✓ Re-approve → changes to APPROVED
  - Shows rejection reason below actions
  
- **DISABLED users:**
  - 🔓 Re-enable → restores to APPROVED status

**Access:** Only visible to Lab Head (Admin role)

### 4. Updated Dashboard (`frontend/src/app/components/dashboard/`)
**Role-Based Quick Access Cards:**

**Admin sees:**
- 👥 **Users Management** → new card linking to `/admin/users`
- 📁 **Projects** → "View and manage all laboratory projects"
- 🛒 **Purchase Requests** → "Review and approve equipment requests"
- 📚 **Scientific Articles** → Coming soon

**Project Manager sees:**
- 📁 **Projects** → "Manage your projects and research initiatives"
- 🛒 **Purchase Requests** → "Submit and track your purchase requests"
- 📚 **Scientific Articles** → Coming soon

**Lab Member sees:**
- 📁 **Projects** → "View projects you're assigned to"
- 🛒 **Purchase Requests** → "View purchase requests status"
- 📚 **Scientific Articles** → Coming soon

### 5. New Admin Service (`frontend/src/app/services/admin.service.ts`)
Provides methods to call all admin endpoints:
- `getAllUsers(status?)` - Get users with optional status filter
- `getUserById(id)` - Get single user details
- `approveUser(id)` - Approve pending user
- `rejectUser(id, reason)` - Reject with reason
- `disableUser(id)` - Disable approved user
- `enableUser(id)` - Re-enable disabled user
- `promoteUser(id, newRole)` - Change user role

### 6. Updated Routing (`frontend/src/app/app-routing.module.ts`)
**New Routes:**
- `/welcome` - Landing page (public, default route)
- `/register` - Registration form (public)
- `/admin/users` - Users management (protected by AuthGuard)

**Updated Defaults:**
- App now starts at `/welcome` instead of `/dashboard`
- 404 redirects to `/welcome` instead of `/dashboard`

### 7. Updated Auth Service (`frontend/src/app/services/auth.service.ts`)
- Added `register(userData)` method as alias for signup
- Fixed API URL from port 8080 → 3000

---

## User Status Lifecycle

```
┌─────────────┐
│  REGISTER   │
└─────┬───────┘
      │
      ▼
┌─────────────┐     Approve      ┌─────────────┐
│   PENDING   │ ───────────────► │  APPROVED   │
│ (cannot     │                   │ (can login) │
│  login)     │                   └──────┬──────┘
└─────┬───────┘                          │
      │                                  │ Disable
      │ Reject                           │
      ▼                                  ▼
┌─────────────┐                   ┌─────────────┐
│  REJECTED   │                   │  DISABLED   │
│ (cannot     │                   │ (cannot     │
│  login)     │                   │  login)     │
└─────────────┘                   └─────────────┘
      │                                  │
      │ Re-approve                       │ Re-enable
      └──────────────────────────────────┘
                     │
                     ▼
              ┌─────────────┐
              │  APPROVED   │
              └─────────────┘
```

---

## Testing Instructions

### 1. Test New User Registration Flow

**Step 1:** Start application and navigate to `http://localhost:4200`
- Should see Welcome page with two cards

**Step 2:** Click **"Register"** card
- Fill form with test data:
  ```
  First Name: John
  Last Name: Smith
  National ID: TEST123456
  Email: john.smith@test.com
  Password: test123
  Confirm Password: test123
  Role: Project Manager
  ```
- Click **"Register"**
- Should see success message: "Awaiting Lab Head approval"
- Will redirect to login after 3 seconds

**Step 3:** Try to login as new user
- Email: john.smith@test.com
- Password: test123
- Should get error: **"Account awaiting approval by Lab Head"**

### 2. Test Admin Approval Workflow

**Step 1:** Login as admin
- Navigate to `http://localhost:4200/welcome`
- Click **"Lab Head Login"**
- Email: admin@lab.com
- Password: admin123
- Should login successfully

**Step 2:** Access Users Management
- Click **"Users Management"** card on dashboard
- OR navigate to `http://localhost:4200/admin/users`
- Should see table with all users including new PENDING user

**Step 3:** Approve the user
- Find John Smith with status PENDING (orange badge)
- Click **"✓ Approve"** button
- Confirm the action
- Status should change to APPROVED (green badge)
- "Approved By" column should show "Lab Head"

**Step 4:** Test approved user can now login
- Logout from admin account
- Login as john.smith@test.com / test123
- Should login successfully!
- Dashboard should show "Project Manager" role
- Quick Access cards should show Project Manager view

### 3. Test Rejection Flow

**Step 1:** Register another user
- Register with email: jane.doe@test.com

**Step 2:** Login as admin and reject
- Go to Users Management
- Find Jane Doe with PENDING status
- Click **"✗ Reject"**
- Enter rejection reason: "Invalid credentials verification"
- Click **"Confirm Rejection"**
- Status should change to REJECTED (red badge)
- Rejection reason should appear below actions

**Step 3:** Try to login as rejected user
- Email: jane.doe@test.com
- Should get error: **"Account rejected: Invalid credentials verification"**

**Step 4:** Re-approve rejected user
- As admin, click **"✓ Re-approve"** on Jane Doe
- Status should change to APPROVED
- User can now login

### 4. Test Disable/Enable Flow

**Step 1:** Disable approved user
- As admin, find John Smith (APPROVED status)
- Click **"🔒 Disable"**
- Confirm action
- Status changes to DISABLED (gray badge)

**Step 2:** Try to login as disabled user
- Should get error: **"Account disabled by administrator"**

**Step 3:** Re-enable user
- As admin, click **"🔓 Re-enable"** on John Smith
- Status changes back to APPROVED
- User can login again

### 5. Test Role Change/Promotion

**Step 1:** Promote user
- As admin, find John Smith (APPROVED, Project Manager)
- Click **"⬆ Change Role"**
- Select new role: "Lab Member"
- Click **"Confirm"**
- Table should update showing "Lab Member" role

**Step 2:** Login as promoted user
- Login as john.smith@test.com
- Dashboard should now show "Lab Member" role
- Quick Access descriptions should reflect member privileges

### 6. Test Filters and Search

**In Admin Users Management:**
- Test status filter dropdown:
  - Select "PENDING" → shows only pending users
  - Select "APPROVED" → shows only approved users
  - Select "All Users" → shows everyone
  
- Test search bar:
  - Type "john" → filters to John Smith
  - Type "smith" → filters to John Smith
  - Type "@test.com" → shows all test users
  - Clear search → shows all again

---

## Security Notes

### Backend Security
1. **Admin Routes Protected:**
   - All `/api/admin/*` routes require valid JWT token
   - All routes require admin role via `isAdmin` middleware
   - Non-admin users get 403 Forbidden

2. **Cannot Self-Promote:**
   - Users cannot register as admin
   - Only existing admins can promote others to admin role
   - First admin created via SQL script only

3. **Status Validation:**
   - Signin checks status before issuing JWT
   - No token issued to PENDING, REJECTED, or DISABLED users
   - Status transitions logged with approvedById

### Frontend Security
1. **Route Protection:**
   - `/admin/users` requires login via AuthGuard
   - Admin-specific UI elements use `*ngIf="isAdmin()"`
   - Non-admin users cannot access admin pages

2. **Token Management:**
   - JWT stored in localStorage
   - Auth interceptor adds token to all API requests
   - Token cleared on logout

---

## Common Issues & Solutions

### Issue: "Account awaiting approval" error when trying to login
**Cause:** New user hasn't been approved yet
**Solution:** Admin must approve the user via Users Management page

### Issue: Can't see Users Management card on dashboard
**Cause:** Logged in as non-admin user
**Solution:** Only Lab Head (admin role) can see this card. Login as admin@lab.com

### Issue: "Field 'status' doesn't have a default value" SQL error
**Cause:** Migration script not executed
**Solution:** Run `day3-user-approval-system.sql` in Laragon MySQL

### Issue: Admin routes return 403 Forbidden
**Cause:** Logged in as non-admin user
**Solution:** Only admin users can access `/api/admin/*` endpoints

### Issue: Register form says "Admin accounts can only be created by administrators"
**Cause:** Tried to register with admin role (blocked by backend)
**Solution:** Use Register form for ProjectManager/Member only. Admin promotion happens via admin panel.

---

## File Checklist

### Backend Files Created/Modified:
- ✅ `backend/migrations/day3-user-approval-system.sql` - NEW
- ✅ `backend/models/User.js` - MODIFIED (added status fields)
- ✅ `backend/models/index.js` - MODIFIED (User self-relationship)
- ✅ `backend/controllers/auth.controller.js` - MODIFIED (status checks)
- ✅ `backend/controllers/admin.controller.js` - NEW
- ✅ `backend/routes/admin.routes.js` - NEW
- ✅ `backend/server.js` - MODIFIED (mounted admin routes)

### Frontend Files Created/Modified:
- ✅ `frontend/src/app/components/welcome/welcome.component.ts` - NEW
- ✅ `frontend/src/app/components/welcome/welcome.component.html` - NEW
- ✅ `frontend/src/app/components/welcome/welcome.component.css` - NEW
- ✅ `frontend/src/app/components/register/register.component.ts` - NEW
- ✅ `frontend/src/app/components/register/register.component.html` - NEW
- ✅ `frontend/src/app/components/register/register.component.css` - NEW
- ✅ `frontend/src/app/components/admin-users/admin-users.component.ts` - NEW
- ✅ `frontend/src/app/components/admin-users/admin-users.component.html` - NEW
- ✅ `frontend/src/app/components/admin-users/admin-users.component.css` - NEW
- ✅ `frontend/src/app/services/admin.service.ts` - NEW
- ✅ `frontend/src/app/services/auth.service.ts` - MODIFIED (added register method, fixed port)
- ✅ `frontend/src/app/components/dashboard/dashboard.component.ts` - MODIFIED (role checks)
- ✅ `frontend/src/app/components/dashboard/dashboard.component.html` - MODIFIED (role-based cards)
- ✅ `frontend/src/app/app.module.ts` - MODIFIED (new components declared)
- ✅ `frontend/src/app/app-routing.module.ts` - MODIFIED (new routes)

---

## Next Steps (Future Days)

**Day 4 Suggestions:**
- Implement Articles Management (CRUD for scientific articles)
- Add file upload for articles (PDF storage)
- Create article search and categorization

**Day 5 Suggestions:**
- Email notifications for user approval/rejection
- Password reset functionality
- User profile editing

**Day 6 Suggestions:**
- Advanced reporting dashboards
- Export data to Excel/PDF
- Activity logs and audit trail

---

## Summary

Day 3 successfully implements:
✅ User approval workflow (PENDING → APPROVED/REJECTED)
✅ Account status management (APPROVED/DISABLED)
✅ Landing page with registration option
✅ Admin users management panel
✅ Role-based dashboard views
✅ User role promotion system
✅ Complete SQL migration script

All features working together with Day 1 (Auth) and Day 2 (Business Domain) for a complete laboratory management system!
