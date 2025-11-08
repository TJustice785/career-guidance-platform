# Database Seeding Guide - Quick Start

## 🚀 How to Populate Your Firestore Database

You already have a complete database seeder built into your app!

---

## Method 1: Use the Built-in Seeder Page (Easiest)

### Step 1: Access the Seeder Page

1. **Make sure your dev server is running:**
   ```bash
   cd client
   npm start
   ```

2. **Navigate to the seeder page in your browser:**
   ```
   http://localhost:3001/seed-database
   ```

### Step 2: Seed Your Database

You'll see a page with these options:

1. **🚀 Seed All Data** - Click this to populate everything at once:
   - 8 Institutions (NUL, Limkokwing, LCE, etc.)
   - 10 Courses (Computer Science, Business, Engineering, etc.)
   - 10 Jobs (Software Developer, Nurse, Engineer, etc.)
   - 7 Career Tips
   - 8 Companies

2. **Or seed individual collections:**
   - 🏛️ Institutions only
   - 📚 Courses only
   - 💼 Jobs only
   - 💡 Career Tips only
   - 🏢 Companies only

### Step 3: Verify Data

1. Go to **Firebase Console** → **Firestore Database**
2. You should see these collections populated:
   - `institutions` (8 documents)
   - `courses` (10 documents)
   - `jobs` (10 documents)
   - `careerTips` (7 documents)
   - `companies` (8 documents)

---

## Method 2: Manual Firestore Console Entry

If the seeder page doesn't work, add data manually:

### Add an Institution

1. Firebase Console → Firestore → **institutions** collection
2. Click **Add Document**
3. Auto-ID
4. Add fields:

```
name: "National University of Lesotho"
description: "Premier institution offering diverse programs"
location: "Roma, Maseru"
type: "university"
website: "https://www.nul.ls"
email: "info@nul.ls"
phone: "+266 2234 0601"
established: 1945
featured: true
createdAt: (timestamp)
updatedAt: (timestamp)
```

### Add a Course

1. Firestore → **courses** collection
2. Add Document:

```
title: "Computer Science - BSc"
description: "Comprehensive computer science program"
institutionName: "National University of Lesotho"
duration: "4 years"
level: "degree"
field: "Computer Science"
fees: 15000
currency: "LSL"
status: "open"
enrolled: 0
createdAt: (timestamp)
updatedAt: (timestamp)
```

### Add a Job

1. Firestore → **jobs** collection
2. Add Document:

```
title: "Software Developer"
company: "Lesotho Tech Solutions"
description: "Join our team as a software developer"
location: "Maseru, Lesotho"
type: "full-time"
category: "Technology"
experience: "0-2 years"
education: "Bachelor's Degree"
status: "open"
featured: true
applicants: 0
createdAt: (timestamp)
updatedAt: (timestamp)
```

---

## What Data Will Be Seeded

### 📚 8 Institutions
1. National University of Lesotho (NUL)
2. Limkokwing University
3. Lesotho College of Education (LCE)
4. Lerotholi Polytechnic
5. Botho University
6. Institute of Development Management (IDM)
7. Lesotho Agricultural College (LAC)
8. National Health Training College (NHTC)

### 📖 10 Courses
1. BSc Computer Science (NUL)
2. Diploma Business Administration (Limkokwing)
3. Certificate Early Childhood Education (LCE)
4. Diploma Electrical Engineering (Lerotholi)
5. BCom Accounting (Botho)
6. Certificate Nursing Assistant (NHTC)
7. Diploma Agricultural Science (LAC)
8. BA Graphic Design (Limkokwing)
9. Certificate Public Administration (IDM)
10. Diploma Information Technology (Botho)

### 💼 10 Jobs
1. Junior Software Developer (Lesotho Tech Solutions)
2. Marketing Manager (Lesotho Retail Group)
3. Accounting Intern (Lesotho Financial Services)
4. Registered Nurse (Queen Mamohato Hospital)
5. Civil Engineer (Lesotho Construction Ltd)
6. Customer Service Rep (Vodacom Lesotho)
7. Agricultural Extension Officer (Ministry of Agriculture)
8. Graphic Designer (Creative Media Lesotho)
9. HR Officer (Lesotho Retail Group)
10. Data Analyst (Lesotho Tech Solutions)

### 💡 7 Career Tips
1. How to Write a Winning Resume
2. Ace Your Job Interview: Top 10 Tips
3. Building Your Professional Network
4. Essential Skills for the Modern Workplace
5. Negotiating Your Salary: A Guide
6. LinkedIn Profile Optimization
7. Common Interview Questions & Answers

### 🏢 8 Companies
1. Lesotho Tech Solutions
2. Lesotho Retail Group
3. Lesotho Financial Services
4. Queen Mamohato Memorial Hospital
5. Lesotho Construction Ltd
6. Vodacom Lesotho
7. Ministry of Agriculture
8. Creative Media Lesotho

---

## Troubleshooting

### Error: "Permission denied"

**Solution:** Check Firestore security rules. For testing, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Error: "Firebase not initialized"

**Solution:** Check `client/src/config/firebase.config.js` has correct credentials

### Seeder page shows blank

**Solution:** 
1. Check browser console for errors
2. Make sure you're logged in
3. Try accessing directly: `http://localhost:3001/seed-database`

### Data not appearing in Firestore

**Solution:**
1. Check browser console for success messages
2. Refresh Firebase Console
3. Verify you're looking at the correct project
4. Check Network tab for failed requests

---

## Quick Commands

### Access Seeder
```
http://localhost:3001/seed-database
```

### Check if data exists
1. Firebase Console → Firestore
2. Look for collections: institutions, courses, jobs, companies, careerTips

### Clear all data (if needed)
1. Firebase Console → Firestore
2. Select collection → Delete collection
3. Re-run seeder

---

## After Seeding

Once data is seeded, you can:

1. **Test Student Dashboard:**
   - Login as student
   - Browse institutions → Should see 8 institutions
   - Search jobs → Should see 10 jobs

2. **Test Institute Dashboard:**
   - Login as institute
   - View courses → Should see courses for that institution

3. **Test Company Dashboard:**
   - Login as company
   - View jobs → Should see job postings

4. **Test Admin Dashboard:**
   - Login as admin
   - View all data across the platform

---

## Production Notes

**Before deploying to production:**

1. **Remove the seeder route** from `App.js`:
   ```javascript
   // Remove this line:
   <Route path="/seed-database" element={<SeedDatabase />} />
   ```

2. **Or protect it with admin-only access:**
   ```javascript
   <Route 
     path="/seed-database" 
     element={
       <ProtectedRoute allowedRoles={['admin']}>
         <SeedDatabase />
       </ProtectedRoute>
     } 
   />
   ```

3. **Update Firestore rules** to be more restrictive

---

## Summary

**Easiest way to populate database:**

1. Go to: `http://localhost:3001/seed-database`
2. Click **"🚀 Seed All Data"**
3. Wait for success message
4. Check Firebase Console to verify
5. Start testing your app!

**Total time:** 2-3 minutes

**Total documents created:** 43 documents across 5 collections

---

**You're ready to test your Career Guidance Platform with real data! 🎉**
