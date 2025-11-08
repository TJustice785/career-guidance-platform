# Step-by-Step Migration Guide

## Overview
Migrating from REST API (localhost:5000) to Firebase Firestore SDK.

## Already Completed ✅
- Institutions CRUD (ManageInstitutions.js, ManageInstitutionsEnhanced.js)
- Companies CRUD (ManageCompanies.js)
- Courses CRUD (ManageCourses.js)

## Remaining Tasks

### Step 1: Create Firebase Services Directory
```bash
mkdir client/src/services/firebase
```

### Step 2: Create Service Files (ONE AT A TIME)

#### users.service.js
- Location: `client/src/services/firebase/users.service.js`
- Functions: getAll, getById, create, update, delete, toggleStatus
- Collection: `users`

#### institutions.service.js  
- Location: `client/src/services/firebase/institutions.service.js`
- Functions: getAll, getById, create, update, delete
- Collection: `institutions`

#### companies.service.js
- Location: `client/src/services/firebase/companies.service.js`
- Functions: getAll, getById, create, update, delete
- Collection: `companies`

#### courses.service.js
- Location: `client/src/services/firebase/courses.service.js`
- Functions: getAll, getById, getByInstitution, create, update, delete
- Collection: `courses`

#### jobs.service.js
- Location: `client/src/services/firebase/jobs.service.js`
- Functions: getAll, getById, getByCompany, getAvailable, create, update, delete
- Collection: `jobs`

#### applications.service.js
- Location: `client/src/services/firebase/applications.service.js`
- Functions: getAll, getById, getByUser, getByCourse, getByJob, create, update, delete
- Collection: `applications`

#### documents.service.js
- Location: `client/src/services/firebase/documents.service.js`
- Functions: getAll, getById, getByUser, create, delete
- Collection: `documents`

#### admissions.service.js
- Location: `client/src/services/firebase/admissions.service.js`
- Functions: getAll, getById, getByUser, getByInstitution, create, update, delete
- Collection: `admissions`

### Step 3: Service Template (Copy for each service)

```javascript
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../config/firebase.config';

export const [CollectionName]Service = {
  // Get all documents
  async getAll(filters = {}) {
    try {
      let q = query(collection(db, '[collection_name]'));
      
      // Apply filters
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      
      // Apply sorting
      if (filters.orderBy) {
        q = query(q, orderBy(filters.orderBy, filters.orderDirection || 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching [collection_name]:', error);
      throw error;
    }
  },

  // Get single document by ID
  async getById(id) {
    try {
      const docRef = doc(db, '[collection_name]', id);
      const snap = await getDoc(docRef);
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      console.error('Error fetching [collection_name]:', error);
      throw error;
    }
  },

  // Create new document
  async create(data) {
    try {
      const docRef = doc(collection(db, '[collection_name]'));
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating [collection_name]:', error);
      throw error;
    }
  },

  // Update document
  async update(id, updates) {
    try {
      const docRef = doc(db, '[collection_name]', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating [collection_name]:', error);
      throw error;
    }
  },

  // Delete document
  async delete(id) {
    try {
      const docRef = doc(db, '[collection_name]', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting [collection_name]:', error);
      throw error;
    }
  }
};
```

### Step 4: Update Components to Use Firebase Services

For EACH component using API calls:

1. Find the component file
2. Replace imports:
   ```javascript
   // Remove
   import { adminAPI } from '../../services/api.service';
   
   // Add
   import { usersService } from '../../services/firebase/users.service';
   ```

3. Replace API calls:
   ```javascript
   // Remove
   const response = await adminAPI.getAllUsers();
   const users = response.data.data;
   
   // Add
   const users = await usersService.getAll();
   ```

4. Update error handling (remove response.data wrapping)

### Step 5: Update AuthContext
Already uses Firebase - verify working correctly.

### Step 6: Test Each Component
- Navigate to page
- Test CRUD operations
- Check console for errors
- Verify data in Firestore console

### Step 7: Build and Deploy
```bash
cd client
npm run build
firebase deploy --only hosting
```

### Step 8: Clean Up (After ALL endpoints migrated)
Delete:
- `client/src/services/api.js`
- `client/src/services/api.service.js`
- `client/src/services/document.service.js`
- `client/src/services/job.service.js`
- `server/` directory

---

## Quick Reference: Common Patterns

### Fetch All
```javascript
const items = await collectionService.getAll();
```

### Fetch with Filter
```javascript
const items = await collectionService.getAll({ status: 'active' });
```

### Fetch Single
```javascript
const item = await collectionService.getById(id);
```

### Create
```javascript
const id = await collectionService.create({ name: 'Test', status: 'active' });
```

### Update
```javascript
await collectionService.update(id, { name: 'Updated' });
```

### Delete
```javascript
await collectionService.delete(id);
```

---

## Files to Update Checklist

### Admin Components
- [ ] ManageUsers.js
- [x] ManageInstitutions.js ✅
- [x] ManageCompanies.js ✅
- [x] ManageCourses.js ✅
- [ ] AdminDashboard.js (stats fetch)

### Student Components
- [ ] StudentDashboard.js
- [ ] BrowseInstitutions.js
- [ ] Application components

### Institute Components
- [ ] InstituteDashboard.js
- [ ] Course management
- [ ] Application review

### Company Components
- [ ] CompanyDashboard.js
- [ ] Job posting
- [ ] Application review
