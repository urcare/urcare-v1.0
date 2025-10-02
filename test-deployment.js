// UrCare Deployment Test Script
// Run with: node test-deployment.js

const https = require('https');
const http = require('http');

const FRONTEND_URL = 'https://urcare-app.vercel.app';
const SERVER_URL = 'https://urcare-phonepe-server.vercel.app';

console.log('🧪 Testing UrCare Deployment...\n');

// Test function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test 1: Frontend Health Check
async function testFrontend() {
  console.log('1️⃣ Testing Frontend...');
  try {
    const response = await makeRequest(FRONTEND_URL);
    if (response.status === 200) {
      console.log('✅ Frontend is accessible');
      return true;
    } else {
      console.log(`❌ Frontend returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend test failed: ${error.message}`);
    return false;
  }
}

// Test 2: PhonePe Server Health Check
async function testServer() {
  console.log('2️⃣ Testing PhonePe Server...');
  try {
    const response = await makeRequest(`${SERVER_URL}/health`);
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      console.log('✅ PhonePe server is healthy');
      console.log(`   Status: ${data.status}`);
      console.log(`   Environment: ${data.environment}`);
      return true;
    } else {
      console.log(`❌ Server returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Server test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Payment Creation
async function testPaymentCreation() {
  console.log('3️⃣ Testing Payment Creation...');
  try {
    const paymentData = {
      amount: 299,
      planName: 'premium',
      billingCycle: 'monthly',
      userId: 'test-user-123'
    };
    
    const response = await makeRequest(`${SERVER_URL}/api/phonepe/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.data);
      if (data.success) {
        console.log('✅ Payment creation works');
        console.log(`   Transaction ID: ${data.data?.merchantTransactionId}`);
        return true;
      } else {
        console.log(`❌ Payment creation failed: ${data.error}`);
        return false;
      }
    } else {
      console.log(`❌ Payment creation returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Payment creation test failed: ${error.message}`);
    return false;
  }
}

// Test 4: CORS Configuration
async function testCORS() {
  console.log('4️⃣ Testing CORS Configuration...');
  try {
    const response = await makeRequest(`${SERVER_URL}/api/phonepe/create`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.status === 200 || response.status === 204) {
      console.log('✅ CORS is configured correctly');
      return true;
    } else {
      console.log(`❌ CORS test failed with status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS test failed: ${error.message}`);
    return false;
  }
}

// Test 5: Admin Endpoints
async function testAdminEndpoints() {
  console.log('5️⃣ Testing Admin Endpoints...');
  try {
    const response = await makeRequest(`${SERVER_URL}/api/admin/subscriptions`);
    if (response.status === 200) {
      console.log('✅ Admin endpoints are accessible');
      return true;
    } else {
      console.log(`❌ Admin endpoints returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Admin endpoints test failed: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  const tests = [
    testFrontend,
    testServer,
    testPaymentCreation,
    testCORS,
    testAdminEndpoints
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    console.log(''); // Add spacing between tests
  }
  
  console.log('📊 Test Results:');
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Success Rate: ${Math.round((passed/total) * 100)}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Your deployment is working correctly.');
    console.log('\n🔗 Your app is ready:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   PhonePe Server: ${SERVER_URL}`);
    console.log(`   Health Check: ${SERVER_URL}/health`);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the deployment.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check Vercel deployment status');
    console.log('   2. Verify environment variables');
    console.log('   3. Check function logs in Vercel dashboard');
    console.log('   4. Ensure PhonePe credentials are correct');
  }
}

// Run the tests
runTests().catch(console.error);
