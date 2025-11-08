# 🌱 DATABASE SEEDING - VISUAL GUIDE

## 🎯 QUICK START (3 Steps)

Your dev server is **ALREADY RUNNING** ✅

---

## Step 1️⃣: Open the Seeder Page

**Click this link or copy to your browser:**

```
http://localhost:3000/seed-database
```

**Alternative (if port 3000 doesn't work):**

```
http://localhost:3001/seed-database
```

---

## Step 2️⃣: Click "Seed All Data"

You'll see a page that looks like this:

```
┌─────────────────────────────────────────────────┐
│  🌱 Database Seeder                             │
│  Populate your Firestore database with sample   │
│  data                                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │  Seed All Data                           │  │
│  │                                          │  │
│  │  This will populate your database with   │  │
│  │  sample institutions, courses, jobs,     │  │
│  │  career tips, and companies.             │  │
│  │                                          │  │
│  │  [ 🚀 Seed All Data ]                    │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
│  Or Seed Individual Collections                 │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 🏛️ Institutions│  │ 📚 Courses   │           │
│  │ Add 3 sample  │  │ Add 3 sample │           │
│  │ institutions  │  │ courses      │           │
│  │ [Seed]        │  │ [Seed]       │           │
│  └──────────────┘  └──────────────┘           │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 💼 Jobs       │  │ 💡 Career Tips│          │
│  │ Add 3 sample  │  │ Add 3 career │           │
│  │ job listings  │  │ tips         │           │
│  │ [Seed]        │  │ [Seed]       │           │
│  └──────────────┘  └──────────────┘           │
│                                                  │
│  ┌──────────────┐                               │
│  │ 🏢 Companies  │                               │
│  │ Add 3 sample  │                               │
│  │ companies     │                               │
│  │ [Seed]        │                               │
│  └──────────────┘                               │
└─────────────────────────────────────────────────┘
```

**👉 Click the big blue button: "🚀 Seed All Data"**

---

## Step 3️⃣: Wait for Success Message

After 10-15 seconds, you'll see:

```
┌─────────────────────────────────────────────────┐
│  ✅ All data seeded successfully!               │
└─────────────────────────────────────────────────┘
```

**That's it! Your database is now populated! 🎉**

---

## ✅ What Just Happened?

Your Firestore database now has:

| Collection | Documents | Description |
|------------|-----------|-------------|
| 🏛️ **institutions** | 8 | Universities, colleges, polytechnics |
| 📚 **courses** | 10 | Degree, diploma, certificate programs |
| 💼 **jobs** | 10 | Full-time, part-time, internships |
| 💡 **careerTips** | 7 | Career advice articles |
| 🏢 **companies** | 8 | Employers and organizations |

**Total: 43 documents created!**

---

## 🔍 Verify in Firebase Console

### Option 1: Quick Check
1. Open: https://console.firebase.google.com
2. Select your project
3. Click **"Firestore Database"** (left menu)
4. Click **"Data"** tab
5. You should see 5 collections with data

### Option 2: Detailed Check
Click each collection to see documents:

**institutions:**
```
✅ National University of Lesotho
✅ Limkokwing University
✅ Lesotho College of Education
✅ Lerotholi Polytechnic
✅ Botho University
✅ Institute of Development Management
✅ Lesotho Agricultural College
✅ National Health Training College
```

**courses:**
```
✅ BSc Computer Science
✅ Diploma Business Administration
✅ Certificate Early Childhood Education
✅ Diploma Electrical Engineering
✅ BCom Accounting
✅ Certificate Nursing Assistant
✅ Diploma Agricultural Science
✅ BA Graphic Design
✅ Certificate Public Administration
✅ Diploma Information Technology
```

**jobs:**
```
✅ Junior Software Developer
✅ Marketing Manager
✅ Accounting Intern
✅ Registered Nurse
✅ Civil Engineer
✅ Customer Service Representative
✅ Agricultural Extension Officer
✅ Graphic Designer
✅ HR Officer
✅ Data Analyst
```

---

## 🧪 Test Your App

Now test with real data!

### Test 1: Student Dashboard
```
1. Go to: http://localhost:3000/login
2. Login as a student (or create account)
3. Click "Institutions" → Should see 8 institutions
4. Click "Job Search" → Should see 10 jobs
5. Try searching and filtering
```

### Test 2: Browse Institutions
```
1. Navigate to "Institutions" page
2. You should see cards for:
   - National University of Lesotho
   - Limkokwing University
   - Lesotho College of Education
   - And 5 more...
3. Click on any institution to view details
4. See available courses for that institution
```

### Test 3: Job Search
```
1. Navigate to "Job Search" page
2. You should see 10 job listings
3. Try filtering by:
   - Location
   - Job type (Full-time, Part-time, etc.)
   - Category
4. Click "Apply Now" to test application flow
```

### Test 4: Admin Dashboard
```
1. Login as admin
2. View statistics:
   - Total Users
   - Total Institutions (should show 8)
   - Total Students
   - Total Companies (should show 8)
3. Navigate to management pages
4. View all data across the platform
```

---

## 🎨 Sample Data Preview

### Institution Example:
```json
{
  "name": "National University of Lesotho",
  "description": "The premier institution of higher learning in Lesotho",
  "location": "Roma, Maseru",
  "type": "university",
  "website": "https://www.nul.ls",
  "email": "info@nul.ls",
  "phone": "+266 2234 0601",
  "established": 1945,
  "featured": true
}
```

### Course Example:
```json
{
  "title": "BSc Computer Science",
  "description": "Comprehensive computer science program",
  "institutionName": "National University of Lesotho",
  "duration": "4 years",
  "level": "degree",
  "field": "Computer Science",
  "fees": 15000,
  "currency": "LSL",
  "status": "open"
}
```

### Job Example:
```json
{
  "title": "Junior Software Developer",
  "company": "Lesotho Tech Solutions",
  "description": "Join our team as a software developer",
  "location": "Maseru, Lesotho",
  "type": "full-time",
  "category": "Technology",
  "salary": {
    "min": 8000,
    "max": 12000,
    "currency": "LSL"
  },
  "experience": "0-2 years",
  "education": "Bachelor's Degree",
  "status": "open"
}
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Permission denied"
**Symptom:** Error message when clicking seed button

**Solution:**
1. Go to Firebase Console
2. Firestore Database → Rules
3. Update to:
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
4. Click "Publish"

---

### Issue 2: Page shows blank
**Symptom:** White screen or no content

**Solution:**
1. Press F12 to open browser console
2. Check for errors
3. Make sure you're logged in
4. Try: http://localhost:3001/seed-database

---

### Issue 3: Data not in Firebase
**Symptom:** Success message but no data in Firebase

**Solution:**
1. Refresh Firebase Console (F5)
2. Check correct project is selected
3. Look in "Data" tab, not "Rules"
4. Check browser console for actual errors

---

### Issue 4: Button does nothing
**Symptom:** Clicking button has no effect

**Solution:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Make sure Firebase is initialized
4. Check network tab for failed requests

---

## 🔄 Re-seeding

**Want to seed again?**

The seeder **adds new documents** without deleting existing ones.

**To start fresh:**
1. Go to Firebase Console
2. Select each collection
3. Click "..." → "Delete collection"
4. Run seeder again

---

## 📊 Database Structure After Seeding

```
Firestore Database
│
├── 🏛️ institutions (8 documents)
│   ├── doc1: National University of Lesotho
│   ├── doc2: Limkokwing University
│   ├── doc3: Lesotho College of Education
│   └── ... (5 more)
│
├── 📚 courses (10 documents)
│   ├── doc1: BSc Computer Science
│   ├── doc2: Diploma Business Administration
│   ├── doc3: Certificate Early Childhood Education
│   └── ... (7 more)
│
├── 💼 jobs (10 documents)
│   ├── doc1: Junior Software Developer
│   ├── doc2: Marketing Manager
│   ├── doc3: Accounting Intern
│   └── ... (7 more)
│
├── 💡 careerTips (7 documents)
│   ├── doc1: How to Write a Winning Resume
│   ├── doc2: Ace Your Job Interview
│   └── ... (5 more)
│
└── 🏢 companies (8 documents)
    ├── doc1: Lesotho Tech Solutions
    ├── doc2: Lesotho Retail Group
    └── ... (6 more)
```

---

## ✅ Success Checklist

After seeding, you should be able to:

- ✅ See 8 institutions in Student Dashboard
- ✅ See 10 jobs in Job Search
- ✅ View course details for each institution
- ✅ Apply to jobs
- ✅ Browse career tips
- ✅ Search and filter all data
- ✅ See statistics in Admin Dashboard
- ✅ View all data in Firebase Console

---

## 🎉 You're Done!

**Your database is now populated with 43 documents!**

**Next Steps:**
1. ✅ Test all dashboards
2. ✅ Try searching and filtering
3. ✅ Test application flows
4. ✅ Create test user accounts
5. ✅ Explore all features

---

## 📞 Need Help?

**Check these files for more info:**
- `DATABASE_SEEDING_GUIDE.md` - Detailed guide
- `POPULATE_DATABASE_NOW.md` - Quick reference
- Browser console (F12) - Error messages

**Common URLs:**
- Seeder: http://localhost:3000/seed-database
- Login: http://localhost:3000/login
- Firebase: https://console.firebase.google.com

---

**Happy Testing! 🚀**
