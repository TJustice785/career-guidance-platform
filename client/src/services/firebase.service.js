import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase.config';
import toast from 'react-hot-toast';

// ==================== ADMIN SERVICES ====================

export const adminService = {
  // User Management
  async getAllUsers(filters = {}) {
    try {
      let q = collection(db, 'users');
      
      if (filters.role) {
        q = query(q, where('role', '==', filters.role));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(userId, data) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  },

  // Institution Management
  async getAllInstitutions() {
    try {
      const snapshot = await getDocs(collection(db, 'institutions'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to fetch institutions');
      throw error;
    }
  },

  async approveInstitution(institutionId) {
    try {
      const docRef = doc(db, 'institutions', institutionId);
      await updateDoc(docRef, {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      toast.success('Institution approved');
    } catch (error) {
      console.error('Error approving institution:', error);
      toast.error('Failed to approve institution');
      throw error;
    }
  },

  async deleteInstitution(institutionId) {
    try {
      await deleteDoc(doc(db, 'institutions', institutionId));
      toast.success('Institution deleted');
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Failed to delete institution');
      throw error;
    }
  },

  // Company Management
  async getAllCompanies() {
    try {
      const snapshot = await getDocs(collection(db, 'companies'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
      throw error;
    }
  },

  async approveCompany(companyId) {
    try {
      const docRef = doc(db, 'companies', companyId);
      await updateDoc(docRef, {
        status: 'approved',
        approvedAt: serverTimestamp()
      });
      toast.success('Company approved');
    } catch (error) {
      console.error('Error approving company:', error);
      toast.error('Failed to approve company');
      throw error;
    }
  },

  // Statistics
  async getStats() {
    try {
      const [users, institutions, companies, applications] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'institutions')),
        getDocs(collection(db, 'companies')),
        getDocs(collection(db, 'applications'))
      ]);

      const students = users.docs.filter(doc => doc.data().role === 'student').length;
      const pendingApps = applications.docs.filter(doc => doc.data().status === 'pending').length;

      return {
        totalUsers: users.size,
        totalInstitutes: institutions.size,
        totalCompanies: companies.size,
        totalStudents: students,
        activeApplications: applications.size,
        pendingApprovals: pendingApps
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// ==================== INSTITUTE SERVICES ====================

export const instituteService = {
  // Course Management
  async getCourses(institutionId) {
    try {
      const q = query(
        collection(db, 'courses'),
        where('institutionId', '==', institutionId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      throw error;
    }
  },

  async addCourse(institutionId, courseData) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        institutionId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Course added successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
      throw error;
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const docRef = doc(db, 'courses', courseId);
      await updateDoc(docRef, {
        ...courseData,
        updatedAt: serverTimestamp()
      });
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      throw error;
    }
  },

  async deleteCourse(courseId) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      throw error;
    }
  },

  // Application Management
  async getApplications(institutionId, status = null) {
    try {
      let q = query(
        collection(db, 'applications'),
        where('institutionId', '==', institutionId)
      );
      
      if (status) {
        q = query(q, where('status', '==', status));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
      throw error;
    }
  },

  async updateApplicationStatus(applicationId, status, notes = '') {
    try {
      const docRef = doc(db, 'applications', applicationId);
      await updateDoc(docRef, {
        status,
        notes,
        reviewedAt: serverTimestamp()
      });
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      throw error;
    }
  },

  // Student Management
  async getEnrolledStudents(institutionId) {
    try {
      const q = query(
        collection(db, 'admissions'),
        where('institutionId', '==', institutionId),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      throw error;
    }
  },

  // Statistics
  async getStats(institutionId) {
    try {
      const [courses, applications, admissions] = await Promise.all([
        getDocs(query(collection(db, 'courses'), where('institutionId', '==', institutionId))),
        getDocs(query(collection(db, 'applications'), where('institutionId', '==', institutionId))),
        getDocs(query(collection(db, 'admissions'), where('institutionId', '==', institutionId)))
      ]);

      const pendingApps = applications.docs.filter(doc => doc.data().status === 'pending').length;

      return {
        totalStudents: admissions.size,
        activeCourses: courses.size,
        pendingApplications: pendingApps,
        totalAdmissions: admissions.size
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// ==================== STUDENT SERVICES ====================

export const studentService = {
  // Institution Browsing
  async getAllInstitutions(filters = {}) {
    try {
      let q = collection(db, 'institutions');
      q = query(q, where('status', '==', 'approved'));
      
      if (filters.location) {
        q = query(q, where('location', '==', filters.location));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to fetch institutions');
      throw error;
    }
  },

  async getInstitutionCourses(institutionId) {
    try {
      const q = query(
        collection(db, 'courses'),
        where('institutionId', '==', institutionId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Application Management
  async applyToCourse(studentId, applicationData) {
    try {
      // Check if student already has 2 applications to this institution
      const existingApps = await getDocs(
        query(
          collection(db, 'applications'),
          where('studentId', '==', studentId),
          where('institutionId', '==', applicationData.institutionId)
        )
      );

      if (existingApps.size >= 2) {
        toast.error('You can only apply to 2 courses per institution');
        throw new Error('Maximum applications reached for this institution');
      }

      const docRef = await addDoc(collection(db, 'applications'), {
        ...applicationData,
        studentId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      toast.success('Application submitted successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.message !== 'Maximum applications reached for this institution') {
        toast.error('Failed to submit application');
      }
      throw error;
    }
  },

  async getMyApplications(studentId) {
    try {
      const q = query(
        collection(db, 'applications'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
      throw error;
    }
  },

  // Document Management
  async uploadDocument(studentId, file, documentType) {
    try {
      const storageRef = ref(storage, `documents/${studentId}/${documentType}_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save document metadata to Firestore
      await addDoc(collection(db, 'documents'), {
        studentId,
        documentType,
        fileName: file.name,
        fileUrl: downloadURL,
        uploadedAt: serverTimestamp()
      });

      toast.success('Document uploaded successfully');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    }
  },

  async getMyDocuments(studentId) {
    try {
      const q = query(
        collection(db, 'documents'),
        where('studentId', '==', studentId),
        orderBy('uploadedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to fetch documents');
      throw error;
    }
  },

  async deleteDocument(documentId, fileUrl) {
    try {
      // Delete from Storage
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', documentId));
      
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      throw error;
    }
  },

  // Job Search
  async searchJobs(filters = {}) {
    try {
      let q = collection(db, 'jobs');
      q = query(q, where('status', '==', 'active'));
      
      if (filters.industry) {
        q = query(q, where('industry', '==', filters.industry));
      }
      
      if (filters.location) {
        q = query(q, where('location', '==', filters.location));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs');
      throw error;
    }
  },

  async applyToJob(studentId, jobId, applicationData) {
    try {
      await addDoc(collection(db, 'jobApplications'), {
        ...applicationData,
        studentId,
        jobId,
        status: 'pending',
        appliedAt: serverTimestamp()
      });
      
      // Increment application count
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        applicationCount: increment(1)
      });
      
      toast.success('Job application submitted');
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Failed to apply to job');
      throw error;
    }
  },

  // Statistics
  async getStats(studentId) {
    try {
      const [applications, jobApplications, documents] = await Promise.all([
        getDocs(query(collection(db, 'applications'), where('studentId', '==', studentId))),
        getDocs(query(collection(db, 'jobApplications'), where('studentId', '==', studentId))),
        getDocs(query(collection(db, 'documents'), where('studentId', '==', studentId)))
      ]);

      const accepted = applications.docs.filter(doc => doc.data().status === 'accepted').length;
      const pending = applications.docs.filter(doc => doc.data().status === 'pending').length;

      return {
        appliedCourses: applications.size,
        acceptedApplications: accepted,
        pendingApplications: pending,
        completedCourses: 0, // To be calculated based on admissions
        jobApplications: jobApplications.size,
        savedJobs: 0 // To be implemented
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// ==================== COMPANY SERVICES ====================

export const companyService = {
  // Job Management
  async getMyJobs(companyId) {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('companyId', '==', companyId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
      throw error;
    }
  },

  async postJob(companyId, jobData) {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        companyId,
        status: 'active',
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Job posted successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
      throw error;
    }
  },

  async updateJob(jobId, jobData) {
    try {
      const docRef = doc(db, 'jobs', jobId);
      await updateDoc(docRef, {
        ...jobData,
        updatedAt: serverTimestamp()
      });
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
      throw error;
    }
  },

  async deleteJob(jobId) {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      throw error;
    }
  },

  // Application Management
  async getJobApplications(companyId, filters = {}) {
    try {
      // First get all jobs for this company
      const jobsSnapshot = await getDocs(
        query(collection(db, 'jobs'), where('companyId', '==', companyId))
      );
      const jobIds = jobsSnapshot.docs.map(doc => doc.id);

      if (jobIds.length === 0) return [];

      // Then get applications for these jobs
      let q = query(
        collection(db, 'jobApplications'),
        where('jobId', 'in', jobIds)
      );

      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }

      q = query(q, orderBy('appliedAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
      throw error;
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const docRef = doc(db, 'jobApplications', applicationId);
      await updateDoc(docRef, {
        status,
        reviewedAt: serverTimestamp()
      });
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      throw error;
    }
  },

  // Candidate Search
  async searchCandidates(filters = {}) {
    try {
      let q = query(collection(db, 'users'), where('role', '==', 'student'));

      // Add more filters as needed
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching candidates:', error);
      toast.error('Failed to search candidates');
      throw error;
    }
  },

  // Statistics
  async getStats(companyId) {
    try {
      const jobsSnapshot = await getDocs(
        query(collection(db, 'jobs'), where('companyId', '==', companyId))
      );
      
      const jobIds = jobsSnapshot.docs.map(doc => doc.id);
      const activeJobs = jobsSnapshot.docs.filter(doc => doc.data().status === 'active').length;

      let totalApplications = 0;
      let shortlisted = 0;
      let hired = 0;

      if (jobIds.length > 0) {
        const appsSnapshot = await getDocs(
          query(collection(db, 'jobApplications'), where('jobId', 'in', jobIds))
        );

        totalApplications = appsSnapshot.size;
        shortlisted = appsSnapshot.docs.filter(doc => doc.data().status === 'shortlisted').length;
        hired = appsSnapshot.docs.filter(doc => doc.data().status === 'hired').length;
      }

      return {
        activeJobs,
        totalApplications,
        shortlisted,
        hired
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default {
  admin: adminService,
  institute: instituteService,
  student: studentService,
  company: companyService
};
