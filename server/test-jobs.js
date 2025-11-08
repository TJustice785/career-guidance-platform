const express = require('express');
const { db } = require('./config/firebase.config');
const app = express();
app.use(express.json());

app.get('/api/jobs', async (req, res) => {
  console.log('Jobs endpoint called');
  try {
    console.log('Fetching jobs from Firestore...');
    const snapshot = await db.collection('jobs').where('status', '==', 'active').limit(5).get();
    console.log('Found', snapshot.size, 'jobs');
    const jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    console.log('Sending response...');
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const server = app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
setTimeout(() => {
  console.log('Closing test server');
  server.close();
}, 10000);
