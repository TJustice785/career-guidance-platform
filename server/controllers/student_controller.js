const { db, bucket, Timestamp, FieldValue } = require('../config/firebase.config');
const { sendNotificationEmail } = require('../services/email_service');

const studentController = {
  // Get all courses (public)
  getCourses: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        status = 'active',
        institutionId = '',
        category = ''
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Query the courses collection
      const snapshot = await db.collection('courses').get();

      let courses = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // Apply status filter
        if (status !== 'all' && data.isActive !== (status === 'active')) {
          return; // Skip this course
        }

        courses.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          duration: data.duration,
          requirements: data.requirements,
          fees: data.fees,
          category: data.category,
          level: data.level,
          institutionId: data.institutionId,
          institutionName: data.institutionName,
          careerProspects: data.careerProspects,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      // Apply institution filter
      if (institutionId) {
        courses = courses.filter(course => course.institutionId === institutionId);
      }

      // Apply category filter
      if (category) {
        courses = courses.filter(course => course.category === category);
      }

      // Sort by name
      courses.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      // Apply search filter if needed
      if (search) {
        const searchLower = search.toLowerCase();
        courses = courses.filter(course =>
          (course.name && course.name.toLowerCase().includes(searchLower)) ||
          (course.description && course.description.toLowerCase().includes(searchLower)) ||
          (course.institutionName && course.institutionName.toLowerCase().includes(searchLower))
        );
      }

      // Calculate pagination
      const total = courses.length;
      const totalPages = Math.ceil(total / limitNumber);
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = Math.min(startIndex + limitNumber, total);
      const paginatedCourses = courses.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        status: 'success',
        data: paginatedCourses,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
  },

  // Get all institutions
  getInstitutions: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        status = 'active' 
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      // Query the institutions collection
      const snapshot = await db.collection('institutions').get();
      
      let institutions = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        // Apply status filter
        if (status !== 'all' && data.isActive !== (status === 'active')) {
          return; // Skip this institution
        }
        
        institutions.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          address: data.address,
          phone: data.phone,
          website: data.website,
          email: data.email,
          logoUrl: data.logoUrl,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      // Sort by name
      institutions.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      // Apply search filter if needed
      if (search) {
        const searchLower = search.toLowerCase();
        institutions = institutions.filter(inst => 
          (inst.name && inst.name.toLowerCase().includes(searchLower)) ||
          (inst.email && inst.email.toLowerCase().includes(searchLower)) ||
          (inst.address && inst.address.toLowerCase().includes(searchLower))
        );
      }

      // Calculate pagination
      const total = institutions.length;
      const totalPages = Math.ceil(total / limitNumber);
      const startIndex = (pageNumber - 1) * limitNumber;
      const endIndex = Math.min(startIndex + limitNumber, total);
      const paginatedInstitutions = institutions.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        status: 'success',
        data: paginatedInstitutions,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1
        }
      });
    } catch (error) {
      console.error('Get institutions error:', error);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Failed to fetch institutions',
        error: error.message
      });
    }
  },

  // Get courses for a specific institution
  getInstitutionCourses: async (req, res) => {
    try {
      const { institutionId } = req.params;

      // Get all courses for this institution (no compound index needed)
      const coursesSnapshot = await db
        .collection('courses')
        .where('institutionId', '==', institutionId)
        .get();

      const courses = [];
      coursesSnapshot.forEach(doc => {
        const data = doc.data();
        // Filter active courses in memory
        if (data.isActive !== false) { // Include if isActive is true or undefined
          courses.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate()?.toISOString(),
            updatedAt: data.updatedAt?.toDate()?.toISOString()
          });
        }
      });

      res.status(200).json({
        success: true,
        status: 'success',
        data: courses
      });
    } catch (error) {
      console.error('Get institution courses error:', error);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
  },

  // Apply for a course
  applyForCourse: async (req, res) => {
    try {
      const { uid } = req.user;
      const { institutionId, courseId, qualifications } = req.body;

      // Check if student already has 2 applications for this institution
      const existingApplications = await db
        .collection('applications')
        .where('studentId', '==', uid)
        .where('institutionId', '==', institutionId)
        .where('status', 'in', ['pending', 'under_review'])
        .get();

      if (existingApplications.size >= 2) {
        return res.status(400).json({
          status: 'error',
          message: 'You can only apply for a maximum of 2 courses per institution'
        });
      }

      // Check if student already applied for this specific course
      const duplicateApplication = await db
        .collection('applications')
        .where('studentId', '==', uid)
        .where('courseId', '==', courseId)
        .where('status', 'in', ['pending', 'under_review', 'admitted'])
        .get();

      if (!duplicateApplication.empty) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already applied for this course'
        });
      }

      // Get course details
      const courseDoc = await db.collection('courses').doc(courseId).get();
      if (!courseDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Course not found'
        });
      }

      const courseData = courseDoc.data();

      // Check if student meets minimum requirements
      const meetsRequirements = checkQualifications(qualifications, courseData.requirements);
      if (!meetsRequirements) {
        return res.status(400).json({
          status: 'error',
          message: 'You do not meet the minimum requirements for this course'
        });
      }

      // Create application
      const applicationData = {
        studentId: uid,
        institutionId,
        courseId,
        courseName: courseData.name,
        qualifications,
        status: 'pending',
        appliedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const applicationRef = await db.collection('applications').add(applicationData);

      // Update student's applications array
      await db.collection('users').doc(uid).update({
        applications: FieldValue.arrayUnion(applicationRef.id)
      });

      // Send notification to institution
      await db.collection('notifications').add({
        userId: institutionId,
        type: 'new_application',
        title: 'New Course Application',
        message: `A student has applied for ${courseData.name}`,
        applicationId: applicationRef.id,
        read: false,
        createdAt: Timestamp.now()
      });

      res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: {
          applicationId: applicationRef.id,
          ...applicationData
        }
      });
    } catch (error) {
      console.error('Apply for course error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit application',
        error: error.message
      });
    }
  },

  // Get student's applications
  getMyApplications: async (req, res) => {
    try {
      const { uid } = req.user;

      const applicationsSnapshot = await db
        .collection('applications')
        .where('studentId', '==', uid)
        .orderBy('appliedAt', 'desc')
        .get();

      const applications = [];
      for (const doc of applicationsSnapshot.docs) {
        const appData = doc.data();
        
        // Get institution details
        const institutionDoc = await db.collection('users').doc(appData.institutionId).get();
        const institutionData = institutionDoc.exists ? institutionDoc.data() : {};

        applications.push({
          id: doc.id,
          ...appData,
          institutionName: institutionData.name || 'Unknown Institution'
        });
      }

      res.status(200).json({
        status: 'success',
        data: applications
      });
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch applications',
        error: error.message
      });
    }
  },

  // Get student's admissions
  getMyAdmissions: async (req, res) => {
    try {
      const { uid } = req.user;

      const admissionsSnapshot = await db
        .collection('admissions')
        .where('studentId', '==', uid)
        .orderBy('admittedAt', 'desc')
        .get();

      const admissions = [];
      for (const doc of admissionsSnapshot.docs) {
        const admissionData = doc.data();
        
        // Get institution details
        const institutionDoc = await db.collection('users').doc(admissionData.institutionId).get();
        const institutionData = institutionDoc.exists ? institutionDoc.data() : {};

        admissions.push({
          id: doc.id,
          ...admissionData,
          institutionName: institutionData.name || 'Unknown Institution'
        });
      }

      res.status(200).json({
        status: 'success',
        data: admissions
      });
    } catch (error) {
      console.error('Get admissions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch admissions',
        error: error.message
      });
    }
  },

  // Accept admission (and reject others automatically)
  acceptAdmission: async (req, res) => {
    try {
      const { uid, email } = req.user;
      const { admissionId } = req.params;

      // Get the admission being accepted
      const admissionDoc = await db.collection('admissions').doc(admissionId).get();
      if (!admissionDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Admission not found'
        });
      }

      const admissionData = admissionDoc.data();

      if (admissionData.studentId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      if (admissionData.status === 'accepted') {
        return res.status(400).json({
          status: 'error',
          message: 'Admission already accepted'
        });
      }

      // Start a batch write
      const batch = db.batch();

      // Accept this admission
      batch.update(db.collection('admissions').doc(admissionId), {
        status: 'accepted',
        acceptedAt: Timestamp.now()
      });

      // Get all other admissions for this student
      const otherAdmissionsSnapshot = await db
        .collection('admissions')
        .where('studentId', '==', uid)
        .where('status', '==', 'admitted')
        .get();

      // Reject other admissions and move waiting list students
      for (const doc of otherAdmissionsSnapshot.docs) {
        if (doc.id !== admissionId) {
          const otherAdmission = doc.data();
          
          // Reject this admission
          batch.update(doc.ref, {
            status: 'auto_rejected',
            rejectedAt: Timestamp.now(),
            reason: 'Student accepted admission at another institution'
          });

          // Find waiting list student for this course
          const waitingListSnapshot = await db
            .collection('applications')
            .where('courseId', '==', otherAdmission.courseId)
            .where('status', '==', 'waiting_list')
            .orderBy('appliedAt', 'asc')
            .limit(1)
            .get();

          if (!waitingListSnapshot.empty) {
            const waitingStudent = waitingListSnapshot.docs[0];
            const waitingStudentData = waitingStudent.data();

            // Create admission for waiting list student
            const newAdmissionRef = db.collection('admissions').doc();
            batch.set(newAdmissionRef, {
              studentId: waitingStudentData.studentId,
              institutionId: otherAdmission.institutionId,
              courseId: otherAdmission.courseId,
              courseName: otherAdmission.courseName,
              status: 'admitted',
              admittedAt: Timestamp.now(),
              movedFromWaitingList: true
            });

            // Update waiting list application status
            batch.update(waitingStudent.ref, {
              status: 'admitted',
              updatedAt: Timestamp.now()
            });

            // Send notification to waiting list student
            const notificationRef = db.collection('notifications').doc();
            batch.set(notificationRef, {
              userId: waitingStudentData.studentId,
              type: 'admission',
              title: 'Congratulations! You have been admitted',
              message: `You have been moved from the waiting list and admitted to ${otherAdmission.courseName}`,
              admissionId: newAdmissionRef.id,
              read: false,
              createdAt: Timestamp.now()
            });
          }
        }
      }

      // Commit all changes
      await batch.commit();

      // Send confirmation email
      await sendNotificationEmail(
        email,
        'Admission Accepted',
        `You have successfully accepted your admission to ${admissionData.courseName}. Other admissions have been automatically declined.`
      );

      res.status(200).json({
        status: 'success',
        message: 'Admission accepted successfully. Other admissions have been declined.'
      });
    } catch (error) {
      console.error('Accept admission error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to accept admission',
        error: error.message
      });
    }
  },

  // Upload document
  uploadDocument: async (req, res) => {
    try {
      const { uid } = req.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      const { documentType, description } = req.body;

      // Upload to Firebase Storage
      const fileName = `documents/${uid}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      // Make file publicly accessible
      await fileUpload.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Save document metadata to Firestore
      const documentData = {
        userId: uid,
        documentType: documentType || 'other',
        fileName: file.originalname,
        fileUrl: publicUrl,
        filePath: fileName,
        description: description || '',
        uploadedAt: Timestamp.now()
      };

      const documentRef = await db.collection('documents').add(documentData);

      // Update user's documents array
      await db.collection('users').doc(uid).update({
        documents: FieldValue.arrayUnion(documentRef.id)
      });

      res.status(201).json({
        status: 'success',
        message: 'Document uploaded successfully',
        data: {
          documentId: documentRef.id,
          ...documentData
        }
      });
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload document',
        error: error.message
      });
    }
  },

  // Get student's documents
  getMyDocuments: async (req, res) => {
    try {
      const { uid } = req.user;

      const documentsSnapshot = await db
        .collection('documents')
        .where('userId', '==', uid)
        .orderBy('uploadedAt', 'desc')
        .get();

      const documents = [];
      documentsSnapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        status: 'success',
        data: documents
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch documents',
        error: error.message
      });
    }
  },

  // Delete document
  deleteDocument: async (req, res) => {
    try {
      const { uid } = req.user;
      const { documentId } = req.params;

      const documentDoc = await db.collection('documents').doc(documentId).get();
      if (!documentDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Document not found'
        });
      }

      const documentData = documentDoc.data();

      if (documentData.userId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Delete file from Storage
      await bucket.file(documentData.filePath).delete();

      // Delete document metadata
      await db.collection('documents').doc(documentId).delete();

      // Update user's documents array
      await db.collection('users').doc(uid).update({
        documents: FieldValue.arrayRemove(documentId)
      });

      res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully'
      });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete document',
        error: error.message
      });
    }
  },

  // Upload transcript
  uploadTranscript: async (req, res) => {
    try {
      const { uid } = req.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      // Upload to Firebase Storage
      const fileName = `transcripts/${uid}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Update user profile with transcript
      await db.collection('users').doc(uid).update({
        transcript: {
          fileName: file.originalname,
          fileUrl: publicUrl,
          filePath: fileName,
          uploadedAt: Timestamp.now()
        },
        hasCompletedStudies: true,
        updatedAt: Timestamp.now()
      });

      res.status(200).json({
        status: 'success',
        message: 'Transcript uploaded successfully',
        data: {
          fileUrl: publicUrl
        }
      });
    } catch (error) {
      console.error('Upload transcript error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload transcript',
        error: error.message
      });
    }
  },

  // Upload certificate
  uploadCertificate: async (req, res) => {
    try {
      const { uid } = req.user;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      const { certificateName, issuer, issueDate } = req.body;

      // Upload to Firebase Storage
      const fileName = `certificates/${uid}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      // Add certificate to user's certificates array
      const certificateData = {
        name: certificateName,
        issuer,
        issueDate,
        fileName: file.originalname,
        fileUrl: publicUrl,
        filePath: fileName,
        uploadedAt: Timestamp.now()
      };

      await db.collection('users').doc(uid).update({
        certificates: FieldValue.arrayUnion(certificateData)
      });

      res.status(200).json({
        status: 'success',
        message: 'Certificate uploaded successfully',
        data: certificateData
      });
    } catch (error) {
      console.error('Upload certificate error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to upload certificate',
        error: error.message
      });
    }
  },

  // Get available jobs
  getAvailableJobs: async (req, res) => {
    try {
      const { uid } = req.user;

      // Get student profile
      const studentDoc = await db.collection('users').doc(uid).get();
      const studentData = studentDoc.data();

      // Only show jobs if student has completed studies
      if (!studentData.hasCompletedStudies) {
        return res.status(200).json({
          status: 'success',
          data: [],
          message: 'Complete your studies and upload your transcript to view job opportunities'
        });
      }

      // Get all jobs (no index required)
      const jobsSnapshot = await db.collection('jobs').get();

      const jobs = [];
      for (const doc of jobsSnapshot.docs) {
        const jobData = doc.data();
        
        // Filter by active status
        if (jobData.status !== 'active') {
          continue;
        }
        
        // Check if student qualifies for this job
        const qualifies = checkJobQualification(studentData, jobData);
        
        if (qualifies) {
          // Get company details from companies collection
          let companyName = jobData.companyName || 'Unknown Company';
          
          if (jobData.companyId) {
            const companyDoc = await db.collection('companies').doc(jobData.companyId).get();
            if (companyDoc.exists) {
              companyName = companyDoc.data().companyName || companyName;
            }
          }

          jobs.push({
            id: doc.id,
            ...jobData,
            companyName,
            postedAt: jobData.postedAt?.toDate()?.toISOString(),
            deadline: jobData.deadline?.toDate()?.toISOString(),
            createdAt: jobData.createdAt?.toDate()?.toISOString(),
            updatedAt: jobData.updatedAt?.toDate()?.toISOString()
          });
        }
      }
      
      // Sort by posted date (newest first)
      jobs.sort((a, b) => {
        const dateA = a.postedAt ? new Date(a.postedAt) : new Date(0);
        const dateB = b.postedAt ? new Date(b.postedAt) : new Date(0);
        return dateB - dateA;
      });

      res.status(200).json({
        status: 'success',
        data: jobs
      });
    } catch (error) {
      console.error('Get available jobs error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  },

  // Apply for job
  applyForJob: async (req, res) => {
    try {
      const { uid, email } = req.user;
      const { jobId } = req.params;
      const { coverLetter, additionalInfo } = req.body;

      // Check if already applied
      const existingApplication = await db
        .collection('jobApplications')
        .where('studentId', '==', uid)
        .where('jobId', '==', jobId)
        .get();

      if (!existingApplication.empty) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already applied for this job'
        });
      }

      // Get job details
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      if (!jobDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found'
        });
      }

      const jobData = jobDoc.data();

      // Get student profile
      const studentDoc = await db.collection('users').doc(uid).get();
      const studentData = studentDoc.data();

      // Check qualification
      const qualifies = checkJobQualification(studentData, jobData);
      if (!qualifies) {
        return res.status(400).json({
          status: 'error',
          message: 'You do not meet the requirements for this job'
        });
      }

      // Create job application
      const applicationData = {
        studentId: uid,
        jobId,
        companyId: jobData.companyId,
        jobTitle: jobData.title,
        coverLetter: coverLetter || '',
        additionalInfo: additionalInfo || '',
        status: 'pending',
        appliedAt: Timestamp.now()
      };

      const applicationRef = await db.collection('jobApplications').add(applicationData);

      // Update job applications count
      await db.collection('jobs').doc(jobId).update({
        applicationsCount: FieldValue.increment(1)
      });

      // Send notification to company
      await db.collection('notifications').add({
        userId: jobData.companyId,
        type: 'job_application',
        title: 'New Job Application',
        message: `A qualified candidate has applied for ${jobData.title}`,
        jobApplicationId: applicationRef.id,
        read: false,
        createdAt: Timestamp.now()
      });

      res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully',
        data: {
          applicationId: applicationRef.id,
          ...applicationData
        }
      });
    } catch (error) {
      console.error('Apply for job error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to submit job application',
        error: error.message
      });
    }
  },

  // Get student's job applications
  getMyJobApplications: async (req, res) => {
    try {
      const { uid } = req.user;

      const applicationsSnapshot = await db
        .collection('jobApplications')
        .where('studentId', '==', uid)
        .orderBy('appliedAt', 'desc')
        .get();

      const applications = [];
      for (const doc of applicationsSnapshot.docs) {
        const appData = doc.data();
        
        // Get company details
        const companyDoc = await db.collection('users').doc(appData.companyId).get();
        const companyData = companyDoc.exists ? companyDoc.data() : {};

        applications.push({
          id: doc.id,
          ...appData,
          companyName: companyData.name || 'Unknown Company'
        });
      }

      res.status(200).json({
        status: 'success',
        data: applications
      });
    } catch (error) {
      console.error('Get job applications error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch job applications',
        error: error.message
      });
    }
  },

  // Get notifications
  getNotifications: async (req, res) => {
    try {
      const { uid } = req.user;

      const notificationsSnapshot = await db
        .collection('notifications')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const notifications = [];
      notificationsSnapshot.forEach(doc => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch notifications',
        error: error.message
      });
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (req, res) => {
    try {
      const { uid } = req.user;
      const { notificationId } = req.params;

      const notificationDoc = await db.collection('notifications').doc(notificationId).get();
      if (!notificationDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Notification not found'
        });
      }

      const notificationData = notificationDoc.data();
      if (notificationData.userId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      await db.collection('notifications').doc(notificationId).update({
        read: true,
        readAt: Timestamp.now()
      });

      res.status(200).json({
        status: 'success',
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Mark notification as read error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to mark notification as read',
        error: error.message
      });
    }
  }
};

// Helper function to check qualifications
function checkQualifications(studentQualifications, courseRequirements) {
  // Implement your qualification checking logic here
  // This is a simplified version
  if (!courseRequirements || !courseRequirements.minimumGrade) {
    return true;
  }

  // Add your custom logic based on your requirements
  return true;
}

// Helper function to check job qualification
function checkJobQualification(studentData, jobData) {
  if (!studentData.hasCompletedStudies) {
    return false;
  }

  // Check if job has requirements
  if (!jobData.requirements) {
    return true;
  }

  // Add your custom qualification logic here
  // For example: check academic performance, certificates, experience, etc.
  return true;
}

module.exports = studentController;