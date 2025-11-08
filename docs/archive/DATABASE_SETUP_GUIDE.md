# 🗄️ Firebase Database Setup Guide - CareerPath Platform

## 📋 Table of Contents
1. [Enable Firestore Database](#enable-firestore-database)
2. [Database Structure](#database-structure)
3. [Security Rules](#security-rules)
4. [Sample Data](#sample-data)
5. [Database Operations](#database-operations)

---

## 🚀 Enable Firestore Database

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore
2. Click **"Create database"**
3. Select **"Start in production mode"** (we have custom rules)
4. Choose location: **nam5 (us-central)** or closest to Lesotho
5. Click **"Enable"**

### Step 2: Deploy Firestore Rules
After enabling Firestore, run:
```bash
firebase deploy --only firestore
```

---

## 📊 Database Structure

### Collections Overview

```
career-guidance-platform-7e18e (Firestore Database)
│
├── 👥 users/
│   └── {userId}
│       ├── email: string
│       ├── displayName: string
│       ├── role: string (student|company|institute|admin)
│       ├── photoURL: string
│       ├── createdAt: timestamp
│       └── profile: object
│
├── 🏛️ institutions/
│   └── {institutionId}
│       ├── name: string
│       ├── description: string
│       ├── location: string
│       ├── type: string (university|college|technical)
│       ├── website: string
│       ├── email: string
│       ├── phone: string
│       ├── logo: string
│       ├── accreditation: string
│       ├── established: number
│       ├── featured: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📚 courses/
│   └── {courseId}
│       ├── title: string
│       ├── description: string
│       ├── institutionId: string
│       ├── institutionName: string
│       ├── duration: string
│       ├── level: string (certificate|diploma|degree|masters|phd)
│       ├── field: string
│       ├── requirements: array
│       ├── fees: number
│       ├── currency: string (LSL|ZAR)
│       ├── startDate: timestamp
│       ├── applicationDeadline: timestamp
│       ├── capacity: number
│       ├── enrolled: number
│       ├── status: string (open|closed|full)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 💼 jobs/
│   └── {jobId}
│       ├── title: string
│       ├── company: string
│       ├── companyId: string
│       ├── description: string
│       ├── requirements: array
│       ├── responsibilities: array
│       ├── location: string
│       ├── type: string (full-time|part-time|contract|internship)
│       ├── category: string
│       ├── salary: object {min, max, currency}
│       ├── experience: string
│       ├── education: string
│       ├── skills: array
│       ├── benefits: array
│       ├── applicationDeadline: timestamp
│       ├── featured: boolean
│       ├── trending: boolean
│       ├── views: number
│       ├── applicants: number
│       ├── status: string (open|closed)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── 📝 applications/
│   └── {applicationId}
│       ├── userId: string
│       ├── userName: string
│       ├── userEmail: string
│       ├── type: string (course|job)
│       ├── targetId: string (courseId or jobId)
│       ├── targetTitle: string
│       ├── status: string (pending|reviewing|accepted|rejected)
│       ├── resume: string (URL)
│       ├── coverLetter: string
│       ├── linkedIn: string
│       ├── portfolio: string
│       ├── documents: array
│       ├── submittedAt: timestamp
│       ├── reviewedAt: timestamp
│       └── reviewNotes: string
│
├── 📄 documents/
│   └── {documentId}
│       ├── userId: string
│       ├── name: string
│       ├── type: string (resume|certificate|transcript|id)
│       ├── url: string
│       ├── size: number
│       ├── uploadedAt: timestamp
│       └── verified: boolean
│
├── 💡 careerTips/
│   └── {tipId}
│       ├── title: string
│       ├── content: string
│       ├── category: string (interview|resume|career|skills)
│       ├── author: string
│       ├── featured: boolean
│       ├── views: number
│       ├── likes: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── 🏢 companies/
    └── {companyId}
        ├── name: string
        ├── description: string
        ├── industry: string
        ├── size: string
        ├── location: string
        ├── website: string
        ├── logo: string
        ├── featured: boolean
        ├── activeJobs: number
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

---

## 🔒 Security Rules

The Firestore rules are already configured in `firestore.rules`:

### Key Security Features:
- ✅ **Authentication Required**: All operations require user authentication
- ✅ **Role-Based Access**: Different permissions for students, companies, institutes, and admins
- ✅ **User Data Privacy**: Users can only access their own data
- ✅ **Admin Controls**: Only admins can manage institutions and courses
- ✅ **Company Permissions**: Companies can post and manage jobs
- ✅ **Application Privacy**: Users see only their own applications

---

## 📦 Sample Data

### Create Sample Institution
```javascript
// In Firebase Console > Firestore > Add Collection
{
  "name": "National University of Lesotho",
  "description": "The premier institution of higher learning in Lesotho",
  "location": "Roma, Lesotho",
  "type": "university",
  "website": "https://www.nul.ls",
  "email": "info@nul.ls",
  "phone": "+266 2234 0601",
  "logo": "https://example.com/nul-logo.png",
  "accreditation": "Council on Higher Education",
  "established": 1945,
  "featured": true,
  "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
  "updatedAt": firebase.firestore.FieldValue.serverTimestamp()
}
```

### Create Sample Course
```javascript
{
  "title": "Bachelor of Science in Computer Science",
  "description": "Comprehensive program covering software development, algorithms, and systems",
  "institutionId": "nul-001",
  "institutionName": "National University of Lesotho",
  "duration": "4 years",
  "level": "degree",
  "field": "Computer Science",
  "requirements": [
    "High School Certificate",
    "Mathematics Grade C or better",
    "English Grade C or better"
  ],
  "fees": 15000,
  "currency": "LSL",
  "startDate": firebase.firestore.Timestamp.fromDate(new Date('2025-02-01')),
  "applicationDeadline": firebase.firestore.Timestamp.fromDate(new Date('2025-01-15')),
  "capacity": 50,
  "enrolled": 0,
  "status": "open",
  "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
  "updatedAt": firebase.firestore.FieldValue.serverTimestamp()
}
```

### Create Sample Job
```javascript
{
  "title": "Junior Software Developer",
  "company": "Lesotho Tech Solutions",
  "companyId": "lts-001",
  "description": "Join our growing team as a Junior Software Developer",
  "requirements": [
    "Bachelor's degree in Computer Science or related field",
    "Knowledge of JavaScript, React, and Node.js",
    "Strong problem-solving skills"
  ],
  "responsibilities": [
    "Develop and maintain web applications",
    "Collaborate with senior developers",
    "Write clean, maintainable code"
  ],
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
  "skills": ["JavaScript", "React", "Node.js", "Git"],
  "benefits": ["Health Insurance", "Paid Leave", "Professional Development"],
  "applicationDeadline": firebase.firestore.Timestamp.fromDate(new Date('2025-02-28')),
  "featured": true,
  "trending": true,
  "views": 0,
  "applicants": 0,
  "status": "open",
  "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
  "updatedAt": firebase.firestore.FieldValue.serverTimestamp()
}
```

---

## 🛠️ Database Operations

### Using Firebase Console (Manual)

1. **Go to Firestore Database**:
   - https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore

2. **Create Collections**:
   - Click "Start collection"
   - Enter collection name (e.g., "institutions")
   - Add first document with sample data

3. **Add Documents**:
   - Click "Add document"
   - Auto-generate ID or use custom ID
   - Add fields with appropriate types

### Using Code (Programmatic)

Create a file: `client/src/utils/seedDatabase.js`

```javascript
import { db } from '../config/firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Seed Institutions
export const seedInstitutions = async () => {
  const institutions = [
    {
      name: "National University of Lesotho",
      description: "Premier institution of higher learning",
      location: "Roma, Lesotho",
      type: "university",
      website: "https://www.nul.ls",
      email: "info@nul.ls",
      phone: "+266 2234 0601",
      featured: true,
      established: 1945,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    // Add more institutions...
  ];

  for (const institution of institutions) {
    await addDoc(collection(db, 'institutions'), institution);
  }
  console.log('Institutions seeded successfully!');
};

// Seed Jobs
export const seedJobs = async () => {
  const jobs = [
    {
      title: "Junior Software Developer",
      company: "Lesotho Tech Solutions",
      description: "Join our growing team",
      location: "Maseru, Lesotho",
      type: "full-time",
      category: "Technology",
      salary: { min: 8000, max: 12000, currency: "LSL" },
      featured: true,
      trending: true,
      status: "open",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    // Add more jobs...
  ];

  for (const job of jobs) {
    await addDoc(collection(db, 'jobs'), job);
  }
  console.log('Jobs seeded successfully!');
};
```

---

## 📱 Next Steps

1. ✅ **Enable Firestore** in Firebase Console
2. ✅ **Deploy Rules**: `firebase deploy --only firestore`
3. ✅ **Add Sample Data** via Console or code
4. ✅ **Test CRUD Operations** in your app
5. ✅ **Monitor Usage** in Firebase Console

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com/project/career-guidance-platform-7e18e
- **Firestore Database**: https://console.firebase.google.com/project/career-guidance-platform-7e18e/firestore
- **Firestore Documentation**: https://firebase.google.com/docs/firestore

---

## 🆘 Troubleshooting

### Issue: "Database does not exist"
**Solution**: Enable Firestore in Firebase Console first

### Issue: "Permission denied"
**Solution**: Check firestore.rules and ensure user is authenticated

### Issue: "Quota exceeded"
**Solution**: Monitor usage in Firebase Console, upgrade plan if needed

---

**Created**: October 2025  
**Project**: CareerPath - Career Guidance Platform  
**Database**: Firestore (NoSQL)
