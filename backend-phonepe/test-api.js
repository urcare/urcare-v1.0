const fetch = require('node-fetch').default;

async function testPhonePeAPI() {
  try {
    console.log('🧪 Testing PhonePe API...');

    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('Health response:', healthData);

    // Test payment creation
    console.log('\n2. Testing payment creation...');
    const paymentData = {
      orderId: 'TEST_ORDER_' + Date.now(),
      amount: 100,
      userId: 'test_user_123',
      planSlug: 'basic',
      billingCycle: 'annual'
    };

    console.log('Payment request:', paymentData);

    const paymentResponse = await fetch('http://localhost:5000/api/phonepe/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();
    console.log('Payment response:', paymentResult);

    if (paymentResult.success) {
      console.log('✅ Payment created successfully!');
      console.log('Redirect URL:', paymentResult.redirectUrl);
    } else {
      console.log('❌ Payment creation failed:', paymentResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPhonePeAPI();
