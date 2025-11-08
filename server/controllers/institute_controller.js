const { db, Timestamp, FieldValue } = require('../config/firebase.config');
const { sendAdmissionEmail } = require('../services/email.service');

const instituteController = {
  // ==================== FACULTY METHODS ====================
  // Add Faculty
  addFaculty: async (req, res) => {
    try {
      const { uid } = req.user;
      const { name, description } = req.body;

      const facultyData = {
        institutionId: uid,
        name,
        description: description || '',
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const facultyRef = await db.collection('faculties').add(facultyData);

      res.status(201).json({
        status: 'success',
        message: 'Faculty added successfully',
        data: {
          id: facultyRef.id,
          ...facultyData
        }
      });
    } catch (error) {
      console.error('Add faculty error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add faculty',
        error: error.message
      });
    }
  },

  // Get Faculties
  getFaculties: async (req, res) => {
    try {
      const { uid } = req.user;

      const facultiesSnapshot = await db
        .collection('faculties')
        .where('institutionId', '==', uid)
        .orderBy('name')
        .get();

      const faculties = [];
      facultiesSnapshot.forEach(doc => {
        faculties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      res.status(200).json({
        status: 'success',
        data: faculties
      });
    } catch (error) {
      console.error('Get faculties error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch faculties',
        error: error.message
      });
    }
  },

  // Update Faculty
  updateFaculty: async (req, res) => {
    try {
      const { uid } = req.user;
      const { facultyId } = req.params;
      const updates = req.body;

      // Verify ownership
      const facultyDoc = await db.collection('faculties').doc(facultyId).get();
      if (!facultyDoc.exists || facultyDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      delete updates.createdAt;
      delete updates.institutionId;
      updates.updatedAt = Timestamp.now();

      await db.collection('faculties').doc(facultyId).update(updates);

      const updatedDoc = await db.collection('faculties').doc(facultyId).get();

      res.status(200).json({
        status: 'success',
        message: 'Faculty updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update faculty error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update faculty',
        error: error.message
      });
    }
  },

  // Delete Faculty
  deleteFaculty: async (req, res) => {
    try {
      const { uid } = req.user;
      const { facultyId } = req.params;

      // Verify ownership
      const facultyDoc = await db.collection('faculties').doc(facultyId).get();
      if (!facultyDoc.exists || facultyDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check if faculty has courses
      const coursesSnapshot = await db
        .collection('courses')
        .where('facultyId', '==', facultyId)
        .get();

      if (!coursesSnapshot.empty) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete faculty with existing courses'
        });
      }

      await db.collection('faculties').doc(facultyId).delete();

      res.status(200).json({
        status: 'success',
        message: 'Faculty deleted successfully'
      });
    } catch (error) {
      console.error('Delete faculty error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete faculty',
        error: error.message
      });
    }
  },

  // ==================== COURSE METHODS ====================
  // Add Course
  addCourse: async (req, res) => {
    try {
      const { uid } = req.user;
      const { facultyId, name, description, duration, requirements, tuitionFee } = req.body;

      // Verify faculty belongs to this institution
      const facultyDoc = await db.collection('faculties').doc(facultyId).get();
      if (!facultyDoc.exists || facultyDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const courseData = {
        institutionId: uid,
        facultyId,
        name,
        description: description || '',
        duration: duration || '',
        requirements: requirements || {},
        tuitionFee: tuitionFee || 0,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const courseRef = await db.collection('courses').add(courseData);

      res.status(201).json({
        status: 'success',
        message: 'Course added successfully',
        data: {
          id: courseRef.id,
          ...courseData
        }
      });
    } catch (error) {
      console.error('Add course error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to add course',
        error: error.message
      });
    }
  },

  // Get Courses
  getCourses: async (req, res) => {
    try {
      const { uid } = req.user;
      const { facultyId, status } = req.query;

      let query = db
        .collection('courses')
        .where('institutionId', '==', uid);

      if (facultyId) {
        query = query.where('facultyId', '==', facultyId);
      }
      if (status) {
        query = query.where('isActive', '==', status === 'active');
      }

      const coursesSnapshot = await query.orderBy('name').get();

      const courses = [];
      for (const doc of coursesSnapshot.docs) {
        const courseData = doc.data();
        
        // Get faculty name
        const facultyDoc = await db.collection('faculties').doc(courseData.facultyId).get();
        
        courses.push({
          id: doc.id,
          ...courseData,
          facultyName: facultyDoc.exists ? facultyDoc.data().name : 'Unknown'
        });
      }

      res.status(200).json({
        status: 'success',
        data: courses
      });
    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch courses',
        error: error.message
      });
    }
  },

  // Update Course
  updateCourse: async (req, res) => {
    try {
      const { uid } = req.user;
      const { courseId } = req.params;
      const updates = req.body;

      // Verify ownership
      const courseDoc = await db.collection('courses').doc(courseId).get();
      if (!courseDoc.exists || courseDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      delete updates.createdAt;
      delete updates.institutionId;
      updates.updatedAt = Timestamp.now();

      await db.collection('courses').doc(courseId).update(updates);

      const updatedDoc = await db.collection('courses').doc(courseId).get();

      res.status(200).json({
        status: 'success',
        message: 'Course updated successfully',
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update course',
        error: error.message
      });
    }
  },

  // Delete Course
  deleteCourse: async (req, res) => {
    try {
      const { uid } = req.user;
      const { courseId } = req.params;

      // Verify ownership
      const courseDoc = await db.collection('courses').doc(courseId).get();
      if (!courseDoc.exists || courseDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check if course has applications
      const applicationsSnapshot = await db
        .collection('applications')
        .where('courseId', '==', courseId)
        .get();

      if (!applicationsSnapshot.empty) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete course with existing applications'
        });
      }

      await db.collection('courses').doc(courseId).delete();

      res.status(200).json({
        status: 'success',
        message: 'Course deleted successfully'
      });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete course',
        error: error.message
      });
    }
  },

  // ==================== APPLICATION METHODS ====================
  // Get Applications
  getApplications: async (req, res) => {
    try {
      const { uid } = req.user;
      const { status, facultyId, courseId } = req.query;

      let query = db
        .collection('applications')
        .where('institutionId', '==', uid);

      if (status) {
        query = query.where('status', '==', status);
      }
      if (facultyId) {
        query = query.where('facultyId', '==', facultyId);
      }
      if (courseId) {
        query = query.where('courseId', '==', courseId);
      }

      const applicationsSnapshot = await query.orderBy('appliedAt', 'desc').get();

      const applications = [];
      for (const doc of applicationsSnapshot.docs) {
        const appData = doc.data();
        
        // Get student details
        const studentDoc = await db.collection('students').doc(appData.studentId).get();
        const courseDoc = await db.collection('courses').doc(appData.courseId).get();
        
        applications.push({
          id: doc.id,
          ...appData,
          student: studentDoc.exists ? studentDoc.data() : null,
          course: courseDoc.exists ? courseDoc.data() : null
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

  // Process Application
  processApplication: async (req, res) => {
    try {
      const { uid } = req.user;
      const { applicationId } = req.params;
      const { status, feedback } = req.body;

      // Get application
      const applicationRef = db.collection('applications').doc(applicationId);
      const applicationDoc = await applicationRef.get();

      if (!applicationDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Application not found'
        });
      }

      const application = applicationDoc.data();

      // Verify ownership
      if (application.institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Validate status transition
      const validTransitions = {
        pending: ['accepted', 'rejected'],
        accepted: ['enrolled', 'rejected'],
        rejected: ['pending'],
        enrolled: []
      };

      if (!validTransitions[application.status].includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid status transition from ${application.status} to ${status}`
        });
      }

      // Update application
      const updateData = {
        status,
        updatedAt: Timestamp.now()
      };

      if (feedback) {
        updateData.feedback = feedback;
      }

      if (status === 'enrolled') {
        // Add student to course
        await db.collection('enrollments').add({
          studentId: application.studentId,
          courseId: application.courseId,
          institutionId: uid,
          enrolledAt: Timestamp.now(),
          status: 'active'
        });

        // Notify student
        const studentDoc = await db.collection('students').doc(application.studentId).get();
        if (studentDoc.exists) {
          const student = studentDoc.data();
          const courseDoc = await db.collection('courses').doc(application.courseId).get();
          
          if (courseDoc.exists) {
            await sendAdmissionEmail({
              to: student.email,
              studentName: student.fullName,
              courseName: courseDoc.data().name,
              institutionName: req.user.institutionName
            });
          }
        }
      }

      await applicationRef.update(updateData);

      res.status(200).json({
        status: 'success',
        message: 'Application processed successfully'
      });
    } catch (error) {
      console.error('Process application error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to process application',
        error: error.message
      });
    }
  },

  // Publish Admissions (Batch process)
  publishAdmissions: async (req, res) => {
    try {
      const { uid } = req.user;
      const { courseId, publishDate } = req.body;

      // Verify course ownership
      const courseDoc = await db.collection('courses').doc(courseId).get();
      if (!courseDoc.exists || courseDoc.data().institutionId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Get all pending applications for this course
      const applicationsSnapshot = await db
        .collection('applications')
        .where('courseId', '==', courseId)
        .where('status', '==', 'pending')
        .get();

      const batch = db.batch();
      const notificationDate = publishDate ? new Date(publishDate) : new Date();

      // Update all applications to rejected by default
      applicationsSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          status: 'rejected',
          updatedAt: Timestamp.now(),
          feedback: 'Admission not granted based on competition'
        });
      });

      // Get accepted applications (you would add your selection logic here)
      // This is a placeholder - implement your selection criteria
      const acceptedApplications = []; // Add your selection logic here

      // Update accepted applications
      acceptedApplications.forEach(doc => {
        batch.update(doc.ref, {
          status: 'accepted',
          updatedAt: Timestamp.now(),
          feedback: 'Congratulations! Your application has been accepted.'
        });
      });

      await batch.commit();

      // Schedule notifications (implementation depends on your notification system)
      // This is a placeholder
      await scheduleAdmissionNotifications(acceptedApplications, notificationDate);

      res.status(200).json({
        status: 'success',
        message: 'Admissions published successfully',
        data: {
          total: applicationsSnapshot.size,
          accepted: acceptedApplications.length,
          rejected: applicationsSnapshot.size - acceptedApplications.length
        }
      });
    } catch (error) {
      console.error('Publish admissions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to publish admissions',
        error: error.message
      });
    }
  },

  // ==================== ADMISSIONS METHODS ====================
  // Get Admissions
  getAdmissions: async (req, res) => {
    try {
      const { uid } = req.user;
      const { status, courseId } = req.query;

      let query = db
        .collection('enrollments')
        .where('institutionId', '==', uid);

      if (status) {
        query = query.where('status', '==', status);
      }
      if (courseId) {
        query = query.where('courseId', '==', courseId);
      }

      const enrollmentsSnapshot = await query
        .orderBy('enrolledAt', 'desc')
        .get();

      const enrollments = [];
      for (const doc of enrollmentsSnapshot.docs) {
        const enrollment = doc.data();
        
        // Get student and course details
        const [studentDoc, courseDoc] = await Promise.all([
          db.collection('students').doc(enrollment.studentId).get(),
          db.collection('courses').doc(enrollment.courseId).get()
        ]);
        
        enrollments.push({
          id: doc.id,
          ...enrollment,
          student: studentDoc.exists ? studentDoc.data() : null,
          course: courseDoc.exists ? courseDoc.data() : null
        });
      }

      res.status(200).json({
        status: 'success',
        data: enrollments
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

  // ==================== STUDENT METHODS ====================
  // Get Students
  getStudents: async (req, res) => {
    try {
      const { uid } = req.user;
      const { status, courseId } = req.query;

      // First, get all enrollments for this institution
      let enrollmentQuery = db
        .collection('enrollments')
        .where('institutionId', '==', uid);

      if (status) {
        enrollmentQuery = enrollmentQuery.where('status', '==', status);
      }
      if (courseId) {
        enrollmentQuery = enrollmentQuery.where('courseId', '==', courseId);
      }

      const enrollmentsSnapshot = await enrollmentQuery.get();
      const studentIds = [...new Set(enrollmentsSnapshot.docs.map(doc => doc.data().studentId))];

      // Get student details
      const students = [];
      for (const studentId of studentIds) {
        const studentDoc = await db.collection('students').doc(studentId).get();
        if (studentDoc.exists) {
          // Get student's enrollments
          const studentEnrollments = enrollmentsSnapshot.docs
            .filter(doc => doc.data().studentId === studentId)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              // Remove sensitive data
              studentId: undefined,
              institutionId: undefined
            }));

          students.push({
            id: studentDoc.id,
            ...studentDoc.data(),
            enrollments: studentEnrollments
          });
        }
      }

      res.status(200).json({
        status: 'success',
        data: students
      });
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch students',
        error: error.message
      });
    }
  }
};

module.exports = instituteController;