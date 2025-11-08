# API Migration Plan - Complete Inventory

## 1. Existing API Inventory

### All Endpoints Found

#### Admin Endpoints (`/api/admin`)
- **GET** `/api/admin/users` - Get all users (pagination, filters)
- **GET** `/api/admin/users/:id` - Get user by ID
- **POST** `/api/admin/users` - Create user
- **PUT** `/api/admin/users/:id` - Update user
- **DELETE** `/api/admin/users/:id` - Delete user
- **PATCH** `/api/admin/users/:id/toggle-status` - Toggle user status
- **GET** `/api/admin/institutions` - Get all institutions
- **GET** `/api/admin/institutions/:id` - Get institution by ID
- **POST** `/api/admin/institutions` - Create institution
- **PUT** `/api/admin/institutions/:id` - Update institution
- **DELETE** `/api/admin/institutions/:id` - Delete institution
- **PATCH** `/api/admin/institutions/:id/toggle-status` - Toggle status
- **GET** `/api/admin/companies` - Get all companies
- **GET** `/api/admin/courses` - Get all courses
- **GET** `/api/admin/applications` - Get all applications
- **GET** `/api/admin/applications/:id` - Get application by ID
- **PATCH** `/api/admin/applications/:id/status` - Update application status
- **POST** `/api/admin/applications/:id/notes` - Add note
- **GET** `/api/admin/applications/stats` - Get statistics
- **GET** `/api/admin/settings` - Get settings
- **PUT** `/api/admin/settings` - Update settings
- **GET** `/api/admin/stats` - Dashboard statistics

#### Auth Endpoints (`/api/auth`)
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/register` - Register user
- **POST** `/api/auth/logout` - Logout user
- **POST** `/api/auth/refresh-token` - Refresh JWT
- **POST** `/api/auth/forgot-password` - Request password reset
- **POST** `/api/auth/reset-password` - Reset password
- **GET** `/api/auth/me` - Get current user

#### Institute Endpoints (`/api/institute`)
- **GET** `/api/institute/courses` - Get institute courses
- **POST** `/api/institute/courses` - Create course
- **PUT** `/api/institute/courses/:id` - Update course
- **DELETE** `/api/institute/courses/:id` - Delete course
- **GET** `/api/institute/courses/:id/applications` - Get course applications
- **PUT** `/api/institute/applications/:id` - Update application status
- **POST** `/api/institute/admissions` - Create admission

#### Student Endpoints (`/api/student`)
- **GET** `/api/institutions` - Get all institutions
- **GET** `/api/institutions/:id` - Get institution by ID
- **GET** `/api/institutions/:id/courses` - Get institution courses
- **POST** `/api/applications` - Apply for course
- **GET** `/api/me/applications` - Get my applications
- **GET** `/api/applications/:id` - Get application by ID
- **GET** `/api/me/admissions` - Get my admissions
- **POST** `/api/admissions/:id/accept` - Accept admission
- **GET** `/api/me/documents` - Get my documents
- **POST** `/api/documents` - Upload document
- **DELETE** `/api/documents/:id` - Delete document
- **GET** `/api/jobs/available` - Get available jobs
- **POST** `/api/jobs/:id/apply` - Apply for job

#### Company Endpoints (`/api/company`)
- **GET** `/api/company/jobs` - Get company jobs
- **POST** `/api/company/jobs` - Create job
- **PUT** `/api/company/jobs/:id` - Update job
- **DELETE** `/api/company/jobs/:id` - Delete job
- **GET** `/api/company/jobs/:id/applications` - Get job applications
- **PUT** `/api/company/applications/:id` - Update application status

#### Other Endpoints
- **GET** `/api/jobs` - Get all jobs
- **GET** `/api/companies` - Get all companies
- **GET** `/api/settings` - Get public settings

## 2. Firestore Data Model Mapping

### Collections Needed

```
users/
  {uid}/
    email: string
    role: string
    firstName: string
    lastName: string
    createdAt: timestamp
    updatedAt: timestamp

institutions/
  {institutionId}/
    name: string
    email: string
    phone: string
    location: string
    type: string
    status: string
    createdAt: timestamp

companies/
  {companyId}/
    companyName: string
    email: string
    phone: string
    industry: string
    location: string
    status: string
    createdAt: timestamp

courses/
  {courseId}/
    institutionId: string
    name: string
    description: string
    duration: string
    requirements: string
    isActive: boolean
    createdAt: timestamp

jobs/
  {jobId}/
    companyId: string
    title: string
    description: string
    requirements: string
    location: string
    salary: string
    status: string
    createdAt: timestamp

applications/
  {applicationId}/
    studentId: string
    courseId?: string
    jobId?: string
    status: string
    submittedAt: timestamp

admissions/
  {admissionId}/
    studentId: string
    institutionId: string
    courseId: string
    status: string
    createdAt: timestamp

documents/
  {documentId}/
    studentId: string
    documentType: string
    fileName: string
    fileUrl: string
    uploadedAt: timestamp
```

## 3. Files to Create/Update

### New Firebase Service Files
- `client/src/services/firebase/users.service.js`
- `client/src/services/firebase/institutions.service.js`
- `client/src/services/firebase/companies.service.js`
- `client/src/services/firebase/courses.service.js`
- `client/src/services/firebase/jobs.service.js`
- `client/src/services/firebase/applications.service.js`
- `client/src/services/firebase/documents.service.js`

### Files to Update
- `client/src/services/api.js` - Mark as deprecated
- `client/src/services/api.service.js` - Mark as deprecated
- `client/src/config/index.js` - Remove API_BASE_URL
- All component files using API calls

## 4. Implementation Steps

### Step 1: Create Firebase Services (Each handles one collection)

**users.service.js**
```javascript
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';

export const usersService = {
  async getAll(filters = {}) {
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const docRef = doc(db, 'users', id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async create(userData) {
    const docRef = doc(collection(db, 'users'));
    await setDoc(docRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id, updates) {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id) {
    await deleteDoc(doc(db, 'users', id));
  }
};
```

**Repeat for each collection**

### Step 2: Replace API Calls in Components

Replace:
```javascript
import { adminAPI } from '../../services/api.service';
const users = await adminAPI.getAllUsers();
```

With:
```javascript
import { usersService } from '../../services/firebase/users.service';
const users = await usersService.getAll();
```

### Step 3: Update Authentication

Already using Firebase Auth - no changes needed.

### Step 4: Add Security Rules

Update `firestore.rules` for each collection.

### Step 5: Test Each Endpoint

Test CRUD operations for each collection.

### Step 6: Remove API Files

Once all endpoints migrated, remove:
- `client/src/services/api.js`
- `client/src/services/api.service.js`
- `client/src/services/document.service.js`
- `client/src/services/job.service.js`
- Server directory (if not needed)

## 5. Files Currently Using API Calls

### Components Using API Calls (Need Migration)
1. `client/src/pages/admin/ManageUsers.js`
2. `client/src/pages/admin/ManageInstitutions.js` - ✅ DONE
3. `client/src/pages/admin/ManageCompanies.js` - ✅ DONE
4. `client/src/pages/admin/ManageCourses.js` - ✅ DONE
5. `client/src/pages/admin/AdminDashboard.js`
6. `client/src/pages/student/StudentDashboard.js`
7. `client/src/pages/institute/InstituteDashboard.js`
8. `client/src/pages/company/CompanyDashboard.js`
9. `client/src/services/auth.service.js`

## 6. Migration Priority

1. **HIGH** - Core CRUD operations (Users, Institutions, Companies, Courses)
2. **MEDIUM** - Applications, Jobs, Admissions
3. **LOW** - Documents, Settings

## 7. Testing Checklist

For each endpoint migrated:
- [ ] Create operation works
- [ ] Read operation works (single & list)
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Security rules enforce permissions
- [ ] UI updates correctly
- [ ] Error handling works
- [ ] Loading states work

## 8. Deployment Steps

1. Test all endpoints in development
2. Deploy Firestore security rules
3. Build production bundle
4. Deploy to Firebase Hosting
5. Test production
6. Monitor for errors

---

**Status**: In Progress
**Next Step**: Create Firebase service files
