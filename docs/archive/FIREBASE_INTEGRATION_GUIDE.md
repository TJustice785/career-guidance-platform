# Firebase Integration Guide

## Step-by-Step Integration Process

### Step 1: Import Firebase Service

In any dashboard component, import the Firebase service:

```javascript
import firebaseService from '../services/firebase.service';
```

### Step 2: Replace Mock Data with Real Data

#### Example: Student Dashboard

**Before (Mock Data):**
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

**After (Real Firebase Data):**
```javascript
useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await firebaseService.student.getStats(userData.uid);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userData?.uid) {
    fetchStats();
  }
}, [userData]);
```

---

## Complete Integration Examples

### 1. Student Dashboard - Browse Institutions

```javascript
// In InstitutionsView component
function InstitutionsView() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '' });

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.student.getAllInstitutions(filters);
        setInstitutions(data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [filters]);

  const handleLocationChange = (e) => {
    setFilters({ ...filters, location: e.target.value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Browse Institutions</h1>
      
      <div className="mb-6">
        <select onChange={handleLocationChange} className="px-4 py-2 border rounded-lg">
          <option value="">All Locations</option>
          <option value="Maseru">Maseru</option>
          <option value="Leribe">Leribe</option>
          <option value="Mafeteng">Mafeteng</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {institutions.map((institution) => (
            <div key={institution.id} className="card-glass p-6 hover:shadow-xl transition">
              <h3 className="font-bold text-xl text-primary mb-2">{institution.name}</h3>
              <p className="text-sm text-secondary mb-2">{institution.location}</p>
              <p className="text-sm text-gray-600 mb-4">{institution.description}</p>
              <Link 
                to={`/student/institutions/${institution.id}`} 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Student Dashboard - Apply to Course

```javascript
function CourseApplicationForm({ courseId, institutionId, onSuccess }) {
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    highSchoolName: '',
    graduationYear: '',
    grade: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await firebaseService.student.applyToCourse(userData.uid, {
        institutionId,
        courseId,
        studentName: `${userData.firstName} ${userData.lastName}`,
        studentEmail: userData.email,
        academicInfo: {
          highSchoolName: formData.highSchoolName,
          graduationYear: formData.graduationYear,
          grade: formData.grade
        }
      });

      toast.success('Application submitted successfully!');
      onSuccess();
    } catch (error) {
      // Error toast is shown by the service
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">High School Name</label>
        <input
          type="text"
          value={formData.highSchoolName}
          onChange={(e) => setFormData({ ...formData, highSchoolName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Graduation Year</label>
        <input
          type="number"
          value={formData.graduationYear}
          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Overall Grade</label>
        <select
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select grade</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
```

### 3. Student Dashboard - Upload Document

```javascript
function DocumentUpload() {
  const { userData } = useAuth();
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('transcript');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await firebaseService.student.uploadDocument(userData.uid, file, documentType);
      setFile(null);
      // Refresh documents list
    } catch (error) {
      // Error toast is shown by the service
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card-glass p-6">
      <h3 className="font-bold text-lg mb-4">Upload Document</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="transcript">Transcript</option>
            <option value="certificate">Certificate</option>
            <option value="id">ID Copy</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select File</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
        >
          <FaUpload className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
}
```

### 4. Institute Dashboard - Review Applications

```javascript
function ApplicationsManagement() {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await firebaseService.institute.getApplications(
        userData.uid,
        statusFilter || null
      );
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await firebaseService.institute.updateApplicationStatus(
        applicationId,
        'accepted',
        'Application approved'
      );
      fetchApplications(); // Refresh list
    } catch (error) {
      // Error toast shown by service
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await firebaseService.institute.updateApplicationStatus(
        applicationId,
        'rejected',
        'Application rejected'
      );
      fetchApplications(); // Refresh list
    } catch (error) {
      // Error toast shown by service
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
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-primary">{app.studentName}</h3>
                    <p className="text-sm text-secondary">{app.courseName}</p>
                    <p className="text-sm mt-2">
                      <strong>Grade:</strong> {app.academicInfo?.grade}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {app.createdAt?.toDate().toLocaleDateString()}
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
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
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

### 5. Company Dashboard - Post Job

```javascript
function NewJobForm() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    industry: '',
    salary: '',
    requirements: {
      education: '',
      experience: '',
      skills: ''
    },
    applicationDeadline: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await firebaseService.company.postJob(userData.uid, {
        ...formData,
        companyName: userData.name,
        requirements: {
          ...formData.requirements,
          skills: formData.requirements.skills.split(',').map(s => s.trim())
        }
      });

      toast.success('Job posted successfully!');
      navigate('/company/jobs');
    } catch (error) {
      // Error toast shown by service
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Post New Job</h1>
      
      <div className="card-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Type *</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows="6"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required Skills (comma-separated)</label>
            <input
              type="text"
              name="requirements.skills"
              value={formData.requirements.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g. JavaScript, React, Node.js"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Job'}
            </button>
            <Link
              to="/company/jobs"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Real-time Updates with onSnapshot

For real-time data updates, use Firestore's `onSnapshot`:

```javascript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';

function ApplicationsRealtime() {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'applications'),
      where('institutionId', '==', userData.uid)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userData.uid]);

  return (
    <div>
      {applications.map(app => (
        <div key={app.id}>{app.studentName}</div>
      ))}
    </div>
  );
}
```

---

## Error Handling Best Practices

```javascript
async function fetchDataWithErrorHandling() {
  try {
    setLoading(true);
    setError(null);
    
    const data = await firebaseService.student.getApplications(userId);
    setApplications(data);
    
  } catch (error) {
    console.error('Error fetching applications:', error);
    setError('Failed to load applications. Please try again.');
    
    // Optionally retry
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(retryCount + 1);
        fetchDataWithErrorHandling();
      }, 2000);
    }
  } finally {
    setLoading(false);
  }
}
```

---

## Next Steps

1. **Replace all mock data** in dashboards with Firebase service calls
2. **Test each CRUD operation** thoroughly
3. **Add loading states** for better UX
4. **Implement error handling** for all operations
5. **Add real-time listeners** where appropriate
6. **Test security rules** to ensure proper access control

---

This guide provides complete examples for integrating Firebase into your dashboards!
