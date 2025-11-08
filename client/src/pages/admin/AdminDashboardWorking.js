import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';

// Dashboard Home Component
function DashboardHome({ stats, loading }) {
  const { userData } = useAuth();

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
      {description && (
        <div className="text-xs text-gray-500">{description}</div>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome back, {userData?.firstName || 'Admin'}! 👋
        </h1>
        <p className="text-secondary text-lg">Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
          title="Active Jobs"
          value={stats.activeJobs}
          change={-3}
          description="Current job postings"
        />
        <StatCard
          title="Courses"
          value={stats.totalCourses}
          description="Available courses"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Link to="/admin/users" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-2">Manage Users</h3>
          <p className="text-primary-100 text-sm">View and manage all users</p>
        </Link>
        <Link to="/admin/institutions" className="bg-gradient-to-br from-success-500 to-success-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-2">Institutions</h3>
          <p className="text-success-100 text-sm">Manage institutions</p>
        </Link>
        <Link to="/admin/companies" className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-2">Companies</h3>
          <p className="text-secondary-100 text-sm">Manage companies</p>
        </Link>
        <Link to="/admin/reports" className="bg-gradient-to-br from-warning-500 to-warning-600 text-white p-6 rounded-xl hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold mb-2">Reports</h3>
          <p className="text-warning-100 text-sm">View analytics</p>
        </Link>
      </div>
    </div>
  );
}

// Users Management with CRUD
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp()
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}!`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">User Management</h1>
      
      {/* Filters */}
      <div className="card-glass p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="institute">Institute</option>
            <option value="company">Company</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'company' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'institute' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      user.isActive ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 text-xs bg-error-50 text-error-600 rounded hover:bg-error-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Institutions Management with CRUD
function InstitutionsManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    type: 'University',
    location: '',
    email: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'institutions'));
      const instList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInstitutions(instList);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'institutions'), {
        ...formData,
        status: 'active',
        coursesCount: 0,
        studentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Institution added successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        abbreviation: '',
        type: 'University',
        location: '',
        email: '',
        phone: '',
        website: ''
      });
      fetchInstitutions();
    } catch (error) {
      console.error('Error adding institution:', error);
      toast.error('Failed to add institution');
    }
  };

  const handleDelete = async (instId) => {
    if (!window.confirm('Are you sure you want to delete this institution?')) return;
    
    try {
      await deleteDoc(doc(db, 'institutions', instId));
      toast.success('Institution deleted successfully!');
      fetchInstitutions();
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Failed to delete institution');
    }
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Institution Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Add Institution
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Institution</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Institution Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({...formData, abbreviation: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option>University</option>
                  <option>College</option>
                  <option>Technical Institute</option>
                  <option>Training Center</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="Website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-lg">
                  Add Institution
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search institutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Institutions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-gray-500">No institutions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map(inst => (
            <div key={inst.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition">
              <h3 className="font-bold text-lg mb-2">{inst.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{inst.type}</p>
              <p className="text-sm text-gray-600 mb-1">{inst.location}</p>
              <p className="text-sm text-gray-600 mb-4">{inst.email}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(inst.id)}
                  className="flex-1 px-4 py-2 text-sm bg-error-50 text-error-600 rounded hover:bg-error-100"
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

// Companies Management (similar structure)
function CompaniesManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'companies'));
      const companiesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCompanies(companiesList);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Company Management</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Total Companies: {companies.length}</p>
      </div>
    </div>
  );
}

// Placeholder components
function CoursesManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Course Management</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Course management interface</p>
      </div>
    </div>
  );
}

function ApplicationsManagement() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Application Management</h1>
      <div className="card-glass p-6">
        <p className="text-secondary">Application management interface</p>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">System Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6">
          <h3 className="font-bold text-lg mb-4">Application Trends</h3>
          <p className="text-secondary">Charts and analytics</p>
        </div>
        <div className="card-glass p-6">
          <h3 className="font-bold text-lg mb-4">Job Placements</h3>
          <p className="text-secondary">Statistics</p>
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
        <p className="text-secondary">System configuration</p>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInstitutes: 0,
    totalCompanies: 0,
    totalStudents: 0,
    activeJobs: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const institutionsSnap = await getDocs(collection(db, 'institutions'));
      const companiesSnap = await getDocs(collection(db, 'companies'));
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      const coursesSnap = await getDocs(collection(db, 'courses'));
      
      const users = usersSnap.docs.map(doc => doc.data());
      
      setStats({
        totalUsers: usersSnap.size,
        totalInstitutes: institutionsSnap.size,
        totalCompanies: companiesSnap.size,
        totalStudents: users.filter(u => u.role === 'student').length,
        activeJobs: jobsSnap.size,
        totalCourses: coursesSnap.size
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">CareerPath</h1>
            <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
          </div>

          <nav className="space-y-1">
            <Link to="/admin" className="block px-4 py-3 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/users" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Users
            </Link>
            <Link to="/admin/institutions" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Institutions
            </Link>
            <Link to="/admin/courses" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Courses
            </Link>
            <Link to="/admin/companies" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Companies
            </Link>
            <Link to="/admin/applications" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Applications
            </Link>
            <Link to="/admin/reports" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Reports
            </Link>
            <Link to="/admin/settings" className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Settings
            </Link>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">Administrator</p>
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
          <Route index element={<DashboardHome stats={stats} loading={loading} />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="institutions" element={<InstitutionsManagement />} />
          <Route path="courses" element={<CoursesManagement />} />
          <Route path="companies" element={<CompaniesManagement />} />
          <Route path="applications" element={<ApplicationsManagement />} />
          <Route path="reports" element={<ReportsView />} />
          <Route path="settings" element={<SettingsView />} />
        </Routes>
      </main>
    </div>
  );
}
