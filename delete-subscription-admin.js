import { createClient } from '@supabase/supabase-js';

// Use the anon key for now - we'll need to use RLS policies or get service role key
const supabaseUrl = 'https://lvnkpserdydhnqbigfbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODI0NDAsImV4cCI6MjA1MDA1ODQ0MH0.8vJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteUserSubscription(userId) {
  try {
    console.log(`🗑️  Attempting to delete subscription for user: ${userId}`);
    
    // First, let's check if the user has any subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('❌ Error fetching subscriptions:', fetchError);
      console.log('💡 This might be due to RLS policies. You may need to:');
      console.log('   1. Use the Supabase dashboard directly');
      console.log('   2. Get the service role key');
      console.log('   3. Or run this from the admin panel in the app');
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('ℹ️  No subscriptions found for this user');
      return;
    }

    console.log(`📋 Found ${subscriptions.length} subscription(s):`);
    subscriptions.forEach((sub, index) => {
      console.log(`   ${index + 1}. ID: ${sub.id}, Status: ${sub.status}, Plan: ${sub.plan_id}, Billing: ${sub.billing_cycle}`);
    });

    // Try to delete subscriptions
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('❌ Error deleting subscriptions:', deleteError);
      console.log('💡 This is likely due to RLS policies. Try using the admin panel in the app instead.');
      return;
    }

    console.log('✅ Successfully deleted all subscriptions for user:', userId);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get user ID from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Please provide a user ID as an argument');
  console.log('Usage: node delete-subscription-admin.js <user-id>');
  process.exit(1);
}

// Run the deletion
deleteUserSubscription(userId);
