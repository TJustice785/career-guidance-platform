import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase.config';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import DashboardNavbar from '../../components/DashboardNavbar';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';
import Footer from '../../components/Footer';

// Dashboard Home Component
function DashboardHome({ stats, loading, userData, recentApplications }) {
  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-dark-300 rounded-2xl p-6 border border-gray-700 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-300 uppercase tracking-wide">
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
      {description && <div className="text-xs text-gray-300">{description}</div>}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome, {userData?.name || 'Company'}! 🏢
        </h1>
        <p className="text-secondary text-lg">Manage your job postings and find qualified candidates</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          change={8}
          description="Currently open positions"
        />
        <StatCard
          title="Total Applications"
          value={stats.totalApplications}
          change={15}
          description="All time applications"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          description="Under review"
        />
        <StatCard
          title="Hired"
          value={stats.hired}
          change={12}
          description="This month"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card-glass animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Recent Applications</h2>
            <Link to="/company/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
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
            ) : recentApplications.length > 0 ? (
              recentApplications.map((app) => {
                const statusConfig = {
                  pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
                  reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reviewing' },
                  shortlisted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Shortlisted' },
                  hired: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hired' },
                  accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
                  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
                };
                
                const status = statusConfig[app.status] || statusConfig.pending;
                
                return (
                  <div key={app.id} className="p-4 bg-dark-200 rounded-lg hover:bg-dark-400 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-primary">{app.studentName || 'Unknown Applicant'}</p>
                        <p className="text-sm text-secondary">{app.jobTitle || 'Job Position'}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {app.qualifications?.currentGrade || 'Qualifications not specified'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs rounded-full`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 bg-dark-200 rounded-lg text-center">
                <p className="text-gray-400">No recent applications</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/company/jobs/new" className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center">
              Post New Job
            </Link>
            <Link to="/company/jobs" className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center">
              Manage Jobs
            </Link>
            <Link to="/company/applications" className="block w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium text-center">
              View Applications
            </Link>
            <Link to="/company/profile" className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center">
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDashboard() {
  const { userData, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('=== Fetching Company Dashboard Stats ===');
        console.log('UserData:', userData);
        console.log('CurrentUser UID:', currentUser?.uid);
        
        if (!userData || !currentUser) {
          console.log('⏳ No userData or currentUser yet');
          setLoading(false);
          return;
        }

        // Strategy: Try multiple ways to find company jobs (same as JobsManagement)
        let companyIds = [];
        
        // 1. Try to find company document by matching companyName or email
        try {
          const companiesSnapshot = await getDocs(collection(db, 'companies'));
          companiesSnapshot.docs.forEach(doc => {
            const companyData = doc.data();
            if (companyData.name === userData.companyName || 
                companyData.companyName === userData.companyName ||
                companyData.email === userData.email) {
              console.log(`✓ Found matching company document: ${doc.id} - ${companyData.name}`);
              companyIds.push(doc.id);
            }
          });
        } catch (error) {
          console.log('Could not search companies collection:', error);
        }
        
        // 2. Add user's UID (for jobs created via the form)
        companyIds.push(currentUser.uid); // Use currentUser.uid instead of userData.uid
        companyIds.push(userData.id);
        if (userData.companyId) companyIds.push(userData.companyId);
        
        // Remove duplicates
        companyIds = [...new Set(companyIds.filter(Boolean))];
        console.log('✓ Using company IDs for stats:', companyIds);
        
        // Fetch ALL jobs and applications, then filter
        const [allJobsSnapshot, jobApplicationsSnapshot, applicationsSnapshot] = await Promise.all([
          getDocs(collection(db, 'jobs')),
          getDocs(collection(db, 'jobApplications')),
          getDocs(collection(db, 'applications'))
        ]);

        // Filter jobs
        const allJobs = allJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const jobs = allJobs.filter(job => 
          companyIds.includes(job.companyId) ||
          job.companyName === userData.companyName ||
          job.companyName === userData.name
        );
        
        // Combine applications from both collections
        const jobApplications = jobApplicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const applicationsFromAppsCollection = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const allApplications = [...jobApplications, ...applicationsFromAppsCollection];
        
        // Filter applications
        const applications = allApplications.filter(app =>
          companyIds.includes(app.companyId) ||
          jobs.some(job => job.id === app.jobId) // Include apps for our jobs
        );
        
        console.log(`✓ Found ${jobs.length} jobs and ${applications.length} applications`);

        // Sort applications by date (most recent first) and take top 3
        const sortedApplications = applications.sort((a, b) => {
          const dateA = a.appliedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.appliedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });
        
        setRecentApplications(sortedApplications.slice(0, 3));

        // Calculate stats
        const activeJobs = jobs.filter(job => job.status === 'active' || job.status === 'open' || job.isActive).length;
        const totalApplications = applications.length;
        const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
        const hired = applications.filter(app => app.status === 'hired' || app.status === 'accepted').length;

        const calculatedStats = {
          activeJobs,
          totalApplications,
          shortlisted,
          hired
        };
        
        console.log('✓ Calculated stats:', calculatedStats);

        setStats(calculatedStats);
      } catch (error) {
        console.error('❌ Error fetching company stats:', error);
        console.error('Error details:', error.message);
        // Set stats to 0 instead of fake data
        setStats({
          activeJobs: 0,
          totalApplications: 0,
          shortlisted: 0,
          hired: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (userData && currentUser) {
      fetchStats();
    } else {
      console.log('⏳ Waiting for userData and currentUser...');
      setLoading(false);
    }
  }, [userData, currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/company', label: 'Dashboard' },
    { path: '/company/jobs', label: 'Job Postings' },
    { path: '/company/applications', label: 'Applications' },
    { path: '/company/candidates', label: 'Candidates' },
    { path: '/company/profile', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
      {/* Top Navbar */}
      <DashboardNavbar role="company" navItems={navItems} onLogout={handleLogout} />
      
      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<DashboardHome stats={stats} loading={loading} userData={userData} recentApplications={recentApplications} />} />
            <Route path="jobs" element={<JobsManagement />} />
            <Route path="jobs/new" element={<NewJobForm />} />
            <Route path="jobs/edit/:jobId" element={<EditJobForm />} />
            <Route path="applications" element={<ApplicationsView />} />
            <Route path="candidates" element={<CandidatesView />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
}

// Sub-components
function JobsManagement() {
  const { userData, currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        console.log('=== JobsManagement Debug ===');
        console.log('Full userData:', JSON.stringify(userData, null, 2));
        console.log('CurrentUser UID:', currentUser?.uid);
        
        if (!userData || !currentUser) {
          console.log('⏳ No userData or currentUser yet');
          setLoading(false);
          return;
        }

        // Strategy: Try multiple ways to find company jobs
        let companyIds = [];
        
        // 1. Try to find company document by matching companyName or email
        try {
          const companiesSnapshot = await getDocs(collection(db, 'companies'));
          companiesSnapshot.docs.forEach(doc => {
            const companyData = doc.data();
            // Match by company name or email
            if (companyData.name === userData.companyName || 
                companyData.companyName === userData.companyName ||
                companyData.email === userData.email) {
              console.log(`✓ Found matching company document: ${doc.id} - ${companyData.name}`);
              companyIds.push(doc.id);
            }
          });
        } catch (error) {
          console.log('Could not search companies collection:', error);
        }
        
        // 2. Add user's UID (for jobs created via the form)
        companyIds.push(currentUser.uid); // Use currentUser.uid instead of userData.uid
        companyIds.push(userData.id);
        if (userData.companyId) companyIds.push(userData.companyId);
        
        // Remove duplicates
        companyIds = [...new Set(companyIds.filter(Boolean))];
        
        console.log('✓ Using company IDs:', companyIds);

        // Fetch ALL jobs first to debug
        const allJobsSnapshot = await getDocs(collection(db, 'jobs'));
        console.log('=== ALL Jobs in Database ===');
        allJobsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log(`Job ID: ${doc.id}, Title: ${data.title}, CompanyId: ${data.companyId}`);
        });

        // Fetch jobs matching any of the company IDs
        const allJobs = allJobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const matchingJobs = allJobs.filter(job => 
          companyIds.includes(job.companyId) ||
          job.companyName === userData.companyName ||
          job.companyName === userData.name
        );

        console.log(`✓ Found ${matchingJobs.length} matching jobs out of ${allJobs.length} total`);

        // Fetch applications count
        const applicationsSnapshot = await getDocs(collection(db, 'jobApplications'));
        const applicationsByJob = {};
        applicationsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const jobId = data.jobId;
          if (!applicationsByJob[jobId]) {
            applicationsByJob[jobId] = 0;
          }
          applicationsByJob[jobId]++;
        });

        const jobsData = matchingJobs.map(job => ({
          ...job,
          applicationsCount: applicationsByJob[job.id] || 0
        }));

        console.log('✓ Setting jobs to state:', jobsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && currentUser) {
      fetchJobs();
    } else {
      console.log('⏳ Waiting for userData and currentUser...');
      setLoading(false);
    }
  }, [userData, currentUser]);

  const navigate = useNavigate();
  const [viewingJob, setViewingJob] = useState(null);

  const handleView = (job) => {
    setViewingJob(job);
  };

  const handleEdit = (jobId) => {
    navigate(`/company/jobs/edit/${jobId}`);
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(prev => prev.filter(job => job.id !== jobId));
      console.log(`✓ Deleted job: ${jobId}`);
      alert('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job: ' + error.message);
    }
  };

  const handleToggleActive = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        isActive: newStatus === 'active',
        updatedAt: new Date()
      });
      
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus, isActive: newStatus === 'active' } : job
      ));
      
      console.log(`✓ Updated job ${jobId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status: ' + error.message);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Job Postings</h1>
      <div className="card-glass p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
          />
          <Link to="/company/jobs/new" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap">
            Post New Job
          </Link>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `No jobs found matching "${searchTerm}"` : 'No job postings yet'}
              </p>
              {!searchTerm && (
                <Link to="/company/jobs/new" className="text-primary-600 hover:text-primary-700 font-medium">
                  Post your first job →
                </Link>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-primary">{job.title || 'Untitled Position'}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.location && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                          {job.location}
                        </span>
                      )}
                      {job.type && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                          {job.type}
                        </span>
                      )}
                      {job.salary && (
                        <span className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                          {typeof job.salary === 'object' 
                            ? `${job.salary.currency || 'M'}${job.salary.min}-${job.salary.max}`
                            : job.salary}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary mt-2">
                      Applications: {job.applicationsCount} • Posted: {getTimeAgo(job.createdAt || job.postedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button 
                      onClick={() => handleToggleActive(job.id, job.status)}
                      className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
                        job.status === 'active' || job.status === 'open' || job.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {job.status === 'active' || job.status === 'open' || job.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button 
                      onClick={() => handleView(job)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(job.id)}
                      className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id, job.title)}
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

      {/* View Job Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setViewingJob(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{viewingJob.title}</h2>
                <button
                  onClick={() => setViewingJob(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Location</h3>
                  <p className="text-gray-900 dark:text-white mt-1">{viewingJob.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Job Type</h3>
                  <p className="text-gray-900 dark:text-white mt-1">{viewingJob.type || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Salary</h3>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {viewingJob.salary 
                      ? (typeof viewingJob.salary === 'object' 
                          ? `${viewingJob.salary.currency || 'M'}${viewingJob.salary.min}-${viewingJob.salary.max}`
                          : viewingJob.salary)
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Industry</h3>
                  <p className="text-gray-900 dark:text-white mt-1">{viewingJob.industry || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Deadline</h3>
                  <p className="text-gray-900 dark:text-white mt-1">{viewingJob.deadline || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</h3>
                  <p className="text-gray-900 dark:text-white mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      viewingJob.status === 'active' || viewingJob.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {viewingJob.status === 'active' || viewingJob.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Job Description</h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{viewingJob.description || 'No description provided'}</p>
              </div>

              {/* Qualifications */}
              {viewingJob.qualifications && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Qualifications</h3>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{viewingJob.qualifications}</p>
                </div>
              )}

              {/* Applications */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Applications</h3>
                <p className="text-gray-900 dark:text-white">{viewingJob.applicationsCount || 0} applications received</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
              <button
                onClick={() => setViewingJob(null)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(viewingJob.id);
                  setViewingJob(null);
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewJobForm() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    industry: '',
    salary: '',
    qualifications: '',
    description: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData || !currentUser) {
        alert('User data not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Check if company is suspended
      if (userData.status === 'suspended' || userData.isActive === false) {
        alert('Your company account is suspended. Contact admin to reactivate.');
        setLoading(false);
        return;
      }

      console.log('Posting job with userData:', userData);
      console.log('Current user:', currentUser);
      console.log('Current user UID:', currentUser?.uid);

      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      // Use currentUser.uid as companyId (userData doesn't contain uid)
      // Fallback: try to get from multiple sources
      const companyId = currentUser?.uid || userData?.uid || userData?.id;
      
      if (!companyId) {
        throw new Error('Unable to determine company ID. Please ensure you are logged in properly.');
      }
      
      const companyName = userData.name || userData.companyName || userData.email || 'Unknown Company';
      
      console.log('Using companyId:', companyId);
      
      const jobData = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        industry: formData.industry,
        salary: formData.salary,
        qualifications: formData.qualifications,
        description: formData.description,
        deadline: formData.deadline || null,
        companyId: companyId,
        companyName: companyName,
        status: 'active',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Creating job with data:', jobData);

      await addDoc(collection(db, 'jobs'), jobData);
      
      alert('Job posted successfully!');
      navigate('/company/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Post New Job</h1>
      <div className="card-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="e.g. Software Developer" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="e.g. Maseru" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type *</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry *</label>
            <select 
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              required
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Mining">Mining</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
            <input 
              type="text" 
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="e.g. M15,000 - M25,000" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Qualifications *</label>
            <textarea 
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows="3" 
              placeholder="List required qualifications..." 
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description *</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows="6" 
              placeholder="Describe the role, responsibilities, and requirements..." 
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Deadline</label>
            <input 
              type="date" 
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <Link to="/company/jobs" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditJobForm() {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    industry: '',
    salary: '',
    qualifications: '',
    description: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetchingJob(true);
        const jobDoc = await getDoc(doc(db, 'jobs', jobId));
        
        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          setFormData({
            title: jobData.title || '',
            location: jobData.location || '',
            type: jobData.type || '',
            industry: jobData.industry || '',
            salary: typeof jobData.salary === 'object' 
              ? `${jobData.salary.currency || 'M'}${jobData.salary.min}-${jobData.salary.max}`
              : jobData.salary || '',
            qualifications: jobData.qualifications || '',
            description: jobData.description || '',
            deadline: jobData.deadline || ''
          });
        } else {
          alert('Job not found');
          navigate('/company/jobs');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        alert('Failed to load job: ' + error.message);
      } finally {
        setFetchingJob(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData || !currentUser) {
        alert('User data not found. Please log in again.');
        setLoading(false);
        return;
      }

      const jobData = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        industry: formData.industry,
        salary: formData.salary,
        qualifications: formData.qualifications,
        description: formData.description,
        deadline: formData.deadline || null,
        updatedAt: new Date()
      };

      console.log('Updating job with data:', jobData);

      await updateDoc(doc(db, 'jobs', jobId), jobData);
      
      alert('Job updated successfully!');
      navigate('/company/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Edit Job</h1>
      <div className="card-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              placeholder="e.g. Software Developer" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location *</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="e.g. Maseru" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type *</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
              <input 
                type="text" 
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="e.g. Technology" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
              <input 
                type="text" 
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                placeholder="e.g. M4000-M5000" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Qualifications</label>
            <textarea 
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows="4" 
              placeholder="Required qualifications and skills..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description *</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
              rows="6" 
              placeholder="Describe the role, responsibilities, and requirements..." 
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Deadline</label>
            <input 
              type="date" 
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : 'Update Job'}
            </button>
            <Link to="/company/jobs" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplicationsView() {
  const { userData, currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use currentUser.uid as the primary source for companyId
        const companyId = currentUser?.uid || userData?.uid || userData?.id || userData?.companyId;
        
        if (!companyId) {
          console.warn('No company ID found for applications');
          setLoading(false);
          return;
        }

        console.log('Fetching applications for company ID:', companyId);

        // First, fetch all company's jobs
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter jobs by companyId
        const jobsData = allJobs.filter(job => job.companyId === companyId);
        const jobIds = jobsData.map(job => job.id);
        
        console.log(`✓ Found ${jobsData.length} jobs for company:`, jobIds);

        // Fetch ALL applications from both possible collections
        const [jobApplicationsSnapshot, applicationsSnapshot] = await Promise.all([
          getDocs(collection(db, 'jobApplications')),
          getDocs(collection(db, 'applications'))
        ]);
        
        const jobApplications = jobApplicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const applications = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Combine both collections
        const allApplications = [...jobApplications, ...applications];
        
        console.log(`Found ${jobApplications.length} in 'jobApplications' collection`);
        console.log(`Found ${applications.length} in 'applications' collection`);
        
        console.log('=== ALL Applications in Database ===');
        console.log('Total applications found:', allApplications.length);
        allApplications.forEach(app => {
          console.log(`App ID: ${app.id}`);
          console.log(`  - JobId: ${app.jobId} (match: ${jobIds.includes(app.jobId)})`);
          console.log(`  - CompanyId: ${app.companyId} (match: ${app.companyId === companyId})`);
          console.log(`  - Student: ${app.studentName || app.studentEmail}`);
          console.log(`  - Status: ${app.status}`);
        });
        
        console.log('\n=== Matching Logic ===');
        console.log('Looking for companyId:', companyId);
        console.log('Looking for jobIds:', jobIds);
        
        // Match applications by either companyId OR jobId
        const applicationsData = allApplications.filter(app => {
          const matchesCompanyId = app.companyId === companyId;
          const matchesJobId = jobIds.includes(app.jobId);
          const matches = matchesCompanyId || matchesJobId;
          
          if (matches) {
            console.log(`✓ MATCHED: App ${app.id} - companyId match: ${matchesCompanyId}, jobId match: ${matchesJobId}`);
          }
          
          return matches;
        });

        console.log(`\n✓ Found ${applicationsData.length} applications matching company or job IDs`);
        
        setJobs(jobsData);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && currentUser) {
      fetchData();
    } else {
      console.log('⏳ Waiting for userData and currentUser...');
      setLoading(false);
    }
  }, [userData, currentUser]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      console.log(`✓ Updated application ${applicationId} to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status: ' + error.message);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJob === 'all' || app.jobId === selectedJob;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesSearch = !searchTerm || 
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const hours = Math.floor((new Date() - date) / (1000 * 60 * 60));
    if (hours === 0) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const statusConfig = {
    pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
    reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reviewing' },
    shortlisted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Shortlisted' },
    hired: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Hired' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Job Applications</h1>
      <div className="card-glass p-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <select 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <select 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
          <input 
            type="text" 
            placeholder="Search candidates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
          />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {applications.length === 0 
                  ? 'No applications received yet' 
                  : 'No applications match your filters'}
              </p>
              <p className="text-sm text-gray-400 mt-4">
                You have {jobs.length} active job{jobs.length !== 1 ? 's' : ''} posted
              </p>
              {jobs.length === 0 && (
                <Link to="/company/jobs/new" className="inline-block mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Post Your First Job
                </Link>
              )}
            </div>
          ) : (
            filteredApplications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              
              return (
                <div key={app.id} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{app.studentName || 'Unknown Applicant'}</h3>
                      <p className="text-sm text-secondary">Applied for: {app.jobTitle || 'Unknown Position'}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {app.qualifications?.currentGrade && (
                          <span className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                            {app.qualifications.currentGrade}
                          </span>
                        )}
                        {app.qualifications?.subjects && app.qualifications.subjects.length > 0 && (
                          <span className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-full">
                            {app.qualifications.subjects.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Applied: {getTimeAgo(app.appliedAt || app.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs rounded-full text-center`}>
                        {status.label}
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {app.status !== 'shortlisted' && app.status !== 'hired' && (
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors"
                          >
                            Shortlist
                          </button>
                        )}
                        {app.status === 'shortlisted' && (
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'hired')}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                          >
                            Hire
                          </button>
                        )}
                        {app.status !== 'rejected' && app.status !== 'hired' && (
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        )}
                        {(app.status === 'rejected' || app.status === 'hired') && (
                          <button 
                            onClick={() => handleStatusUpdate(app.id, 'pending')}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
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

function CandidatesView() {
  const { userData, currentUser } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const companyId = currentUser?.uid || userData?.uid || userData?.id;
        
        if (!companyId) {
          console.warn('No company ID found for candidates');
          setLoading(false);
          return;
        }

        // Fetch ALL applications from both possible collections
        const [jobApplicationsSnapshot, applicationsSnapshot] = await Promise.all([
          getDocs(collection(db, 'jobApplications')),
          getDocs(collection(db, 'applications'))
        ]);
        
        const jobApplications = jobApplicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const applications = applicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Combine both collections
        const allApplications = [...jobApplications, ...applications];

        // Fetch company's jobs
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const allJobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const jobsData = allJobs.filter(job => job.companyId === companyId);
        const jobIds = jobsData.map(job => job.id);

        // Filter applications by companyId or jobId
        const companyApplications = allApplications.filter(app => 
          app.companyId === companyId || jobIds.includes(app.jobId)
        );

        // Create unique candidates list
        const candidatesMap = new Map();
        
        companyApplications.forEach(app => {
          const candidateId = app.studentId || app.studentEmail;
          
          if (!candidatesMap.has(candidateId)) {
            candidatesMap.set(candidateId, {
              id: candidateId,
              name: app.studentName || 'Unknown',
              email: app.studentEmail || '',
              phone: app.studentPhone || app.phone || '',
              currentGrade: app.currentGrade || app.qualifications?.currentGrade || '',
              subjects: app.subjects || app.qualifications?.subjects || [],
              skills: app.skills || [],
              certifications: app.certifications || [],
              languages: app.languages || [],
              workExperience: app.workExperience || [],
              credits: app.credits || 0,
              totalApplications: 1,
              appliedJobs: [app.jobTitle || app.jobId],
              latestStatus: app.status || 'pending',
              lastApplied: app.appliedAt || app.createdAt
            });
          } else {
            // Update existing candidate
            const existing = candidatesMap.get(candidateId);
            existing.totalApplications++;
            if (app.jobTitle && !existing.appliedJobs.includes(app.jobTitle)) {
              existing.appliedJobs.push(app.jobTitle);
            }
            // Keep most recent application date
            const newDate = app.appliedAt || app.createdAt;
            if (newDate && (!existing.lastApplied || newDate > existing.lastApplied)) {
              existing.lastApplied = newDate;
              existing.latestStatus = app.status;
            }
          }
        });

        setCandidates(Array.from(candidatesMap.values()));
        console.log(`✓ Found ${candidatesMap.size} unique candidates`);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && currentUser) {
      fetchCandidates();
    }
  }, [userData, currentUser]);

  // Get unique qualifications for filter
  const qualifications = [...new Set(candidates.map(c => c.currentGrade).filter(Boolean))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      candidate.subjects?.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesQualification = selectedQualification === 'all' || 
      candidate.currentGrade === selectedQualification;
    
    return matchesSearch && matchesQualification;
  });

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const statusConfig = {
    pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
    reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Reviewing' },
    shortlisted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Shortlisted' },
    hired: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Hired' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Candidate Database</h1>
      <div className="card-glass p-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Search by name, skills, qualifications..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
          />
          <select 
            value={selectedQualification}
            onChange={(e) => setSelectedQualification(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Qualifications</option>
            {qualifications.map(qual => (
              <option key={qual} value={qual}>{qual}</option>
            ))}
          </select>
        </div>
        
        <p className="text-secondary mb-6">
          {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found from your applicant pool
        </p>

        {/* Candidates List */}
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              {candidates.length === 0 
                ? 'No candidates yet. Start receiving applications to build your candidate pool.' 
                : 'No candidates match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => {
              const status = statusConfig[candidate.latestStatus] || statusConfig.pending;
              
              return (
                <div key={candidate.id} className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary">{candidate.name}</h3>
                      <p className="text-sm text-secondary">{candidate.email}</p>
                      {candidate.phone && (
                        <p className="text-sm text-secondary">📞 {candidate.phone}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 ${status.bg} ${status.text} text-xs rounded-full`}>
                        {status.label}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last active: {getTimeAgo(candidate.lastApplied)}
                      </p>
                    </div>
                  </div>

                  {/* Qualifications */}
                  {candidate.currentGrade && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Education</h4>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-sm rounded-full">
                        🎓 {candidate.currentGrade}
                      </span>
                      {candidate.credits > 0 && (
                        <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm rounded-full">
                          ✓ {candidate.credits} Credits
                        </span>
                      )}
                    </div>
                  )}

                  {/* Subjects */}
                  {candidate.subjects && candidate.subjects.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.subjects.slice(0, 5).map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded">
                            {subject}
                          </span>
                        ))}
                        {candidate.subjects.length > 5 && (
                          <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                            +{candidate.subjects.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Skills & Certifications */}
                  <div className="flex flex-wrap gap-4 mb-3">
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-xs text-gray-500">+{candidate.skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {candidate.certifications && candidate.certifications.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Certifications</h4>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs rounded">
                          {candidate.certifications.length} Certification{candidate.certifications.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Applications Summary */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>{candidate.totalApplications}</strong> application{candidate.totalApplications !== 1 ? 's' : ''} submitted
                      {candidate.appliedJobs.length > 0 && (
                        <span className="ml-2">
                          • Applied to: <strong>{candidate.appliedJobs.slice(0, 2).join(', ')}</strong>
                          {candidate.appliedJobs.length > 2 && ` +${candidate.appliedJobs.length - 2} more`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Company Profile</h1>
      <div className="card-glass p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Enter company name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <select className="w-full px-4 py-2 border rounded-lg">
              <option>Technology</option>
              <option>Finance</option>
              <option>Education</option>
              <option>Healthcare</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea className="w-full px-4 py-2 border rounded-lg" rows="4" placeholder="Company description"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Company address" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input type="tel" className="w-full px-4 py-2 border rounded-lg" placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input type="url" className="w-full px-4 py-2 border rounded-lg" placeholder="https://yoursite.co.ls" />
          </div>
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
