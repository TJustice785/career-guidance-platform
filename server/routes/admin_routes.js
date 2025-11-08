const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// Apply authentication and role check to all routes
router.use(verifyToken);
router.use(checkRole('admin'));

// Institution management
router.post('/institutions', adminController.addInstitution);
router.get('/institutions', adminController.getAllInstitutions);
router.put('/institutions/:institutionId', adminController.updateInstitution);
router.delete('/institutions/:institutionId', adminController.deleteInstitution);

// Faculty management
router.post('/faculties', adminController.addFaculty);
router.get('/faculties', adminController.getAllFaculties);
router.put('/faculties/:facultyId', adminController.updateFaculty);
router.delete('/faculties/:facultyId', adminController.deleteFaculty);

// Course management
router.post('/courses', adminController.addCourse);
router.get('/courses', adminController.getAllCourses);
router.put('/courses/:courseId', adminController.updateCourse);
router.delete('/courses/:courseId', adminController.deleteCourse);

// Company management
router.get('/companies', adminController.getAllCompanies);
router.put('/companies/:companyId/approve', adminController.approveCompany);
router.put('/companies/:companyId/suspend', adminController.suspendCompany);
router.delete('/companies/:companyId', adminController.deleteCompany);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/stats', adminController.getUserStats);

// Reports
router.get('/reports/applications', adminController.getApplicationsReport);
router.get('/reports/admissions', adminController.getAdmissionsReport);
router.get('/reports/jobs', adminController.getJobsReport);
router.get('/reports/dashboard', adminController.getDashboardStats);

module.exports = router;
