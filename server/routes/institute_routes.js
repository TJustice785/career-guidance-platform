const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/institute.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// Apply authentication and role check to all routes
router.use(verifyToken);
router.use(checkRole('institute'));

// Faculty routes
router.post('/faculties', instituteController.addFaculty);
router.get('/faculties', instituteController.getFaculties);
router.put('/faculties/:facultyId', instituteController.updateFaculty);
router.delete('/faculties/:facultyId', instituteController.deleteFaculty);

// Course routes
router.post('/courses', instituteController.addCourse);
router.get('/courses', instituteController.getCourses);
router.put('/courses/:courseId', instituteController.updateCourse);
router.delete('/courses/:courseId', instituteController.deleteCourse);

// Application routes
router.get('/applications', instituteController.getApplications);
router.put('/applications/:applicationId/process', instituteController.processApplication);

// Admission routes
router.post('/admissions/publish', instituteController.publishAdmissions);
router.get('/admissions', instituteController.getAdmissions);

// Student routes
router.get('/students', instituteController.getStudents);

module.exports = router;
