import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import AcademicProfile from './AcademicProfile';

// Modern Dashboard Home Component
function DashboardHome({ stats, loading, userData }) {
  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
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
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {loading ? (
          <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <span>{(value !== undefined && value !== null) ? value.toLocaleString() : '0'}</span>
        )}
      </div>
      {description && (
        <div className="text-xs text-gray-500">{description}</div>
      )}
    </div>
  );

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userData?.firstName}!
        </h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your applications today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Applied Courses"
          value={stats.appliedCourses}
          description="Total applications submitted"
        />
        <StatCard
          title="Accepted"
          value={stats.acceptedApplications}
          change={12}
          description="Successful applications"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingApplications}
          description="Awaiting decision"
        />
        <StatCard
          title="Completed"
          value={stats.completedCourses}
          description="Finished courses"
        />
        <StatCard
          title="Job Applications"
          value={stats.jobApplications}
          change={8}
          description="Jobs applied to"
        />
        <StatCard
          title="Saved Jobs"
          value={stats.savedJobs}
          description="Bookmarked opportunities"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to apply?</h3>
          <p className="text-sm text-gray-600 mb-4">Browse institutions and find the perfect course for you.</p>
          <Link
            to="/student/institutions"
            className="inline-flex px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Institutions
          </Link>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 border border-teal-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Find your dream job</h3>
          <p className="text-sm text-gray-600 mb-4">Explore job opportunities that match your skills.</p>
          <Link
            to="/student/jobs"
            className="inline-flex px-6 py-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Search Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

// Modern Institutions View
function InstitutionsView() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const institutionsRef = collection(db, 'institutions');
        const snapshot = await getDocs(institutionsRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInstitutions(data);
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast.error('Failed to load institutions');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || inst.location?.includes(location);
    return matchesSearch && matchesLocation;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Institutions</h1>
        <p className="text-gray-500 mt-2">Discover educational institutions and their programs</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search institutions..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="Maseru">Maseru</option>
          <option value="Leribe">Leribe</option>
          <option value="Mafeteng">Mafeteng</option>
          <option value="Roma">Roma</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading institutions...</p>
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No institutions found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution) => (
            <div key={institution.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{institution.name}</h3>
                <p className="text-sm text-gray-500">{institution.location}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{institution.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {institution.type || 'University'}
                </span>
                <Link
                  to={`/student/institutions/${institution.id}`}
                  className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  View Courses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Institution Details View (same pattern, modernized)
function InstitutionDetailsView() {
  const { institutionId } = useParams();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('[Modern] Fetching data for institution ID:', institutionId);
        
        const instQuery = query(collection(db, 'institutions'), where('__name__', '==', institutionId));
        const instSnapshot = await getDocs(instQuery);
        if (!instSnapshot.empty) {
          const instData = { id: instSnapshot.docs[0].id, ...instSnapshot.docs[0].data() };
          console.log('[Modern] Institution data:', instData);
          setInstitution(instData);
        } else {
          console.warn('[Modern] No institution found with ID:', institutionId);
        }

        const coursesQuery = query(
          collection(db, 'courses'),
          where('institutionId', '==', institutionId)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('[Modern] Courses found for institution:', coursesData.length, coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('[Modern] Error fetching institution details:', error);
        toast.error('Failed to load institution details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [institutionId]);

  const hasTertiaryLevel = () => {
    const tertiaryLevels = ['Certificate', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD'];
    return tertiaryLevels.includes(userData?.currentGrade);
  };

  const handleApply = async (course) => {
    // Check if student has completed tertiary level
    if (hasTertiaryLevel()) {
      toast.error('You have already completed a tertiary level qualification and cannot apply for courses.');
      return;
    }

    try {
      const existingQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', userData.uid),
        where('courseId', '==', course.id)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        toast.error('You have already applied to this course');
        return;
      }

      const instAppsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', userData.uid),
        where('institutionId', '==', course.institutionId || institutionId)
      );
      const instAppsSnapshot = await getDocs(instAppsQuery);
      
      if (instAppsSnapshot.size >= 2) {
        toast.error('You can only apply to 2 courses per institution');
        return;
      }

      setApplying(true);
      
      await addDoc(collection(db, 'applications'), {
        studentId: userData.uid,
        studentName: `${userData.firstName} ${userData.lastName}`,
        studentEmail: userData.email,
        institutionId: course.institutionId || institutionId, // Use course's institutionId (owner UID)
        institutionName: institution.name,
        courseId: course.id,
        courseName: course.title,
        status: 'pending',
        createdAt: serverTimestamp(),
        qualifications: {
          currentGrade: userData.currentGrade || '',
          subjects: userData.subjects || [],
          certifications: userData.certifications || []
        }
      });

      toast.success('Application submitted successfully!');
      setTimeout(() => navigate('/student/applications'), 1500);
    } catch (error) {
      console.error('Error applying to course:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading institution details...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Institution not found</p>
        <Link to="/student/institutions" className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-medium">
          ← Back to Institutions
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/student/institutions" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-6">
        ← Back to Institutions
      </Link>
      
      <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{institution.name}</h1>
        <p className="text-gray-500 mb-4">{institution.location}</p>
        <p className="text-gray-600 mb-6">{institution.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{institution.type}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Established</p>
            <p className="text-sm font-semibold text-gray-900">{institution.established}</p>
          </div>
          {institution.website && (
            <div className="col-span-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Website</p>
              <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                Visit Website →
              </a>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No courses available at this institution</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {course.field}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {course.level}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {course.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                  
                  {course.fees && (
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      Fees: {course.fees} {course.currency} per year
                    </p>
                  )}
                  
                  {course.requirements && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-700 mb-2">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {Array.isArray(course.requirements) ? (
                          course.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))
                        ) : (
                          <li>{course.requirements}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleApply(course)}
                  disabled={applying || hasTertiaryLevel()}
                  className="px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  title={hasTertiaryLevel() ? 'You have completed tertiary level and cannot apply' : ''}
                >
                  {hasTertiaryLevel() ? 'Not Eligible' : applying ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Continue with other components following the same modern pattern...
// (ApplicationsView, DocumentsView, JobsView, ProfileView)

export default function StudentDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    appliedCourses: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    completedCourses: 0,
    jobApplications: 0,
    savedJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userData?.uid) return;
      
      try {
        setLoading(true);
        
        // Fetch course applications
        const appsQuery = query(collection(db, 'applications'), where('studentId', '==', userData.uid));
        const appsSnapshot = await getDocs(appsQuery);
        const applications = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch job applications from Firestore
        const jobAppsQuery = query(collection(db, 'jobApplications'), where('studentId', '==', userData.uid));
        const jobAppsSnapshot = await getDocs(jobAppsQuery);
        
        // Fetch saved jobs
        const savedJobsQuery = query(collection(db, 'savedJobs'), where('studentId', '==', userData.uid));
        const savedJobsSnapshot = await getDocs(savedJobsQuery);
        
        // Fetch admissions (completed courses)
        const admissionsQuery = query(collection(db, 'admissions'), where('studentId', '==', userData.uid));
        const admissionsSnapshot = await getDocs(admissionsQuery);
        
        setStats({
          appliedCourses: applications.length || 0,
          acceptedApplications: applications.filter(app => app.status === 'accepted').length || 0,
          pendingApplications: applications.filter(app => app.status === 'pending').length || 0,
          completedCourses: admissionsSnapshot.size || 0,
          jobApplications: jobAppsSnapshot.size || 0,
          savedJobs: savedJobsSnapshot.size || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load statistics');
        // Set default values on error
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          {/* Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">CareerPath</h1>
            <p className="text-sm text-gray-500 mt-1">Student Portal</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link to="/student" className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
              Dashboard
            </Link>
            <Link to="/student/institutions" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Institutions
            </Link>
            <Link to="/student/applications" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              My Applications
            </Link>
            <Link to="/student/documents" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Documents
            </Link>
            <Link to="/student/jobs" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Job Search
            </Link>
            <Link to="/student/academic" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Academic Profile
            </Link>
            <Link to="/student/profile" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Profile Settings
            </Link>
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
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
          <Route path="institutions" element={<InstitutionsView />} />
          <Route path="institutions/:institutionId" element={<InstitutionDetailsView />} />
          <Route path="academic" element={<AcademicProfile />} />
          {/* Add other routes with modernized components */}
        </Routes>
      </main>
    </div>
  );
}
