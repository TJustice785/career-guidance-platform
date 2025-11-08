const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function clearApplications() {
  try {
    // Get Tsepang's applications
    const appsSnapshot = await db.collection('applications')
      .where('studentEmail', '==', 'tsepangtsehla31@gmail.com')
      .get();

    console.log(`Found ${appsSnapshot.size} applications to delete`);

    // Delete all applications
    for (const doc of appsSnapshot.docs) {
      await doc.ref.delete();
      console.log('Deleted application:', doc.id);
    }

    console.log('All applications cleared');
  } catch (error) {
    console.error('Error:', error);
  }
}

clearApplications();