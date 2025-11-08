import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api.service';
import toast from 'react-hot-toast';
import { FaUpload, FaFileAlt, FaTrash } from 'react-icons/fa';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await studentAPI.getMyDocuments();
      setDocuments(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', type);
    formData.append('description', '');

    setUploading(true);
    try {
      await studentAPI.uploadDocument(formData);
      toast.success('Document uploaded successfully!');
      fetchDocuments();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Delete this document?')) return;
    
    try {
      await studentAPI.deleteDocument(documentId);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Documents</h1>
      
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-500 transition">
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload ID/Passport</span>
              <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'id')} accept=".pdf,.jpg,.png" disabled={uploading} />
            </label>
          </div>
          
          <div>
            <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-500 transition">
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Transcript</span>
              <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'transcript')} accept=".pdf" disabled={uploading} />
            </label>
          </div>
          
          <div>
            <label className="block w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-primary-500 transition">
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Upload Certificate</span>
              <input type="file" className="hidden" onChange={(e) => handleUpload(e, 'certificate')} accept=".pdf,.jpg,.png" disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">My Documents</h3>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center flex-1">
                  <FaFileAlt className="text-blue-500 text-2xl mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.fileName}</p>
                    <p className="text-sm text-gray-500">{doc.documentType} • Uploaded {new Date(doc.uploadedAt?.seconds * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    View
                  </a>
                  <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;
