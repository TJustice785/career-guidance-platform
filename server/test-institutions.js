const admin = require('firebase-admin');
const serviceAccount = require('../career-guidance-platform-7e18e-firebase-adminsdk-fbsvc-a5b8af8773.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function testInstitutionQuery() {
  console.log('Testing institution query...');
  
  try {
    // Get all institutions
    const instSnapshot = await db.collection('institutions').get();
    console.log(`\nTotal institutions found: ${instSnapshot.size}`);
    
    // Print each institution
    instSnapshot.forEach(doc => {
      console.log('\nInstitution:', {
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testInstitutionQuery();