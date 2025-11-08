# Firestore Database Structure

## Collections Overview

```
firestore/
├── users/                    # All user accounts
├── institutions/             # Higher learning institutions
├── courses/                  # Courses offered by institutions
├── applications/             # Student course applications
├── admissions/               # Accepted students (enrollments)
├── documents/                # Student uploaded documents
├── companies/                # Registered companies
├── jobs/                     # Job postings
└── jobApplications/          # Job applications from students
```

---

## Collection Schemas

### 1. `users` Collection
Stores all user accounts (admin, student, institute, company)

```javascript
{
  id: "auto-generated-uid",
  email: "user@example.com",
  role: "student" | "admin" | "institute" | "company",
  
  // Common fields
  emailVerified: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  
  // Student-specific fields
  firstName: "John",
  lastName: "Doe",
  phone: "+266 5800 0000",
  dateOfBirth: "2000-01-01",
  address: "Maseru, Lesotho",
  
  // Institute-specific fields
  name: "National University of Lesotho",
  description: "Premier institution...",
  location: "Roma, Maseru",
  website: "https://nul.ls",
  status: "pending" | "approved" | "rejected",
  
  // Company-specific fields
  name: "TechCorp Lesotho",
  industry: "Technology",
  description: "Leading tech company...",
  address: "Maseru",
  website: "https://techcorp.ls",
  status: "pending" | "approved" | "rejected"
}
```

### 2. `institutions` Collection
Separate collection for institution details (optional, can use users collection)

```javascript
{
  id: "auto-generated",
  userId: "ref-to-users-collection",
  name: "National University of Lesotho",
  description: "Premier institution offering diverse programs",
  location: "Roma, Maseru",
  address: "P.O. Box 180, Roma",
  phone: "+266 2234 0601",
  email: "info@nul.ls",
  website: "https://nul.ls",
  logo: "https://storage.url/logo.png",
  status: "approved" | "pending" | "rejected",
  faculties: ["Science", "Arts", "Engineering"],
  createdAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt: Timestamp
}
```

### 3. `courses` Collection
Courses offered by institutions

```javascript
{
  id: "auto-generated",
  institutionId: "ref-to-institutions",
  institutionName: "National University of Lesotho",
  
  title: "Computer Science - BSc",
  code: "CS101",
  faculty: "Science & Technology",
  department: "Computer Science",
  
  description: "Comprehensive computer science program...",
  duration: "4 years",
  level: "Undergraduate" | "Postgraduate",
  
  requirements: {
    minimumGrade: "C",
    subjects: ["Mathematics", "English", "Science"],
    additionalRequirements: "Pass in Mathematics"
  },
  
  fees: {
    tuition: 15000,
    registration: 500,
    currency: "LSL"
  },
  
  intake: {
    startDate: "2025-08-01",
    applicationDeadline: "2025-06-30",
    capacity: 50
  },
  
  status: "active" | "inactive",
  enrolledStudents: 45,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 4. `applications` Collection
Student applications to courses

```javascript
{
  id: "auto-generated",
  studentId: "ref-to-users",
  studentName: "John Doe",
  studentEmail: "john@example.com",
  
  institutionId: "ref-to-institutions",
  institutionName: "National University of Lesotho",
  
  courseId: "ref-to-courses",
  courseName: "Computer Science - BSc",
  
  status: "pending" | "accepted" | "rejected",
  
  academicInfo: {
    highSchoolName: "Maseru High School",
    graduationYear: 2024,
    grade: "B",
    subjects: [
      { name: "Mathematics", grade: "A" },
      { name: "English", grade: "B" },
      { name: "Science", grade: "B" }
    ]
  },
  
  documents: {
    transcript: "https://storage.url/transcript.pdf",
    certificate: "https://storage.url/certificate.pdf",
    idCopy: "https://storage.url/id.pdf"
  },
  
  notes: "Application notes from reviewer",
  reviewedBy: "admin-user-id",
  reviewedAt: Timestamp,
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 5. `admissions` Collection
Accepted students (enrollments)

```javascript
{
  id: "auto-generated",
  studentId: "ref-to-users",
  studentName: "John Doe",
  
  institutionId: "ref-to-institutions",
  institutionName: "National University of Lesotho",
  
  courseId: "ref-to-courses",
  courseName: "Computer Science - BSc",
  
  applicationId: "ref-to-applications",
  
  admissionNumber: "NUL/2025/001",
  academicYear: "2025/2026",
  semester: 1,
  
  status: "active" | "graduated" | "withdrawn",
  
  enrollmentDate: Timestamp,
  expectedGraduation: "2029-05-01",
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 6. `documents` Collection
Student uploaded documents

```javascript
{
  id: "auto-generated",
  studentId: "ref-to-users",
  
  documentType: "transcript" | "certificate" | "id" | "other",
  fileName: "transcript_2024.pdf",
  fileUrl: "https://storage.url/documents/student-id/transcript_2024.pdf",
  fileSize: 1024000, // bytes
  mimeType: "application/pdf",
  
  description: "High School Transcript",
  
  uploadedAt: Timestamp,
  updatedAt: Timestamp
}
```

### 7. `companies` Collection
Registered companies (can also use users collection)

```javascript
{
  id: "auto-generated",
  userId: "ref-to-users",
  
  name: "TechCorp Lesotho",
  industry: "Technology" | "Finance" | "Education" | "Healthcare" | "Other",
  description: "Leading technology company in Lesotho",
  
  address: "Maseru Central",
  location: "Maseru",
  phone: "+266 5800 0000",
  email: "hr@techcorp.ls",
  website: "https://techcorp.ls",
  
  logo: "https://storage.url/logo.png",
  
  size: "1-10" | "11-50" | "51-200" | "201-500" | "500+",
  founded: 2015,
  
  status: "approved" | "pending" | "rejected",
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt: Timestamp
}
```

### 8. `jobs` Collection
Job postings by companies

```javascript
{
  id: "auto-generated",
  companyId: "ref-to-companies",
  companyName: "TechCorp Lesotho",
  
  title: "Software Developer",
  description: "We are looking for a talented software developer...",
  
  requirements: {
    education: "BSc Computer Science or related field",
    experience: "2-3 years",
    skills: ["JavaScript", "React", "Node.js"],
    qualifications: ["BSc Computer Science", "BSc Information Technology"]
  },
  
  location: "Maseru",
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship",
  industry: "Technology",
  
  salary: {
    min: 15000,
    max: 25000,
    currency: "LSL",
    period: "monthly"
  },
  
  benefits: ["Health Insurance", "Pension", "Training"],
  
  applicationDeadline: "2025-07-31",
  startDate: "2025-08-15",
  
  status: "active" | "closed" | "filled",
  applicationCount: 23,
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 9. `jobApplications` Collection
Job applications from students

```javascript
{
  id: "auto-generated",
  studentId: "ref-to-users",
  studentName: "John Doe",
  studentEmail: "john@example.com",
  
  jobId: "ref-to-jobs",
  jobTitle: "Software Developer",
  
  companyId: "ref-to-companies",
  companyName: "TechCorp Lesotho",
  
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired",
  
  coverLetter: "I am writing to express my interest...",
  resume: "https://storage.url/resume.pdf",
  
  qualifications: {
    education: "BSc Computer Science",
    institution: "National University of Lesotho",
    graduationYear: 2024,
    experience: "2 years"
  },
  
  skills: ["JavaScript", "React", "Node.js"],
  
  notes: "Interview scheduled for...",
  reviewedBy: "company-user-id",
  reviewedAt: Timestamp,
  
  appliedAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isInstitute() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'institute';
    }
    
    function isStudent() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }
    
    function isCompany() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'company';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Institutions collection
    match /institutions/{institutionId} {
      allow read: if true; // Public read
      allow create: if isInstitute();
      allow update: if isAdmin() || 
                       (isInstitute() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true; // Public read
      allow create: if isInstitute();
      allow update: if isAdmin() || 
                       (isInstitute() && resource.data.institutionId == request.auth.uid);
      allow delete: if isAdmin() || 
                       (isInstitute() && resource.data.institutionId == request.auth.uid);
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if isAdmin() || 
                     isOwner(resource.data.studentId) ||
                     (isInstitute() && resource.data.institutionId == request.auth.uid);
      allow create: if isStudent();
      allow update: if isAdmin() || 
                       (isInstitute() && resource.data.institutionId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Admissions collection
    match /admissions/{admissionId} {
      allow read: if isAdmin() || 
                     isOwner(resource.data.studentId) ||
                     (isInstitute() && resource.data.institutionId == request.auth.uid);
      allow create: if isInstitute() || isAdmin();
      allow update: if isAdmin() || 
                       (isInstitute() && resource.data.institutionId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Documents collection
    match /documents/{documentId} {
      allow read: if isAdmin() || isOwner(resource.data.studentId);
      allow create: if isStudent();
      allow update: if isOwner(resource.data.studentId);
      allow delete: if isOwner(resource.data.studentId) || isAdmin();
    }
    
    // Companies collection
    match /companies/{companyId} {
      allow read: if true; // Public read
      allow create: if isCompany();
      allow update: if isAdmin() || 
                       (isCompany() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Jobs collection
    match /jobs/{jobId} {
      allow read: if true; // Public read
      allow create: if isCompany();
      allow update: if isAdmin() || 
                       (isCompany() && resource.data.companyId == request.auth.uid);
      allow delete: if isAdmin() || 
                       (isCompany() && resource.data.companyId == request.auth.uid);
    }
    
    // Job Applications collection
    match /jobApplications/{applicationId} {
      allow read: if isAdmin() || 
                     isOwner(resource.data.studentId) ||
                     (isCompany() && resource.data.companyId == request.auth.uid);
      allow create: if isStudent();
      allow update: if isAdmin() || 
                       (isCompany() && resource.data.companyId == request.auth.uid);
      allow delete: if isAdmin();
    }
  }
}
```

---

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Documents folder
    match /documents/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Institution logos
    match /institutions/{institutionId}/{fileName} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
    
    // Company logos
    match /companies/{companyId}/{fileName} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
  }
}
```

---

## Indexes Required

Create these composite indexes in Firebase Console:

### applications collection
- `studentId` (Ascending) + `createdAt` (Descending)
- `institutionId` (Ascending) + `status` (Ascending) + `createdAt` (Descending)
- `institutionId` (Ascending) + `createdAt` (Descending)

### courses collection
- `institutionId` (Ascending) + `status` (Ascending)

### jobs collection
- `companyId` (Ascending) + `createdAt` (Descending)
- `status` (Ascending) + `industry` (Ascending) + `createdAt` (Descending)
- `status` (Ascending) + `location` (Ascending) + `createdAt` (Descending)

### jobApplications collection
- `studentId` (Ascending) + `appliedAt` (Descending)
- `jobId` (Ascending) + `status` (Ascending) + `appliedAt` (Descending)

---

## Initial Setup Script

To set up the database structure, you can use this script:

```javascript
// scripts/initializeFirestore.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/config/firebase.config';

async function initializeDatabase() {
  try {
    // Add sample institution
    const institutionRef = await addDoc(collection(db, 'institutions'), {
      name: "National University of Lesotho",
      description: "Premier institution offering diverse programs in science, arts, and technology",
      location: "Roma, Maseru",
      address: "P.O. Box 180, Roma",
      phone: "+266 2234 0601",
      email: "info@nul.ls",
      website: "https://nul.ls",
      status: "approved",
      faculties: ["Science & Technology", "Arts", "Engineering"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add sample courses
    await addDoc(collection(db, 'courses'), {
      institutionId: institutionRef.id,
      institutionName: "National University of Lesotho",
      title: "Computer Science - BSc",
      code: "CS101",
      faculty: "Science & Technology",
      description: "Comprehensive computer science program covering programming, algorithms, and software engineering",
      duration: "4 years",
      level: "Undergraduate",
      requirements: {
        minimumGrade: "C",
        subjects: ["Mathematics", "English", "Science"]
      },
      fees: {
        tuition: 15000,
        currency: "LSL"
      },
      status: "active",
      enrolledStudents: 45,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
```

---

## Usage in Components

```javascript
import firebaseService from '../services/firebase.service';

// In your component
useEffect(() => {
  const fetchData = async () => {
    try {
      const stats = await firebaseService.student.getStats(userId);
      setStats(stats);
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchData();
}, [userId]);
```

---

This structure provides a complete, scalable database design for your Career Guidance Platform!
