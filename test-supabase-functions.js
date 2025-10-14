import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://your-project.supabase.co'; // Replace with your actual URL
const supabaseKey = 'your-anon-key'; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

// Test user ID (replace with actual user ID)
const testUserId = 'your-test-user-id';

console.log('🧪 Testing Supabase Functions...\n');

// RPC Functions to test
const rpcFunctions = [
  {
    name: 'get_user_subscription',
    params: { p_user_id: testUserId },
    description: 'Get user subscription details'
  },
  {
    name: 'get_user_daily_activities',
    params: { p_user_id: testUserId, p_date: new Date().toISOString().split('T')[0] },
    description: 'Get user daily activities'
  },
  {
    name: 'save_daily_activities',
    params: { 
      p_user_id: testUserId,
      p_activities: [
        { name: 'Test Activity', completed: false, time: '09:00' }
      ],
      p_date: new Date().toISOString().split('T')[0]
    },
    description: 'Save daily activities'
  },
  {
    name: 'mark_activity_completed',
    params: { 
      p_user_id: testUserId,
      p_activity_id: 'test-activity-id',
      p_completed: true
    },
    description: 'Mark activity as completed'
  },
  {
    name: 'get_onboarding_data',
    params: { p_user_id: testUserId },
    description: 'Get onboarding data'
  },
  {
    name: 'save_health_report',
    params: { 
      p_user_id: testUserId,
      p_report_data: { test: 'data' }
    },
    description: 'Save health report'
  },
  {
    name: 'can_access_feature',
    params: { 
      p_user_id: testUserId,
      p_feature: 'premium'
    },
    description: 'Check feature access'
  },
  {
    name: 'update_subscription_usage',
    params: { 
      p_user_id: testUserId,
      p_feature: 'premium'
    },
    description: 'Update subscription usage'
  }
];

// Edge Functions to test
const edgeFunctions = [
  {
    name: 'health-score',
    params: { 
      user_id: testUserId,
      health_data: { test: 'data' }
    },
    description: 'Calculate health score'
  },
  {
    name: 'health-plans',
    params: { 
      user_id: testUserId,
      health_data: { test: 'data' }
    },
    description: 'Generate health plans'
  },
  {
    name: 'plan-activities',
    params: { 
      user_id: testUserId,
      plan_data: { test: 'data' }
    },
    description: 'Generate plan activities'
  },
  {
    name: 'phonepe-sandbox-pay',
    params: { 
      amount: 100,
      user_id: testUserId
    },
    description: 'PhonePe sandbox payment'
  },
  {
    name: 'create-razorpay-order',
    params: { 
      amount: 100,
      currency: 'INR'
    },
    description: 'Create Razorpay order'
  }
];

// Test RPC Functions
async function testRPCFunctions() {
  console.log('📊 Testing RPC Functions:\n');
  
  for (const func of rpcFunctions) {
    try {
      console.log(`Testing: ${func.name}`);
      console.log(`Description: ${func.description}`);
      console.log(`Parameters:`, func.params);
      
      const { data, error } = await supabase.rpc(func.name, func.params);
      
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
  
  for (const func of edgeFunctions) {
    try {
      console.log(`Testing: ${func.name}`);
      console.log(`Description: ${func.description}`);
      console.log(`Parameters:`, func.params);
      
      const { data, error } = await supabase.functions.invoke(func.name, {
        body: func.params
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

// Test database tables
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

// Test storage buckets
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
