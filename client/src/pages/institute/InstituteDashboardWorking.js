import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';

// Dashboard Home Component
function DashboardHome({ stats, loading, userData }) {
  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change > 0 ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {loading ? (
          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      {description && <div className="text-xs text-gray-500">{description}</div>}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome, {userData?.institutionName || userData?.fullName || 'Institution'}! 🎓
        </h1>
        <p className="text-secondary text-lg">Manage your courses and student applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Courses"
          value={stats.activeCourses}
          change={10}
          description="Currently available"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change={15}
          description="Enrolled students"
        />
        <StatCard
          title="Applications"
          value={stats.applications}
          description="Pending review"
        />
        <StatCard
          title="Graduates"
          value={stats.graduates}
          change={8}
          description="This year"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link to="/institute/courses/new" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Add New Course</h3>
          <p className="text-primary-100">Create a new course offering</p>
        </Link>
        <Link to="/institute/applications" className="bg-gradient-to-br from-success-500 to-success-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Review Applications</h3>
          <p className="text-success-100">Process student applications</p>
        </Link>
        <Link to="/institute/courses" className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Manage Courses</h3>
          <p className="text-secondary-100">Edit or remove courses</p>
        </Link>
      </div>
    </div>
  );
}

// Courses Management Component with CRUD
function CoursesManagement() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const institutionId = userData?.institutionId || userData?.uid;
      const q = query(
        collection(db, 'courses'),
        where('institutionId', '==', institutionId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const coursesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesList);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Course Management</h1>
        <Link
          to="/institute/courses/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Add New Course
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No courses found matching your search.' : 'No courses added yet.'}
          </p>
          {!searchTerm && (
            <Link
              to="/institute/courses/new"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Add Your First Course
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Code: {course.code}</p>
                </div>
                <span className="px-3 py-1 bg-success-100 text-success-700 text-sm rounded-full">
                  {course.status || 'Active'}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Enrolled:</span>
                  <span className="font-medium">{course.enrollmentCount || 0} students</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(course.id)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// New Course Form Component with CREATE
function NewCourseForm() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    duration: '',
    level: 'Undergraduate',
    department: '',
    credits: '',
    prerequisites: '',
    fees: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'courses'), {
        ...formData,
        institutionId: userData?.institutionId || userData?.uid,
        institutionName: userData?.institutionName || userData?.fullName,
        status: 'active',
        enrollmentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success('Course added successfully!');
      navigate('/institute/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Add New Course</h1>
      <div className="card-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Course Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Computer Science"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Course Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. CS101"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="4"
              placeholder="Describe the course..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 4 years"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Level *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option>Certificate</option>
                <option>Diploma</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
                <option>Masters</option>
                <option>PhD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Faculty of Science"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Credits</label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 120"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prerequisites</label>
            <textarea
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="List entry requirements..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tuition Fees</label>
            <input
              type="text"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. M15,000 per year"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Course'}
            </button>
            <Link
              to="/institute/courses"
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

// Applications View Component
function ApplicationsView() {
  const { userData } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const institutionId = userData?.institutionId || userData?.uid;
      const q = query(
        collection(db, 'applications'),
        where('institutionId', '==', institutionId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const appsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(appsList);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        reviewedAt: serverTimestamp(),
        reviewedBy: userData?.uid,
        updatedAt: serverTimestamp()
      });
      toast.success(`Application ${newStatus}!`);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Student Applications</h1>
      
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{app.studentName}</h3>
                  <p className="text-sm text-gray-600">{app.studentEmail}</p>
                  <p className="text-sm text-gray-600 mt-1">Applied for: {app.courseName}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full text-center ${
                    app.status === 'approved' ? 'bg-success-100 text-success-700' :
                    app.status === 'rejected' ? 'bg-error-100 text-error-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {app.status || 'pending'}
                  </span>
                  {app.status !== 'approved' && app.status !== 'rejected' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                        className="px-3 py-1 text-xs bg-success-50 text-success-600 rounded hover:bg-success-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        className="px-3 py-1 text-xs bg-error-50 text-error-600 rounded hover:bg-error-100"
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
  );
}

// Placeholder components
function StudentsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Students</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Student management interface</p>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Profile Settings</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Institution profile settings</p>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function InstituteDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    applications: 0,
    graduates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const institutionId = userData?.institutionId || userData?.uid;
      
      // Fetch courses count
      const coursesQuery = query(collection(db, 'courses'), where('institutionId', '==', institutionId));
      const coursesSnapshot = await getDocs(coursesQuery);
      
      // Fetch applications count
      const appsQuery = query(collection(db, 'applications'), where('institutionId', '==', institutionId));
      const appsSnapshot = await getDocs(appsQuery);
      
      const applications = appsSnapshot.docs.map(doc => doc.data());
      
      setStats({
        activeCourses: coursesSnapshot.size,
        totalStudents: 0, // Would need students collection
        applications: applications.filter(app => app.status === 'pending').length,
        graduates: 0 // Would need graduates data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">CareerPath</h1>
            <p className="text-sm text-gray-500 mt-1">Institute Portal</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link to="/institute" className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
              Dashboard
            </Link>
            <Link to="/institute/courses" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Courses
            </Link>
            <Link to="/institute/applications" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Applications
            </Link>
            <Link to="/institute/students" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Students
            </Link>
            <Link to="/institute/profile" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Profile Settings
            </Link>
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{userData?.institutionName || userData?.fullName || 'Institution'}</p>
              <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Routes>
          <Route index element={<DashboardHome stats={stats} loading={loading} userData={userData} />} />
          <Route path="courses" element={<CoursesManagement />} />
          <Route path="courses/new" element={<NewCourseForm />} />
          <Route path="applications" element={<ApplicationsView />} />
          <Route path="students" element={<StudentsView />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  );
}
