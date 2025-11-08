const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/jobs',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Making HTTP request to localhost:5000/api/jobs...');

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
    console.log('Received chunk, total length:', data.length);
  });

  res.on('end', () => {
    console.log('Response ended, total length:', data.length);
    try {
      const json = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
      console.log('Raw response (first 500 chars):', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.setTimeout(15000, () => {
  console.log('Request timed out after 15 seconds');
  req.destroy();
});

req.end();
