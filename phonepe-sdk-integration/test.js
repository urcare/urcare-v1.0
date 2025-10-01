import PhonePeService from './phonepe-service.js';

/**
 * Test PhonePe SDK Integration
 */
async function testPhonePeIntegration() {
  console.log('🧪 Testing PhonePe SDK Integration');
  console.log('=====================================');

  const phonepeService = new PhonePeService();

  try {
    // Test 1: Configuration
    console.log('\n🔧 Test 1: Configuration');
    console.log('-------------------------');
    const config = phonepeService.getConfig();
    console.log('Configuration:', config);

    // Test 2: Create Payment Order
    console.log('\n💰 Test 2: Create Payment Order');
    console.log('--------------------------------');
    
    const orderId = `TEST_ORDER_${Date.now()}`;
    const amount = 100; // ₹1 in paise
    const userId = 'test_user_123';
    const planSlug = 'basic';
    const billingCycle = 'annual';

    console.log('Creating payment order:', { orderId, amount, userId, planSlug, billingCycle });

    const paymentResult = await phonepeService.createPaymentOrder({
      orderId,
      amount,
      userId,
      planSlug,
      billingCycle
    });

    console.log('Payment result:', paymentResult);

    if (paymentResult.success) {
      console.log('✅ Payment order created successfully!');
      console.log('🔗 Redirect URL:', paymentResult.redirectUrl);
    } else {
      console.log('❌ Payment order creation failed');
    }

    // Test 3: Check Payment Status
    console.log('\n🔍 Test 3: Check Payment Status');
    console.log('-------------------------------');
    
    console.log('Checking payment status for:', orderId);

    const statusResult = await phonepeService.checkPaymentStatus(orderId);

    console.log('Status result:', statusResult);

    if (statusResult.success) {
      console.log('✅ Payment status checked successfully!');
    } else {
      console.log('❌ Payment status check failed');
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testPhonePeIntegration();

