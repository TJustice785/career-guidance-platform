const { db } = require('./config/firebase.config');
console.log('Testing direct Firebase query...');
(async () => {
  try {
    console.log('Starting query...');
    const snapshot = await db.collection('jobs').get();
    console.log('Query completed, docs:', snapshot.size);
    const jobs = [];
    snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
    console.log('Jobs found:', jobs.length);
    if (jobs.length > 0) {
      console.log('Sample job:', JSON.stringify(jobs[0], null, 2));
    }
  } catch (error) {
    console.error('Direct query error:', error);
  }
})();
