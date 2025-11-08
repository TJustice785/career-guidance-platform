# API Endpoints Testing Guide

## Quick Start

1. **Start the server** in one terminal:
```bash
cd server
npm run dev
```

2. **Start the client** in another terminal:
```bash
cd client
npm start
```

3. **Open your browser** to http://localhost:3000

## Test Endpoints

### 1. Health Check (No Auth Required)
```bash
GET http://localhost:5000/api/health

Expected Response:
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-01-25T..."
}
```

### 2. Get Institutions (Public - No Auth Required)
```bash
GET http://localhost:5000/api/institutions

Expected Response:
{
  "success": true,
  "status": "success",
  "data": [...]
}
```

### 3. Get Companies (Public - No Auth Required)
```bash
GET http://localhost:5000/api/companies

Expected Response:
{
  "success": true,
  "status": "success",
  "data": [...]
}
```

### 4. Get Jobs (Public - No Auth Required)
```bash
GET http://localhost:5000/api/jobs

Expected Response:
{
  "success": true,
  "status": "success",
  "data": [...]
}
```

### 5. Admin Endpoints (Requires Authentication)

First, get a token by logging in as admin, then use it in subsequent requests.

#### Login as Admin
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpassword"
}

Expected Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

#### Get All Institutions (Admin)
```bash
GET http://localhost:5000/api/admin/institutions
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Create Institution (Admin)
```bash
POST http://localhost:5000/api/admin/institutions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Test University",
  "email": "test@university.edu",
  "description": "A test university",
  "address": "123 Test St",
  "phone": "+266 1234 5678"
}
```

#### Update Institution (Admin)
```bash
PUT http://localhost:5000/api/admin/institutions/INSTITUTION_ID
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated University Name",
  "description": "Updated description"
}
```

#### Delete Institution (Admin)
```bash
DELETE http://localhost:5000/api/admin/institutions/INSTITUTION_ID
Authorization: Bearer YOUR_TOKEN_HERE
```

## Testing from Browser Console

Open your browser's Developer Tools (F12) and use the Console tab:

```javascript
// Test health check
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data));

// Test institutions
fetch('http://localhost:5000/api/institutions')
  .then(res => res.json())
  .then(data => console.log('Institutions:', data));

// Test companies
fetch('http://localhost:5000/api/companies')
  .then(res => res.json())
  .then(data => console.log('Companies:', data));

// Test jobs
fetch('http://localhost:5000/api/jobs')
  .then(res => res.json())
  .then(data => console.log('Jobs:', data));
```

## Common Issues

### Issue: CORS Error
**Symptom**: "Access to fetch blocked by CORS policy"
**Solution**: Already fixed in server/index.js - restart the server after fix

### Issue: 401 Unauthorized
**Symptom**: "Unauthorized - No token provided"
**Solution**: You need to login first to get a token

### Issue: No Data in Response
**Symptom**: Empty array `[]` returned
**Solution**: Database is empty - you need to add data first

### Issue: Cannot Connect to Server
**Symptom**: "Network error" or "ECONNREFUSED"
**Solution**: 
1. Check if server is running on port 5000
2. Check firewall settings
3. Verify URL is correct

## Database Verification

To verify your database has data:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Firestore Database
4. Check if collections exist (institutions, companies, jobs, users, etc.)
5. Verify there is data in these collections

## Add Test Data

If your database is empty, you can add test data through the admin panel:

1. Login as admin
2. Go to Admin Dashboard
3. Navigate to "Manage Institutions"
4. Click "Add Institution"
5. Fill in the form and submit

Or use the API:

```bash
POST http://localhost:5000/api/admin/institutions
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "National University of Lesotho",
  "abbreviation": "NUL",
  "type": "University",
  "email": "info@nul.ls",
  "phone": "+266 2234 0601",
  "website": "https://www.nul.ls",
  "description": "The premier institution of higher learning in Lesotho",
  "address": "Roma, Maseru District",
  "location": "Roma"
}
```

## Next Steps

1. ✅ Fix CORS configuration
2. ✅ Create client .env file
3. ⏳ Start server and test endpoints
4. ⏳ Verify data displays in frontend
5. ⏳ Test all CRUD operations
6. ⏳ Add error handling where needed
