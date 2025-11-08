const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student_controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG allowed'));
    }
  }
});

// Apply authentication and role check to all routes
router.use(verifyToken);
router.use(checkRole('student'));

// Course application routes
router.get('/institutions', studentController.getInstitutions);
router.get('/institutions/:institutionId/courses', studentController.getInstitutionCourses);
router.post('/apply', studentController.applyForCourse);
router.get('/applications', studentController.getMyApplications);
router.get('/admissions', studentController.getMyAdmissions);
router.post('/admissions/:admissionId/accept', studentController.acceptAdmission);

// Document management
router.post('/documents/upload', upload.single('document'), studentController.uploadDocument);
router.get('/documents', studentController.getMyDocuments);
router.delete('/documents/:documentId', studentController.deleteDocument);

// Transcript and certificates
router.post('/transcript/upload', upload.single('transcript'), studentController.uploadTranscript);
router.post('/certificates/upload', upload.single('certificate'), studentController.uploadCertificate);

// Job-related routes
router.get('/jobs', studentController.getAvailableJobs);
router.post('/jobs/:jobId/apply', studentController.applyForJob);
router.get('/job-applications', studentController.getMyJobApplications);
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:notificationId/read', studentController.markNotificationAsRead);

module.exports = router;
