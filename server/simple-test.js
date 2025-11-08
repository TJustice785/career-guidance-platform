const express = require('express');
const { db } = require('./config/firebase.config');
const app = express();

app.get('/test-jobs', async (req, res) => {
  console.log('Test endpoint called');
  try {
    const snapshot = await db.collection('jobs').where('status', '==', 'active').limit(2).get();
    const jobs = [];
    snapshot.forEach(doc => {
      jobs.push({ id: doc.id, title: doc.data().title });
    });
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5002, () => console.log('Test server on 5002'));
