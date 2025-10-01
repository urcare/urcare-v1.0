import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://lvnkpserdydhnqbigfbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQ4MjQ0MCwiZXhwIjoyMDUwMDU4NDQwfQ.8vJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteUserSubscription(userId) {
  try {
    console.log(`🗑️  Deleting subscription for user: ${userId}`);
    
    // First, let's check if the user has any subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('❌ Error fetching subscriptions:', fetchError);
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

    // Delete all subscriptions for this user
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('❌ Error deleting subscriptions:', deleteError);
      return;
    }

    console.log('✅ Successfully deleted all subscriptions for user:', userId);

    // Also check and delete any related payment records
    const { data: payments, error: paymentFetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId);

    if (paymentFetchError) {
      console.error('❌ Error fetching payments:', paymentFetchError);
    } else if (payments && payments.length > 0) {
      console.log(`📋 Found ${payments.length} payment record(s), deleting...`);
      
      const { error: paymentDeleteError } = await supabase
        .from('payments')
        .delete()
        .eq('user_id', userId);

      if (paymentDeleteError) {
        console.error('❌ Error deleting payments:', paymentDeleteError);
      } else {
        console.log('✅ Successfully deleted all payment records for user:', userId);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get user ID from command line argument
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Please provide a user ID as an argument');
  console.log('Usage: node delete-user-subscription.js <user-id>');
  process.exit(1);
}

// Run the deletion
deleteUserSubscription(userId);
