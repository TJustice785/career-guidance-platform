import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const ManageInstitutionsEnhanced = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    type: 'University',
    location: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    logoUrl: '',
    established: '',
    faculties: '',
    programs: '',
    facilities: '',
    admissionRequirementsDiploma: '',
    admissionRequirementsDegree: '',
    tuitionFeesDiploma: '',
    tuitionFeesDegree: ''
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'institutions'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInstitutions(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch institutions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check for duplicate name (case-insensitive)
      const nameToCheck = formData.name.toLowerCase().trim();
      
      if (!editingInstitution) {
        // Only check for duplicates when creating new
        const duplicate = institutions.find(inst => 
          inst.name.toLowerCase().trim() === nameToCheck
        );
        
        if (duplicate) {
          toast.error(
            `Institution "${formData.name}" already exists! Please use a different name or edit the existing one.`,
            { duration: 5000 }
          );
          return;
        }
      } else {
        // When editing, check if name conflicts with another institution
        const duplicate = institutions.find(inst => 
          inst.id !== editingInstitution.id && 
          inst.name.toLowerCase().trim() === nameToCheck
        );
        
        if (duplicate) {
          toast.error(
            `Another institution named "${formData.name}" already exists! Please use a different name.`,
            { duration: 5000 }
          );
          return;
        }
      }
      
      // Process arrays from comma-separated strings
      const processedData = {
        ...formData,
        established: formData.established ? parseInt(formData.established) : null,
        faculties: formData.faculties ? formData.faculties.split(',').map(f => f.trim()).filter(f => f) : [],
        programs: formData.programs ? formData.programs.split(',').map(p => p.trim()).filter(p => p) : [],
        facilities: formData.facilities ? formData.facilities.split(',').map(f => f.trim()).filter(f => f) : [],
        admissionRequirements: {
          diploma: formData.admissionRequirementsDiploma || '',
          degree: formData.admissionRequirementsDegree || ''
        },
        tuitionFees: {
          diploma: formData.tuitionFeesDiploma || '',
          degree: formData.tuitionFeesDegree || ''
        }
      };
      
      if (editingInstitution) {
        await updateDoc(doc(db, 'institutions', editingInstitution.id), {
          ...processedData,
          updatedAt: serverTimestamp()
        });
        toast.success('Institution updated successfully!');
      } else {
        await addDoc(collection(db, 'institutions'), {
          ...processedData,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success('Institution created successfully! ✅');
      }

      setShowModal(false);
      setEditingInstitution(null);
      resetForm();
      fetchInstitutions();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (institution) => {
    setEditingInstitution(institution);
    setFormData({
      name: institution.name || '',
      abbreviation: institution.abbreviation || '',
      type: institution.type || 'University',
      location: institution.location || '',
      email: institution.email || '',
      phone: institution.phone || '',
      website: institution.website || '',
      description: institution.description || '',
      logoUrl: institution.logoUrl || '',
      established: institution.established || '',
      faculties: Array.isArray(institution.faculties) ? institution.faculties.join(', ') : '',
      programs: Array.isArray(institution.programs) ? institution.programs.join(', ') : '',
      facilities: Array.isArray(institution.facilities) ? institution.facilities.join(', ') : '',
      admissionRequirementsDiploma: institution.admissionRequirements?.diploma || '',
      admissionRequirementsDegree: institution.admissionRequirements?.degree || '',
      tuitionFeesDiploma: institution.tuitionFees?.diploma || '',
      tuitionFeesDegree: institution.tuitionFees?.degree || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this institution?')) return;
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../../config/firebase.config');
      await deleteDoc(doc(db, 'institutions', id));
      toast.success('Institution deleted successfully!');
      fetchInstitutions();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      abbreviation: '',
      type: 'University',
      location: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      logoUrl: '',
      established: '',
      faculties: '',
      programs: '',
      facilities: '',
      admissionRequirementsDiploma: '',
      admissionRequirementsDegree: '',
      tuitionFeesDiploma: '',
      tuitionFeesDegree: ''
    });
  };

  const filteredInstitutions = institutions.filter(inst =>
    inst.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Institutions</h1>
        <button
          onClick={() => {
            setEditingInstitution(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <FaPlus /> Add Institution
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search institutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstitutions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No institutions found. Click "Add Institution" to create one.
                  </td>
                </tr>
              ) : (
                filteredInstitutions.map((institution) => (
                  <tr key={institution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {institution.logoUrl && (
                          <img src={institution.logoUrl} alt={institution.name} className="w-8 h-8 rounded mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{institution.name}</div>
                          {institution.abbreviation && (
                            <div className="text-xs text-gray-500">{institution.abbreviation}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{institution.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{institution.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{institution.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(institution)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(institution.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingInstitution ? 'Edit Institution' : 'Add New Institution'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., National University of Lesotho"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Abbreviation
                      </label>
                      <input
                        type="text"
                        value={formData.abbreviation}
                        onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., NUL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="University">University</option>
                        <option value="College">College</option>
                        <option value="Technical Institute">Technical Institute</option>
                        <option value="Vocational School">Vocational School</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Roma, Lesotho"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="+266 2234 0601"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="https://institution.co.ls"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year Established
                      </label>
                      <input
                        type="number"
                        value={formData.established}
                        onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 1945"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Brief description of the institution..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://institution.co.ls/logo.png"
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculties (comma-separated)
                      </label>
                      <textarea
                        value={formData.faculties}
                        onChange={(e) => setFormData({ ...formData, faculties: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Faculty of Science and Technology, Faculty of Education, Faculty of Law"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate each faculty with a comma</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Programs Offered (comma-separated)
                      </label>
                      <textarea
                        value={formData.programs}
                        onChange={(e) => setFormData({ ...formData, programs: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Bachelor of Science in Computer Science, Bachelor of Laws (LLB), Bachelor of Education"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate each program with a comma</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facilities (comma-separated)
                      </label>
                      <textarea
                        value={formData.facilities}
                        onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Library and Archives, Student Hostels, ICT Labs, Sports Complex"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate each facility with a comma</p>
                    </div>
                  </div>
                </div>

                {/* Admission Requirements */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Requirements</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diploma Requirements
                      </label>
                      <textarea
                        value={formData.admissionRequirementsDiploma}
                        onChange={(e) => setFormData({ ...formData, admissionRequirementsDiploma: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="At least 3 credits including English and Mathematics..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree Requirements
                      </label>
                      <textarea
                        value={formData.admissionRequirementsDegree}
                        onChange={(e) => setFormData({ ...formData, admissionRequirementsDegree: e.target.value })}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Minimum of 4 credits including English and Mathematics..."
                      />
                    </div>
                  </div>
                </div>

                {/* Tuition Fees */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tuition Fees</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diploma Fees
                      </label>
                      <input
                        type="text"
                        value={formData.tuitionFeesDiploma}
                        onChange={(e) => setFormData({ ...formData, tuitionFeesDiploma: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., M8,000 - M12,000 per year"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree Fees
                      </label>
                      <input
                        type="text"
                        value={formData.tuitionFeesDegree}
                        onChange={(e) => setFormData({ ...formData, tuitionFeesDegree: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., M15,000 - M25,000 per year"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                  >
                    {editingInstitution ? 'Update' : 'Create'} Institution
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingInstitution(null);
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

export default ManageInstitutionsEnhanced;
