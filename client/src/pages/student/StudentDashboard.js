import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import JobBrowser from './JobBrowser';
import SchoolBrowser from './SchoolBrowser';
import PersonalizedDashboard from './PersonalizedDashboard';
import QualificationsManager from './QualificationsManager';
import Footer from '../../components/Footer';
import DashboardNavbar from '../../components/DashboardNavbar';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';

// Dashboard Home Component
function DashboardHome({ stats, loading, userData, recentApplications, recentJobs }) {

  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700 hover:border-primary-600 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
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
      <div className="text-3xl font-bold mb-1" style={{ color: '#ffffff' }}>
        {loading ? (
          <div className="h-9 w-20 bg-dark-500 rounded animate-pulse"></div>
        ) : (
          <span className="text-white">{(value !== undefined && value !== null) ? value.toLocaleString() : '0'}</span>
        )}
      </div>
      {description && (
        <div className="text-xs text-gray-400">{description}</div>
      )}
    </div>
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome back, {userData?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-secondary text-lg">
            Track your academic journey and career opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Applied Courses"
            value={stats.appliedCourses}
            description="Total course applications"
          />
          <StatCard
            title="Accepted"
            value={stats.acceptedApplications}
            change={12}
            description="Approved applications"
          />
          <StatCard
            title="Pending"
            value={stats.pendingApplications}
            description="Awaiting review"
          />
          <StatCard
            title="Completed Courses"
            value={stats.completedCourses}
            description="Courses finished"
          />
        </div>

        {/* Motivational Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quote 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 p-[1px] shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl p-6">
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Daily Inspiration</span>
                </div>
                
                <svg className="w-10 h-10 text-white/40 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>
              
              <p className="text-white text-lg font-semibold mb-4 leading-relaxed">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </p>
              
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm font-medium">— Winston Churchill</p>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-xs font-mono text-white">💪 Keep Going</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quote 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 p-[1px] shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-green-500/20 animate-pulse"></div>
            
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-2xl p-6">
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Words of Wisdom</span>
                </div>
                
                <svg className="w-10 h-10 text-white/40 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>
              
              <p className="text-white text-lg font-semibold mb-4 leading-relaxed">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-sm font-medium">— Nelson Mandela</p>
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-xs font-mono text-white">🎓 Stay Focused</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/student/personalized" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🎯 Personalized Opportunities
            </h2>
            <p className="text-blue-700 text-sm mb-4">
              Discover courses and jobs tailored to your qualifications
            </p>
            <div className="text-blue-600 text-sm font-medium">
              View Recommendations →
            </div>
          </Link>
          
          <Link to="/student/browse-jobs" className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              💼 Browse Jobs
            </h2>
            <p className="text-green-700 text-sm mb-4">
              Find career opportunities that match your skills
            </p>
            <div className="text-green-600 text-sm font-medium">
              Explore Jobs →
            </div>
          </Link>
          
          <Link to="/student/browse-schools" className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-6 border border-teal-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-teal-900 mb-2">
              🎓 Browse Schools
            </h2>
            <p className="text-teal-700 text-sm mb-4">
              Explore educational opportunities
            </p>
            <div className="text-teal-600 text-sm font-medium">
              Find Courses →
            </div>
          </Link>
        </div>

        {/* Additional Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/student/qualifications" className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-orange-900 mb-2">
              📋 My Qualifications
            </h2>
            <p className="text-orange-700 text-sm mb-4">
              Manage your academic and professional qualifications
            </p>
            <div className="text-orange-600 text-sm font-medium">
              Edit Qualifications →
            </div>
          </Link>
          
          <Link to="/student/applications" className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">
              📝 My Applications
            </h2>
            <p className="text-indigo-700 text-sm mb-4">
              Track your job and course applications
            </p>
            <div className="text-indigo-600 text-sm font-medium">
              View Applications →
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Recent Applications
            </h2>
            <div className="space-y-3">
              {loading ? (
                <>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                </>
              ) : recentApplications && recentApplications.length > 0 ? (
                recentApplications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-3 bg-white dark:bg-dark-200 rounded-lg hover:bg-blue-50 dark:hover:bg-dark-400 transition cursor-pointer border border-blue-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{app.courseName || app.jobTitle || 'Application'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className={`${
                        app.status === 'accepted' || app.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                        app.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No applications yet. Start exploring opportunities!</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-800/30 rounded-2xl p-6 border border-teal-200 dark:border-teal-700">
            <h2 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-4">
              Job Opportunities
            </h2>
            <div className="space-y-3">
              {loading ? (
                <>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-200 dark:bg-dark-500 rounded animate-pulse"></div>
                </>
              ) : recentJobs && recentJobs.length > 0 ? (
                recentJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="p-3 bg-white dark:bg-dark-200 rounded-lg hover:bg-teal-50 dark:hover:bg-dark-400 transition cursor-pointer border border-teal-100 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {job.title || 'Job Opportunity'} {job.companyName ? `- ${job.companyName}` : ''}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {job.type || 'Full-time'} • {job.location || 'Remote'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p>No job opportunities available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-dark-300 rounded-2xl p-6 border border-gray-600">
          <h2 className="text-lg font-semibold text-white mb-4">
            Your Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-secondary">Profile Completion</span>
                <span className="text-sm font-bold text-primary">
                  {(() => {
                    let completion = 0;
                    if (userData?.firstName) completion += 20;
                    if (userData?.lastName) completion += 20;
                    if (userData?.email) completion += 20;
                    if (userData?.currentGrade) completion += 20;
                    if (userData?.subjects && userData.subjects.length > 0) completion += 20;
                    return completion;
                  })()}%
                </span>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ 
                  width: `${(() => {
                    let completion = 0;
                    if (userData?.firstName) completion += 20;
                    if (userData?.lastName) completion += 20;
                    if (userData?.email) completion += 20;
                    if (userData?.currentGrade) completion += 20;
                    if (userData?.subjects && userData.subjects.length > 0) completion += 20;
                    return completion;
                  })()}%` 
                }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-secondary">Application Success Rate</span>
                <span className="text-sm font-bold text-primary">
                  {stats.appliedCourses > 0 
                    ? Math.round((stats.acceptedApplications / stats.appliedCourses) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-dark-500 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ 
                  width: `${stats.appliedCourses > 0 
                    ? Math.round((stats.acceptedApplications / stats.appliedCourses) * 100) 
                    : 0}%` 
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { userData, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    appliedCourses: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    completedCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?.uid) {
        console.log('No currentUser.uid, skipping stats fetch');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching stats for user:', currentUser.uid);
        
        // Fetch course applications
        const appsQuery = query(collection(db, 'applications'), where('studentId', '==', currentUser.uid));
        const appsSnapshot = await getDocs(appsQuery);
        const applications = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Applications found:', applications.length);
        
        // Fetch admissions (completed courses - students who were accepted and enrolled)
        const admissionsQuery = query(collection(db, 'admissions'), where('studentId', '==', currentUser.uid));
        const admissionsSnapshot = await getDocs(admissionsQuery);
        
        // Fetch recent jobs from Firebase
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activeJobs = allJobs
          .filter(job => job.status === 'active' || job.status === 'open' || job.isActive)
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          });
        
        // Sort applications by date
        const sortedApplications = applications.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        
        setRecentApplications(sortedApplications);
        setRecentJobs(activeJobs);
        
        const newStats = {
          appliedCourses: applications.length || 0,
          acceptedApplications: applications.filter(app => app.status === 'accepted' || app.status === 'approved').length || 0,
          pendingApplications: applications.filter(app => app.status === 'pending').length || 0,
          completedCourses: admissionsSnapshot.size || 0
        };
        console.log('Setting stats:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load statistics');
        // Set default values on error
        setStats({
          appliedCourses: 0,
          acceptedApplications: 0,
          pendingApplications: 0,
          completedCourses: 0
        });
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
    { path: '/student', label: 'Dashboard' },
    { path: '/student/personalized', label: 'Opportunities' },
    { path: '/student/institutions', label: 'Institutions' },
    { path: '/student/applications', label: 'My Applications' },
    { path: '/student/documents', label: 'Documents' },
    { path: '/student/browse-jobs', label: 'Jobs' },
    { path: '/student/browse-schools', label: 'Courses' },
    { path: '/student/qualifications', label: 'Qualifications' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
      {/* Top Navbar */}
      <DashboardNavbar role="student" navItems={navItems} onLogout={handleLogout} />
      
      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<DashboardHome stats={stats} loading={loading} userData={userData} recentApplications={recentApplications} recentJobs={recentJobs} />} />
            <Route path="personalized" element={<PersonalizedDashboard />} />
            <Route path="institutions" element={<InstitutionsView />} />
            <Route path="institutions/:institutionId" element={<InstitutionDetailsView />} />
            <Route path="applications" element={<ApplicationsView />} />
            <Route path="documents" element={<DocumentsView />} />
            <Route path="browse-jobs" element={<JobBrowser />} />
            <Route path="browse-schools" element={<SchoolBrowser />} />
            <Route path="qualifications" element={<QualificationsManager />} />
            <Route path="profile" element={<ProfileView />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
}

// Sub-components
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
      <h1 className="text-3xl font-bold text-primary mb-6">Browse Institutions</h1>
      
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
          className="px-4 py-2 border rounded-lg"
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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary">Loading institutions...</p>
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-400 mb-4">No institutions found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInstitutions.map((institution) => (
            <div key={institution.id} className="bg-dark-300 rounded-xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">{institution.name}</h3>
                <p className="text-sm text-gray-400">{institution.location}</p>
              </div>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{institution.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary capitalize">
                  {institution.type || 'University'}
                </span>
                <Link 
                  to={`/student/institutions/${institution.id}`}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 text-sm"
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

function InstitutionDetailsView() {
  const { institutionId } = useParams();
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data for institution ID:', institutionId);
        
        // Fetch institution details
        const instQuery = query(collection(db, 'institutions'), where('__name__', '==', institutionId));
        const instSnapshot = await getDocs(instQuery);
        if (!instSnapshot.empty) {
          const instData = { id: instSnapshot.docs[0].id, ...instSnapshot.docs[0].data() };
          console.log('Institution data:', instData);
          setInstitution(instData);
        } else {
          console.warn('No institution found with ID:', institutionId);
        }

        // Fetch courses for this institution
        const coursesQuery = query(
          collection(db, 'courses'),
          where('institutionId', '==', institutionId)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Courses found for institution:', coursesData.length, coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching institution details:', error);
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

    // Check if already applied
    try {
      const existingQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', currentUser.uid),
        where('courseId', '==', course.id)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        toast.error('You have already applied to this course');
        return;
      }

      // Check max 2 applications per institution
      const instAppsQuery = query(
        collection(db, 'applications'),
        where('studentId', '==', currentUser.uid),
        where('institutionId', '==', course.institutionId || institutionId)
      );
      const instAppsSnapshot = await getDocs(instAppsQuery);
      
      if (instAppsSnapshot.size >= 2) {
        toast.error('You can only apply to 2 courses per institution');
        return;
      }

      setApplying(true);
      
      // Add application with ownerId (the institution's user ID) for proper visibility
      await addDoc(collection(db, 'applications'), {
        studentId: currentUser.uid,
        studentName: `${userData.firstName} ${userData.lastName}`,
        studentEmail: userData.email,
        institutionId: institutionId,
        ownerId: institution.ownerId || institutionId, // This is important for institution's view
        institutionName: institution.name,
        courseId: course.id,
        courseName: course.title,
        status: 'pending',
        createdAt: serverTimestamp(),
        type: 'course', // Specify this is a course application
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
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-secondary">Loading institution details...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Institution not found</p>
        <Link to="/student/institutions" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Institutions
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/student/institutions" className="text-primary-600 hover:underline mb-4 inline-block">
        ← Back to Institutions
      </Link>
      
      <div className="bg-dark-300 rounded-2xl p-8 border border-gray-600 mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">{institution.name}</h1>
        <p className="text-gray-400 mb-4">{institution.location}</p>
        <p className="text-gray-300 mb-6">{institution.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Type:</span> {institution.type}
          </div>
          <div>
            <span className="font-medium">Established:</span> {institution.established}
          </div>
          {institution.website && (
            <div>
              <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary mb-4">Available Courses ({courses.length})</h2>

      {courses.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-400">No courses available at this institution</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="card-glass p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-primary mb-2">{course.title}</h3>
                  <p className="text-sm text-secondary mb-3">{course.field} • {course.level} • {course.duration}</p>
                  <p className="text-sm text-gray-300 mb-4">{course.description}</p>
                  
                  {course.fees && (
                    <div className="text-sm font-medium text-gray-300 mb-2">
                      <span className="font-medium text-primary">Fees:</span>
                      {typeof course.fees === 'object' ? (
                        <div className="ml-2">
                          {course.fees.local && <div>Local: M{course.fees.local}/year</div>}
                          {course.fees.international && <div>International: {course.fees.currency || 'M'}{course.fees.international}/year</div>}
                        </div>
                      ) : (
                        <span> M{course.fees}/year</span>
                      )}
                    </div>
                  )}
                  
                  {course.requirements && (
                    <div className="text-sm text-gray-300">
                      <span className="font-medium">Requirements:</span>
                      {typeof course.requirements === 'object' && !Array.isArray(course.requirements) ? (
                        <ul className="list-disc list-inside ml-2">
                          {course.requirements.minimumPoints && (
                            <li>Minimum Points: {course.requirements.minimumPoints}</li>
                          )}
                          {course.requirements.minimumGrade && (
                            <li>Minimum Grade: {course.requirements.minimumGrade}</li>
                          )}
                          {course.requirements.subjects && Array.isArray(course.requirements.subjects) && (
                            <li>Required Subjects: {course.requirements.subjects.join(', ')}</li>
                          )}
                          {course.requirements.entranceExam && (
                            <li>Entrance Exam: {course.requirements.entranceExam ? 'Required' : 'Not Required'}</li>
                          )}
                        </ul>
                      ) : Array.isArray(course.requirements) ? (
                        <ul className="list-disc list-inside ml-2">
                          {course.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="ml-2">{String(course.requirements)}</div>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleApply(course)}
                  disabled={applying || hasTertiaryLevel()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 ml-4"
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

function ApplicationsView() {
  const { userData, currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        const appsQuery = query(
          collection(db, 'applications'),
          where('studentId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(appsQuery);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-success-100 text-success-700';
      case 'rejected': return 'bg-error-100 text-error-700';
      default: return 'bg-warning-100 text-warning-700';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">My Applications</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-400 mb-4">No applications yet. Browse institutions to apply!</p>
          <Link to="/student/institutions" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Browse Institutions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="card-glass p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-primary">{app.courseName}</h3>
                  <p className="text-sm text-secondary">{app.institutionName}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Applied: {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                  {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsView() {
  const { userData, currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('transcript');

  useEffect(() => {
    fetchDocuments();
  }, [currentUser]);

  const fetchDocuments = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setLoading(true);
      const docsQuery = query(
        collection(db, 'documents'),
        where('studentId', '==', currentUser.uid),
        orderBy('uploadedAt', 'desc')
      );
      const snapshot = await getDocs(docsQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      setUploading(true);
      
      const storageRef = ref(storage, `documents/${currentUser.uid}/${documentType}_${Date.now()}_${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'documents'), {
        studentId: currentUser.uid,
        documentType,
        fileName: selectedFile.name,
        fileUrl: downloadURL,
        uploadedAt: serverTimestamp()
      });

      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, fileUrl) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, 'documents', docId));

      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">My Documents</h1>
      
      <div className="card-glass p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Upload New Document</h2>
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
            <label className="block text-sm font-medium mb-2">Select File (PDF, JPG, PNG)</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button 
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-400">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((document) => (
            <div key={document.id} className="bg-dark-300 rounded-xl p-6 border border-gray-700">
              <div className="mb-4">
                <h3 className="font-semibold text-white mb-1">{document.fileName}</h3>
                <p className="text-sm text-gray-400">
                  {document.documentType} • {document.uploadedAt?.toDate ? document.uploadedAt.toDate().toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <a 
                  href={document.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  View
                </a>
                <button 
                  onClick={() => handleDelete(document.id, document.fileUrl)}
                  className="px-4 py-2 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-colors"
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

function ProfileView() {
  const { userData, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp()
      });

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">My Profile</h1>
      <div className="card-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg" 
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-dark-400" 
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg" 
              placeholder="+266 5800 0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg" 
              placeholder="Maseru, Lesotho"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input 
              type="date" 
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg" 
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
