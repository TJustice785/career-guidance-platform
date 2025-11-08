const { db } = require('./config/firebase.config');

async function debugJobs() {
  console.log('Testing direct Firestore query...');
  const start = Date.now();

  try {
    const snapshot = await db.collection('jobs').where('status', '==', 'active').limit(5).get();
    const end = Date.now();
    console.log('Query completed in', end - start, 'ms');
    console.log('Found', snapshot.size, 'jobs');

    const jobs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        title: data.title,
        companyName: data.companyName,
        status: data.status
      });
    });

    console.log('Sample jobs:', jobs.slice(0, 2));
    console.log('First job data:', jobs[0]);
  } catch (error) {
    console.error('Firestore error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

debugJobs();
