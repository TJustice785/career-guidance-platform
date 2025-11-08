const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Submit a new application
exports.submitApplication = async (req, res) => {
  try {
    const { courseId, studentId, institutionId, documents } = req.body;
    const applicationId = uuidv4();
    
    await db.collection('applications').doc(applicationId).set({
      courseId,
      studentId,
      institutionId,
      status: 'pending',
      documents: documents || [],
      appliedAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: { id: applicationId, ...req.body, status: 'pending' }
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, error: 'Failed to submit application' });
  }
};

// Get applications with filters
exports.getApplications = async (req, res) => {
  try {
    const { studentId, institutionId, status } = req.query;
    let query = db.collection('applications');
    
    if (studentId) query = query.where('studentId', '==', studentId);
    if (institutionId) query = query.where('institutionId', '==', institutionId);
    if (status) query = query.where('status', '==', status);

    const snapshot = await query.get();
    const applications = [];
    snapshot.forEach(doc => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (feedback) updateData.feedback = feedback;
    
    await db.collection('applications').doc(id).update(updateData);
    
    res.status(200).json({
      success: true,
      data: { id, status }
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, error: 'Failed to update application status' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('applications').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error getting application:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch application' });
  }
};
