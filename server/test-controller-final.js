const express = require('express');
const jobController = require('./controllers/job.controller');
const app = express();

app.use(express.json());

app.get('/test-controller', async (req, res) => {
  console.log('Testing controller directly...');
  try {
    // Test different query parameters
    const testQueries = [
      { query: {}, description: 'No filters' },
      { query: { status: 'active' }, description: 'Status filter' },
      { query: { search: 'developer' }, description: 'Search filter' },
      { query: { location: 'maseru' }, description: 'Location filter' },
      { query: { type: 'Full-time' }, description: 'Type filter' }
    ];

    const results = [];

    for (const test of testQueries) {
      console.log(`\nTesting: ${test.description}`);
      console.log('Query params:', test.query);

      // Mock request object
      const mockReq = {
        query: test.query,
        params: {}
      };

      // Mock response object
      const mockRes = {
        status: (code) => ({
          json: (data) => {
            console.log(`Response (${code}):`, JSON.stringify(data, null, 2));
            results.push({
              test: test.description,
              query: test.query,
              status: code,
              data: data
            });
            return mockRes;
          }
        }),
        json: (data) => {
          console.log('Response (200):', JSON.stringify(data, null, 2));
          results.push({
            test: test.description,
            query: test.query,
            status: 200,
            data: data
          });
          return mockRes;
        }
      };

      await jobController.getJobs(mockReq, mockRes);
    }

    res.json({
      message: 'Controller tests completed',
      results: results
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(5008, () => console.log('Test server on 5008'));
setTimeout(() => {
  console.log('Closing test server...');
  server.close();
}, 15000);
