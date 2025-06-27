// Simple test script to verify onboarding flow
const { createClient } = require('@supabase/supabase-js');

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOnboardingFlow() {
  console.log('Testing onboarding flow...');
  
  try {
    // Test 1: Check if user_profiles table exists and has the right columns
    console.log('\n1. Checking user_profiles table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (schemaError) {
      console.error('Schema error:', schemaError);
    } else {
      console.log('✅ user_profiles table exists');
      if (schemaData.length > 0) {
        console.log('Sample record columns:', Object.keys(schemaData[0]));
      }
    }
    
    // Test 2: Check if we can insert/update a test record
    console.log('\n2. Testing insert/update functionality...');
    const testProfile = {
      id: 'test-user-id',
      full_name: 'Test User',
      phone: '+1234567890',
      onboarding_completed: true,
      role: 'patient',
      status: 'active'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .upsert(testProfile)
      .select();
    
    if (insertError) {
      console.error('Insert error:', insertError);
    } else {
      console.log('✅ Insert/update successful:', insertData);
    }
    
    // Test 3: Check if we can query by onboarding_completed
    console.log('\n3. Testing onboarding_completed query...');
    const { data: queryData, error: queryError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('onboarding_completed', true)
      .limit(5);
    
    if (queryError) {
      console.error('Query error:', queryError);
    } else {
      console.log('✅ Query successful, found', queryData.length, 'completed profiles');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testOnboardingFlow(); 