Failed to load institutions and courseconst jobController = require('./controllers/job.controller');

async function testController() {
  console.log('Testing controller directly...');
  try {
    const testQueries = [
      { query: {}, description: 'No filters' },
      { query: { status: 'active' }, description: 'Status filter' },
      { query: { search: 'developer' }, description: 'Search filter' },
      { query: { location: 'maseru' }, description: 'Location filter' },
      { query: { type: 'Full-time' }, description: 'Type filter' }
    ];

    for (const test of testQueries) {
      console.log(`\nTesting: ${test.description}`);
      console.log('Query params:', test.query);

      const mockReq = {
        query: test.query,
        params: {}
      };

      const mockRes = {
        status: (code) => ({
          json: (data) => {
            console.log(`Response (${code}):`, JSON.stringify(data, null, 2));
            return mockRes;
          }
        }),
        json: (data) => {
          console.log('Response (200):', JSON.stringify(data, null, 2));
          return mockRes;
        }
      };

      await jobController.getJobs(mockReq, mockRes);
    }

    console.log('\nAll tests completed');
  } catch (error) {
    console.error('Controller error:', error);
  }
}

testController();
