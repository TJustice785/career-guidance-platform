const express = require('express');
const jobController = require('./controllers/job.controller');
const app = express();

app.get('/test-controller-fixed', async (req, res) => {
  console.log('Testing controller with fixed import...');
  try {
    await jobController.getJobs(req, res);
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5005, () => console.log('Fixed controller test server on 5005'));
