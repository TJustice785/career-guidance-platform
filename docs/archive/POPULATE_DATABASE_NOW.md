# 🚀 POPULATE DATABASE - QUICK START

## ✅ Your Dev Server is Already Running!

Your React app is already running on **port 3000 or 3001**.

---

## 📋 Step-by-Step Instructions

### Step 1: Open the Seeder Page

**Open your browser and go to:**

```
http://localhost:3000/seed-database
```

**OR if that doesn't work, try:**

```
http://localhost:3001/seed-database
```

---

### Step 2: Seed Your Database

Once the page loads, you'll see a **Database Seeder** interface with:

#### Option 1: Seed Everything at Once (RECOMMENDED)
1. Click the big blue button: **"🚀 Seed All Data"**
2. Wait 10-15 seconds
3. You'll see: **"✅ All data seeded successfully!"**

This will create:
- ✅ **8 Institutions** (NUL, Limkokwing, LCE, etc.)
- ✅ **10 Courses** (Computer Science, Business, etc.)
- ✅ **10 Jobs** (Software Developer, Nurse, etc.)
- ✅ **7 Career Tips**
- ✅ **8 Companies**

#### Option 2: Seed Individual Collections
If you prefer, you can seed each collection separately:
- 🏛️ **Institutions** - Click "Seed Institutions"
- 📚 **Courses** - Click "Seed Courses"
- 💼 **Jobs** - Click "Seed Jobs"
- 💡 **Career Tips** - Click "Seed Career Tips"
- 🏢 **Companies** - Click "Seed Companies"

---

### Step 3: Verify Data in Firebase

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Database:**
   - Click **"Firestore Database"** in the left menu
   - Click **"Data"** tab

3. **Check Collections:**
   You should see these collections with data:
   - ✅ `institutions` - 8 documents
   - ✅ `courses` - 10 documents
   - ✅ `jobs` - 10 documents
   - ✅ `careerTips` - 7 documents
   - ✅ `companies` - 8 documents

---

### Step 4: Test Your App

Now you can test all features with real data!

#### Test Student Dashboard:
1. Go to: `http://localhost:3000/login`
2. Login as a student
3. Navigate to **"Institutions"** → You should see 8 institutions
4. Navigate to **"Job Search"** → You should see 10 jobs

#### Test Institute Dashboard:
1. Login as an institute
2. View courses for your institution

#### Test Company Dashboard:
1. Login as a company
2. View job postings

#### Test Admin Dashboard:
1. Login as admin
2. View all data across the platform

---

## 🎯 What Data Will Be Created

### 🏛️ Institutions (8)
1. **National University of Lesotho (NUL)**
   - Location: Roma, Maseru
   - Type: University
   - Established: 1945

2. **Limkokwing University**
   - Location: Maseru
   - Type: University
   - Established: 2007

3. **Lesotho College of Education (LCE)**
   - Location: Maseru
   - Type: College
   - Established: 1975

4. **Lerotholi Polytechnic**
   - Location: Maseru
   - Type: Polytechnic
   - Established: 1906

5. **Botho University**
   - Location: Maseru
   - Type: University
   - Established: 2000

6. **Institute of Development Management (IDM)**
   - Location: Maseru
   - Type: Institute
   - Established: 1974

7. **Lesotho Agricultural College (LAC)**
   - Location: Maseru
   - Type: College
   - Established: 1955

8. **National Health Training College (NHTC)**
   - Location: Maseru
   - Type: College
   - Established: 1974

---

### 📚 Courses (10)

1. **BSc Computer Science** - NUL
   - Duration: 4 years
   - Level: Degree
   - Fees: LSL 15,000/year

2. **Diploma Business Administration** - Limkokwing
   - Duration: 2 years
   - Level: Diploma
   - Fees: LSL 12,000/year

3. **Certificate Early Childhood Education** - LCE
   - Duration: 1 year
   - Level: Certificate
   - Fees: LSL 8,000/year

4. **Diploma Electrical Engineering** - Lerotholi
   - Duration: 3 years
   - Level: Diploma
   - Fees: LSL 10,000/year

5. **BCom Accounting** - Botho
   - Duration: 4 years
   - Level: Degree
   - Fees: LSL 18,000/year

6. **Certificate Nursing Assistant** - NHTC
   - Duration: 1 year
   - Level: Certificate
   - Fees: LSL 7,000/year

7. **Diploma Agricultural Science** - LAC
   - Duration: 2 years
   - Level: Diploma
   - Fees: LSL 9,000/year

8. **BA Graphic Design** - Limkokwing
   - Duration: 3 years
   - Level: Degree
   - Fees: LSL 16,000/year

9. **Certificate Public Administration** - IDM
   - Duration: 6 months
   - Level: Certificate
   - Fees: LSL 6,000

10. **Diploma Information Technology** - Botho
    - Duration: 2 years
    - Level: Diploma
    - Fees: LSL 14,000/year

---

### 💼 Jobs (10)

1. **Junior Software Developer**
   - Company: Lesotho Tech Solutions
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 8,000 - 12,000/month

2. **Marketing Manager**
   - Company: Lesotho Retail Group
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 15,000 - 20,000/month

3. **Accounting Intern**
   - Company: Lesotho Financial Services
   - Location: Maseru
   - Type: Internship
   - Salary: LSL 3,000 - 5,000/month

4. **Registered Nurse**
   - Company: Queen Mamohato Memorial Hospital
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 10,000 - 15,000/month

5. **Civil Engineer**
   - Company: Lesotho Construction Ltd
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 18,000 - 25,000/month

6. **Customer Service Representative**
   - Company: Vodacom Lesotho
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 6,000 - 8,000/month

7. **Agricultural Extension Officer**
   - Company: Ministry of Agriculture
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 9,000 - 12,000/month

8. **Graphic Designer**
   - Company: Creative Media Lesotho
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 7,000 - 10,000/month

9. **HR Officer**
   - Company: Lesotho Retail Group
   - Location: Maseru
   - Type: Full-time
   - Salary: LSL 12,000 - 16,000/month

10. **Data Analyst**
    - Company: Lesotho Tech Solutions
    - Location: Maseru
    - Type: Full-time
    - Salary: LSL 10,000 - 14,000/month

---

### 💡 Career Tips (7)

1. **How to Write a Winning Resume**
2. **Ace Your Job Interview: Top 10 Tips**
3. **Building Your Professional Network in Lesotho**
4. **Essential Skills for the Modern Workplace**
5. **Negotiating Your Salary: A Guide for Lesotho**
6. **LinkedIn Profile Optimization**
7. **Common Interview Questions & How to Answer Them**

---

### 🏢 Companies (8)

1. **Lesotho Tech Solutions** - Technology
2. **Lesotho Retail Group** - Retail
3. **Lesotho Financial Services** - Finance
4. **Queen Mamohato Memorial Hospital** - Healthcare
5. **Lesotho Construction Ltd** - Construction
6. **Vodacom Lesotho** - Telecommunications
7. **Ministry of Agriculture** - Government
8. **Creative Media Lesotho** - Media & Design

---

## ⚠️ Troubleshooting

### Issue: "Permission denied" error

**Solution:**
1. Go to Firebase Console
2. Click **Firestore Database** → **Rules**
3. Update rules to allow authenticated users:

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

4. Click **Publish**

---

### Issue: Seeder page shows blank

**Solution:**
1. Check browser console (F12) for errors
2. Make sure you're logged in
3. Try refreshing the page
4. Clear browser cache

---

### Issue: Data not appearing in Firestore

**Solution:**
1. Check browser console for success messages
2. Refresh Firebase Console (F5)
3. Verify you're looking at the correct Firebase project
4. Check Network tab (F12) for failed requests

---

### Issue: "Firebase not initialized"

**Solution:**
1. Check `client/src/config/firebase.config.js` has correct credentials
2. Make sure Firebase is properly configured
3. Restart the dev server

---

## 🎉 Success Checklist

After seeding, verify:

- ✅ Firebase Console shows 5 collections
- ✅ `institutions` has 8 documents
- ✅ `courses` has 10 documents
- ✅ `jobs` has 10 documents
- ✅ `careerTips` has 7 documents
- ✅ `companies` has 8 documents
- ✅ Student dashboard shows institutions
- ✅ Job search shows job listings
- ✅ All data displays correctly

---

## 📊 Summary

**Total Time:** 2-3 minutes
**Total Documents:** 43 documents across 5 collections
**Next Step:** Test all dashboards with real data!

---

## 🚀 Quick Commands

### Access Seeder:
```
http://localhost:3000/seed-database
```

### View Firebase Data:
```
https://console.firebase.google.com
→ Select Project
→ Firestore Database
→ Data
```

### Test Student Dashboard:
```
http://localhost:3000/login
→ Login as student
→ Browse institutions & jobs
```

---

**You're ready to populate your database! Just open the seeder page and click the button! 🎉**
