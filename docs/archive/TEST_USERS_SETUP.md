# Test Users Setup Guide

## Method 1: Add Users via Firebase Console (Recommended)

### Step 1: Create Authentication Users

1. Go to **Firebase Console**: https://console.firebase.google.com/
2. Select your project: `career-guidance-platform-7e18e`
3. Click **Authentication** in left menu
4. Click **Users** tab
5. Click **Add User** button

Create these 4 users:

#### User 1: Admin
```
Email: admin@careerpath.ls
Password: Admin123!
```

#### User 2: Student
```
Email: student@careerpath.ls
Password: Student123!
```

#### User 3: Institute
```
Email: institute@careerpath.ls
Password: Institute123!
```

#### User 4: Company
```
Email: company@careerpath.ls
Password: Company123!
```

### Step 2: Add User Documents to Firestore

After creating each user in Authentication, you need to add their data to Firestore:

1. Go to **Firestore Database** in left menu
2. Click on **users** collection (create it if it doesn't exist)
3. Click **Add Document** for each user

---

## Firestore User Documents

### Admin User Document

```
Collection: users
Document ID: [Copy UID from Authentication]

Fields:
email: "admin@careerpath.ls"
role: "admin"
firstName: "System"
lastName: "Administrator"
emailVerified: true
createdAt: [Click "Add field" → Type: timestamp → Use server timestamp]
updatedAt: [Click "Add field" → Type: timestamp → Use server timestamp]
```

**How to add:**
1. In Firestore, click **users** collection
2. Click **Add document**
3. Document ID: Copy the UID from Authentication → Users → admin@careerpath.ls
4. Add each field one by one:
   - Field: `email`, Type: string, Value: `admin@careerpath.ls`
   - Field: `role`, Type: string, Value: `admin`
   - Field: `firstName`, Type: string, Value: `System`
   - Field: `lastName`, Type: string, Value: `Administrator`
   - Field: `emailVerified`, Type: boolean, Value: `true`
   - Field: `createdAt`, Type: timestamp, Value: (current timestamp)
   - Field: `updatedAt`, Type: timestamp, Value: (current timestamp)

---

### Student User Document

```
Collection: users
Document ID: [Copy UID from Authentication]

Fields:
email: "student@careerpath.ls"
role: "student"
firstName: "John"
lastName: "Doe"
phone: "+266 5800 1234"
dateOfBirth: "2000-01-15"
address: "Maseru, Lesotho"
emailVerified: true
createdAt: [timestamp]
updatedAt: [timestamp]
```

---

### Institute User Document

```
Collection: users
Document ID: [Copy UID from Authentication]

Fields:
email: "institute@careerpath.ls"
role: "institute"
name: "National University of Lesotho"
description: "Premier institution offering diverse programs in science, arts, and technology"
location: "Roma, Maseru"
address: "P.O. Box 180, Roma 180, Lesotho"
phone: "+266 2234 0601"
website: "https://www.nul.ls"
emailVerified: true
createdAt: [timestamp]
updatedAt: [timestamp]
```

---

### Company User Document

```
Collection: users
Document ID: [Copy UID from Authentication]

Fields:
email: "company@careerpath.ls"
role: "company"
name: "TechCorp Lesotho"
industry: "Technology"
description: "Leading technology company in Lesotho"
address: "Maseru Central, Lesotho"
phone: "+266 5800 5678"
website: "https://techcorp.ls"
emailVerified: true
createdAt: [timestamp]
updatedAt: [timestamp]
```

---

## Method 2: Import Users via Script

Create a file `client/src/scripts/createTestUsers.js`:

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';

const testUsers = [
  {
    email: 'admin@careerpath.ls',
    password: 'Admin123!',
    data: {
      email: 'admin@careerpath.ls',
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      emailVerified: true
    }
  },
  {
    email: 'student@careerpath.ls',
    password: 'Student123!',
    data: {
      email: 'student@careerpath.ls',
      role: 'student',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+266 5800 1234',
      dateOfBirth: '2000-01-15',
      address: 'Maseru, Lesotho',
      emailVerified: true
    }
  },
  {
    email: 'institute@careerpath.ls',
    password: 'Institute123!',
    data: {
      email: 'institute@careerpath.ls',
      role: 'institute',
      name: 'National University of Lesotho',
      description: 'Premier institution offering diverse programs',
      location: 'Roma, Maseru',
      address: 'P.O. Box 180, Roma 180, Lesotho',
      phone: '+266 2234 0601',
      website: 'https://www.nul.ls',
      emailVerified: true
    }
  },
  {
    email: 'company@careerpath.ls',
    password: 'Company123!',
    data: {
      email: 'company@careerpath.ls',
      role: 'company',
      name: 'TechCorp Lesotho',
      industry: 'Technology',
      description: 'Leading technology company in Lesotho',
      address: 'Maseru Central, Lesotho',
      phone: '+266 5800 5678',
      website: 'https://techcorp.ls',
      emailVerified: true
    }
  }
];

async function createTestUsers() {
  console.log('Creating test users...');

  for (const user of testUsers) {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );

      console.log(`✅ Created auth user: ${user.email}`);

      // Create Firestore document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...user.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log(`✅ Created Firestore document for: ${user.email}`);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      }
    }
  }

  console.log('✅ All test users created!');
}

export default createTestUsers;
```

**To run this script:**
1. Create the file above
2. Import it in a temporary component
3. Call the function once
4. Remove the import after users are created

---

## Method 3: Quick JSON Import

If you prefer to manually add to Firestore, here's the JSON for each user:

### Admin User (JSON)
```json
{
  "email": "admin@careerpath.ls",
  "role": "admin",
  "firstName": "System",
  "lastName": "Administrator",
  "emailVerified": true,
  "createdAt": "2025-10-23T16:00:00.000Z",
  "updatedAt": "2025-10-23T16:00:00.000Z"
}
```

### Student User (JSON)
```json
{
  "email": "student@careerpath.ls",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+266 5800 1234",
  "dateOfBirth": "2000-01-15",
  "address": "Maseru, Lesotho",
  "emailVerified": true,
  "createdAt": "2025-10-23T16:00:00.000Z",
  "updatedAt": "2025-10-23T16:00:00.000Z"
}
```

### Institute User (JSON)
```json
{
  "email": "institute@careerpath.ls",
  "role": "institute",
  "name": "National University of Lesotho",
  "description": "Premier institution offering diverse programs in science, arts, and technology",
  "location": "Roma, Maseru",
  "address": "P.O. Box 180, Roma 180, Lesotho",
  "phone": "+266 2234 0601",
  "website": "https://www.nul.ls",
  "emailVerified": true,
  "createdAt": "2025-10-23T16:00:00.000Z",
  "updatedAt": "2025-10-23T16:00:00.000Z"
}
```

### Company User (JSON)
```json
{
  "email": "company@careerpath.ls",
  "role": "company",
  "name": "TechCorp Lesotho",
  "industry": "Technology",
  "description": "Leading technology company in Lesotho",
  "address": "Maseru Central, Lesotho",
  "phone": "+266 5800 5678",
  "website": "https://techcorp.ls",
  "emailVerified": true,
  "createdAt": "2025-10-23T16:00:00.000Z",
  "updatedAt": "2025-10-23T16:00:00.000Z"
}
```

---

## Additional Test Users (Optional)

### Student 2
```
Email: sarah.johnson@student.ls
Password: Student123!
Role: student
Name: Sarah Johnson
```

### Student 3
```
Email: michael.brown@student.ls
Password: Student123!
Role: student
Name: Michael Brown
```

### Institute 2
```
Email: lce@institute.ls
Password: Institute123!
Role: institute
Name: Lesotho College of Education
```

### Company 2
```
Email: vodacom@company.ls
Password: Company123!
Role: company
Name: Vodacom Lesotho
```

---

## Verification Checklist

After adding users, verify:

- [ ] User exists in **Authentication → Users**
- [ ] User document exists in **Firestore → users** collection
- [ ] Document ID matches the UID from Authentication
- [ ] `role` field is set correctly
- [ ] `emailVerified` is set to `true`
- [ ] All required fields are present

---

## Test Login Credentials

Use these credentials to test each dashboard:

| Role | Email | Password | Expected Route |
|------|-------|----------|----------------|
| Admin | admin@careerpath.ls | Admin123! | /admin |
| Student | student@careerpath.ls | Student123! | /student |
| Institute | institute@careerpath.ls | Institute123! | /institute |
| Company | company@careerpath.ls | Company123! | /company |

---

## Common Issues

### Issue: "User profile not found"
**Solution:** The user exists in Authentication but not in Firestore. Add the Firestore document.

### Issue: "User role not assigned"
**Solution:** The Firestore document is missing the `role` field. Add it.

### Issue: Email already in use
**Solution:** User already exists. Just add/update the Firestore document.

### Issue: Weak password error
**Solution:** Firebase requires passwords to be at least 6 characters. All provided passwords meet this requirement.

---

## Quick Start Steps

1. **Go to Firebase Console**
2. **Authentication → Add 4 users** (emails and passwords above)
3. **Firestore → users collection → Add 4 documents**
   - Use UID from Authentication as Document ID
   - Copy fields from the JSON above
4. **Test login** with each user
5. **Check console** for any errors

---

**Estimated Time:** 10-15 minutes to add all 4 users manually

**Pro Tip:** Start with just the Admin and Student users first to test the system, then add Institute and Company users.
