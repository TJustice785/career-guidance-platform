import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSearch, FaEye, FaCheck, FaTimes, FaClock, FaDownload, FaFilter } from 'react-icons/fa';
import { db } from '../../config/firebase.config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [institutionFilter, setInstitutionFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications from Firestore...');
      
      // Fetch all applications without ordering first to see what we have
      const snapshot = await getDocs(collection(db, 'applications'));
      
      console.log('Applications snapshot received, docs count:', snapshot.size);
      
      const apps = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log('Processing application:', doc.id, data);
        
        // Handle different date field names (appliedAt, createdAt, applicationDate)
        const applicationDate = data.appliedAt || data.createdAt || data.applicationDate;
        const lastUpdated = data.updatedAt || data.lastUpdated;
        
        apps.push({
          id: doc.id,
          ...data,
          applicationDate: applicationDate?.toDate ? applicationDate.toDate() : new Date(applicationDate || Date.now()),
          lastUpdated: lastUpdated?.toDate ? lastUpdated.toDate() : new Date(lastUpdated || Date.now()),
          // Normalize field names for consistency
          applicationNumber: data.applicationNumber || doc.id.substring(0, 8).toUpperCase(),
          applicationType: data.applicationType || 'course'
        });
      });
      
      // Sort by date in memory (most recent first)
      apps.sort((a, b) => b.applicationDate - a.applicationDate);
      
      console.log('Total applications fetched:', apps.length);
      setApplications(apps);
      
      if (apps.length === 0) {
        console.log('No applications found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedApplication) return;

    try {
      const appRef = doc(db, 'applications', selectedApplication.id);
      
      const updateData = {
        status: newStatus,
        lastUpdated: new Date(),
        updatedAt: new Date()
      };

      // Add note if provided
      if (statusNote) {
        const currentNotes = selectedApplication.notes || [];
        updateData.notes = [
          ...currentNotes,
          {
            author: 'Admin',
            note: statusNote,
            date: new Date()
          }
        ];
      }

      await updateDoc(appRef, updateData);

      toast.success('Application status updated successfully!');
      setShowStatusModal(false);
      setNewStatus('');
      setStatusNote('');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      waitlisted: 'bg-teal-100 text-teal-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <FaCheck className="inline mr-1" />;
      case 'rejected': return <FaTimes className="inline mr-1" />;
      case 'under_review': return <FaClock className="inline mr-1" />;
      default: return null;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesInstitution = institutionFilter === 'all' || app.institutionId === institutionFilter;
    
    return matchesSearch && matchesStatus && matchesInstitution;
  });

  const uniqueInstitutions = [...new Set(applications.map(app => ({
    id: app.institutionId,
    name: app.institutionName
  })).filter(i => i.id))];

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    waitlisted: applications.filter(a => a.status === 'waitlisted').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
        <p className="text-gray-600">View and manage all student applications</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
          <div className="text-xs text-gray-600">Under Review</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-xs text-gray-600">Accepted</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-xs text-gray-600">Rejected</div>
        </div>
        <div className="bg-teal-50 rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-teal-600">{stats.waitlisted}</div>
          <div className="text-xs text-gray-600">Waitlisted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or application number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="waitlisted">Waitlisted</option>
            </select>
          </div>

          <div>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Institutions</option>
              {uniqueInstitutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution / Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No applications found. {applications.length === 0 ? 'Seed sample data to get started.' : 'Try adjusting your filters.'}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.applicationNumber || app.id.substring(0, 8)}</div>
                      <div className="text-xs text-gray-500 capitalize">{app.applicationType || 'course'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.studentName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{app.studentEmail || 'N/A'}</div>
                      {app.studentPhone && <div className="text-xs text-gray-500">{app.studentPhone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{app.institutionName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{app.courseName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(app.status || 'pending')}`}>
                        {getStatusIcon(app.status || 'pending')}
                        {(app.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setNewStatus(app.status);
                            setShowStatusModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Update Status"
                        >
                          <FaCheck />
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

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <p className="text-gray-600">{selectedApplication.applicationNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{selectedApplication.studentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-gray-900">{selectedApplication.studentEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedApplication.studentPhone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Application Type</label>
                      <p className="text-gray-900 capitalize">{selectedApplication.applicationType}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Institution</label>
                      <p className="text-gray-900">{selectedApplication.institutionName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Course</label>
                      <p className="text-gray-900">{selectedApplication.courseName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Academic Year</label>
                      <p className="text-gray-900">{selectedApplication.academicYear}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Semester</label>
                      <p className="text-gray-900">{selectedApplication.semester}</p>
                    </div>
                  </div>
                </div>

                {/* Qualifications */}
                {selectedApplication.qualifications && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h3>
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-600">School</label>
                      <p className="text-gray-900">{selectedApplication.qualifications.schoolName}</p>
                    </div>
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-600">Overall Grade</label>
                      <p className="text-gray-900">{selectedApplication.qualifications.overallGrade}</p>
                    </div>
                    {selectedApplication.qualifications.lgcseResults && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">LGCSE Results</label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {Object.entries(selectedApplication.qualifications.lgcseResults).map(([subject, grade]) => (
                            <div key={subject} className="bg-gray-50 p-2 rounded">
                              <div className="text-xs text-gray-600">{subject}</div>
                              <div className="font-semibold text-gray-900">{grade}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Guardian Information */}
                {selectedApplication.guardianInfo && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Guardian Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{selectedApplication.guardianInfo.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Relationship</label>
                        <p className="text-gray-900">{selectedApplication.guardianInfo.relationship}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedApplication.guardianInfo.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedApplication.guardianInfo.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Application Fee */}
                {selectedApplication.applicationFee && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Fee</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Amount</label>
                        <p className="text-gray-900">{selectedApplication.applicationFee.currency} {selectedApplication.applicationFee.amount}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Payment Status</label>
                        <p className={`font-semibold ${selectedApplication.applicationFee.paid ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedApplication.applicationFee.paid ? 'PAID' : 'UNPAID'}
                        </p>
                      </div>
                      {selectedApplication.applicationFee.paid && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Payment Date</label>
                            <p className="text-gray-900">{new Date(selectedApplication.applicationFee.paymentDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Reference</label>
                            <p className="text-gray-900">{selectedApplication.applicationFee.referenceNumber}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Status */}
                {selectedApplication.reviewStatus && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Review Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Documents Verified</label>
                        <p className={`font-semibold ${selectedApplication.reviewStatus.documentsVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedApplication.reviewStatus.documentsVerified ? 'Yes' : 'Pending'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Academic Review</label>
                        <p className="text-gray-900 capitalize">{selectedApplication.reviewStatus.academicReview}</p>
                      </div>
                      {selectedApplication.reviewStatus.interviewRequired && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Interview Required</label>
                            <p className="text-gray-900">Yes</p>
                          </div>
                          {selectedApplication.reviewStatus.interviewDate && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Interview Date</label>
                              <p className="text-gray-900">{new Date(selectedApplication.reviewStatus.interviewDate).toLocaleString()}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedApplication.notes && selectedApplication.notes.length > 0 && (
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                    <div className="space-y-2">
                      {selectedApplication.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{note.author}</span>
                            <span className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Statement */}
                {selectedApplication.personalStatement && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Statement</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedApplication.personalStatement}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setNewStatus(selectedApplication.status);
                    setShowStatusModal(true);
                  }}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Application Status</h2>
              <p className="text-gray-600 mb-4">
                Application: {selectedApplication.applicationNumber}<br />
                Student: {selectedApplication.studentName}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="waitlisted">Waitlisted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Note (Optional)
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Add any notes about this status change..."
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setNewStatus('');
                    setStatusNote('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
