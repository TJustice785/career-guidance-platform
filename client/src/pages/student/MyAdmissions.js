import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api.service';
import toast from 'react-hot-toast';

const MyAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await studentAPI.getMyAdmissions();
      setAdmissions(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAdmission = async (admissionId) => {
    if (!window.confirm('Accept this admission? Other admissions will be automatically declined.')) return;
    
    try {
      await studentAPI.acceptAdmission(admissionId);
      toast.success('Admission accepted successfully!');
      fetchAdmissions();
    } catch (error) {
      toast.error(error.message || 'Failed to accept admission');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Admissions</h1>
      
      {admissions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {admissions.map((admission) => (
            <div key={admission.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{admission.courseName}</h3>
                  <p className="text-gray-600 mb-4">{admission.institutionName}</p>
                  
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Admitted:</span> {new Date(admission.admittedAt?.seconds * 1000).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                        admission.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        admission.status === 'admitted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {admission.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                {admission.status === 'admitted' && (
                  <button
                    onClick={() => handleAcceptAdmission(admission.id)}
                    className="ml-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Accept Admission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No admissions yet</p>
        </div>
      )}
    </div>
  );
};

export default MyAdmissions;
