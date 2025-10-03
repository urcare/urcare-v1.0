console.log('🔍 Debugging PhonePe SDK structure...');

const phonepeModule = require('phonepe-pg-sdk-node');

console.log('Looking for main classes...');

// Check for StandardCheckoutClient
if (phonepeModule.StandardCheckoutClient) {
  console.log('✅ StandardCheckoutClient found:', typeof phonepeModule.StandardCheckoutClient);
  try {
    const client = new phonepeModule.StandardCheckoutClient({
      merchantId: 'M23XRS3XN3QMF',
      saltKey: '713219fb-38d0-468d-8268-8b15955468b0',
      saltIndex: 1,
      environment: 'PRODUCTION'
    });
    console.log('✅ StandardCheckoutClient instance created');
    console.log('Client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
  } catch (error) {
    console.error('❌ StandardCheckoutClient creation failed:', error.message);
  }
}

// Check for CustomCheckoutClient
if (phonepeModule.CustomCheckoutClient) {
  console.log('✅ CustomCheckoutClient found:', typeof phonepeModule.CustomCheckoutClient);
  try {
    const client = new phonepeModule.CustomCheckoutClient({
      merchantId: 'M23XRS3XN3QMF',
      saltKey: '713219fb-38d0-468d-8268-8b15955468b0',
      saltIndex: 1,
      environment: 'PRODUCTION'
    });
    console.log('✅ CustomCheckoutClient instance created');
    console.log('Client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
  } catch (error) {
    console.error('❌ CustomCheckoutClient creation failed:', error.message);
  }
}

// Check default export
if (phonepeModule.default) {
  console.log('Default export type:', typeof phonepeModule.default);
  console.log('Default export keys:', Object.keys(phonepeModule.default));
}
