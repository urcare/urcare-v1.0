console.log('🔍 Debugging PhonePe SDK import...');

try {
  console.log('1. Trying require...');
  const phonepeModule = require('phonepe-pg-sdk-node');
  console.log('✅ Require successful');
  console.log('Module keys:', Object.keys(phonepeModule));
  console.log('Module type:', typeof phonepeModule);
  console.log('Module constructor:', phonepeModule.constructor?.name);
  
  if (phonepeModule.default) {
    console.log('Default export keys:', Object.keys(phonepeModule.default));
    console.log('Default export type:', typeof phonepeModule.default);
  }
  
  if (phonepeModule.PhonePe) {
    console.log('PhonePe class found:', typeof phonepeModule.PhonePe);
  }
  
  // Try to create instance
  try {
    const PhonePe = phonepeModule.PhonePe || phonepeModule.default || phonepeModule;
    console.log('PhonePe class:', typeof PhonePe);
    
    if (typeof PhonePe === 'function') {
      const instance = new PhonePe({
        merchantId: 'M23XRS3XN3QMF',
        saltKey: '713219fb-38d0-468d-8268-8b15955468b0',
        saltIndex: 1,
        environment: 'production'
      });
      console.log('✅ PhonePe instance created successfully');
      console.log('Instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
    } else {
      console.log('❌ PhonePe is not a constructor function');
    }
  } catch (instanceError) {
    console.error('❌ Failed to create PhonePe instance:', instanceError.message);
  }
  
} catch (error) {
  console.error('❌ Require failed:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n2. Trying dynamic import...');
import('phonepe-pg-sdk-node')
  .then(phonepeModule => {
    console.log('✅ Dynamic import successful');
    console.log('Module keys:', Object.keys(phonepeModule));
    console.log('Module type:', typeof phonepeModule);
  })
  .catch(error => {
    console.error('❌ Dynamic import failed:', error.message);
  });
