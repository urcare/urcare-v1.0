// Simple Supabase Functions Test
// Run with: node test-functions-simple.js

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const TEST_USER_ID = 'your-test-user-id';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testing Supabase Functions...\n');

// Test RPC Functions
async function testRPCFunctions() {
  console.log('📊 Testing RPC Functions:\n');
  
  const rpcTests = [
    {
      name: 'get_user_subscription',
      params: { p_user_id: TEST_USER_ID },
      description: 'Get user subscription details'
    },
    {
      name: 'get_user_daily_activities',
      params: { p_user_id: TEST_USER_ID, p_date: new Date().toISOString().split('T')[0] },
      description: 'Get user daily activities'
    },
    {
      name: 'get_onboarding_data',
      params: { p_user_id: TEST_USER_ID },
      description: 'Get onboarding data'
    },
    {
      name: 'can_access_feature',
      params: { p_user_id: TEST_USER_ID, p_feature: 'premium' },
      description: 'Check feature access'
    }
  ];

  for (const test of rpcTests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Description: ${test.description}`);
      console.log(`Parameters:`, test.params);
      
      const { data, error } = await supabase.rpc(test.name, test.params);
      
      if (error) {
        console.log(`❌ Error:`, error.message);
        console.log(`Error details:`, error);
      } else {
        console.log(`✅ Success:`, data);
      }
      
      console.log('─'.repeat(50));
    } catch (err) {
      console.log(`💥 Exception:`, err.message);
      console.log('─'.repeat(50));
    }
  }
}

// Test Edge Functions
async function testEdgeFunctions() {
  console.log('\n🚀 Testing Edge Functions:\n');
  
  const edgeTests = [
    {
      name: 'health-score',
      params: { user_id: TEST_USER_ID, health_data: { test: 'data' } },
      description: 'Calculate health score'
    },
    {
      name: 'health-plans',
      params: { user_id: TEST_USER_ID, health_data: { test: 'data' } },
      description: 'Generate health plans'
    },
    {
      name: 'plan-activities',
      params: { user_id: TEST_USER_ID, plan_data: { test: 'data' } },
      description: 'Generate plan activities'
    }
  ];

  for (const test of edgeTests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`Description: ${test.description}`);
      console.log(`Parameters:`, test.params);
      
      const { data, error } = await supabase.functions.invoke(test.name, {
        body: test.params
      });
      
      if (error) {
        console.log(`❌ Error:`, error.message);
        console.log(`Error details:`, error);
      } else {
        console.log(`✅ Success:`, data);
      }
      
      console.log('─'.repeat(50));
    } catch (err) {
      console.log(`💥 Exception:`, err.message);
      console.log('─'.repeat(50));
    }
  }
}

// Test Database Tables
async function testDatabaseTables() {
  console.log('\n🗄️ Testing Database Tables:\n');
  
  const tables = [
    'user_subscriptions',
    'manual_upi_payments',
    'subscription_plans',
    'daily_activities',
    'health_analysis',
    'health_plans'
  ];
  
  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`);
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5);
      
      if (error) {
        console.log(`❌ Error:`, error.message);
      } else {
        console.log(`✅ Success: Found ${count} records`);
        console.log(`Sample data:`, data?.slice(0, 2));
      }
      
      console.log('─'.repeat(50));
    } catch (err) {
      console.log(`💥 Exception:`, err.message);
      console.log('─'.repeat(50));
    }
  }
}

// Test Storage Buckets
async function testStorageBuckets() {
  console.log('\n📁 Testing Storage Buckets:\n');
  
  const buckets = [
    'payment-screenshots',
    'health-reports'
  ];
  
  for (const bucket of buckets) {
    try {
      console.log(`Testing bucket: ${bucket}`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', { limit: 5 });
      
      if (error) {
        console.log(`❌ Error:`, error.message);
      } else {
        console.log(`✅ Success: Found ${data?.length || 0} files`);
        console.log(`Sample files:`, data?.slice(0, 2));
      }
      
      console.log('─'.repeat(50));
    } catch (err) {
      console.log(`💥 Exception:`, err.message);
      console.log('─'.repeat(50));
    }
  }
}

// Main test function
async function runAllTests() {
  console.log('🔍 Starting comprehensive Supabase function testing...\n');
  
  try {
    await testRPCFunctions();
    await testEdgeFunctions();
    await testDatabaseTables();
    await testStorageBuckets();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.log('\n💥 Test suite failed:', error);
  }
}

// Run the tests
runAllTests();

