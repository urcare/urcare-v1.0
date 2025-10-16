// Direct Supabase Functions Test
// This script tests functions directly without requiring credentials

console.log('🧪 Supabase Functions Test Suite\n');

// Function to test a single RPC function
async function testRPCFunction(supabase, functionName, params, description) {
  try {
    console.log(`\n📊 Testing: ${functionName}`);
    console.log(`Description: ${description}`);
    console.log(`Parameters:`, JSON.stringify(params, null, 2));
    
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log(`Error details:`, JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    } else {
      console.log(`✅ Success:`, JSON.stringify(data, null, 2));
      return { success: true, data };
    }
  } catch (err) {
    console.log(`💥 Exception: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Function to test a single Edge function
async function testEdgeFunction(supabase, functionName, params, description) {
  try {
    console.log(`\n🚀 Testing: ${functionName}`);
    console.log(`Description: ${description}`);
    console.log(`Parameters:`, JSON.stringify(params, null, 2));
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: params
    });
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log(`Error details:`, JSON.stringify(error, null, 2));
      return { success: false, error: error.message };
    } else {
      console.log(`✅ Success:`, JSON.stringify(data, null, 2));
      return { success: true, data };
    }
  } catch (err) {
    console.log(`💥 Exception: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Function to test database table access
async function testDatabaseTable(supabase, tableName) {
  try {
    console.log(`\n🗄️ Testing table: ${tableName}`);
    
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(3);
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
      return { success: false, error: error.message };
    } else {
      console.log(`✅ Success: Found ${count} records`);
      console.log(`Sample data:`, JSON.stringify(data?.slice(0, 2), null, 2));
      return { success: true, count, sampleData: data?.slice(0, 2) };
    }
  } catch (err) {
    console.log(`💥 Exception: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Function to test storage bucket access
async function testStorageBucket(supabase, bucketName) {
  try {
    console.log(`\n📁 Testing bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 3 });
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
      return { success: false, error: error.message };
    } else {
      console.log(`✅ Success: Found ${data?.length || 0} files`);
      console.log(`Sample files:`, JSON.stringify(data?.slice(0, 2), null, 2));
      return { success: true, fileCount: data?.length || 0, sampleFiles: data?.slice(0, 2) };
    }
  } catch (err) {
    console.log(`💥 Exception: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Export functions for use in browser console or other scripts
if (typeof window !== 'undefined') {
  // Browser environment
  window.testSupabaseFunctions = {
    testRPCFunction,
    testEdgeFunction,
    testDatabaseTable,
    testStorageBucket
  };
  console.log('✅ Test functions available as window.testSupabaseFunctions');
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    testRPCFunction,
    testEdgeFunction,
    testDatabaseTable,
    testStorageBucket
  };
}

console.log('\n📋 Available test functions:');
console.log('- testRPCFunction(supabase, functionName, params, description)');
console.log('- testEdgeFunction(supabase, functionName, params, description)');
console.log('- testDatabaseTable(supabase, tableName)');
console.log('- testStorageBucket(supabase, bucketName)');
console.log('\n💡 Usage: Copy this script and run in browser console with your Supabase client');

