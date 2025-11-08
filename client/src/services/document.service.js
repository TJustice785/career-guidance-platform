import axios from 'axios';
import { API_BASE_URL } from '../config';

const DOCUMENT_API_URL = `${API_BASE_URL}/documents`;

const documentService = {
  // Upload a document
  uploadDocument: async (formData, onUploadProgress) => {
    try {
      const response = await axios.post(DOCUMENT_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error.response?.data || { error: 'Failed to upload document' };
    }
  },

  // Get all documents for current user
  getDocuments: async (filters = {}) => {
    try {
      const response = await axios.get(DOCUMENT_API_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error.response?.data || { error: 'Failed to fetch documents' };
    }
  },

  // Get document by ID
  getDocumentById: async (documentId) => {
    try {
      const response = await axios.get(`${DOCUMENT_API_URL}/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error.response?.data || { error: 'Failed to fetch document' };
    }
  },

  // Delete a document
  deleteDocument: async (documentId) => {
    try {
      const response = await axios.delete(`${DOCUMENT_API_URL}/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error.response?.data || { error: 'Failed to delete document' };
    }
  },

  // Download a document
  downloadDocument: async (documentId) => {
    try {
      const response = await axios.get(`${DOCUMENT_API_URL}/${documentId}/download`, {
        responseType: 'blob',
      });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Get the filename from the content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up - check if remove method exists (for test environment compatibility)
      if (link.remove) {
        link.remove();
      } else {
        // Fallback for older browsers or test environments
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error.response?.data || { error: 'Failed to download document' };
    }
  },

  // Update document metadata
  updateDocument: async (documentId, updateData) => {
    try {
      const response = await axios.patch(
        `${DOCUMENT_API_URL}/${documentId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error.response?.data || { error: 'Failed to update document' };
    }
  },

  // Get document types
  getDocumentTypes: async () => {
    try {
      const response = await axios.get(`${DOCUMENT_API_URL}/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document types:', error);
      return [
        { value: 'transcript', label: 'Academic Transcript' },
        { value: 'certificate', label: 'Certificate' },
        { value: 'id', label: 'ID/Passport' },
        { value: 'cv', label: 'CV/Resume' },
        { value: 'other', label: 'Other' },
      ];
    }
  },

  // Get document preview URL
  getDocumentPreviewUrl: (documentId) => {
    return `${DOCUMENT_API_URL}/${documentId}/preview`;
  },
};

export default documentService;
