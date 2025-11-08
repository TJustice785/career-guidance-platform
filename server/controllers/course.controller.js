const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, code, facultyId, institutionId, duration, requirements, capacity } = req.body;
    const courseId = uuidv4();
    
    await db.collection('courses').doc(courseId).set({
      name,
      code,
      facultyId,
      institutionId,
      duration,
      requirements,
      capacity,
      availableSlots: capacity,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: { id: courseId, ...req.body }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, error: 'Failed to create course' });
  }
};

// Get all courses with filters
exports.getCourses = async (req, res) => {
  try {
    const { institutionId, facultyId, search } = req.query;
    let query = db.collection('courses');
    
    if (institutionId) query = query.where('institutionId', '==', institutionId);
    if (facultyId) query = query.where('facultyId', '==', facultyId);
    if (search) {
      // Add search functionality
      query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
    }

    const snapshot = await query.get();
    const courses = [];
    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch courses' });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const courseRef = db.collection('courses').doc(id);
    await courseRef.update(updateData);
    
    res.status(200).json({
      success: true,
      data: { id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, error: 'Failed to update course' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('courses').doc(id).delete();
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: 'Failed to delete course' });
  }
};
