// Test script to debug the API
const https = require('https');

const data = JSON.stringify({
  orderId: "TEST_123456",
  amount: 10000,
  userId: "test_user_123",
  planSlug: "basic",
  billingCycle: "annual"
});

const options = {
  hostname: 'urcare.vercel.app',
  port: 443,
  path: '/api/phonepe/pay',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Sending data:', data);

const req = https.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
