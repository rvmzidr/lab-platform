# Day 2 Setup Instructions

## Database Migration (Laragon)

### Step 1: Open Laragon MySQL
1. Start Laragon
2. Click "Database" → "MySQL" or open phpMyAdmin
3. Alternatively, use MySQL CLI: `mysql -u root -p`

### Step 2: Run Migration Script
Execute the SQL script located at:
```
backend/migrations/day2-business-models.sql
```

**Option A: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select the `lab_platform` database
3. Click "SQL" tab
4. Copy and paste the entire content of `day2-business-models.sql`
5. Click "Go" to execute

**Option B: Using MySQL CLI**
```bash
mysql -u root -p lab_platform < backend/migrations/day2-business-models.sql
```

### Step 3: Verify Tables Created
Run this query to verify:
```sql
SHOW TABLES;
```

You should see:
- institutions
- projects
- purchase_requests
- users

### Step 4: Check Sample Data
```sql
SELECT * FROM institutions;
```

You should see 2 sample institutions created automatically.

## Starting the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

## Testing the Application

### 1. Login
- Navigate to http://localhost:4200
- Login with admin credentials:
  - Email: admin@lab.com
  - Password: admin123

### 2. Test Projects
- Click "View Projects" from dashboard
- Click "+ New Project" (Admin only)
- Fill in the form and create a project

### 3. Test Purchase Requests
- Click "View Requests" from dashboard
- Click "+ New Purchase Request"
- Fill in the form and create a request
- Test status transitions:
  - **Submit** (DRAFT → PENDING)
  - **Approve** (PENDING → APPROVED) - Admin only
  - **Reject** (PENDING → REJECTED) - Admin only
  - **Deliver** (APPROVED → DELIVERED) - Admin only

## Troubleshooting

### Issue: Tables already exist
**Solution:** Drop the old tables first:
```sql
DROP TABLE IF EXISTS purchase_requests;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS institutions;
```
Then re-run the migration script.

### Issue: Foreign key constraint error
**Solution:** Ensure you have the `users` table created first (from Day 1).

### Issue: Cannot connect to backend
**Solution:** 
1. Check if backend is running on port 8080
2. Verify database credentials in `.env` file
3. Check Laragon MySQL is running

### Issue: CORS error in browser
**Solution:** Ensure backend CORS is configured for `http://localhost:4200`

## API Testing with Postman/Thunder Client

### Get All Projects
```
GET http://localhost:8080/api/projects
Headers:
  x-access-token: <your-jwt-token>
```

### Create Purchase Request
```
POST http://localhost:8080/api/purchase-requests
Headers:
  x-access-token: <your-jwt-token>
  Content-Type: application/json
Body:
{
  "itemName": "Laboratory Microscope",
  "quantity": 2,
  "estimatedPrice": 500,
  "projectId": 1,
  "description": "High-resolution microscope for research"
}
```

### Submit for Approval
```
POST http://localhost:8080/api/purchase-requests/1/submit
Headers:
  x-access-token: <your-jwt-token>
```

## Next Steps

After successful setup, you can:
1. Create multiple projects under different institutions
2. Test the complete purchase request workflow
3. Test role-based permissions by creating users with different roles
4. Explore filtering and search functionality

Enjoy your Lab Platform! 🎉
