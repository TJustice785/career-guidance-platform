const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function testApplicationsQuery() {
  console.log('Testing applications query...');
  
  try {
    // Get all applications
    const appsSnapshot = await db.collection('applications').get();
    console.log(`Total applications found: ${appsSnapshot.size}`);
    
    // Print each application
    appsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('\nApplication:', {
        id: doc.id,
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        institutionId: data.institutionId,
        ownerId: data.ownerId,
        status: data.status,
        createdAt: data.createdAt,
        appliedAt: data.appliedAt
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testApplicationsQuery();