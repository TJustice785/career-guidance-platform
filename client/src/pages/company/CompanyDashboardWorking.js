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
          Welcome, {userData?.companyName || userData?.fullName || 'Company'}! 🏢
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link to="/company/jobs/new" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Post New Job</h3>
          <p className="text-primary-100">Create a new job posting</p>
        </Link>
        <Link to="/company/applications" className="bg-gradient-to-br from-success-500 to-success-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">View Applications</h3>
          <p className="text-success-100">Review candidate applications</p>
        </Link>
        <Link to="/company/jobs" className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold mb-2">Manage Jobs</h3>
          <p className="text-secondary-100">Edit or remove job postings</p>
        </Link>
      </div>
    </div>
  );
}

// Jobs Management Component with CRUD
function JobsManagement() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const companyId = userData?.companyId || userData?.uid;
      const apiService = await import('../../services/api').then(module => module.default);
      const response = await apiService.jobs.getAll({
        companyId,
        status: 'all' // Get all jobs for the company
      });
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      toast.success('Job deleted successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Job Postings</h1>
        <Link
          to="/company/jobs/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Post New Job
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'No jobs found matching your search.' : 'No jobs posted yet.'}
          </p>
          {!searchTerm && (
            <Link
              to="/company/jobs/new"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Post Your First Job
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                      {job.type || 'Full-time'}
                    </span>
                    {job.salary && (
                      <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Applications: {job.applicationsCount || 0} • Posted: {job.createdAt ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="px-3 py-1 bg-success-100 text-success-700 text-sm rounded-full">
                    {job.status || 'Active'}
                  </span>
                  <Link
                    to={`/company/jobs/edit/${job.id}`}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-4 py-2 text-sm font-medium text-error-600 bg-error-50 rounded-lg hover:bg-error-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// New Job Form Component with CREATE
function NewJobForm() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    industry: '',
    salary: '',
    requirements: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiService = await import('../../services/api').then(module => module.default);
      await apiService.jobs.create({
        ...formData,
        companyId: userData?.companyId || userData?.uid,
        companyName: userData?.companyName || userData?.fullName,
        status: 'active',
        applicationsCount: 0,
        viewsCount: 0
      });

      toast.success('Job posted successfully!');
      navigate('/company/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to post job');
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. Software Developer"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Maseru"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Industry *</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select industry</option>
              <option>Technology</option>
              <option>Finance</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Manufacturing</option>
              <option>Retail</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. M15,000 - M25,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required Qualifications *</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="List required qualifications..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="6"
              placeholder="Describe the role, responsibilities, and requirements..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Job'}
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
      const companyId = userData?.companyId || userData?.uid;
      const apiService = await import('../../services/api').then(module => module.default);
      const response = await apiService.applications.getByCompany(companyId);
      setApplications(response.data.data || []);
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
      <h1 className="text-3xl font-bold text-primary mb-6">Job Applications</h1>
      
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
          <option value="shortlisted">Shortlisted</option>
          <option value="accepted">Accepted</option>
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
                  <p className="text-sm text-gray-600 mt-1">Applied for: {app.jobTitle}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-1 text-sm rounded-full text-center ${
                    app.status === 'accepted' ? 'bg-success-100 text-success-700' :
                    app.status === 'rejected' ? 'bg-error-100 text-error-700' :
                    app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {app.status || 'pending'}
                  </span>
                  {app.status !== 'accepted' && app.status !== 'rejected' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'accepted')}
                        className="px-3 py-1 text-xs bg-success-50 text-success-600 rounded hover:bg-success-100"
                      >
                        Accept
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
function CandidatesView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Candidates</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Candidate management interface</p>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Profile Settings</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Company profile settings</p>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function CompanyDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const companyId = userData?.companyId || userData?.uid;

      // Fetch jobs count using API
      const apiService = await import('../../services/api').then(module => module.default);
      const jobsResponse = await apiService.jobs.getAll({
        companyId,
        status: 'all'
      });

      // Fetch applications count using API
      const appsResponse = await apiService.applications.getByCompany(companyId);

      const applications = appsResponse.data.data || [];

      setStats({
        activeJobs: jobsResponse.data.data?.length || 0,
        totalApplications: applications.length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        hired: applications.filter(app => app.status === 'accepted').length
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
            <p className="text-sm text-gray-500 mt-1">Company Portal</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link to="/company" className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
              Dashboard
            </Link>
            <Link to="/company/jobs" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Job Postings
            </Link>
            <Link to="/company/applications" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Applications
            </Link>
            <Link to="/company/candidates" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Candidates
            </Link>
            <Link to="/company/profile" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Profile Settings
            </Link>
          </nav>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">{userData?.companyName || userData?.fullName || 'Company'}</p>
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
          <Route path="jobs" element={<JobsManagement />} />
          <Route path="jobs/new" element={<NewJobForm />} />
          <Route path="applications" element={<ApplicationsView />} />
          <Route path="candidates" element={<CandidatesView />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  );
}
