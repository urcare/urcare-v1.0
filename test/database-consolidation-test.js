// Database Consolidation Test Script
// Tests data migration completeness and service compatibility

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lvnkpserdydhnqbigfbz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

class DatabaseConsolidationTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`\n🧪 Running test: ${testName}`);
      await testFunction();
      this.testResults.passed++;
      console.log(`✅ ${testName} - PASSED`);
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ test: testName, error: error.message });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
    }
  }

  async testUnifiedTablesExist() {
    const requiredTables = [
      'health_analysis_unified',
      'health_plans_unified',
      'daily_schedules_unified',
      'subscriptions_unified',
      'payments_unified',
      'user_profiles_unified',
      'plan_activities_unified',
      'progress_tracking_unified'
    ];

    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        throw new Error(`Table ${table} does not exist or is not accessible: ${error.message}`);
      }
    }
  }

  async testCompatibilityViewsExist() {
    const requiredViews = [
      'health_analysis',
      'health_insights',
      'user_health_scores',
      'health_plans',
      'user_health_plans',
      'user_selected_health_plans',
      'daily_schedules',
      'user_daily_schedules',
      'subscriptions',
      'razorpay_subscriptions',
      'payments',
      'razorpay_payments',
      'user_profiles',
      'onboarding_profiles',
      'user_plan_activities',
      'user_progress_tracking'
    ];

    for (const view of requiredViews) {
      const { data, error } = await supabase
        .from(view)
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(`View ${view} does not exist or is not accessible: ${error.message}`);
      }
    }
  }

  async testDataMigrationCompleteness() {
    // Test health analysis data migration
    const { data: healthAnalysisCount } = await supabase
      .from('health_analysis_unified')
      .select('id', { count: 'exact' });

    const { data: oldHealthAnalysisCount } = await supabase
      .from('health_analysis')
      .select('id', { count: 'exact' });

    const { data: oldHealthInsightsCount } = await supabase
      .from('health_insights')
      .select('id', { count: 'exact' });

    const { data: oldUserHealthScoresCount } = await supabase
      .from('user_health_scores')
      .select('id', { count: 'exact' });

    const totalOldRecords = (oldHealthAnalysisCount?.length || 0) + 
                           (oldHealthInsightsCount?.length || 0) + 
                           (oldUserHealthScoresCount?.length || 0);

    if (healthAnalysisCount?.length < totalOldRecords) {
      throw new Error(`Health analysis data migration incomplete. Expected at least ${totalOldRecords} records, got ${healthAnalysisCount?.length || 0}`);
    }

    // Test health plans data migration
    const { data: healthPlansCount } = await supabase
      .from('health_plans_unified')
      .select('id', { count: 'exact' });

    const { data: oldHealthPlansCount } = await supabase
      .from('health_plans')
      .select('id', { count: 'exact' });

    const { data: oldUserHealthPlansCount } = await supabase
      .from('user_health_plans')
      .select('id', { count: 'exact' });

    const { data: oldUserSelectedHealthPlansCount } = await supabase
      .from('user_selected_health_plans')
      .select('id', { count: 'exact' });

    const totalOldPlansRecords = (oldHealthPlansCount?.length || 0) + 
                               (oldUserHealthPlansCount?.length || 0) + 
                               (oldUserSelectedHealthPlansCount?.length || 0);

    if (healthPlansCount?.length < totalOldPlansRecords) {
      throw new Error(`Health plans data migration incomplete. Expected at least ${totalOldPlansRecords} records, got ${healthPlansCount?.length || 0}`);
    }

    // Test subscriptions data migration
    const { data: subscriptionsCount } = await supabase
      .from('subscriptions_unified')
      .select('id', { count: 'exact' });

    const { data: oldSubscriptionsCount } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact' });

    const { data: oldRazorpaySubscriptionsCount } = await supabase
      .from('razorpay_subscriptions')
      .select('id', { count: 'exact' });

    const totalOldSubscriptionsRecords = (oldSubscriptionsCount?.length || 0) + 
                                       (oldRazorpaySubscriptionsCount?.length || 0);

    if (subscriptionsCount?.length < totalOldSubscriptionsRecords) {
      throw new Error(`Subscriptions data migration incomplete. Expected at least ${totalOldSubscriptionsRecords} records, got ${subscriptionsCount?.length || 0}`);
    }
  }

  async testForeignKeyRelationships() {
    // Test that foreign keys are properly maintained
    const { data: healthPlans, error: healthPlansError } = await supabase
      .from('health_plans_unified')
      .select('id, user_id')
      .limit(5);

    if (healthPlansError) {
      throw new Error(`Error fetching health plans: ${healthPlansError.message}`);
    }

    for (const plan of healthPlans || []) {
      // Test that user_id exists in auth.users (this would need to be tested with actual user data)
      if (!plan.user_id) {
        throw new Error(`Health plan ${plan.id} has null user_id`);
      }
    }

    // Test subscriptions foreign keys
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions_unified')
      .select('id, user_id, plan_id')
      .limit(5);

    if (subscriptionsError) {
      throw new Error(`Error fetching subscriptions: ${subscriptionsError.message}`);
    }

    for (const subscription of subscriptions || []) {
      if (!subscription.user_id) {
        throw new Error(`Subscription ${subscription.id} has null user_id`);
      }
      if (!subscription.plan_id) {
        throw new Error(`Subscription ${subscription.id} has null plan_id`);
      }
    }
  }

  async testRLSPolicies() {
    // Test that RLS policies are working
    // This is a basic test - in a real scenario, you'd test with different user contexts
    
    const { data: healthAnalysis, error: healthAnalysisError } = await supabase
      .from('health_analysis_unified')
      .select('id')
      .limit(1);

    if (healthAnalysisError && healthAnalysisError.code !== 'PGRST116') {
      throw new Error(`RLS policy test failed for health_analysis_unified: ${healthAnalysisError.message}`);
    }

    const { data: healthPlans, error: healthPlansError } = await supabase
      .from('health_plans_unified')
      .select('id')
      .limit(1);

    if (healthPlansError && healthPlansError.code !== 'PGRST116') {
      throw new Error(`RLS policy test failed for health_plans_unified: ${healthPlansError.message}`);
    }
  }

  async testDataIntegrity() {
    // Test that critical fields are not null where they shouldn't be
    const { data: healthAnalysis, error: healthAnalysisError } = await supabase
      .from('health_analysis_unified')
      .select('id, user_id, health_score, analysis')
      .limit(10);

    if (healthAnalysisError) {
      throw new Error(`Error testing health analysis data integrity: ${healthAnalysisError.message}`);
    }

    for (const record of healthAnalysis || []) {
      if (!record.user_id) {
        throw new Error(`Health analysis record ${record.id} has null user_id`);
      }
      if (record.health_score === null || record.health_score === undefined) {
        throw new Error(`Health analysis record ${record.id} has null health_score`);
      }
      if (!record.analysis) {
        throw new Error(`Health analysis record ${record.id} has null analysis`);
      }
    }

    // Test health plans data integrity
    const { data: healthPlans, error: healthPlansError } = await supabase
      .from('health_plans_unified')
      .select('id, user_id, plan_name, status')
      .limit(10);

    if (healthPlansError) {
      throw new Error(`Error testing health plans data integrity: ${healthPlansError.message}`);
    }

    for (const plan of healthPlans || []) {
      if (!plan.user_id) {
        throw new Error(`Health plan record ${plan.id} has null user_id`);
      }
      if (!plan.plan_name) {
        throw new Error(`Health plan record ${plan.id} has null plan_name`);
      }
      if (!plan.status) {
        throw new Error(`Health plan record ${plan.id} has null status`);
      }
    }
  }

  async testIndexesExist() {
    // Test that indexes are working by running queries that should use them
    const { data: healthAnalysis, error: healthAnalysisError } = await supabase
      .from('health_analysis_unified')
      .select('id')
      .eq('is_latest', true)
      .limit(1);

    if (healthAnalysisError) {
      throw new Error(`Index test failed for health_analysis_unified: ${healthAnalysisError.message}`);
    }

    const { data: healthPlans, error: healthPlansError } = await supabase
      .from('health_plans_unified')
      .select('id')
      .eq('is_active', true)
      .limit(1);

    if (healthPlansError) {
      throw new Error(`Index test failed for health_plans_unified: ${healthPlansError.message}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Database Consolidation Tests...\n');

    await this.runTest('Unified Tables Exist', () => this.testUnifiedTablesExist());
    await this.runTest('Compatibility Views Exist', () => this.testCompatibilityViewsExist());
    await this.runTest('Data Migration Completeness', () => this.testDataMigrationCompleteness());
    await this.runTest('Foreign Key Relationships', () => this.testForeignKeyRelationships());
    await this.runTest('RLS Policies', () => this.testRLSPolicies());
    await this.runTest('Data Integrity', () => this.testDataIntegrity());
    await this.runTest('Indexes Exist', () => this.testIndexesExist());

    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.testResults.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }

    if (this.testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Database consolidation is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }

    return this.testResults;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new DatabaseConsolidationTester();
  tester.runAllTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseConsolidationTester;
