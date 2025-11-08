const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fetchApplications() {
  try {
    console.log('Fetching applications for tsepangtsehla31@gmail.com...');
    
    // Query applications for the specific email
    const applicationsSnapshot = await db.collection('applications')
      .where('studentEmail', '==', 'tsepangtsehla31@gmail.com')
      .get();

    if (applicationsSnapshot.empty) {
      console.log('No applications found for this email address.');
      return;
    }

    console.log('\nFound applications:');
    applicationsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('\nApplication ID:', doc.id);
      console.log('Institution:', data.institutionName);
      console.log('Course:', data.courseName);
      console.log('Status:', data.status);
      console.log('Created:', data.createdAt ? data.createdAt.toDate().toLocaleString() : 'No date');
      console.log('Student Name:', data.studentName);
      if (data.qualifications) {
        console.log('Qualifications:', {
          currentGrade: data.qualifications.currentGrade,
          subjects: data.qualifications.subjects
        });
      }
      console.log('----------------------------------------');
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
  } finally {
    process.exit();
  }
}

fetchApplications();