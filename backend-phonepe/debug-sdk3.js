console.log('🔍 Debugging PhonePe SDK API methods...');

const phonepeModule = require('phonepe-pg-sdk-node');

// Create client
const client = new phonepeModule.StandardCheckoutClient({
  merchantId: 'M23XRS3XN3QMF',
  saltKey: '713219fb-38d0-468d-8268-8b15955468b0',
  saltIndex: 1,
  environment: 'PRODUCTION'
});

console.log('Client prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)));

// Check if there are any methods on the client
console.log('Client methods:', Object.getOwnPropertyNames(client));

// Try to find payment-related methods
const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(client));
const paymentMethods = methods.filter(method => 
  method.toLowerCase().includes('pay') || 
  method.toLowerCase().includes('order') ||
  method.toLowerCase().includes('create')
);

console.log('Payment-related methods:', paymentMethods);

// Check if there are any properties that might contain methods
console.log('Client properties:', Object.keys(client));
