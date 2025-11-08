const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, checkRole, checkCompanyApproval } = require('../middleware/auth.middleware');

// Apply authentication and role check to all routes
router.use(verifyToken);
router.use(checkRole('company'));
router.use(checkCompanyApproval); // Ensure company is approved

// Job routes
router.post('/jobs', companyController.createJob);
router.get('/jobs', companyController.getMyJobs);
router.put('/jobs/:jobId', companyController.updateJob);
router.delete('/jobs/:jobId', companyController.deleteJob);

// Application routes
router.get('/jobs/:jobId/applications', companyController.getJobApplications);
router.put('/applications/:applicationId', companyController.updateApplicationStatus);

// Dashboard
router.get('/dashboard/stats', companyController.getDashboardStats);

module.exports = router;
