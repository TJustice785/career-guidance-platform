const { db, FieldValue } = require('../config/firebase.config');
const { v4: uuidv4 } = require('uuid');

const adminController = {
  // Add Institution
  addInstitution: async (req, res) => {
    try {
      const {
        name, description, address, phone, website, email, logoUrl,
        abbreviation, type, location, established, faculties, programs,
        facilities, admissionRequirements, tuitionFees
      } = req.body;

      // Validate required fields
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Institution name and email are required'
        });
      }

      const institutionData = {
        name,
        abbreviation: abbreviation || '',
        type: type || 'University',
        description: description || '',
        address: address || '',
        location: location || '',
        phone: phone || '',
        website: website || '',
        email: email.toLowerCase(),
        logoUrl: logoUrl || '',
        established: established || null,
        faculties: faculties || [],
        programs: programs || [],
        facilities: facilities || [],
        admissionRequirements: admissionRequirements || { diploma: '', degree: '' },
        tuitionFees: tuitionFees || { diploma: '', degree: '' },
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('institutions').add(institutionData);

      res.status(201).json({
        success: true,
        message: 'Institution added successfully',
        data: {
          id: docRef.id,
          ...institutionData
        }
      });
    } catch (error) {
      console.error('Error adding institution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add institution',
        error: error.message
      });
    }
  },

  // Update Institution
  updateInstitution: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if institution exists
      const institutionRef = db.collection('institutions').doc(id);
      const doc = await institutionRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Institution not found'
        });
      }

      // Prepare update data
      const updateData = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp()
      };

      // Update the document
      await institutionRef.update(updateData);

      // Get updated document
      const updatedDoc = await institutionRef.get();

      res.status(200).json({
        success: true,
        message: 'Institution updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Error updating institution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update institution',
        error: error.message
      });
    }
  },

  // Get All Institutions with Pagination
  getAllInstitutions: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = 'all'
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      // Build the base query
      let query = db.collection('institutions');

      // Apply status filter
      if (status !== 'all') {
        query = query.where('isActive', '==', status === 'active');
      }

      // First, get all institutions that match the status filter
      let allInstitutions = [];
      const snapshot = await query.orderBy('name').get();

      snapshot.forEach(doc => {
        const data = doc.data();
        allInstitutions.push({
          id: doc.id,
          ...data,
          // Format dates
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      // Apply search filter if needed
      if (search) {
        const searchLower = search.toLowerCase();
        allInstitutions = allInstitutions.filter(inst =>
          (inst.name && inst.name.toLowerCase().includes(searchLower)) ||
          (inst.email && inst.email.toLowerCase().includes(searchLower)) ||
          (inst.phone && inst.phone.includes(search))
        );
      }

      // Calculate pagination
      const total = allInstitutions.length;
      const totalPages = Math.ceil(total / limitNumber);

      // Apply pagination
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limitNumber, total);
      const paginatedInstitutions = allInstitutions.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        data: paginatedInstitutions,
        pagination: {
          total: total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Error fetching institutions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch institutions',
        error: error.message
      });
    }
  },

  // Delete Institution
  deleteInstitution: async (req, res) => {
    try {
      const { id } = req.params;

      const institutionRef = db.collection('institutions').doc(id);
      const doc = await institutionRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Institution not found'
        });
      }

      await institutionRef.delete();

      res.status(200).json({
        success: true,
        message: 'Institution deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting institution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete institution',
        error: error.message
      });
    }
  },

  // Toggle Institution Status
  toggleInstitutionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if institution exists
      const institutionRef = db.collection('institutions').doc(id);
      const doc = await institutionRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Institution not found'
        });
      }

      // Toggle isActive status
      const currentStatus = doc.data().isActive;
      await institutionRef.update({
        isActive: !currentStatus,
        updatedAt: FieldValue.serverTimestamp()
      });

      res.status(200).json({
        success: true,
        message: `Institution ${!currentStatus ? 'deactivated' : 'activated'} successfully`,
        data: {
          id: doc.id,
          isActive: !currentStatus
        }
      });
    } catch (error) {
      console.error('Error toggling institution status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update institution status',
        error: error.message
      });
    }
  },

  // Get Institution by ID
  getInstitutionById: async (req, res) => {
    try {
      const { id } = req.params;

      const doc = await db.collection('institutions').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Institution not found'
        });
      }

      const data = doc.data();

      res.status(200).json({
        success: true,
        data: {
          id: doc.id,
          ...data,
          // Format dates
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching institution:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch institution',
        error: error.message
      });
    }
  },

  // ==================== COMPANY MANAGEMENT ====================
  // Add Company
  addCompany: async (req, res) => {
    try {
      const {
        companyName, description, industry, address, phone, website, email, logoUrl,
        location, employees, founded, benefits, departments
      } = req.body;

      if (!companyName || !email) {
        return res.status(400).json({
          success: false,
          message: 'Company name and email are required'
        });
      }

      const companyData = {
        companyName,
        description: description || '',
        industry: industry || '',
        address: address || '',
        location: location || '',
        phone: phone || '',
        website: website || '',
        email: email.toLowerCase(),
        logoUrl: logoUrl || '',
        employees: employees || null,
        founded: founded || null,
        benefits: benefits || [],
        departments: departments || [],
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('companies').add(companyData);

      res.status(201).json({
        success: true,
        message: 'Company added successfully',
        data: {
          id: docRef.id,
          ...companyData
        }
      });
    } catch (error) {
      console.error('Error adding company:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add company',
        error: error.message
      });
    }
  },

  // Update Company
  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const companyRef = db.collection('companies').doc(id);
      const doc = await companyRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      const updateData = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp()
      };

      await companyRef.update(updateData);
      const updatedDoc = await companyRef.get();

      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update company',
        error: error.message
      });
    }
  },

  // Get All Companies with Pagination
  getAllCompanies: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = 'all'
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      // Build the base query
      let query = db.collection('companies');

      // Apply status filter
      if (status !== 'all') {
        query = query.where('isActive', '==', status === 'active');
      }

      // First, get all companies that match the status filter
      let allCompanies = [];
      const snapshot = await query.orderBy('companyName').get();

      snapshot.forEach(doc => {
        const data = doc.data();
        allCompanies.push({
          id: doc.id,
          ...data,
          // Format dates
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      // Apply search filter if needed
      if (search) {
        const searchLower = search.toLowerCase();
        allCompanies = allCompanies.filter(company =>
          (company.companyName && company.companyName.toLowerCase().includes(searchLower)) ||
          (company.email && company.email.toLowerCase().includes(searchLower)) ||
          (company.industry && company.industry.toLowerCase().includes(searchLower))
        );
      }

      // Calculate pagination
      const total = allCompanies.length;
      const totalPages = Math.ceil(total / limitNumber);

      // Apply pagination
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limitNumber, total);
      const paginatedCompanies = allCompanies.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        data: paginatedCompanies,
        pagination: {
          total: total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch companies',
        error: error.message
      });
    }
  },

  // Delete Company
  deleteCompany: async (req, res) => {
    try {
      const { id } = req.params;

      const companyRef = db.collection('companies').doc(id);
      const doc = await companyRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      await companyRef.delete();

      res.status(200).json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete company',
        error: error.message
      });
    }
  },

  // ==================== COURSE MANAGEMENT ====================
  // Add Course
  addCourse: async (req, res) => {
    try {
      const { institutionId, name, description, duration, requirements, isActive } = req.body;

      if (!institutionId || !name) {
        return res.status(400).json({
          success: false,
          message: 'Institution ID and course name are required'
        });
      }

      const courseData = {
        institutionId,
        name,
        description: description || '',
        duration: duration || '',
        requirements: requirements || '',
        isActive: isActive !== false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('courses').add(courseData);

      res.status(201).json({
        success: true,
        message: 'Course added successfully',
        data: {
          id: docRef.id,
          ...courseData
        }
      });
    } catch (error) {
      console.error('Error adding course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add course',
        error: error.message
      });
    }
  },

  // Update Course
  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const courseRef = db.collection('courses').doc(id);
      const doc = await courseRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      const updateData = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp()
      };

      await courseRef.update(updateData);
      const updatedDoc = await courseRef.get();

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update course',
        error: error.message
      });
    }
  },

  // Delete Course
  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;

      const courseRef = db.collection('courses').doc(id);
      const doc = await courseRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      await courseRef.delete();

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete course',
        error: error.message
      });
    }
  },

  // Get All Courses
  getAllCourses: async (req, res) => {
    try {
      const snapshot = await db.collection('courses').get();
      
      const courses = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        courses.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      res.status(200).json({
        success: true,
        data: courses
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
  },

  // ==================== APPLICATION MANAGEMENT ====================
  // Get All Applications
  getAllApplications: async (req, res) => {
    try {
      const snapshot = await db.collection('applications').orderBy('applicationDate', 'desc').get();
      
      const applications = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          ...data,
          applicationDate: data.applicationDate?.toDate()?.toISOString(),
          lastUpdated: data.lastUpdated?.toDate()?.toISOString(),
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch applications',
        error: error.message
      });
    }
  },

  // Get User by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const doc = await db.collection('users').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const data = doc.data();

      res.status(200).json({
        success: true,
        data: {
          id: doc.id,
          uid: doc.id,
          ...data,
          // Format dates
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString(),
          lastLogin: data.lastLogin?.toDate()?.toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error.message
      });
    }
  },

  // Create User
  createUser: async (req, res) => {
    try {
      const {
        email, password, role, firstName, lastName, name,
        phone, address, description, industry, website
      } = req.body;

      // Validate required fields
      if (!email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and role are required'
        });
      }

      // Check if user already exists
      const existingUser = await db.collection('users').where('email', '==', email.toLowerCase()).get();
      if (!existingUser.empty) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Prepare user data based on role
      const userData = {
        email: email.toLowerCase(),
        role,
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      // Add role-specific fields
      if (role === 'student') {
        userData.firstName = firstName || '';
        userData.lastName = lastName || '';
        userData.phone = phone || '';
        userData.address = address || '';
      } else if (role === 'institute' || role === 'company') {
        userData.name = name || '';
        userData.description = description || '';
        userData.phone = phone || '';
        userData.website = website || '';
        userData.address = address || '';
        if (role === 'company') {
          userData.industry = industry || '';
        }
      }

      // For now, we'll store the user in Firestore
      // In a real implementation, you'd also create the user in Firebase Auth
      const docRef = await db.collection('users').add(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
          id: docRef.id,
          uid: docRef.id,
          ...userData
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      });
    }
  },

  // Update User
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if user exists
      const userRef = db.collection('users').doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Remove sensitive fields that shouldn't be updated directly
      delete updates.password;
      delete updates.uid;
      delete updates.id;

      // Prepare update data
      const updateData = {
        ...updates,
        updatedAt: FieldValue.serverTimestamp()
      };

      // Update the document
      await userRef.update(updateData);

      // Get updated document
      const updatedDoc = await userRef.get();

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          id: updatedDoc.id,
          uid: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  },

  // Delete User
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const userRef = db.collection('users').doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Optional: Check if user has admin role and prevent deletion
      const userData = doc.data();
      if (userData.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete admin users'
        });
      }

      await userRef.delete();

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  },

  // Toggle User Status
  toggleUserStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if user exists
      const userRef = db.collection('users').doc(id);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userData = doc.data();

      // Optional: Prevent deactivating admin users
      if (userData.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate admin users'
        });
      }

      // Toggle isActive status
      const currentStatus = userData.isActive !== false; // Consider undefined as active
      await userRef.update({
        isActive: !currentStatus,
        updatedAt: FieldValue.serverTimestamp()
      });

      res.status(200).json({
        success: true,
        message: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        data: {
          id: doc.id,
          isActive: !currentStatus
        }
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: error.message
      });
    }
  },

  // ==================== DASHBOARD STATS ====================
  // Get Dashboard Statistics
  getDashboardStats: async (req, res) => {
    try {
      // Get total users count
      const usersSnapshot = await db.collection('users').get();
      const totalUsers = usersSnapshot.size;

      // Get total students count
      const studentsSnapshot = await db.collection('users').where('role', '==', 'student').get();
      const totalStudents = studentsSnapshot.size;

      // Get total institutions count (active ones)
      const institutionsSnapshot = await db.collection('institutions').where('isActive', '!=', false).get();
      const totalInstitutions = institutionsSnapshot.size;

      // Get total companies count (active ones)
      const companiesSnapshot = await db.collection('companies').where('isActive', '!=', false).get();
      const totalCompanies = companiesSnapshot.size;

      // Get total courses count (active ones)
      const coursesSnapshot = await db.collection('courses').where('isActive', '!=', false).get();
      const totalCourses = coursesSnapshot.size;

      // Get active applications count (pending or under_review)
      const applicationsSnapshot = await db.collection('applications')
        .where('status', 'in', ['pending', 'under_review'])
        .get();
      const activeApplications = applicationsSnapshot.size;

      // Get total jobs count (active ones)
      const jobsSnapshot = await db.collection('jobs').where('status', '==', 'active').get();
      const totalJobs = jobsSnapshot.size;

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalStudents,
          totalInstitutions,
          totalCompanies,
          totalCourses,
          activeApplications,
          totalJobs
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      });
    }
  },

  // Get Application by ID
  getApplicationById: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await db.collection('applications').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const data = doc.data();
      res.status(200).json({
        success: true,
        data: {
          id: doc.id,
          ...data,
          applicationDate: data.applicationDate?.toDate()?.toISOString(),
          lastUpdated: data.lastUpdated?.toDate()?.toISOString()
        }
      });
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch application',
        error: error.message
      });
    }
  },

  // Update Application Status
  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const appRef = db.collection('applications').doc(id);
      const doc = await appRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      const updateData = {
        status,
        lastUpdated: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      // Add note if provided
      if (note) {
        const currentData = doc.data();
        const notes = currentData.notes || [];
        notes.push({
          author: 'Admin',
          note,
          date: new Date()
        });
        updateData.notes = notes;
      }

      await appRef.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully'
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update application status',
        error: error.message
      });
    }
  },

  // Delete Application
  deleteApplication: async (req, res) => {
    try {
      const { id } = req.params;
      
      const appRef = db.collection('applications').doc(id);
      const doc = await appRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      await appRef.delete();

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete application',
        error: error.message
      });
    }
  }
};

module.exports = adminController;
