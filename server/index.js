require('dotenv').config();
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://career-guidance-platform-7e18e.web.app',
    'https://career-guidance-platform-7e18e.firebaseapp.com'
  ],
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth_routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/institute', require('./routes/institute.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/company', require('./routes/company.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/api/jobs', require('./routes/job.routes'));

// Public routes for institutions and companies (accessible without authentication)
const studentController = require('./controllers/student_controller');
const { db } = require('./config/firebase.config');

app.get('/api/institutions', studentController.getInstitutions);
app.get('/api/institutions/:institutionId/courses', studentController.getInstitutionCourses);
app.get('/api/courses', studentController.getCourses);

// Get all companies (public)
app.get('/api/companies', async (req, res) => {
  try {
    const snapshot = await db.collection('companies').get();
    
    const companies = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      companies.push({
        id: doc.id,
        companyName: data.companyName,
        description: data.description,
        industry: data.industry,
        website: data.website,
        email: data.email,
        phone: data.phone,
        logoUrl: data.logoUrl,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate()?.toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString()
      });
    });
    
    // Sort by name
    companies.sort((a, b) => (a.companyName || '').localeCompare(b.companyName || ''));
    
    res.status(200).json({
      success: true,
      status: 'success',
      data: companies
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
});

// Jobs endpoint removed - now handled by job routes
// The /api/jobs route is now handled by job.routes.js

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Export for Firebase Functions
exports.api = functions.https.onRequest(app);

// Local development server (only runs when not in Firebase Functions)
if (!process.env.FUNCTION_TARGET) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log('\nAvailable Routes:');
    console.log(`- GET    /api/health`);
    console.log(`- GET    /api/auth/test`);
    console.log(`- GET    /api/admin/test`);
    console.log(`- GET    /api/institute/test`);
    console.log(`- GET    /api/student/test`);
    console.log(`- GET    /api/company/test`);
    console.log(`- GET    /api/applications/test`);
    console.log(`- GET    /api/jobs/test`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}
