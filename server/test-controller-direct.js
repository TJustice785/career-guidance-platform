const express = require('express');
const jobController = require('./controllers/job.controller');
const app = express();

app.get('/test-controller', async (req, res) => {
  console.log('Testing controller directly...');
  try {
    await jobController.getJobs(req, res);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5004, () => console.log('Controller test server on 5004'));
