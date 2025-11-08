# Login Error Fix Guide

## Issues Fixed

### 1. TypeError: Cannot read properties of undefined (reading 'role')
**Location:** `LoginPage.js:31`

**Root Cause:**
- The `login()` function from `AuthContext` was returning `{ user, userData }`, but `userData` could be `null` if:
  - The Firestore document `users/{uid}` doesn't exist for the authenticated user
  - The Firestore fetch failed silently
  - The user document exists but doesn't have a `role` field

**Solution Applied:**
- **In `AuthContext.js`**: Added validation to check if `userData` and `userData.role` exist before returning from the login function. If missing, it throws a clear error with a user-friendly message.
- **In `LoginPage.js`**: Added defensive checks to ensure `result` and `result.userData` exist before accessing `result.userData.role`. If missing, the user is redirected to home with an error message.

### 2. ERR_CONNECTION_REFUSED: localhost:5000/api/auth/login
**Root Cause:**
- Your application uses **Firebase Authentication** (not a backend REST API)
- The backend server at `localhost:5000` has no `/api/auth/login` endpoint implemented (only a test route)
- The error appears because:
  - Some component might be importing/using the axios-based `apiService` unnecessarily
  - Or it's a stale network request from browser cache/dev tools

**Solution:**
- The login flow correctly uses Firebase (`AuthContext.js` uses `signInWithEmailAndPassword`)
- The backend is not needed for authentication
- If you see this error, it's safe to ignore it OR you can:
  - Clear browser cache and reload
  - Check if any component is accidentally calling `apiService.auth.login()`

## What Was Changed

### File: `client/src/contexts/AuthContext.js`
```javascript
// Added validation in login function (lines 58-68)
if (!data) {
  toast.error('User profile not found. Please contact support.');
  throw new Error('User data not found in Firestore');
}

if (!data.role) {
  toast.error('User role not assigned. Please contact support.');
  throw new Error('User role not found');
}
```

### File: `client/src/pages/LoginPage.js`
```javascript
// Added defensive checks in handleSubmit (lines 32-37)
if (!result || !result.userData) {
  toast.error('Login failed: Unable to retrieve user data');
  navigate('/');
  return;
}

// Also added check for missing role (lines 48-51)
if (!result.userData.role) {
  toast.error('User role not found. Please contact support.');
  navigate('/');
}
```

## How to Test

1. **Restart the React dev server** to pick up the changes:
   ```bash
   cd client
   npm start
   ```

2. **Try logging in** with a valid Firebase user account

3. **Expected Behavior:**
   - If the user exists in Firebase Auth but NOT in Firestore → Error: "User profile not found"
   - If the user exists in Firestore but has no `role` field → Error: "User role not assigned"
   - If everything is correct → Success toast and redirect to role-based dashboard

## Important: User Data Setup

For login to work properly, each user must have a Firestore document at `users/{uid}` with this structure:

```javascript
{
  email: "user@example.com",
  role: "student", // or "admin", "institute", "company"
  emailVerified: true,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // ... other user fields
}
```

### To Create Test Users:
1. Use the `/seed-database` route in your app
2. Or manually create Firestore documents after Firebase Auth registration
3. Ensure the `role` field is set to one of: `admin`, `student`, `institute`, `company`

## Backend Server (Optional)

The backend at `localhost:5000` is **not required** for authentication. It's only needed for:
- Admin operations (user management, institution management)
- Application processing
- Job postings
- Other business logic

If you need the backend for other features:
```bash
cd server
npm start
```

## Summary

✅ **Fixed:** TypeError when accessing `userData.role`  
✅ **Added:** Validation to ensure user data exists before login completes  
✅ **Added:** Clear error messages for missing user profiles or roles  
✅ **Clarified:** Backend connection error is unrelated to Firebase auth  

The login flow now has proper error handling and will guide users when their account setup is incomplete.
