const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkAndClearApplications() {
  try {
    // Get Tsepang's applications
    const appsSnapshot = await db.collection('applications')
      .where('studentEmail', '==', 'tsepangtsehla31@gmail.com')
      .get();

    console.log('\nAll applications for Tsepang:');
    appsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log({
        id: doc.id,
        institutionName: data.institutionName,
        courseId: data.courseId,
        courseName: data.courseName,
        status: data.status,
        createdAt: data.createdAt
      });
    });

    // Ask for confirmation before deleting
    console.log('\nTo clear these applications, uncomment the deletion code.');

    // Deletion code (commented out for safety)
    /*
    for (const doc of appsSnapshot.docs) {
      await doc.ref.delete();
      console.log('Deleted application:', doc.id);
    }
    console.log('All applications cleared');
    */

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndClearApplications();