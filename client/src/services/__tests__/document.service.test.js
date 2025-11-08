// Mock axios module
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn();

import documentService from '../document.service';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

describe('Document Service', () => {
  const mockToken = 'test-token';
  
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Set up auth token for tests
    localStorage.setItem('token', mockToken);
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  describe('uploadDocument', () => {
    it('should upload a document with progress tracking', async () => {
      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.pdf'));
      
      const onUploadProgress = jest.fn();
      const mockResponse = { id: 'doc-123', name: 'test.pdf' };
      axios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await documentService.uploadDocument(formData, onUploadProgress);

      expect(axios.post).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDocuments', () => {
    it('should fetch documents with filters', async () => {
      const filters = { type: 'resume' };
      const mockDocuments = [{ id: 'doc-1', name: 'Resume.pdf' }];
      axios.get.mockResolvedValueOnce({ data: mockDocuments });

      const result = await documentService.getDocuments(filters);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents`,
        { params: filters }
      );
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const documentId = 'doc-123';
      const mockResponse = { success: true };
      axios.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await documentService.deleteDocument(documentId);

      expect(axios.delete).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents/${documentId}`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('downloadDocument', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL
      window.URL.createObjectURL = jest.fn(() => 'blob:test-url');
      
      // Mock document.createElement and appendChild/removeChild
      document.createElement = jest.fn(() => ({
        href: '',
        download: '',
        click: jest.fn(),
        setAttribute: jest.fn(),
      }));
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    });

    it('should download a document', async () => {
      const documentId = 'doc-123';
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
      const mockResponse = { data: mockBlob, headers: { 'content-disposition': 'filename=test.pdf' } };
      
      axios.get.mockResolvedValueOnce(mockResponse);

      const result = await documentService.downloadDocument(documentId);

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents/${documentId}/download`,
        { responseType: 'blob' }
      );
      expect(result).toEqual({ success: true, filename: 'test.pdf' });
    });
  });

  describe('updateDocument', () => {
    it('should update document metadata', async () => {
      const documentId = 'doc-123';
      const updateData = { name: 'Updated Resume' };
      const mockResponse = { ...updateData, id: documentId };
      
      axios.patch.mockResolvedValueOnce({ data: mockResponse });

      const result = await documentService.updateDocument(documentId, updateData);

      expect(axios.patch).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents/${documentId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDocumentTypes', () => {
    it('should fetch document types from API', async () => {
      const mockTypes = [
        { id: 'resume', name: 'Resume' },
        { id: 'transcript', name: 'Academic Transcript' }
      ];
      
      axios.get.mockResolvedValueOnce({ data: mockTypes });

      const result = await documentService.getDocumentTypes();

      expect(axios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/documents/types`
      );
      expect(result).toEqual(mockTypes);
    });

    it('should return default types if API fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('API error'));

      const result = await documentService.getDocumentTypes();

      expect(result).toEqual([
        { value: 'transcript', label: 'Academic Transcript' },
        { value: 'certificate', label: 'Certificate' },
        { value: 'id', label: 'ID/Passport' },
        { value: 'cv', label: 'CV/Resume' },
        { value: 'other', label: 'Other' },
      ]);
    });
  });

  describe('getDocumentPreviewUrl', () => {
    it('should return the preview URL for a document', () => {
      const documentId = 'doc-123';
      const result = documentService.getDocumentPreviewUrl(documentId);
      
      expect(result).toBe(`${API_BASE_URL}/documents/${documentId}/preview`);
    });
  });
});
