import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ManageInstitutions from './ManageInstitutionsEnhanced';
import ManageCompanies from './ManageCompanies';
import ManageCourses from './ManageCourses';
import ManageApplications from './ManageApplications';
import CleanupDuplicates from './CleanupDuplicates';
import CleanupAllDuplicates from './CleanupAllDuplicates';
import CleanupDuplicateUsers from './CleanupDuplicateUsers';
import ManageUsers from './ManageUsers';
import CreateAdminUser from './CreateAdminUser';
import SystemSettings from './SystemSettings';
import UnifiedSeeder from './UnifiedSeeder';
import UpdateCoursesToReal from './UpdateCoursesToReal';
import { db } from '../../config/firebase.config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import DashboardNavbar from '../../components/DashboardNavbar';
import EmailVerificationBanner from '../../components/EmailVerificationBanner';
import Footer from '../../components/Footer';

// Dashboard Home Component
function DashboardHome({ stats, loading }) {
  const { userData } = useAuth();

  const StatCard = ({ title, value, change, description }) => (
    <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="text-sm font-medium text-gray-300 uppercase tracking-wide">
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
      <div className="text-3xl font-bold text-white mb-1">
        {loading ? (
          <div className="h-9 w-20 bg-dark-400 rounded animate-pulse"></div>
        ) : (
          (value || 0).toLocaleString()
        )}
      </div>
      {description && (
        <div className="text-xs text-gray-300">{description}</div>
      )}
    </div>
  );

  const ActivityItem = ({ title, time, status }) => (
    <div className="flex items-center p-4 hover:bg-dark-300 rounded-lg transition-colors duration-200">
      <div className={`w-2 h-2 rounded-full mr-3 ${
        status === 'success' ? 'bg-success-500' :
        status === 'warning' ? 'bg-warning-500' :
        'bg-primary-500'
      }`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-300">{time}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome back, {userData?.firstName || 'Admin'}!
        </h1>
        <p className="text-secondary text-lg">Here's what's happening with your platform today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={12}
          description="Registered users"
        />
        <StatCard
          title="Institutes"
          value={stats.totalInstitutes}
          change={8}
          description="Educational institutions"
        />
        <StatCard
          title="Students"
          value={stats.totalStudents}
          change={15}
          description="Active students"
        />
        <StatCard
          title="Companies"
          value={stats.totalCompanies}
          change={5}
          description="Registered companies"
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          change={-3}
          description="Current applications"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          change={7}
          description="Active job postings"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card-glass animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-2">
            <ActivityItem
              title="New institute registered: Tech University"
              time="2 minutes ago"
              status="success"
            />
            <ActivityItem
              title="Student application submitted"
              time="15 minutes ago"
              status="info"
            />
            <ActivityItem
              title="Pending approval required"
              time="1 hour ago"
              status="warning"
            />
            <ActivityItem
              title="Company profile updated: TechCorp"
              time="2 hours ago"
              status="success"
            />
            <ActivityItem
              title="New user registrations: 12"
              time="3 hours ago"
              status="info"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-glass animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/users" className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center">
              Manage Users
            </Link>
            <Link to="/admin/institutions" className="block w-full bg-success-600 text-white py-3 px-4 rounded-lg hover:bg-success-700 transition-colors font-medium text-center">
              Manage Institutes
            </Link>
            <Link to="/admin/companies" className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center">
              Manage Companies
            </Link>
            <Link to="/admin/reports" className="block w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center">
              View Reports
            </Link>
            <Link to="/admin/update-courses" className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-center shadow-lg">
              Update Courses to Real Programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    totalCompanies: 0,
    totalStudents: 0,
    activeApplications: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching dashboard stats from Firebase...');
        
        // Fetch all collections in parallel
        const [usersSnapshot, institutionsSnapshot, companiesSnapshot, coursesSnapshot, jobsSnapshot, applicationsSnapshot] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'institutions')),
          getDocs(collection(db, 'companies')),
          getDocs(collection(db, 'courses')),
          getDocs(collection(db, 'jobs')),
          getDocs(collection(db, 'applications'))
        ]);

        // Count users by role
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalUsers = users.length;
        const totalStudents = users.filter(user => user.role === 'student').length;

        // Count other entities
        const totalInstitutes = institutionsSnapshot.size;
        const totalCompanies = companiesSnapshot.size;
        const totalJobs = jobsSnapshot.size;
        const activeApplications = applicationsSnapshot.size;

        console.log('Dashboard stats:', {
          totalUsers,
          totalInstitutes,
          totalCompanies,
          totalStudents,
          activeApplications,
          totalJobs
        });

        setStats({
          totalUsers,
          totalInstitutes,
          totalCompanies,
          totalStudents,
          activeApplications,
          totalJobs
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Keep stats at 0 on error - display real data only
        setStats({
          totalUsers: 0,
          totalInstitutes: 0,
          totalCompanies: 0,
          totalStudents: 0,
          activeApplications: 0,
          totalJobs: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/institutions', label: 'Institutions' },
    { path: '/admin/courses', label: 'Courses' },
    { path: '/admin/update-courses', label: 'Update Courses' },
    { path: '/admin/companies', label: 'Companies' },
    { path: '/admin/applications', label: 'Applications' },
    { path: '/admin/reports', label: 'Reports' },
    { path: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
      {/* Top Navbar */}
      <DashboardNavbar role="admin" navItems={navItems} onLogout={handleLogout} />
      
      {/* Email Verification Banner */}
      <EmailVerificationBanner />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route index element={<DashboardHome stats={stats} loading={loading} />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="students" element={<div className="p-6"><h1 className="text-3xl font-bold">Student Management Coming Soon</h1></div>} />
            <Route path="institutions" element={<ManageInstitutions />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="companies" element={<ManageCompanies />} />
            <Route path="applications" element={<ManageApplications />} />
            <Route path="cleanup-duplicates" element={<CleanupDuplicates />} />
            <Route path="cleanup-all-duplicates" element={<CleanupAllDuplicates />} />
            <Route path="cleanup-duplicate-users" element={<CleanupDuplicateUsers />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="seed-database" element={<UnifiedSeeder />} />
            <Route path="update-courses" element={<UpdateCoursesToReal />} />
            <Route path="create-admin" element={<CreateAdminUser />} />
            <Route path="*" element={<DashboardHome stats={stats} loading={loading} />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
}

// Placeholder components for routes
function UsersManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <input type="text" placeholder="Search users..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Student</option>
              <option>Institute</option>
              <option>Company</option>
            </select>
          </div>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap">
            Add User
          </button>
        </div>
        <p className="text-secondary">User management interface - List, edit, delete users</p>
      </div>
    </div>
  );
}

function InstitutionsManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Institution Management</h1>
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input type="text" placeholder="Search institutions..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-full sm:w-auto" />
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap">
            Add Institution
          </button>
        </div>
        <p className="text-secondary">Institution management interface - Approve, edit, delete institutions</p>
      </div>
    </div>
  );
}

function CoursesManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Course Management</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Course management interface - View and manage all courses across institutions</p>
      </div>
    </div>
  );
}

function CompaniesManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Company Management</h1>
      <div className="card-glass p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <input type="text" placeholder="Search companies..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all w-full sm:w-auto" />
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium whitespace-nowrap">
            Add Company
          </button>
        </div>
        <p className="text-secondary">Company management interface - Approve, edit, delete companies</p>
      </div>
    </div>
  );
}

function ApplicationsManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Application Management</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Application management interface - View and manage all student applications</p>
      </div>
    </div>
  );
}

function ReportsView() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    applications: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      byMonth: []
    },
    jobPlacements: {
      total: 0,
      placed: 0,
      pending: 0,
      byInstitution: [],
      byCompany: [],
      recentPlacements: []
    },
    institutions: 0,
    students: 0,
    companies: 0
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch all applications
      const applicationsRef = collection(db, 'applications');
      const applicationsSnap = await getDocs(applicationsRef);
      const applications = applicationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch all enrollments
      const enrollmentsRef = collection(db, 'enrollments');
      const enrollmentsSnap = await getDocs(enrollmentsRef);
      const enrollments = enrollmentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch job applications
      const jobApplicationsRef = collection(db, 'jobApplications');
      const jobApplicationsSnap = await getDocs(jobApplicationsRef);
      const jobApplications = jobApplicationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Count entities
      const institutionsSnap = await getDocs(collection(db, 'institutions'));
      const studentsSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
      const companiesSnap = await getDocs(collection(db, 'companies'));

      // Calculate application stats
      const appStats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        accepted: applications.filter(app => app.status === 'approved' || app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        byMonth: calculateMonthlyTrends(applications)
      };

      // Calculate job placement stats
      const placedJobs = jobApplications.filter(app => app.status === 'hired').length;
      const jobStats = {
        total: jobApplications.length,
        placed: placedJobs,
        pending: jobApplications.filter(app => app.status === 'pending' || app.status === 'review').length,
        byInstitution: calculateByInstitution(enrollments),
        byCompany: calculateByCompany(jobApplications),
        recentPlacements: jobApplications
          .filter(app => app.status === 'hired')
          .sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0))
          .slice(0, 5)
      };

      setReportData({
        applications: appStats,
        jobPlacements: jobStats,
        institutions: institutionsSnap.size,
        students: studentsSnap.size,
        companies: companiesSnap.size
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTrends = (applications) => {
    const monthlyData = {};
    applications.forEach(app => {
      if (app.createdAt) {
        const date = app.createdAt.toDate ? app.createdAt.toDate() : new Date(app.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }));
  };

  const calculateByInstitution = (enrollments) => {
    const instData = {};
    enrollments.forEach(enrollment => {
      const instName = enrollment.institutionName || 'Unknown';
      instData[instName] = (instData[instName] || 0) + 1;
    });
    return Object.entries(instData)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const calculateByCompany = (jobApplications) => {
    const companyData = {};
    jobApplications.filter(app => app.status === 'hired').forEach(app => {
      const companyName = app.companyName || 'Unknown';
      companyData[companyName] = (companyData[companyName] || 0) + 1;
    });
    return Object.entries(companyData)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Reports</h1>
        <p className="text-gray-400">Analytics and insights across the platform</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Total Students</div>
          <div className="text-3xl font-bold text-white">{reportData.students}</div>
        </div>
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Institutions</div>
          <div className="text-3xl font-bold text-white">{reportData.institutions}</div>
        </div>
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Companies</div>
          <div className="text-3xl font-bold text-white">{reportData.companies}</div>
        </div>
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-2">Job Placements</div>
          <div className="text-3xl font-bold text-green-400">{reportData.jobPlacements.placed}</div>
        </div>
      </div>

      {/* Main Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Application Trends</h3>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                {reportData.applications.total} Total
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                <span className="text-gray-300">Pending</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{reportData.applications.pending}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <span className="text-gray-300">Accepted</span>
              </div>
              <div className="text-xl font-bold text-green-400">{reportData.applications.accepted}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <span className="text-gray-300">Rejected</span>
              </div>
              <div className="text-xl font-bold text-red-400">{reportData.applications.rejected}</div>
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div>
            <h4 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4">Last 6 Months</h4>
            <div className="space-y-3">
              {reportData.applications.byMonth.map((item, index) => {
                const maxCount = Math.max(...reportData.applications.byMonth.map(i => i.count));
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{item.month}</span>
                      <span className="text-white font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-dark-300 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Job Placements */}
        <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Job Placements</h3>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <span className="text-xs font-mono uppercase tracking-wider text-green-400 font-semibold">
                {reportData.jobPlacements.total} Applications
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <span className="text-gray-300">Hired</span>
              </div>
              <div className="text-xl font-bold text-green-400">{reportData.jobPlacements.placed}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                <span className="text-gray-300">In Process</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{reportData.jobPlacements.pending}</div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-300/50 border border-gray-700/50">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <span className="text-gray-300">Success Rate</span>
              </div>
              <div className="text-xl font-bold text-blue-400">
                {reportData.jobPlacements.total > 0 
                  ? Math.round((reportData.jobPlacements.placed / reportData.jobPlacements.total) * 100) 
                  : 0}%
              </div>
            </div>
          </div>

          {/* Top Companies */}
          <div>
            <h4 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4">Top Hiring Companies</h4>
            <div className="space-y-3">
              {reportData.jobPlacements.byCompany.length > 0 ? (
                reportData.jobPlacements.byCompany.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-dark-300/50 border border-gray-700/50">
                    <span className="text-gray-300 text-sm">{item.name}</span>
                    <div className="flex items-center">
                      <div className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                        <span className="text-xs font-mono text-green-400 font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No placement data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* By Institution Stats */}
      <div className="bg-dark-200 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Enrollments by Institution</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {reportData.jobPlacements.byInstitution.length > 0 ? (
            reportData.jobPlacements.byInstitution.map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-dark-300/50 border border-gray-700/50 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">{item.count}</div>
                <div className="text-xs text-gray-400">{item.name}</div>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center py-8 text-gray-500">No enrollment data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">System Settings</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">System configuration and settings</p>
      </div>
    </div>
  );
}
