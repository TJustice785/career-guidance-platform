const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Job routes are working!' });
});

// Public routes (no authentication required)
router.get('/', jobController.getJobs); // Get all jobs with filters
router.get('/:id', jobController.getJobs); // Get single job by ID

// Protected routes (authentication required)
router.use(authenticate); // Apply authentication to all routes below

// Job CRUD operations
router.post('/', jobController.createJob); // Create new job
router.put('/:id', jobController.updateJob); // Update job
router.delete('/:id', jobController.deleteJob); // Delete job

// Job applications
router.post('/:jobId/apply', jobController.applyForJob); // Apply for job

module.exports = router;
