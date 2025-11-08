# Admin Login Redirect Fix

## Problem
When trying to login as admin, you're redirected to `/login?sessionExpired=true` and the login keeps looping.

## Root Cause
The authentication flow is mixing Firebase client-side auth with backend API auth, causing a mismatch.

## Solutions

### Solution 1: Use Firebase Auth (Recommended)

The app is already configured to use Firebase Auth. The issue is that the admin user might not exist or has incorrect data.

**Step 1: Create Admin User**

1. Go to http://localhost:3000/create-admin
2. Click "Create Admin User" button
3. Wait for success message

**Step 2: Login**

Use these credentials:
- Email: `thabotsehla31@gmail.com`
- Password: `vegetarian@31`

### Solution 2: Check if Admin User Exists

Open browser console and run:

```javascript
// Check Firebase Auth
fetch('http://localhost:5000/api/auth/me')
  .then(res => res.json())
  .then(data => console.log('Current user:', data));
```

### Solution 3: Verify Admin User in Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project
3. Go to Authentication > Users
4. Check if `thabotsehla31@gmail.com` exists
5. If not, click "Add user" and create it
6. Go to Firestore Database > users collection
7. Create a document with:
   - Document ID: (copy the UID from Authentication)
   - Fields:
     - `email`: thabotsehla31@gmail.com
     - `role`: admin
     - `firstName`: Justice
     - `fullName`: Justice
     - `isActive`: true
     - `createdAt`: (timestamp)
     - `updatedAt`: (timestamp)

### Solution 4: Clear Browser Data

1. Open Developer Tools (F12)
2. Go to Application tab
3. Click "Clear site data"
4. Refresh the page
5. Try logging in again

## Debugging Steps

### Check 1: Is the server running?
```bash
curl http://localhost:5000/api/health
```

### Check 2: Is Firebase configured?
Open browser console and check for Firebase errors.

### Check 3: Is the user authenticated?
Open browser console and run:
```javascript
localStorage.getItem('token')
```

### Check 4: Check what happens during login

Add this to the browser console and try logging in:

```javascript
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.newValue);
});
```

## Expected Behavior

### Successful Login Flow:

1. User enters credentials
2. Firebase authenticates
3. Token is stored in localStorage
4. User data is fetched from Firestore
5. User is redirected to their dashboard based on role

### Admin Login:
- Role: admin
- Redirects to: `/admin`

## Common Issues

### Issue 1: "Session Expired"
**Cause**: Token is missing or expired
**Fix**: Clear localStorage and login again

### Issue 2: Infinite redirect loop
**Cause**: Auth state not being properly set
**Fix**: Check AuthContext implementation

### Issue 3: "User not found"
**Cause**: Admin user doesn't exist in Firestore
**Fix**: Create the user document in Firestore

## Quick Test

Run this in browser console to test authentication:

```javascript
// Test login
fetch('http://localhost:5000/api/institutions')
  .then(res => res.json())
  .then(data => console.log('Institutions:', data));
```

This should work without auth. If it works, the server is fine and the issue is with authentication.

## Still Not Working?

1. Check server console for errors
2. Check browser console for errors
3. Verify .env files are correct
4. Make sure Firebase project is configured
5. Clear all browser data and try again
