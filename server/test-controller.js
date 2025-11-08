const express = require('express');
const { db } = require('./config/firebase.config');
const app = express();

app.get('/test-jobs-controller', async (req, res) => {
  console.log('Testing job controller directly...');
  try {
    const snapshot = await db.collection('jobs').where('status', '==', 'active').get();
    const jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, title: doc.data().title });
    });
    console.log('Found', jobs.length, 'jobs');
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5003, () => console.log('Test server on 5003'));
