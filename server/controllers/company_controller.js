const { db, Timestamp, FieldValue } = require('../config/firebase.config');
const { sendJobMatchEmail } = require('../services/email_service');

const companyController = {
  // Create Job
  createJob: async (req, res) => {
    try {
      const { uid } = req.user;
      const {
        title,
        description,
        requirements,
        location,
        employmentType,
        salaryRange,
        deadline,
        qualifications,
        skillsRequired = []
      } = req.body;

      if (!title || !description || !location || !employmentType || !deadline) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, location, employmentType, and deadline are required'
        });
      }

      // Get company details
      const companyDoc = await db.collection('companies').doc(uid).get();
      if (!companyDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found. Please complete your company profile first.'
        });
      }

      const jobData = {
        companyId: uid,
        companyName: companyDoc.data().companyName,
        companyLogo: companyDoc.data().logoUrl || '',
        companyId: uid,
        title,
        description,
        requirements: requirements || {},
        location: location || '',
        employmentType: employmentType || 'full-time',
        salaryRange: salaryRange || '',
        deadline: deadline ? new Date(deadline) : null,
        qualifications: qualifications || {},
        status: 'active',
        applicationsCount: 0,
        postedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const jobRef = await db.collection('jobs').add(jobData);

      // Notify qualified students
      await notifyQualifiedStudents(uid, jobRef.id, jobData);

      res.status(201).json({
        status: 'success',
        message: 'Job posted successfully',
        data: {
          id: jobRef.id,
          ...jobData
        }
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create job',
        error: error.message
      });
    }
  },

  // Get My Jobs with pagination and filtering
  getMyJobs: async (req, res) => {
    try {
      const { uid } = req.user;
      const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      let query = db.collection('jobs')
        .where('companyId', '==', uid);

      // Apply status filter if provided
      if (status) {
        query = query.where('status', '==', status);
      }

      // Get total count for pagination
      const countSnapshot = await query.get();
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / limitNumber);

      // Apply sorting and pagination
      const snapshot = await query
        .orderBy(sortBy, sortOrder)
        .limit(limitNumber)
        .offset(offset)
        .get();

      const jobs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        jobs.push({
          id: doc.id,
          ...data,
          // Format date fields
          deadline: data.deadline?.toDate()?.toISOString(),
          createdAt: data.createdAt?.toDate()?.toISOString(),
          updatedAt: data.updatedAt?.toDate()?.toISOString()
        });
      });

      res.status(200).json({
        success: true,
        data: jobs,
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
      console.error('Error fetching jobs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch jobs',
        error: error.message
      });
    }
  },

  // Update Job
  updateJob: async (req, res) => {
    try {
      const { uid } = req.user;
      const { jobId } = req.params;
      const updateData = req.body;

      // Validate required fields
      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: 'Job ID is required'
        });
      }

      // Get the job to verify ownership
      const jobRef = db.collection('jobs').doc(jobId);
      const jobDoc = await jobRef.get();

      if (!jobDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      // Verify ownership
      if (jobDoc.data().companyId !== uid) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized - You can only update your own jobs'
        });
      }

      // Prepare update data
      const updatedJob = {
        ...updateData,
        updatedAt: FieldValue.serverTimestamp()
      };

      // Handle deadline conversion if provided
      if (updateData.deadline) {
        updatedJob.deadline = new Date(updateData.deadline);
      }

      // Update the job
      await jobRef.update(updatedJob);

      // Get the updated job
      const updatedJobDoc = await jobRef.get();

      res.status(200).json({
        success: true,
        data: {
          id: updatedJobDoc.id,
          ...updatedJobDoc.data(),
          // Format dates
          deadline: updatedJobDoc.data().deadline?.toDate()?.toISOString(),
          createdAt: updatedJobDoc.data().createdAt?.toDate()?.toISOString(),
          updatedAt: updatedJobDoc.data().updatedAt?.toDate()?.toISOString()
        },
        message: 'Job updated successfully'
      });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update job',
        error: error.message
      });
    }
  },

  // Delete Job
  deleteJob: async (req, res) => {
    try {
      const { uid } = req.user;
      const { jobId } = req.params;

      // Verify ownership
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      if (!jobDoc.exists || jobDoc.data().companyId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      await db.collection('jobs').doc(jobId).delete();

      res.status(200).json({
        status: 'success',
        message: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete job',
        error: error.message
      });
    }
  },

  // Get Job Applications with filtering and pagination
  getJobApplications: async (req, res) => {
    try {
      const { uid } = req.user;
      const { jobId } = req.params;
      const { 
        status, 
        search = '', 
        page = 1, 
        limit = 10,
        sortBy = 'appliedAt',
        sortOrder = 'desc'
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      // Verify job ownership
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      if (!jobDoc.exists || jobDoc.data().companyId !== uid) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized - Job not found or access denied'
        });
      }

      // Build the base query
      let query = db.collection('applications')
        .where('jobId', '==', jobId);

      // Apply status filter if provided
      if (status) {
        query = query.where('status', '==', status);
      }

      // Get total count for pagination
      const countSnapshot = await query.get();
      const total = countSnapshot.size;
      const totalPages = Math.ceil(total / limitNumber);

      // Apply sorting and pagination
      const snapshot = await query
        .orderBy(sortBy, sortOrder)
        .limit(limitNumber)
        .offset(offset)
        .get();

      // Get student details for each application
      const applications = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const appData = doc.data();
          
          // Get student details
          const studentDoc = await db.collection('students').doc(appData.studentId).get();
          const studentData = studentDoc.exists ? studentDoc.data() : null;
          
          // Calculate match score if not already calculated
          let matchScore = appData.matchScore || 0;
          
          // If match score not calculated, calculate it
          if (!appData.matchScore && studentData) {
            matchScore = calculateMatchScore(studentData, jobDoc.data());
            // Update the application with the calculated score
            await doc.ref.update({ matchScore });
          }

          return {
            id: doc.id,
            ...appData,
            matchScore,
            student: studentData ? {
              id: studentDoc.id,
              name: studentData.fullName,
              email: studentData.email,
              avatar: studentData.avatarUrl,
              skills: studentData.skills || [],
              education: studentData.education || []
            } : null,
            // Format dates
            appliedAt: appData.appliedAt?.toDate()?.toISOString(),
            updatedAt: appData.updatedAt?.toDate()?.toISOString()
          };
        })
      );

      // If search term provided, filter results
      const filteredApplications = search
        ? applications.filter(app => {
            const searchLower = search.toLowerCase();
            return (
              app.student?.name?.toLowerCase().includes(searchLower) ||
              app.student?.email?.toLowerCase().includes(searchLower) ||
              app.status?.toLowerCase().includes(searchLower)
            );
          })
        : applications;

      res.status(200).json({
        success: true,
        data: filteredApplications,
        pagination: {
          total: filteredApplications.length, // Adjusted total based on search
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(filteredApplications.length / limitNumber), // Adjusted for search
          hasNextPage: pageNumber < Math.ceil(filteredApplications.length / limitNumber),
          hasPreviousPage: pageNumber > 1
        },
        job: {
          id: jobDoc.id,
          title: jobDoc.data().title,
          status: jobDoc.data().status
        }
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job applications',
        error: error.message
      });
    }
  },

  // Update Application Status
  updateApplicationStatus: async (req, res) => {
    try {
      const { uid } = req.user;
      const { applicationId } = req.params;
      const { status, feedback } = req.body; // status: 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'

      // Verify ownership
      const applicationDoc = await db.collection('jobApplications').doc(applicationId).get();
      if (!applicationDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Application not found'
        });
      }

      const applicationData = applicationDoc.data();
      
      // Verify job ownership
      const jobDoc = await db.collection('jobs').doc(applicationData.jobId).get();
      if (!jobDoc.exists || jobDoc.data().companyId !== uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      await db.collection('jobApplications').doc(applicationId).update({
        status,
        feedback: feedback || '',
        reviewedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Send notification to student
      await db.collection('notifications').add({
        userId: applicationData.studentId,
        type: 'job_application_update',
        title: 'Job Application Update',
        message: `Your application for ${applicationData.jobTitle} has been ${status}`,
        jobApplicationId: applicationId,
        read: false,
        createdAt: Timestamp.now()
      });

      res.status(200).json({
        status: 'success',
        message: 'Application status updated successfully'
      });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update application status',
        error: error.message
      });
    }
  },

  // Get Company Dashboard Stats
  getDashboardStats: async (req, res) => {
    try {
      const { uid } = req.user;

      const [jobsSnapshot, applicationsSnapshot] = await Promise.all([
        db.collection('jobs').where('companyId', '==', uid).get(),
        db.collection('jobApplications').where('companyId', '==', uid).get()
      ]);

      const stats = {
        totalJobs: jobsSnapshot.size,
        activeJobs: 0,
        totalApplications: applicationsSnapshot.size,
        newApplications: 0,
        shortlisted: 0,
        hired: 0
      };

      jobsSnapshot.forEach(doc => {
        if (doc.data().status === 'active') stats.activeJobs++;
      });

      applicationsSnapshot.forEach(doc => {
        const app = doc.data();
        if (app.status === 'pending') stats.newApplications++;
        if (app.status === 'shortlisted') stats.shortlisted++;
        if (app.status === 'hired') stats.hired++;
      });

      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch dashboard stats',
        error: error.message
      });
    }
  }
};

// Helper function to calculate match score
function calculateMatchScore(studentData, jobData) {
  let score = 0;

  // Check if student has completed studies
  if (!studentData.hasCompletedStudies) return 0;

  // Base score for having transcript
  if (studentData.transcript) {
    score += 20;
  }

  // Score for certificates
  const certificatesCount = studentData.certificates?.length || 0;
  score += Math.min(certificatesCount * 5, 20); // Max 20 points for certificates

  // Score for work experience
  const experienceCount = studentData.workExperience?.length || 0;
  score += Math.min(experienceCount * 10, 30); // Max 30 points for experience

  // Score for relevant qualifications
  if (jobData.qualifications) {
    // Check for degree match
    if (jobData.qualifications.degreeLevel && studentData.degreeLevel) {
      if (studentData.degreeLevel === jobData.qualifications.degreeLevel) {
        score += 15;
      }
    }

    // Check for field of study match
    if (jobData.qualifications.fieldOfStudy && studentData.fieldOfStudy) {
      if (studentData.fieldOfStudy.toLowerCase().includes(jobData.qualifications.fieldOfStudy.toLowerCase()) ||
          jobData.qualifications.fieldOfStudy.toLowerCase().includes(studentData.fieldOfStudy.toLowerCase())) {
        score += 15;
      }
    }
  }

  return Math.min(score, 100); // Cap at 100
}

// Helper function to notify qualified students
async function notifyQualifiedStudents(companyId, jobId, jobData) {
  try {
    // Get company details
    const companyDoc = await db.collection('users').doc(companyId).get();
    const companyName = companyDoc.exists ? companyDoc.data().name : 'Unknown Company';

    // Get all students who have completed studies
    const studentsSnapshot = await db
      .collection('users')
      .where('role', '==', 'student')
      .where('hasCompletedStudies', '==', true)
      .get();

    const batch = db.batch();
    let notificationCount = 0;

    for (const studentDoc of studentsSnapshot.docs) {
      const studentData = studentDoc.data();
      
      // Calculate match score
      const matchScore = calculateMatchScore(studentData, jobData);
      
      // Only notify if match score is above threshold (e.g., 40)
      if (matchScore >= 40) {
        // Create notification
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: studentDoc.id,
          type: 'job_match',
          title: 'New Job Opportunity',
          message: `${companyName} is hiring for ${jobData.title}. You're a ${matchScore}% match!`,
          jobId,
          matchScore,
          read: false,
          createdAt: Timestamp.now()
        });

        notificationCount++;

        // Send email (limit to prevent spam)
        if (notificationCount <= 50) {
          const jobUrl = `${process.env.CLIENT_URL}/student/jobs/${jobId}`;
          await sendJobMatchEmail(
            studentData.email,
            `${studentData.firstName} ${studentData.lastName}`,
            jobData.title,
            companyName,
            jobUrl
          );
        }
      }
    }

    if (notificationCount > 0) {
      await batch.commit();
      console.log(`Sent ${notificationCount} job notifications`);
    }
  } catch (error) {
    console.error('Error notifying students:', error);
  }
}

module.exports = companyController;