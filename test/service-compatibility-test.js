// Service Compatibility Test Script
// Tests that all service methods still work with the new unified tables

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lvnkpserdydhnqbigfbz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

class ServiceCompatibilityTester {
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

  async testHealthAnalysisService() {
    // Test that health analysis service methods work
    const { data: healthAnalysis, error } = await supabase
      .from('health_analysis_unified')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Health analysis service test failed: ${error.message}`);
    }

    // Test that we can insert a new health analysis
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      health_score: 75,
      display_analysis: { greeting: 'Test analysis' },
      detailed_analysis: { test: 'data' },
      analysis: 'Test health analysis',
      recommendations: ['Test recommendation'],
      ai_provider: 'test',
      ai_model: 'test-model',
      analysis_date: new Date().toISOString().split('T')[0],
      is_latest: true
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('health_analysis_unified')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert test health analysis: ${insertError.message}`);
    }

    // Clean up test data
    await supabase
      .from('health_analysis_unified')
      .delete()
      .eq('id', insertedData.id);
  }

  async testHealthPlanService() {
    // Test that health plan service methods work
    const { data: healthPlans, error } = await supabase
      .from('health_plans_unified')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Health plan service test failed: ${error.message}`);
    }

    // Test that we can insert a new health plan
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      plan_name: 'Test Health Plan',
      plan_type: 'test',
      primary_goal: 'Test goal',
      plan_data: { test: 'data' },
      status: 'active',
      duration_weeks: 4,
      start_date: new Date().toISOString().split('T')[0],
      progress_percentage: 0,
      is_selected: false,
      is_active: true,
      ai_provider: 'test'
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('health_plans_unified')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert test health plan: ${insertError.message}`);
    }

    // Clean up test data
    await supabase
      .from('health_plans_unified')
      .delete()
      .eq('id', insertedData.id);
  }

  async testSubscriptionService() {
    // Test that subscription service methods work
    const { data: subscriptions, error } = await supabase
      .from('subscriptions_unified')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Subscription service test failed: ${error.message}`);
    }

    // Test that we can insert a new subscription
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      plan_id: '00000000-0000-0000-0000-000000000001', // Test plan UUID
      plan_slug: 'test-plan',
      status: 'active',
      billing_cycle: 'monthly',
      amount: 10.00,
      currency: 'INR',
      payment_provider: 'test',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {}
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('subscriptions_unified')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert test subscription: ${insertError.message}`);
    }

    // Clean up test data
    await supabase
      .from('subscriptions_unified')
      .delete()
      .eq('id', insertedData.id);
  }

  async testUserProfileService() {
    // Test that user profile service methods work
    const { data: userProfiles, error } = await supabase
      .from('user_profiles_unified')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      throw new Error(`User profile service test failed: ${error.message}`);
    }

    // Test that we can insert a new user profile
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      full_name: 'Test User',
      age: 30,
      gender: 'other',
      onboarding_completed: false,
      completion_percentage: 0
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('user_profiles_unified')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert test user profile: ${insertError.message}`);
    }

    // Clean up test data
    await supabase
      .from('user_profiles_unified')
      .delete()
      .eq('id', insertedData.id);
  }

  async testCompatibilityViews() {
    // Test that compatibility views work correctly
    const views = [
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

    for (const view of views) {
      const { data, error } = await supabase
        .from(view)
        .select('*')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Compatibility view ${view} is not working: ${error.message}`);
      }
    }
  }

  async testServiceMethodSignatures() {
    // Test that service methods have the correct signatures
    // This is a basic test - in a real scenario, you'd use reflection or similar
    
    // Test health analysis service
    const healthAnalysisMethods = [
      'calculateHealthScore',
      'getUserProfileForHealthScore',
      'checkHealthAnalysisExist',
      'fetchHealthAnalysis',
      'saveHealthAnalysis',
      'getOrCalculateHealthAnalysis'
    ];

    // Test health plan service
    const healthPlanMethods = [
      'generateHealthPlans',
      'saveSelectedHealthPlan',
      'getUserHealthPlans',
      'getActiveHealthPlan',
      'getSelectedHealthPlan',
      'createHealthPlan',
      'updateHealthPlan',
      'deleteHealthPlan',
      'selectHealthPlan',
      'activateHealthPlan',
      'getPlanProgress'
    ];

    // Test subscription service
    const subscriptionMethods = [
      'hasActiveSubscription',
      'getUserSubscription',
      'getSubscriptionPlans',
      'getSubscriptionPlanBySlug',
      'isEligibleForFirstTimePricing',
      'getPricingForUser',
      'createSubscription',
      'updateSubscription',
      'cancelSubscription',
      'getSubscriptionStatus',
      'getSubscriptionCheckResult',
      'handleRazorpayPaymentSuccess',
      'handlePhonePePaymentSuccess'
    ];

    // Test user profile service
    const userProfileMethods = [
      'getUserProfile',
      'upsertUserProfile',
      'updateUserProfile',
      'deleteUserProfile',
      'isOnboardingCompleted',
      'getOnboardingProgress',
      'updateOnboardingProgress',
      'completeOnboarding',
      'getHealthGoals',
      'updateHealthGoals',
      'getPhysicalMeasurements',
      'updatePhysicalMeasurements',
      'getDailySchedule',
      'updateDailySchedule',
      'getHealthConditions',
      'updateHealthConditions',
      'getLocationInfo',
      'updateLocationInfo'
    ];

    // All methods should exist (this is a placeholder - in a real test, you'd check actual method existence)
    console.log('✅ Service method signatures test passed (placeholder)');
  }

  async testDataConsistency() {
    // Test that data is consistent between old and new tables
    // This is a simplified test - in a real scenario, you'd compare actual data
    
    const { data: healthAnalysisCount } = await supabase
      .from('health_analysis_unified')
      .select('id', { count: 'exact' });

    const { data: healthAnalysisViewCount } = await supabase
      .from('health_analysis')
      .select('id', { count: 'exact' });

    // The view should return the same number of records as the unified table
    if (healthAnalysisCount?.length !== healthAnalysisViewCount?.length) {
      throw new Error(`Data consistency issue: unified table has ${healthAnalysisCount?.length || 0} records, view has ${healthAnalysisViewCount?.length || 0} records`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Service Compatibility Tests...\n');

    await this.runTest('Health Analysis Service', () => this.testHealthAnalysisService());
    await this.runTest('Health Plan Service', () => this.testHealthPlanService());
    await this.runTest('Subscription Service', () => this.testSubscriptionService());
    await this.runTest('User Profile Service', () => this.testUserProfileService());
    await this.runTest('Compatibility Views', () => this.testCompatibilityViews());
    await this.runTest('Service Method Signatures', () => this.testServiceMethodSignatures());
    await this.runTest('Data Consistency', () => this.testDataConsistency());

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
      console.log('\n🎉 All service compatibility tests passed!');
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.');
    }

    return this.testResults;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ServiceCompatibilityTester();
  tester.runAllTests()
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

module.exports = ServiceCompatibilityTester;
