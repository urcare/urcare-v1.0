console.log('🔍 Testing PhonePe SDK pay method...');

const phonepeModule = require('phonepe-pg-sdk-node');

// Create client
const client = new phonepeModule.StandardCheckoutClient({
  merchantId: 'M23XRS3XN3QMF',
  saltKey: '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: 1,
  environment: 'PRODUCTION'
});

console.log('Client created successfully');

// Test with minimal payload
const testPayload = {
  merchantId: 'M23XRS3XN3QMF',
  merchantTransactionId: 'TEST_ORDER_123',
  merchantUserId: 'test_user_123',
  amount: 100,
  redirectUrl: 'http://localhost:8081/payment/success',
  redirectMode: 'REDIRECT',
  callbackUrl: 'http://localhost:5000/api/phonepe/callback',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

console.log('Test payload:', JSON.stringify(testPayload, null, 2));

// Try to call pay method
client.pay(testPayload)
  .then(response => {
    console.log('✅ Pay method successful:', response);
  })
  .catch(error => {
    console.error('❌ Pay method failed:', error.message);
    console.error('Error details:', error);
  });
