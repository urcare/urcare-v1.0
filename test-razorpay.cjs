// Test script for Razorpay integration
const https = require('https');

console.log('🧪 Testing Razorpay Integration...\n');

// Test data
const testData = JSON.stringify({
  orderId: "TEST_RAZORPAY_" + Date.now(),
  amount: 10000, // ₹100 in paise
  userId: "test_user_123",
  planSlug: "basic",
  billingCycle: "annual"
});

console.log('📤 Test Data:', testData);

// Test create order API
const createOrderOptions = {
  hostname: 'urcare.vercel.app',
  port: 443,
  path: '/api/razorpay/create-order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('\n🔗 Testing Create Order API...');

const createOrderReq = https.request(createOrderOptions, (res) => {
  console.log('📊 Status:', res.statusCode);
  console.log('📋 Headers:', res.headers);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('📨 Response:', responseData);
    
    try {
      const data = JSON.parse(responseData);
      if (data.success && data.orderId) {
        console.log('✅ Create Order API working!');
        console.log('🎯 Order ID:', data.orderId);
        console.log('💰 Amount:', data.amount);
        console.log('🔑 Key ID:', data.keyId);
      } else {
        console.log('❌ Create Order API failed:', data.error);
      }
    } catch (error) {
      console.log('❌ Invalid JSON response:', error.message);
    }
  });
});

createOrderReq.on('error', (error) => {
  console.error('❌ Request error:', error);
});

createOrderReq.write(testData);
createOrderReq.end();
