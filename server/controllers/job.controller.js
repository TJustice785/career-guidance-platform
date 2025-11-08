const { db } = require('../config/firebase.config');
const { v4: uuidv4 } = require('uuid');

// Create a new job posting
exports.createJob = async (req, res) => {
  try {
    const jobId = uuidv4();
    const jobData = {
      ...req.body,
      id: jobId,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('jobs').doc(jobId).set(jobData);

    res.status(201).json({
      success: true,
      data: jobData
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, error: 'Failed to create job posting' });
  }
};

// Get jobs with filters
exports.getJobs = async (req, res) => {
  try {
    const { companyId, status, search, type, location, id } = req.query;

    // If specific ID is requested, get single job
    if (req.params.id || id) {
      const jobId = req.params.id || id;
      const doc = await db.collection('jobs').doc(jobId).get();
      if (!doc.exists) {
        return res.status(404).json({ success: false, error: 'Job not found' });
      }
      const jobData = { id: doc.id, ...doc.data() };
      return res.status(200).json({ success: true, data: jobData });
    }

    // Get all jobs first, then filter in memory to avoid Firestore compound query limitations
    let query = db.collection('jobs');

    // Only apply equality filters that can be combined
    if (companyId) query = query.where('companyId', '==', companyId);
    if (status) query = query.where('status', '==', status);
    if (type) query = query.where('type', '==', type);

    const snapshot = await query.get();
    let jobs = [];
    snapshot.forEach(doc => {
      const jobData = { id: doc.id, ...doc.data() };
      jobs.push(jobData);
    });

    // Apply client-side filters for search and location
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower)
      );
    }

    if (location) {
      const locationLower = location.toLowerCase();
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(locationLower)
      );
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch jobs' });
  }
};

// Update a job posting
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    await db.collection('jobs').doc(id).update(updateData);
    
    res.status(200).json({
      success: true,
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, error: 'Failed to update job posting' });
  }
};

// Delete a job posting
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('jobs').doc(id).delete();
    
    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, error: 'Failed to delete job posting' });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, studentId, resumeUrl, coverLetter } = req.body;
    const applicationId = uuidv4();
    
    // Check if job exists and is active
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists || jobDoc.data().status !== 'active') {
      return res.status(400).json({ success: false, error: 'Job is not available' });
    }
    
    await db.collection('jobApplications').doc(applicationId).set({
      jobId,
      studentId,
      resumeUrl,
      coverLetter,
      status: 'applied',
      appliedAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json({
      success: true,
      data: { id: applicationId, jobId, studentId, status: 'applied' }
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, error: 'Failed to submit job application' });
  }
};
