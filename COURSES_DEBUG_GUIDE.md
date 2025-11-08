# Courses Not Displaying - Debug Guide

## What Was Fixed

Added comprehensive logging to all course-fetching components:
- ✅ BrowseCourses.js
- ✅ StudentDashboard.js (InstitutionDetailsView)
- ✅ StudentDashboardModern.js (InstitutionDetailsView)

## How to Debug

### Step 1: Build and Deploy
```bash
cd c:\Users\JUSTICE\Downloads\Career\client
npm run build
cd ..
firebase deploy --only hosting
```

### Step 2: Check Browser Console
1. Open your app: https://career-guidance-platform-7e18e.web.app
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Navigate to Browse Institutions or Institutions page
5. Click on an institution to expand/view courses

### Step 3: Look for These Logs

**When browsing institutions:**
```
Institutions loaded: 3 [{...}]
Fetching courses for institution: abc123xyz
Courses found for abc123xyz : 5 [{...}]
```

**When viewing institution details:**
```
Fetching data for institution ID: abc123xyz
Institution data: {...}
Courses found for institution: 5 [{...}]
```

## Common Issues & Solutions

### Issue 1: No Courses Found (0 courses)
**Symptoms:** `Courses found for institution: 0 []`

**Solution:** Courses don't exist in Firestore for that institution.

**Check Firestore:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: career-guidance-platform-7e18e
3. Go to Firestore Database
4. Check the `courses` collection
5. Verify courses have `institutionId` field matching institution IDs

**Sample Course Document Structure:**
```javascript
{
  id: "course123",
  institutionId: "institution456",  // MUST match institution document ID
  title: "Computer Science - BSc",
  name: "Computer Science",
  description: "Comprehensive computer science program",
  level: "Undergraduate",
  duration: "4 years",
  fees: 15000,
  currency: "LSL",
  requirements: ["Grade 12", "Mathematics", "Science"],
  field: "Science & Technology"
}
```

### Issue 2: InstitutionId Mismatch
**Symptoms:** Institution loads but courses don't appear

**Cause:** The `institutionId` in courses doesn't match the institution document ID

**Fix:**
1. Go to Firestore
2. Copy the exact institution document ID (not the name)
3. Make sure ALL courses for that institution have the exact same `institutionId` value

### Issue 3: Permission Denied
**Symptoms:** Error in console: `FirebaseError: Missing or insufficient permissions`

**Fix:** Check firestore.rules

## Quick Test Data

If you need to add test courses, use Firebase Console or this script:

```javascript
// Run this in Firebase Console > Firestore
const courses = [
  {
    institutionId: "YOUR_INSTITUTION_ID_HERE",  // Replace with actual ID
    title: "Computer Science",
    name: "Computer Science",
    description: "Learn programming and software development",
    level: "Undergraduate", 
    duration: "4 years",
    fees: 15000,
    field: "Technology"
  },
  {
    institutionId: "YOUR_INSTITUTION_ID_HERE",  // Same ID
    title: "Business Administration",
    name: "Business Administration",
    description: "Learn business management",
    level: "Undergraduate",
    duration: "3 years",
    fees: 12000,
    field: "Business"
  }
];
```

## Verification Checklist

- [ ] Build completed successfully
- [ ] Deployed to Firebase
- [ ] Can see institutions list
- [ ] Console shows "Institutions loaded: X"
- [ ] Clicking institution shows "Fetching courses for institution: ID"
- [ ] Console shows "Courses found: X"
- [ ] Courses appear in UI
- [ ] Can apply to courses

## Still Not Working?

Share the console logs with these specific messages:
1. `Institutions loaded: X`
2. `Fetching courses for institution: ID`
3. `Courses found for institution: X`
4. Any error messages in red

This will help identify the exact problem!
