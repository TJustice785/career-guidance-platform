const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixApplications() {
  try {
    // Get Machabeng College institution document
    const institutionsSnapshot = await db.collection('institutions')
      .where('name', '==', 'Machabeng College')
      .get();

    if (institutionsSnapshot.empty) {
      console.log('No Machabeng College found!');
      return;
    }

    const machabengInstitution = institutionsSnapshot.docs[0];
    console.log('Found Machabeng College:', {
      id: machabengInstitution.id,
      data: machabengInstitution.data()
    });

    // Get all applications
    const applicationsSnapshot = await db.collection('applications').get();
    console.log('Total applications found:', applicationsSnapshot.size);

    // Update each application to ensure it has the correct institution data
    for (const doc of applicationsSnapshot.docs) {
      const appData = doc.data();
      console.log('Checking application:', {
        id: doc.id,
        studentName: appData.studentName,
        institutionName: appData.institutionName
      });

      // If this application is for Machabeng (checking various possible fields)
      if (appData.institutionName === 'Machabeng College' ||
          appData.institutionId === machabengInstitution.id ||
          appData.ownerId === machabengInstitution.id) {
        
        // Update to ensure all institution fields are set correctly
        await doc.ref.update({
          institutionId: machabengInstitution.id,
          institutionName: 'Machabeng College',
          ownerId: machabengInstitution.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('Updated application:', doc.id);
      }
    }

    console.log('Finished updating applications');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixApplications();