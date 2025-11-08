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

const server = app.listen(5007, () => console.log('Test server on 5007'));
setTimeout(() => {
  console.log('Closing test server...');
  server.close();
}, 10000);
