# Dashboard Login & Routing Test Guide

## Overview
This guide helps you verify that each user role correctly logs in and sees their appropriate dashboard.

## Prerequisites

### 1. Firebase Email/Password Authentication MUST be Enabled
- Go to: https://console.firebase.google.com/
- Select project: `career-guidance-platform-7e18e`
- Navigate to: **Authentication** → **Sign-in method**
- Enable: **Email/Password**
- Click **Save**

### 2. Dev Server Running
The dev server should be running at `http://localhost:3001`

If not, run:
```bash
cd client
npm start
```

## User Roles & Dashboards

Your app supports 4 user roles, each with a unique dashboard:

| Role | Dashboard Route | Features |
|------|----------------|----------|
| **Admin** | `/admin` | User management, institution management, system stats |
| **Student** | `/student` | Course applications, job search, progress tracking |
| **Institute** | `/institute` | Course management, student applications, admissions |
| **Company** | `/company` | Job postings, candidate applications, hiring stats |

## Testing Steps

### Step 1: Create Test Users

You have two options:

#### Option A: Use the Database Seeder (Recommended)
1. Navigate to: `http://localhost:3001/seed-database`
2. Click the seed button to create test users
3. Note the generated credentials

#### Option B: Manual Registration
1. Go to: `http://localhost:3001/register`
2. For each role, register a user:
   - **Admin**: Select "Admin" role
   - **Student**: Select "Student" role, fill in firstName/lastName
   - **Institute**: Select "Institute" role, fill in name/description
   - **Company**: Select "Company" role, fill in name/industry

### Step 2: Verify Firestore Documents

After registration, check Firebase Console:

1. Go to: **Firestore Database**
2. Open collection: `users`
3. For each user document, verify it has:
   ```javascript
   {
     email: "user@example.com",
     role: "student", // or "admin", "institute", "company"
     emailVerified: false,
     createdAt: Timestamp,
     updatedAt: Timestamp,
     // ... other role-specific fields
   }
   ```

**CRITICAL**: The `role` field MUST exist and match one of: `admin`, `student`, `institute`, `company`

### Step 3: Test Login Flow

For each user role:

#### 1. Admin User
```
Email: admin@example.com
Password: [your password]

Expected Result:
✅ Login successful toast
✅ Redirect to: /admin
✅ See: Admin Dashboard with stats (users, institutes, companies)
✅ Header shows: "Admin Dashboard" or similar
```

#### 2. Student User
```
Email: student@example.com
Password: [your password]

Expected Result:
✅ Login successful toast
✅ Redirect to: /student
✅ See: Student Dashboard with:
   - Applied Courses stats
   - Job Applications
   - Recent Applications list
   - Job Opportunities
   - Progress bars
✅ Header shows: "Welcome back, [FirstName]!"
```

#### 3. Institute User
```
Email: institute@example.com
Password: [your password]

Expected Result:
✅ Login successful toast
✅ Redirect to: /institute
✅ See: Institute Dashboard with:
   - Total Students
   - Active Courses
   - Pending Applications
✅ Header shows institute-related content
```

#### 4. Company User
```
Email: company@example.com
Password: [your password]

Expected Result:
✅ Login successful toast
✅ Redirect to: /company
✅ See: Company Dashboard with:
   - Active Jobs
   - Total Applications
   - Shortlisted candidates
   - Hired count
✅ Header shows company-related content
```

### Step 4: Test Protected Routes

While logged in as a **Student**, try to access:
- `http://localhost:3001/admin` → Should redirect to `/` (unauthorized)
- `http://localhost:3001/institute` → Should redirect to `/` (unauthorized)
- `http://localhost:3001/company` → Should redirect to `/` (unauthorized)

### Step 5: Test Public Route Redirects

While logged in, try to access:
- `http://localhost:3001/login` → Should redirect to your role's dashboard
- `http://localhost:3001/register` → Should redirect to your role's dashboard

## Login Flow Diagram

```
User enters credentials
        ↓
LoginPage.handleSubmit()
        ↓
AuthContext.login(email, password)
        ↓
Firebase Authentication
        ↓
Fetch Firestore user document (users/{uid})
        ↓
Validate userData exists & has role
        ↓
Return { user, userData }
        ↓
LoginPage checks userData.role
        ↓
Navigate to role-based dashboard:
  - admin → /admin
  - student → /student
  - institute → /institute
  - company → /company
```

## Troubleshooting

### Error: "User profile not found"
**Cause**: Firestore document doesn't exist for the user
**Fix**: 
1. Check Firebase Console → Firestore Database → `users` collection
2. Ensure document exists with UID matching the authenticated user
3. Re-register the user or manually create the document

### Error: "User role not assigned"
**Cause**: Firestore document exists but has no `role` field
**Fix**:
1. Go to Firebase Console → Firestore Database
2. Find the user document
3. Add field: `role` with value: `admin`, `student`, `institute`, or `company`

### Error: "auth/configuration-not-found"
**Cause**: Email/Password authentication not enabled in Firebase
**Fix**: Follow Step 1 in Prerequisites above

### Dashboard shows but looks broken
**Cause**: Tailwind CSS classes not loading or theme issue
**Fix**:
1. Check browser console for CSS errors
2. Verify `tailwind.config.js` is properly configured
3. Restart dev server

### Redirect loop or stuck on login page
**Cause**: 
- `userData` is null after login
- Role doesn't match any route
**Fix**:
1. Check browser console for errors
2. Verify Firestore document has correct `role` field
3. Clear browser cache and localStorage

## Expected Console Output (Success)

When login is successful, you should see:
```
✅ Login successful! (toast notification)
✅ Redirecting to /[role]
✅ No errors in console (except browser extension noise)
```

## Files Modified for Dashboard Routing

- ✅ `client/src/contexts/AuthContext.js` - Added validation for userData and role
- ✅ `client/src/pages/LoginPage.js` - Added defensive checks before redirect
- ✅ `client/src/pages/RegisterPage.js` - Fixed register function call
- ✅ `client/src/pages/student/StudentDashboard.js` - Enhanced with full UI
- ✅ `client/src/App.js` - Already has correct routing (no changes needed)

## Summary Checklist

Before testing:
- [ ] Firebase Email/Password auth enabled
- [ ] Dev server running at localhost:3001
- [ ] Test users created with proper Firestore documents
- [ ] Each user document has `role` field

During testing:
- [ ] Admin user logs in → sees Admin Dashboard
- [ ] Student user logs in → sees Student Dashboard
- [ ] Institute user logs in → sees Institute Dashboard
- [ ] Company user logs in → sees Company Dashboard
- [ ] Protected routes block unauthorized access
- [ ] Public routes redirect logged-in users

If all checkboxes pass: ✅ **Dashboard routing is working correctly!**
