const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Apply authentication middleware to all admin routes
router.use(authenticate);
router.use(authorize(['admin']));

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!', user: req.user });
});

// Institution Routes
router.post('/institutions', adminController.addInstitution);
router.put('/institutions/:id', adminController.updateInstitution);
router.delete('/institutions/:id', adminController.deleteInstitution);
router.get('/institutions', adminController.getAllInstitutions);
router.get('/institutions/:id', adminController.getInstitutionById);
router.patch('/institutions/:id/toggle-status', adminController.toggleInstitutionStatus);

// Company Routes
router.post('/companies', adminController.addCompany);
router.get('/companies', adminController.getAllCompanies);
router.put('/companies/:id', adminController.updateCompany);
router.delete('/companies/:id', adminController.deleteCompany);

// Course Routes
router.post('/courses', adminController.addCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.get('/courses', adminController.getAllCourses);

// Application Routes
router.get('/applications', adminController.getAllApplications);
router.get('/applications/:id', adminController.getApplicationById);
router.patch('/applications/:id/status', adminController.updateApplicationStatus);
router.delete('/applications/:id', adminController.deleteApplication);

// User Routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.patch('/users/:id/toggle-status', adminController.toggleUserStatus);

// Dashboard Stats Route
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
