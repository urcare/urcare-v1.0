import fetch from 'node-fetch';

async function testEdgeFunction() {
  try {
    console.log('🧪 Testing PhonePe Edge Function...');

    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ0MDAsImV4cCI6MjA1MTI1MDQwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ0MDAsImV4cCI6MjA1MTI1MDQwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
      }
    });

    const healthData = await healthResponse.json();
    console.log('Health response status:', healthResponse.status);
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

    const paymentResponse = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ0MDAsImV4cCI6MjA1MTI1MDQwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NzQ0MDAsImV4cCI6MjA1MTI1MDQwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();
    console.log('Payment response status:', paymentResponse.status);
    console.log('Payment response:', paymentResult);

    if (paymentResponse.ok) {
      console.log('✅ Payment created successfully!');
    } else {
      console.log('❌ Payment creation failed:', paymentResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEdgeFunction();