const { db } = require('./config/firebase.config');
console.log('Testing direct Firebase query...');
(async () => {
  try {
    const snapshot = await db.collection('jobs').get();
    console.log('Direct query successful, docs:', snapshot.size);
    const jobs = [];
    snapshot.forEach(doc => jobs.push({ id: doc.id, ...doc.data() }));
    console.log('Jobs found:', jobs.length);
    console.log('Sample job:', jobs[0]);
  } catch (error) {
    console.error('Direct query error:', error);
  }
})();
