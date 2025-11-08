import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    logoUrl: '',
    employees: '',
    founded: '',
    benefits: '',
    departments: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('Fetching companies from Firebase...');
      
      const snapshot = await getDocs(collection(db, 'companies'));
      console.log('Snapshot received, docs count:', snapshot.size);
      
      const data = snapshot.docs.map(doc => {
        console.log('Processing doc:', doc.id, doc.data());
        return { id: doc.id, ...doc.data() };
      });
      
      console.log('Companies data:', data);
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error(`Failed to fetch companies: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      // Process benefits and departments from comma-separated strings to arrays
      const processedData = {
        name: formData.companyName, // Save as 'name' field
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        location: formData.location,
        website: formData.website,
        description: formData.description,
        logoUrl: formData.logoUrl,
        employees: formData.employees ? parseInt(formData.employees) : null,
        founded: formData.founded ? parseInt(formData.founded) : null,
        benefits: formData.benefits ? formData.benefits.split(',').map(b => b.trim()).filter(b => b) : [],
        departments: formData.departments ? formData.departments.split(',').map(d => d.trim()).filter(d => d) : []
      };
      
      if (editingCompany) {
        await updateDoc(doc(db, 'companies', editingCompany.id), {
          ...processedData,
          updatedAt: serverTimestamp()
        });
        toast.success('Company updated!');
      } else {
        await addDoc(collection(db, 'companies'), {
          ...processedData,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success('Company created!');
      }

      setShowModal(false);
      setEditingCompany(null);
      resetForm();
      fetchCompanies();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.name || company.companyName || '',
      email: company.email || '',
      phone: company.phone || '',
      industry: company.industry || '',
      location: company.location || '',
      website: company.website || '',
      description: company.description || '',
      logoUrl: company.logoUrl || '',
      employees: company.employees || '',
      founded: company.founded || '',
      benefits: Array.isArray(company.benefits) ? company.benefits.join(', ') : '',
      departments: Array.isArray(company.departments) ? company.departments.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this company account?')) return;
    
    try {
      await updateDoc(doc(db, 'companies', id), {
        status: 'approved',
        isActive: true,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Company approved successfully!');
      fetchCompanies();
    } catch (error) {
      toast.error(error.message || 'Approval failed');
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this company account? They will not be able to post jobs.')) return;
    
    try {
      await updateDoc(doc(db, 'companies', id), {
        status: 'suspended',
        isActive: false,
        suspendedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Company suspended successfully!');
      fetchCompanies();
    } catch (error) {
      toast.error(error.message || 'Suspension failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone!')) return;
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../../config/firebase.config');
      await deleteDoc(doc(db, 'companies', id));
      toast.success('Company deleted successfully!');
      fetchCompanies();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      industry: '',
      location: '',
      website: '',
      description: '',
      logoUrl: '',
      employees: '',
      founded: '',
      benefits: '',
      departments: ''
    });
  };

  const filteredCompanies = companies.filter(company =>
    (company.name || company.companyName)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Companies</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {companies.length} {companies.length === 1 ? 'company' : 'companies'} total
            {searchTerm && ` (${filteredCompanies.length} matching search)`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCompany(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FaPlus /> Add Company
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            {companies.length === 0 ? (
              <>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No companies in the database yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Click "Add Company" to create your first company.</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400">No companies match your search "{searchTerm}"</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try a different search term</p>
              </>
            )}
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              {company.logoUrl && (
                <img 
                  src={company.logoUrl} 
                  alt={company.name || company.companyName}
                  className="w-16 h-16 object-contain mb-4"
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name || company.companyName}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  company.status === 'approved' ? 'bg-green-100 text-green-700' :
                  company.status === 'suspended' ? 'bg-red-100 text-red-700' :
                  company.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {company.status === 'approved' ? '✓ Approved' :
                   company.status === 'suspended' ? '⊘ Suspended' :
                   company.status === 'pending' ? '⏳ Pending' :
                   '● Active'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{company.industry}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{company.description}</p>
              
              <div className="space-y-1 mb-4 text-sm">
                {company.email && (
                  <p className="text-gray-600 dark:text-gray-400">📧 {company.email}</p>
                )}
                {company.phone && (
                  <p className="text-gray-600 dark:text-gray-400">📞 {company.phone}</p>
                )}
                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline block"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                {company.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(company.id)}
                    className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 font-medium text-sm"
                  >
                    ✓ Approve Company
                  </button>
                )}
                {company.status === 'approved' && (
                  <button
                    onClick={() => handleSuspend(company.id)}
                    className="w-full bg-orange-50 text-orange-700 py-2 rounded-lg hover:bg-orange-100 font-medium text-sm"
                  >
                    ⊘ Suspend Account
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Technology, Finance, Healthcare"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://company.co.ls"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Maseru, Lesotho"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      value={formData.employees}
                      onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year Founded
                    </label>
                    <input
                      type="number"
                      value={formData.founded}
                      onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 1996"
                    />
                  </div>
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://company.co.ls/logo.png"
                  />
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Benefits (comma-separated)
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Health insurance, Pension fund, Performance bonuses"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each benefit with a comma</p>
                </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departments (comma-separated)
                  </label>
                  <textarea
                    value={formData.departments}
                    onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Network Operations, Customer Service, Sales & Marketing"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate each department with a comma</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                  >
                    {editingCompany ? 'Update' : 'Create'} Company
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCompany(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCompanies;
