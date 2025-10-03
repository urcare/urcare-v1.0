// Test script to verify PhonePe Edge Functions are working
// Run this in your browser console after deploying the functions

async function testPhonePeFunctions() {
  console.log('🧪 Testing PhonePe Edge Functions...');
  
  // Test data
  const testData = {
    amount: 100,
    userId: 'test-user-123',
    planSlug: 'basic',
    billingCycle: 'monthly'
  };
  
  try {
    // Test phonepe-create-order function
    console.log('📞 Testing phonepe-create-order function...');
    
    const response = await fetch('https://lvnkpserdydhnqbigfbz.supabase.co/functions/v1/phonepe-create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || 'your-anon-key'}`
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ phonepe-create-order function is working!');
      console.log('Response:', result);
      
      if (result.redirectUrl) {
        console.log('🎉 PhonePe integration is LIVE!');
        console.log('Redirect URL:', result.redirectUrl);
      } else {
        console.log('⚠️ Function working but no redirect URL (might be in test mode)');
      }
    } else {
      console.log('❌ phonepe-create-order function failed');
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.log('❌ Error testing functions:', error);
    console.log('Make sure you are logged in and the functions are deployed');
  }
}

// Run the test
testPhonePeFunctions();
