# Complete Implementation Guide - All User Dashboards

## 🎯 Overview

This guide provides the complete implementation for all 4 user roles:
1. **Admin Dashboard** - Manage users, institutions, companies, applications
2. **Institute Dashboard** - Manage courses, review applications, track students
3. **Student Dashboard** - ✅ Already Complete
4. **Company Dashboard** - Manage jobs, review applications, find candidates

---

## ✅ Student Dashboard - COMPLETE

All features are working:
- ✅ Dashboard stats from Firestore
- ✅ Browse institutions with search/filter
- ✅ View institution details and courses
- ✅ Apply to courses (max 2 per institution)
- ✅ Track applications
- ✅ Upload/manage documents
- ✅ Search and apply to jobs
- ✅ Update profile

**No fixes needed!**

---

## 🔧 Admin Dashboard - Needs Firebase Integration

### Current Status
- ✅ UI complete with sidebar and routes
- ❌ Using mock data
- ❌ No CRUD operations

### Required Implementations

#### 1. Add Firebase Imports
```javascript
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
```

#### 2. Update Stats to Use Real Data
```javascript
// In AdminDashboard main component
useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const [users, institutions, companies, applications] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'institutions')),
        getDocs(collection(db, 'companies')),
        getDocs(collection(db, 'applications'))
      ]);

      const students = users.docs.filter(doc => doc.data().role === 'student').length;
      const pendingApps = applications.docs.filter(doc => doc.data().status === 'pending').length;

      setStats({
        totalUsers: users.size,
        totalInstitutes: institutions.size,
        totalCompanies: companies.size,
        totalStudents: students,
        activeApplications: applications.size,
        pendingApprovals: pendingApps
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);
```

#### 3. Implement UsersManagement Component
```javascript
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let q = collection(db, 'users');
      
      if (roleFilter) {
        q = query(q, where('role', '==', roleFilter));
      }
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      
      <div className="card-glass p-6">
        <div className="mb-6 flex justify-between items-center">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="institute">Institutes</option>
            <option value="company">Companies</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {user.firstName} {user.lastName} {user.name}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. Implement InstitutionsManagement Component
```javascript
function InstitutionsManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'institutions'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstitutions(data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (institutionId) => {
    try {
      await updateDoc(doc(db, 'institutions', institutionId), {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      toast.success('Institution approved');
      fetchInstitutions();
    } catch (error) {
      console.error('Error approving institution:', error);
      toast.error('Failed to approve institution');
    }
  };

  const handleDelete = async (institutionId) => {
    if (!window.confirm('Are you sure you want to delete this institution?')) return;

    try {
      await deleteDoc(doc(db, 'institutions', institutionId));
      toast.success('Institution deleted');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Failed to delete institution');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Institution Management</h1>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          institutions.map((inst) => (
            <div key={inst.id} className="card-glass p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-primary">{inst.name}</h3>
                  <p className="text-sm text-secondary">{inst.location}</p>
                  <p className="text-sm text-gray-600 mt-2">{inst.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    inst.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inst.status || 'pending'}
                  </span>
                  {inst.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(inst.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inst.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 🔧 Institute Dashboard - Needs Firebase Integration

### Current Status
- ✅ UI complete with sidebar and routes
- ❌ Using mock data
- ❌ No CRUD operations

### Required Implementations

#### 1. Add Firebase Imports (same as Admin)

#### 2. Update Stats to Use Real Data
```javascript
useEffect(() => {
  const fetchStats = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      
      const [courses, applications, admissions] = await Promise.all([
        getDocs(query(collection(db, 'courses'), where('institutionId', '==', userData.uid))),
        getDocs(query(collection(db, 'applications'), where('institutionId', '==', userData.uid))),
        getDocs(query(collection(db, 'admissions'), where('institutionId', '==', userData.uid)))
      ]);

      const pendingApps = applications.docs.filter(doc => doc.data().status === 'pending').length;

      setStats({
        totalStudents: admissions.size,
        activeCourses: courses.size,
        pendingApplications: pendingApps,
        totalAdmissions: admissions.size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [userData]);
```

#### 3. Implement CoursesManagement Component
```javascript
function CoursesManagement() {
  const { userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: '',
    field: '',
    fees: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [userData]);

  const fetchCourses = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'courses'),
        where('institutionId', '==', userData.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'courses'), {
        ...formData,
        institutionId: userData.uid,
        institutionName: userData.name,
        status: 'active',
        enrolled: 0,
        createdAt: serverTimestamp()
      });

      toast.success('Course added successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', duration: '', level: '', field: '', fees: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success('Course deleted');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Course Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="card-glass p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Add New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g. 4 years"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select level</option>
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="degree">Degree</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Field</label>
                <input
                  type="text"
                  value={formData.field}
                  onChange={(e) => setFormData({...formData, field: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fees (LSL)</label>
                <input
                  type="number"
                  value={formData.fees}
                  onChange={(e) => setFormData({...formData, fees: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                Add Course
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="card-glass p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-primary">{course.title}</h3>
                  <p className="text-sm text-secondary">{course.field} • {course.level} • {course.duration}</p>
                  <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                  <p className="text-sm font-medium text-primary mt-2">Fees: {course.fees} LSL</p>
                </div>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### 4. Implement ApplicationsManagement Component
```javascript
function ApplicationsManagement() {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [userData, statusFilter]);

  const fetchApplications = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      let q = query(
        collection(db, 'applications'),
        where('institutionId', '==', userData.uid)
      );
      
      if (statusFilter) {
        q = query(q, where('status', '==', statusFilter));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status,
        reviewedAt: serverTimestamp()
      });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Application Management</h1>
      
      <div className="card-glass p-6">
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-primary">{app.studentName}</h3>
                    <p className="text-sm text-secondary">{app.courseName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 text-xs rounded-full text-center ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'accepted')}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔧 Company Dashboard - Needs Firebase Integration

### Current Status
- ✅ UI complete with sidebar and routes
- ❌ Using mock data
- ❌ No CRUD operations

### Required Implementations

#### 1. Add Firebase Imports (same as above)

#### 2. Update Stats to Use Real Data
```javascript
useEffect(() => {
  const fetchStats = async () => {
    if (!userData?.uid) return;
    
    try {
      setLoading(true);
      
      const jobsSnapshot = await getDocs(
        query(collection(db, 'jobs'), where('companyId', '==', userData.uid))
      );
      
      const jobIds = jobsSnapshot.docs.map(doc => doc.id);
      const activeJobs = jobsSnapshot.docs.filter(doc => doc.data().status === 'active').length;

      let totalApplications = 0;
      let shortlisted = 0;
      let hired = 0;

      if (jobIds.length > 0) {
        const appsSnapshot = await getDocs(
          query(collection(db, 'jobApplications'), where('jobId', 'in', jobIds))
        );

        totalApplications = appsSnapshot.size;
        shortlisted = appsSnapshot.docs.filter(doc => doc.data().status === 'shortlisted').length;
        hired = appsSnapshot.docs.filter(doc => doc.data().status === 'hired').length;
      }

      setStats({
        activeJobs,
        totalApplications,
        shortlisted,
        hired
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [userData]);
```

#### 3. Implement JobsManagement Component (similar to Institute's CoursesManagement)
#### 4. Implement ApplicationsView Component (similar to Institute's ApplicationsManagement)

---

## 📝 Implementation Steps

### For Each Dashboard:

1. **Add Firebase imports** at the top of the file
2. **Replace mock data** with Firestore queries
3. **Implement CRUD operations** for each management component
4. **Add error handling** with try-catch and toast notifications
5. **Add loading states** with spinners
6. **Test each feature** thoroughly

---

## 🧪 Testing Checklist

### Admin Dashboard
- [ ] Stats load from Firestore
- [ ] View all users
- [ ] Filter users by role
- [ ] Delete users
- [ ] View all institutions
- [ ] Approve institutions
- [ ] Delete institutions
- [ ] View all companies
- [ ] Approve companies

### Institute Dashboard
- [ ] Stats load from Firestore
- [ ] View courses
- [ ] Add new course
- [ ] Delete course
- [ ] View applications
- [ ] Filter applications by status
- [ ] Accept/reject applications

### Company Dashboard
- [ ] Stats load from Firestore
- [ ] View jobs
- [ ] Add new job
- [ ] Delete job
- [ ] View job applications
- [ ] Update application status

---

## 🚀 Quick Implementation

Due to the complexity, I recommend implementing one dashboard at a time:

1. **Start with Institute Dashboard** (most critical for students)
2. **Then Company Dashboard** (for job applications)
3. **Finally Admin Dashboard** (for overall management)

Each implementation follows the same pattern:
- Add imports
- Update stats
- Implement management components
- Test thoroughly

---

**Next:** Would you like me to implement these changes directly in the files, or would you prefer to do it manually using this guide?
