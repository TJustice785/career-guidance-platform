import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import AdmissionsManagement from './AdmissionsManagement';
import Footer from '../../components/Footer';
import DashboardNavbar from '../../components/DashboardNavbar';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';

// Dashboard Home Component
function DashboardHome({ stats, loading, recentApplications }) {
  const { userData } = useAuth();

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
  };

  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            change > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {loading ? (
          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
      {description && <div className="text-xs text-gray-400">{description}</div>}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome, {userData?.name || 'Institute'}!
        </h1>
        <p className="text-secondary text-lg">Manage your institution, courses, and student applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change={10}
          description="Enrolled students"
        />
        <StatCard
          title="Active Courses"
          value={stats.activeCourses}
          change={5}
          description="Currently running"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          description="Awaiting review"
        />
        <StatCard
          title="Admissions"
          value={stats.totalAdmissions}
          change={15}
          description="This semester"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card-glass animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Recent Applications</h2>
            <Link to="/institute/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No applications yet</p>
              </div>
            ) : (
              <>
                {recentApplications.slice(0, 5).map((app) => {
                  const status = statusConfig[app.status] || statusConfig.pending;
                  return (
                    <div key={app.id} className="p-4 bg-dark-200 rounded-lg hover:bg-dark-400 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-primary">{app.studentName || 'Unknown Student'}</p>
                          <p className="text-sm text-secondary">{app.courseName || 'Unknown Course'}</p>
                          <p className="text-xs text-gray-400 mt-1">Applied: {getTimeAgo(app.appliedAt || app.createdAt)}</p>
                        </div>
                        <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs rounded-full`}>{status.label}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/institute/courses" className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center">
              Manage Courses
            </Link>
            <Link to="/institute/applications" className="block w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-center">
              Review Applications
            </Link>
            <Link to="/institute/students" className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
              View Students
            </Link>
            <Link to="/institute/profile" className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center">
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstituteDashboard() {
  const { userData, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingApplications: 0,
    totalAdmissions: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?.email) {
        console.log('⏳ Waiting for currentUser...');
        return;
      }
      
      try {
        setLoading(true);
        const institutionId = 'uu4koroLU9P3AZARkYP4'; // Machabeng College's ID
        const institutionName = 'Machabeng College';
        
        console.log('Fetching stats for:', institutionName);
        
        const [courses, applications, enrollments] = await Promise.all([
          getDocs(collection(db, 'courses')),
          getDocs(collection(db, 'applications')),
          getDocs(collection(db, 'enrollments'))
        ]);

        // Filter for Machabeng College using currentUser.uid for more accuracy
        const machabengCourses = courses.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(course => 
            course.institutionName === institutionName || 
            course.institutionId === institutionId ||
            course.institutionId === currentUser.uid
          );

        const machabengApps = applications.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(app => 
            app.institutionName === institutionName || 
            app.institutionId === institutionId ||
            app.institutionId === currentUser.uid
          );

        const machabengEnrollments = enrollments.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(enrollment => 
            enrollment.institutionId === currentUser.uid ||
            enrollment.institutionId === institutionId
          );

        // Count unique students (by studentId)
        const uniqueStudents = new Set(
          machabengEnrollments
            .filter(e => e.studentId)
            .map(e => e.studentId)
        ).size;

        // Count active enrollments for this semester
        const activeEnrollments = machabengEnrollments.filter(
          e => e.status === 'active' || e.status === 'pending'
        ).length;

        console.log('Filtered stats:', {
          courses: machabengCourses.length,
          applications: machabengApps.length,
          enrollments: machabengEnrollments.length,
          uniqueStudents: uniqueStudents
        });

        const pendingApps = machabengApps.filter(app => app.status === 'pending').length;

        // Sort applications by date (most recent first)
        const sortedApps = machabengApps.sort((a, b) => {
          const dateA = a.appliedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.appliedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });

        setRecentApplications(sortedApps);
        setStats({
          totalStudents: uniqueStudents,
          activeCourses: machabengCourses.length,
          pendingApplications: pendingApps,
          totalAdmissions: activeEnrollments
        });

        console.log('✓ Loaded stats:', {
          courses: machabengCourses.length,
          applications: machabengApps.length,
          pending: pendingApps,
          enrollments: machabengEnrollments.length,
          uniqueStudents: uniqueStudents,
          activeEnrollments: activeEnrollments
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/institute', label: 'Dashboard' },
    { path: '/institute/courses', label: 'Courses' },
    { path: '/institute/applications', label: 'Applications' },
    { path: '/institute/admissions', label: 'Admissions' },
    { path: '/institute/students', label: 'Students' },
    { path: '/institute/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
      {/* Top Navbar */}
      <DashboardNavbar role="institute" navItems={navItems} onLogout={handleLogout} />
      
      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<DashboardHome stats={stats} loading={loading} recentApplications={recentApplications} />} />
            <Route path="courses" element={<CoursesManagement />} />
            <Route path="applications" element={<ApplicationsManagement />} />
            <Route path="students" element={<StudentsView />} />
            <Route path="admissions" element={<AdmissionsManagement />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
}

// Sub-components for routes
function CoursesManagement() {
  const { currentUser, userData } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const fetchCourses = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      const coursesSnapshot = await getDocs(
        query(collection(db, 'courses'), where('institutionId', '==', currentUser.uid))
      );
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      const newCourse = {
        ...courseData,
        institutionId: currentUser.uid,
        institutionName: userData?.name || 'Unknown Institution',
        enrolledStudents: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'courses'), newCourse);
      setCourses(prev => [...prev, { id: docRef.id, ...newCourse }]);
      toast.success('Course added successfully!');
      setShowFormModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
      throw error;
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const updatedData = {
        ...courseData,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'courses', courseId), updatedData);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updatedData } : c));
      toast.success('Course updated successfully!');
      setShowFormModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      throw error;
    }
  };

  const handleDelete = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) return;
    
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowFormModal(true);
  };

  const filteredCourses = courses.filter(course =>
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.faculty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Course Management</h1>
      <div className="card-glass p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
          />
          <button 
            onClick={() => {
              setEditingCourse(null);
              setShowFormModal(true);
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap"
          >
            Add New Course
          </button>
        </div>
        
        {/* Course List */}
        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{courses.length === 0 ? 'No courses yet. Add your first course!' : 'No courses match your search.'}</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-primary">{course.name}</h3>
                    <p className="text-sm text-secondary">Faculty: {course.faculty || 'Not specified'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      Duration: {course.duration || 'N/A'} | Students: {course.enrolledStudents || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewingCourse(course)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(course)}
                      className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(course.id, course.name)}
                      className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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

      {/* View Course Modal */}
      {viewingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setViewingCourse(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-primary mb-4">{viewingCourse.name}</h2>
            <div className="space-y-3">
              <p><strong>Faculty:</strong> {viewingCourse.faculty || 'Not specified'}</p>
              <p><strong>Duration:</strong> {viewingCourse.duration || 'Not specified'}</p>
              <p><strong>Description:</strong> {viewingCourse.description || 'No description provided'}</p>
              <p><strong>Requirements:</strong> {viewingCourse.requirements || 'No requirements listed'}</p>
              <p><strong>Enrolled Students:</strong> {viewingCourse.enrolledStudents || 0}</p>
            </div>
            <button 
              onClick={() => setViewingCourse(null)}
              className="mt-6 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Course Form Modal */}
      {showFormModal && (
        <CourseFormModal
          course={editingCourse}
          onClose={() => {
            setShowFormModal(false);
            setEditingCourse(null);
          }}
          onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
        />
      )}
    </div>
  );
}

// Course Form Modal Component
function CourseFormModal({ course, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: course?.name || '',
    faculty: course?.faculty || '',
    duration: course?.duration || '',
    description: course?.description || '',
    requirements: course?.requirements || '',
    requiredSubjects: course?.requiredSubjects || [],
    minimumCredits: course?.minimumCredits || 5,
    fee: course?.fee || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [newRequirement, setNewRequirement] = useState({ subject: '', minGrade: 'C' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addRequirement = () => {
    if (newRequirement.subject.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredSubjects: [...prev.requiredSubjects, {
          subject: newRequirement.subject.trim(),
          minGrade: newRequirement.minGrade
        }]
      }));
      setNewRequirement({ subject: '', minGrade: 'C' });
    } else {
      toast.error('Please enter a subject name');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredSubjects: prev.requiredSubjects.filter((_, i) => i !== index)
    }));
  };

  const getGradeBadgeColor = (grade) => {
    const creditGrades = ['A', 'B', 'C'];
    return creditGrades.includes(grade) 
      ? 'bg-green-600 text-white' 
      : 'bg-gray-400 text-white';
  };

  const getGradeLabel = (grade) => {
    const creditGrades = ['A', 'B', 'C'];
    return creditGrades.includes(grade) ? '✓ Credit' : 'No Credit';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (course) {
        await onSubmit(course.id, formData);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-primary">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Computer Science - BSc"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faculty *
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Science & Technology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 4 years"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course Fee
            </label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., M25,000 per year"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the course, what students will learn..."
            ></textarea>
          </div>

          {/* Minimum Credits Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Credits Required *
            </label>
            <input
              type="number"
              name="minimumCredits"
              min="0"
              max="20"
              value={formData.minimumCredits}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 5"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Number of subjects with grades A, B, or C required for admission
            </p>
          </div>

          {/* Subject Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Required Subjects with Minimum Grades
            </label>
            
            {/* Add New Requirement */}
            <div className="mb-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Add specific subject requirements (e.g., Mathematics with minimum grade C)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Subject name (e.g., Mathematics)"
                  value={newRequirement.subject}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, subject: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                  value={newRequirement.minGrade}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, minGrade: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="A">Minimum Grade A</option>
                  <option value="B">Minimum Grade B</option>
                  <option value="C">Minimum Grade C</option>
                  <option value="D">Minimum Grade D</option>
                  <option value="E">Minimum Grade E</option>
                </select>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Display Requirements List */}
            <div className="space-y-2">
              {formData.requiredSubjects.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No specific subject requirements added. Students will only need to meet the minimum credits requirement.
                </p>
              ) : (
                formData.requiredSubjects.map((req, index) => {
                  const isCredit = ['A', 'B', 'C'].includes(req.minGrade);
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-lg border ${
                        isCredit 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-sm font-bold rounded ${getGradeBadgeColor(req.minGrade)}`}>
                          {req.minGrade}+
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{req.subject}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isCredit 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {getGradeLabel(req.minGrade)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Requirements / Notes
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Any other requirements or important notes..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving...' : (course ? 'Update Course' : 'Add Course')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicationsManagement() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

    const fetchApplications = async () => {
      if (!currentUser?.email) return;
      
      try {
        setLoading(true);
        console.log('Fetching applications for:', currentUser.email);

        // Get ALL applications and filter client-side
        const appsSnapshot = await getDocs(collection(db, 'applications'));
        
        // Log each application for debugging
        const apps = appsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Application:', {
            id: doc.id,
            studentName: data.studentName,
            institutionName: data.institutionName,
            institutionId: data.institutionId,
            status: data.status,
            createdAt: data.createdAt
          });
          return { id: doc.id, ...data };
        });

        // Filter applications for Machabeng College
        const machabengApps = apps.filter(app => 
          app.institutionName === 'Machabeng College' ||
          app.institutionId === 'uu4koroLU9P3AZARkYP4'
        );

        console.log('Found applications for Machabeng:', machabengApps.length);
        setApplications(machabengApps);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setApplications(prev => prev.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      
      toast.success(`Application ${newStatus}!`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const handleCreateAdmission = async (application) => {
    if (!window.confirm(`Create admission for ${application.studentName}?`)) return;
    
    try {
      // ⚠️ CHECK: Prevent admitting same student to multiple programs at this institution
      const existingEnrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('studentId', '==', application.studentId),
        where('institutionId', '==', currentUser.uid),
        where('status', '==', 'active')
      );
      const existingEnrollments = await getDocs(existingEnrollmentsQuery);
      
      if (!existingEnrollments.empty) {
        const existingCourse = existingEnrollments.docs[0].data().courseName;
        toast.error(`This student is already admitted to "${existingCourse}" at your institution. Students can only be admitted to ONE program per institution.`);
        return;
      }

      // Create enrollment record (used by Admissions Management)
      // Store student and course data directly to avoid lookup issues
      const enrollmentData = {
        studentId: application.studentId,
        studentName: application.studentName,
        studentEmail: application.studentEmail,
        institutionId: currentUser.uid,
        courseId: application.courseId,
        courseName: application.courseName,
        applicationId: application.id,
        status: 'active',
        enrolledAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      console.log('Creating enrollment with data:', enrollmentData);
      await addDoc(collection(db, 'enrollments'), enrollmentData);
      
      // Update application status to 'admitted'
      await updateDoc(doc(db, 'applications', application.id), {
        status: 'admitted',
        admittedAt: serverTimestamp()
      });

      setApplications(prev => prev.map(app =>
        app.id === application.id ? { ...app, status: 'admitted' } : app
      ));

      toast.success('Student enrolled successfully! Check Admissions Management to view.');
    } catch (error) {
      console.error('Error creating enrollment:', error);
      toast.error('Failed to create enrollment: ' + error.message);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const uniqueCourses = [...new Set(applications.map(app => app.courseName).filter(Boolean))];

  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesCourse = selectedCourse === 'all' || app.courseName === selectedCourse;
    return matchesStatus && matchesCourse;
  });

  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
    admitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Admitted' }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Application Management</h1>
      <div className="card-glass p-6">
        <div className="flex gap-4 mb-6">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="admitted">Admitted</option>
          </select>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <p className="text-secondary mb-4">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
        </p>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{applications.length === 0 ? 'No applications yet' : 'No applications match your filters'}</p>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              return (
                <div key={app.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{app.studentName || 'Unknown Student'}</h3>
                      <p className="text-sm text-secondary">{app.courseName || 'Unknown Course'}</p>
                      <p className="text-xs text-gray-400 mt-1">Applied: {getTimeAgo(app.appliedAt || app.createdAt)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <strong>Email:</strong> {app.studentEmail}
                      </p>
                      {app.currentGrade && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>Current Grade:</strong> {app.currentGrade}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs rounded-full text-center`}>
                        {status.label}
                      </span>
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {app.status === 'approved' && (
                        <button 
                          onClick={() => handleCreateAdmission(app)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                        >
                          Create Admission
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StudentsView() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [currentUser]);

  const fetchStudents = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      const admissionsSnapshot = await getDocs(
        query(collection(db, 'admissions'), where('institutionId', '==', currentUser.uid))
      );
      const studentsData = admissionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Enrolled Students</h1>
      <div className="card-glass p-6">
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
          />
        </div>
        
        <p className="text-secondary mb-4">
          {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} enrolled
        </p>

        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{students.length === 0 ? 'No students enrolled yet' : 'No students match your search'}</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-primary">{student.studentName || 'Unknown Student'}</h3>
                    <p className="text-sm text-secondary">{student.courseName || 'Unknown Course'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <strong>Email:</strong> {student.studentEmail}
                    </p>
                    {student.admissionDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Enrolled: {student.admissionDate.toDate?.().toLocaleDateString() || 'Unknown'}
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// AdmissionsManagement component is imported at the top

function ProfileSettings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Institution Profile</h1>
      <div className="card-glass p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Institution Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter institution name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Enter description"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter phone" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input type="url" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter website" />
            </div>
          </div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
