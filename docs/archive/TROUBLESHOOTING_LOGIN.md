# Troubleshooting Login Issues

## Issue: Dashboard Not Displaying After Login

### Quick Fixes Applied

1. ✅ **Disabled Email Verification Check** (temporarily for development)
   - File: `client/src/App.js` line 37-59
   - The email verification requirement is now commented out
   - Re-enable in production by uncommenting the block

2. ✅ **Added Debug Logging**
   - LoginPage: Shows login result, user role, redirect path
   - ProtectedRoute: Shows loading state, user data, role checking
   - Check browser console (F12) for detailed logs

### How to Debug

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)

2. **Login and Watch Console** - You should see:
   ```
   Login result: { user: {...}, userData: {...} }
   User role: student
   Redirecting to: /student
   ProtectedRoute - Loading: false User: student@example.com UserData: {...}
   Access granted, rendering dashboard
   ```

3. **Common Issues and Solutions:**

#### Issue 1: "User profile not found"
**Cause:** User exists in Firebase Auth but not in Firestore `users` collection

**Solution:**
```javascript
// Go to Firebase Console → Firestore
// Find the user by UID in the 'users' collection
// If missing, add a document with:
{
  email: "user@example.com",
  role: "student", // or "admin", "institute", "company"
  firstName: "John",
  lastName: "Doe",
  emailVerified: true,
  createdAt: (timestamp),
  updatedAt: (timestamp)
}
```

#### Issue 2: "User role not assigned"
**Cause:** User document exists but missing `role` field

**Solution:**
```javascript
// Go to Firebase Console → Firestore → users → [user-uid]
// Add field: role = "student" (or appropriate role)
```

#### Issue 3: Blank screen after login
**Cause:** Dashboard component has errors

**Solution:**
```javascript
// Check browser console for errors
// Common errors:
// - "stats is not defined" → Already fixed
// - "Cannot read property 'map' of undefined" → Data loading issue
```

#### Issue 4: Redirects back to login
**Cause:** User data not loading from Firestore

**Solution:**
```javascript
// Check console logs:
// "ProtectedRoute - Loading: true" → Wait for it to become false
// "No current user" → Login didn't work
// "User role not allowed" → Wrong role for the route
```

#### Issue 5: Stuck on loading spinner
**Cause:** AuthContext loading state not updating

**Solution:**
```javascript
// Check if Firestore rules allow reading user data
// Go to Firebase Console → Firestore → Rules
// Ensure this rule exists:
match /users/{userId} {
  allow read: if request.auth != null;
}
```

### Step-by-Step Debugging Process

1. **Clear browser cache and reload**
   ```
   Ctrl + Shift + Delete → Clear cache
   Or use Incognito mode
   ```

2. **Check Firebase Console**
   - Authentication → Users → Verify user exists
   - Firestore → users → Verify user document exists with `role` field

3. **Test with these credentials:**
   ```
   Admin:
   Email: admin@careerpath.ls
   Password: Admin123!
   Expected: Redirect to /admin

   Student:
   Email: student@careerpath.ls
   Password: Student123!
   Expected: Redirect to /student
   ```

4. **Check console logs in this order:**
   ```
   1. "Login result:" → Should show user and userData
   2. "User role:" → Should show the role (admin, student, etc.)
   3. "Redirecting to:" → Should show /admin, /student, etc.
   4. "ProtectedRoute - Loading:" → Should be false
   5. "Access granted" → Dashboard should render
   ```

5. **If still not working, check for:**
   - Network errors (check Network tab in DevTools)
   - Firebase configuration errors
   - Missing environment variables
   - CORS issues

### Manual Fix: Create Test User

If you need to manually create a test user:

1. **Firebase Console → Authentication → Add User**
   - Email: `test@example.com`
   - Password: `Test123!`
   - Copy the UID

2. **Firebase Console → Firestore → users collection → Add Document**
   - Document ID: [paste the UID]
   - Fields:
     ```
     email: "test@example.com"
     role: "student"
     firstName: "Test"
     lastName: "User"
     emailVerified: true
     createdAt: (use timestamp)
     updatedAt: (use timestamp)
     ```

3. **Test login with these credentials**

### Re-enable Email Verification (Production)

When ready for production, uncomment this block in `client/src/App.js`:

```javascript
// Line 40-59 in App.js
if (!userData?.emailVerified && userData?.role !== 'admin') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Required</h2>
        <p className="text-gray-600 mb-6">
          Please verify your email address to access your dashboard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          I've Verified My Email
        </button>
      </div>
    </div>
  );
}
```

### Remove Debug Logs (Production)

Before deploying, remove console.log statements from:
- `client/src/pages/LoginPage.js` (lines 32, 42, 53)
- `client/src/App.js` (lines 25, 36, 65, 69)

Or use a build tool to strip them automatically.

---

## Quick Checklist

- [ ] User exists in Firebase Authentication
- [ ] User document exists in Firestore `users` collection
- [ ] User document has `role` field set correctly
- [ ] Firestore security rules allow reading user data
- [ ] Email verification check is disabled (for testing)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful Firestore requests
- [ ] Dashboard component has no syntax errors

---

## Still Not Working?

1. **Check the exact error message in console**
2. **Take a screenshot of:**
   - Browser console logs
   - Network tab (filter by "firestore")
   - Firebase Console → Firestore → users collection
3. **Verify Firebase config in `client/src/config/firebase.config.js`**
4. **Try with a different browser or incognito mode**

---

**Most Common Solution:** The user document in Firestore is missing or doesn't have the `role` field. Add it manually in Firebase Console.
