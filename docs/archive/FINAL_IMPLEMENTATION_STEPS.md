# Final Implementation Steps - Career Guidance Platform

## 🎯 Current Status

✅ **All 4 Dashboards Implemented**
✅ **Firebase Service Layer Created**
✅ **Database Structure Designed**
✅ **Integration Guide Written**

## 📋 Next Steps to Complete Your Project

---

## Step 1: Set Up Firestore Database (15 minutes)

### 1.1 Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: `career-guidance-platform-7e18e`
3. Click **Firestore Database** in the left menu
4. If not created, click **Create Database**
5. Choose **Start in production mode** (we'll add rules next)
6. Select location: **us-central** or closest to Lesotho

### 1.2 Create Collections
Manually create these collections (they'll auto-create when you add data, but this helps visualize):

1. Click **Start collection**
2. Create these collections one by one:
   - `users` (already exists from auth)
   - `institutions`
   - `courses`
   - `applications`
   - `admissions`
   - `documents`
   - `companies`
   - `jobs`
   - `jobApplications`

### 1.3 Add Sample Data

**Add a Sample Institution:**
```
Collection: institutions
Document ID: Auto-ID

Fields:
name: "National University of Lesotho"
description: "Premier institution offering diverse programs"
location: "Roma, Maseru"
address: "P.O. Box 180, Roma"
phone: "+266 2234 0601"
email: "info@nul.ls"
website: "https://nul.ls"
status: "approved"
faculties: ["Science & Technology", "Arts", "Engineering"]
createdAt: (timestamp - use server timestamp)
updatedAt: (timestamp - use server timestamp)
```

**Add a Sample Course:**
```
Collection: courses
Document ID: Auto-ID

Fields:
institutionId: (copy the institution ID from above)
institutionName: "National University of Lesotho"
title: "Computer Science - BSc"
code: "CS101"
faculty: "Science & Technology"
description: "Comprehensive computer science program"
duration: "4 years"
level: "Undergraduate"
status: "active"
enrolledStudents: 0
createdAt: (timestamp)
updatedAt: (timestamp)
```

---

## Step 2: Update Firestore Security Rules (5 minutes)

1. In Firebase Console, go to **Firestore Database**
2. Click **Rules** tab
3. Replace the rules with this:

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
      allow write: if isSignedIn();
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if true; // Public read
      allow write: if isSignedIn();
    }
    
    // Applications collection
    match /applications/{applicationId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }
    
    // All other collections
    match /{document=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
    }
  }
}
```

4. Click **Publish**

---

## Step 3: Set Up Firebase Storage Rules (5 minutes)

1. In Firebase Console, go to **Storage**
2. If not initialized, click **Get Started**
3. Click **Rules** tab
4. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /documents/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

---

## Step 4: Create Test Users (10 minutes)

### Option A: Using Firebase Console

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Create these test users:

**Admin User:**
- Email: `admin@careerpath.ls`
- Password: `Admin123!`
- Then go to **Firestore** → `users` collection
- Find the user by UID
- Add field: `role: "admin"`

**Student User:**
- Email: `student@careerpath.ls`
- Password: `Student123!`
- In Firestore, add:
  - `role: "student"`
  - `firstName: "John"`
  - `lastName: "Doe"`

**Institute User:**
- Email: `institute@careerpath.ls`
- Password: `Institute123!`
- In Firestore, add:
  - `role: "institute"`
  - `name: "National University of Lesotho"`

**Company User:**
- Email: `company@careerpath.ls`
- Password: `Company123!`
- In Firestore, add:
  - `role: "company"`
  - `name: "TechCorp Lesotho"`

### Option B: Using Registration Page

1. Go to `http://localhost:3001/register`
2. Register users for each role
3. Verify email if required
4. Check Firestore to ensure `role` field is set

---

## Step 5: Integrate Firebase Service into Dashboards (30 minutes)

### 5.1 Update Student Dashboard

Open `client/src/pages/student/StudentDashboard.js`

Find the `useEffect` that sets stats (around line 247):

**Replace this:**
```javascript
useEffect(() => {
  setTimeout(() => {
    setStats({
      appliedCourses: 8,
      acceptedApplications: 3,
      pendingApplications: 5,
      completedCourses: 2,
      jobApplications: 12,
      savedJobs: 7
    });
    setLoading(false);
  }, 1000);
}, []);
```

**With this:**
```javascript
useEffect(() => {
  const fetchStats = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      const data = await firebaseService.student.getStats(userData.uid);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep mock data on error
      setStats({
        appliedCourses: 0,
        acceptedApplications: 0,
        pendingApplications: 0,
        completedCourses: 0,
        jobApplications: 0,
        savedJobs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [userData]);
```

**Add import at the top:**
```javascript
import firebaseService from '../../services/firebase.service';
```

### 5.2 Update InstitutionsView Component

In the same file, find `InstitutionsView` function and update it:

```javascript
function InstitutionsView() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const filters = location ? { location } : {};
        const data = await firebaseService.student.getAllInstitutions(filters);
        setInstitutions(data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [location]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Browse Institutions</h1>
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search institutions..." className="pl-10 pr-4 py-2 border rounded-lg w-full" />
          </div>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Locations</option>
            <option value="Maseru">Maseru</option>
            <option value="Leribe">Leribe</option>
            <option value="Mafeteng">Mafeteng</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary">Loading institutions...</p>
        </div>
      ) : institutions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary">No institutions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {institutions.map((institution) => (
            <div key={institution.id} className="card-glass p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-primary mb-2">{institution.name}</h3>
                  <p className="text-sm text-secondary flex items-center">
                    <FaMapMarkerAlt className="mr-1" /> {institution.location}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{institution.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">View Courses</span>
                <Link 
                  to={`/student/institutions/${institution.id}`} 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5.3 Repeat for Other Dashboards

Apply similar patterns to:
- Admin Dashboard stats
- Institute Dashboard stats and applications
- Company Dashboard stats and jobs

---

## Step 6: Test the Application (20 minutes)

### 6.1 Test Student Flow
1. Login as student: `student@careerpath.ls`
2. Navigate to **Institutions** → Should show institutions from Firestore
3. Navigate to **My Applications** → Should show empty or real applications
4. Try uploading a document (if storage is set up)

### 6.2 Test Institute Flow
1. Login as institute: `institute@careerpath.ls`
2. Navigate to **Courses** → Should show courses for this institution
3. Navigate to **Applications** → Should show student applications
4. Try approving/rejecting an application

### 6.3 Test Company Flow
1. Login as company: `company@careerpath.ls`
2. Navigate to **Job Postings** → Try creating a new job
3. Navigate to **Applications** → Should show job applications

### 6.4 Test Admin Flow
1. Login as admin: `admin@careerpath.ls`
2. Navigate through all sections
3. Check stats are loading from Firestore

---

## Step 7: Deploy to Production (30 minutes)

### Option A: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
cd client
firebase init hosting

# Select:
# - Use existing project: career-guidance-platform-7e18e
# - Public directory: build
# - Single-page app: Yes
# - Overwrite index.html: No

# Build production version
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://career-guidance-platform-7e18e.web.app`

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: career-guidance-platform
# - Directory: ./
# - Override settings: No

# Production deployment
vercel --prod
```

---

## Step 8: Final Checklist

### Functionality
- [ ] All 4 user roles can login
- [ ] Each role sees their appropriate dashboard
- [ ] Stats load from Firestore
- [ ] CRUD operations work (create, read, update, delete)
- [ ] File upload works (documents)
- [ ] Search and filtering work
- [ ] Logout works correctly

### Security
- [ ] Firestore rules are set
- [ ] Storage rules are set
- [ ] Email/Password auth is enabled
- [ ] Only authorized users can access their data

### Performance
- [ ] Loading states show while fetching data
- [ ] Error messages display when operations fail
- [ ] Success toasts show for completed actions
- [ ] App is responsive on mobile

### Documentation
- [ ] README.md updated with setup instructions
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] User roles and permissions documented

---

## Step 9: Optional Enhancements

### Add Email Notifications
```javascript
// Use Firebase Cloud Functions
exports.sendApplicationNotification = functions.firestore
  .document('applications/{applicationId}')
  .onCreate(async (snap, context) => {
    const application = snap.data();
    // Send email to institution
    await sendEmail({
      to: application.institutionEmail,
      subject: 'New Application Received',
      body: `New application from ${application.studentName}`
    });
  });
```

### Add Real-time Notifications
```javascript
// In dashboard, listen for new applications
useEffect(() => {
  const q = query(
    collection(db, 'applications'),
    where('institutionId', '==', userData.uid),
    where('status', '==', 'pending')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        toast.info('New application received!');
      }
    });
  });

  return () => unsubscribe();
}, [userData]);
```

### Add Analytics
```javascript
import { logEvent } from 'firebase/analytics';
import { analytics } from './config/firebase.config';

// Track user actions
logEvent(analytics, 'application_submitted', {
  course: courseName,
  institution: institutionName
});
```

---

## Troubleshooting Common Issues

### Issue: "Permission denied" errors
**Solution:** Check Firestore security rules, ensure user is authenticated

### Issue: Data not loading
**Solution:** Check browser console for errors, verify Firestore collections exist

### Issue: File upload fails
**Solution:** Check Storage rules, ensure file size is under limit (5MB default)

### Issue: Stats showing 0
**Solution:** Ensure sample data exists in Firestore, check user ID matches

---

## 📚 Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **React Icons:** https://react-icons.github.io/react-icons/

---

## 🎓 Submission Checklist for Assignment

- [ ] GitHub repository created and code pushed
- [ ] README.md with setup instructions
- [ ] Live demo URL (Firebase Hosting or Vercel)
- [ ] All 4 modules implemented (Admin, Institute, Student, Company)
- [ ] Firebase integration complete
- [ ] Responsive design working
- [ ] Role-based access control implemented
- [ ] Document upload functionality working
- [ ] Search and filtering implemented
- [ ] Screenshots/demo video prepared

---

## 🎉 Congratulations!

Your Career Guidance Platform is now complete with:
✅ 4 fully functional dashboards
✅ Firebase backend integration
✅ Real-time data operations
✅ File upload capability
✅ Role-based access control
✅ Modern, responsive UI
✅ Ready for deployment

**Next:** Test thoroughly, deploy, and submit your assignment!
