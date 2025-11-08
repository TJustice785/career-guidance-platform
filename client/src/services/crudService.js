/**
 * CRUD Service - Centralized Firebase Operations
 * Handles Create, Read, Update, Delete operations for all collections
 */

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
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import toast from 'react-hot-toast';

// ==================== JOBS CRUD ====================

export const jobsService = {
  // CREATE - Add new job
  async create(jobData, userData) {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        companyId: userData.companyId || userData.uid,
        companyName: userData.companyName || userData.fullName,
        status: 'active',
        applicationsCount: 0,
        viewsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Job posted successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to post job');
      throw error;
    }
  },

  // READ - Get all jobs for a company
  async getByCompany(companyId) {
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
      toast.error('Failed to load jobs');
      return [];
    }
  },

  // READ - Get all active jobs
  async getAll() {
    try {
      const apiService = await import('./api').then(module => module.default);
      const response = await apiService.jobs.getAll({ status: 'active' });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      return [];
    }
  },

  // READ - Get single job
  async getById(jobId) {
    try {
      const docSnap = await getDoc(doc(db, 'jobs', jobId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job');
      return null;
    }
  },

  // UPDATE - Edit job
  async update(jobId, updates) {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Job updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
      throw error;
    }
  },

  // DELETE - Remove job
  async delete(jobId) {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      throw error;
    }
  }
};

// ==================== COURSES CRUD ====================

export const coursesService = {
  // CREATE - Add new course
  async create(courseData, userData) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        institutionId: userData.institutionId || userData.uid,
        institutionName: userData.institutionName || userData.fullName,
        status: 'active',
        enrollmentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Course added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to add course');
      throw error;
    }
  },

  // READ - Get all courses for an institution
  async getByInstitution(institutionId) {
    try {
      const q = query(
        collection(db, 'courses'),
        where('institutionId', '==', institutionId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      return [];
    }
  },

  // READ - Get all active courses
  async getAll() {
    try {
      const q = query(
        collection(db, 'courses'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      return [];
    }
  },

  // READ - Get single course
  async getById(courseId) {
    try {
      const docSnap = await getDoc(doc(db, 'courses', courseId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
      return null;
    }
  },

  // UPDATE - Edit course
  async update(courseId, updates) {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      throw error;
    }
  },

  // DELETE - Remove course
  async delete(courseId) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      throw error;
    }
  }
};

// ==================== APPLICATIONS CRUD ====================

export const applicationsService = {
  // CREATE - Submit application
  async create(applicationData, userData) {
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        ...applicationData,
        studentId: userData.uid,
        studentName: userData.fullName,
        studentEmail: userData.email,
        status: 'pending',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Application submitted successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      toast.error('Failed to submit application');
      throw error;
    }
  },

  // READ - Get applications by student
  async getByStudent(studentId) {
    try {
      const q = query(
        collection(db, 'applications'),
        where('studentId', '==', studentId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      return [];
    }
  },

  // READ - Get applications by company
  async getByCompany(companyId) {
    try {
      const q = query(
        collection(db, 'applications'),
        where('companyId', '==', companyId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      return [];
    }
  },

  // READ - Get applications by institution
  async getByInstitution(institutionId) {
    try {
      const q = query(
        collection(db, 'applications'),
        where('institutionId', '==', institutionId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      return [];
    }
  },

  // READ - Get single application
  async getById(applicationId) {
    try {
      const docSnap = await getDoc(doc(db, 'applications', applicationId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application');
      return null;
    }
  },

  // UPDATE - Update application status
  async updateStatus(applicationId, status, reviewerId) {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: reviewerId,
        updatedAt: serverTimestamp()
      });
      toast.success(`Application ${status}!`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      throw error;
    }
  },

  // UPDATE - Edit application
  async update(applicationId, updates) {
    try {
      await updateDoc(doc(db, 'applications', applicationId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Application updated successfully!');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      throw error;
    }
  },

  // DELETE - Withdraw application
  async delete(applicationId) {
    try {
      await deleteDoc(doc(db, 'applications', applicationId));
      toast.success('Application withdrawn successfully!');
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to withdraw application');
      throw error;
    }
  }
};

// ==================== USERS CRUD ====================

export const usersService = {
  // CREATE - Add new user (Admin only)
  async create(userData) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('User added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to add user');
      throw error;
    }
  },

  // READ - Get all users
  async getAll() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return [];
    }
  },

  // READ - Get users by role
  async getByRole(role) {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', role)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return [];
    }
  },

  // READ - Get single user
  async getById(userId) {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
      return null;
    }
  },

  // UPDATE - Edit user
  async update(userId, updates) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  },

  // DELETE - Remove user
  async delete(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  },

  // UPDATE - Toggle user active status
  async toggleActive(userId, isActive) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive,
        updatedAt: serverTimestamp()
      });
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
      throw error;
    }
  }
};

// ==================== INSTITUTIONS CRUD ====================

export const institutionsService = {
  // CREATE - Add new institution
  async create(institutionData) {
    try {
      const docRef = await addDoc(collection(db, 'institutions'), {
        ...institutionData,
        status: 'active',
        coursesCount: 0,
        studentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Institution added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating institution:', error);
      toast.error('Failed to add institution');
      throw error;
    }
  },

  // READ - Get all institutions
  async getAll() {
    try {
      const snapshot = await getDocs(collection(db, 'institutions'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error('Failed to load institutions');
      return [];
    }
  },

  // READ - Get single institution
  async getById(institutionId) {
    try {
      const docSnap = await getDoc(doc(db, 'institutions', institutionId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching institution:', error);
      toast.error('Failed to load institution');
      return null;
    }
  },

  // UPDATE - Edit institution
  async update(institutionId, updates) {
    try {
      await updateDoc(doc(db, 'institutions', institutionId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Institution updated successfully!');
    } catch (error) {
      console.error('Error updating institution:', error);
      toast.error('Failed to update institution');
      throw error;
    }
  },

  // DELETE - Remove institution
  async delete(institutionId) {
    try {
      await deleteDoc(doc(db, 'institutions', institutionId));
      toast.success('Institution deleted successfully!');
    } catch (error) {
      console.error('Error deleting institution:', error);
      toast.error('Failed to delete institution');
      throw error;
    }
  }
};

// ==================== COMPANIES CRUD ====================

export const companiesService = {
  // CREATE - Add new company
  async create(companyData) {
    try {
      const docRef = await addDoc(collection(db, 'companies'), {
        ...companyData,
        status: 'active',
        jobsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Company added successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error('Failed to add company');
      throw error;
    }
  },

  // READ - Get all companies
  async getAll() {
    try {
      const snapshot = await getDocs(collection(db, 'companies'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
      return [];
    }
  },

  // READ - Get single company
  async getById(companyId) {
    try {
      const docSnap = await getDoc(doc(db, 'companies', companyId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching company:', error);
      toast.error('Failed to load company');
      return null;
    }
  },

  // UPDATE - Edit company
  async update(companyId, updates) {
    try {
      await updateDoc(doc(db, 'companies', companyId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Company updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
      throw error;
    }
  },

  // DELETE - Remove company
  async delete(companyId) {
    try {
      await deleteDoc(doc(db, 'companies', companyId));
      toast.success('Company deleted successfully!');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
      throw error;
    }
  }
};

// Export all services
export default {
  jobs: jobsService,
  courses: coursesService,
  applications: applicationsService,
  users: usersService,
  institutions: institutionsService,
  companies: companiesService
};
