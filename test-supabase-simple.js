import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing Supabase AI Functions (Simple)');
console.log('==========================================');

async function testHealthPlans() {
  try {
    console.log('🔍 Testing health-plans function...');
    
    const { data, error } = await supabase.functions.invoke('health-plans', {
      body: {
        userProfile: {
          age: 30,
          gender: 'Male',
          height_cm: 175,
          weight_kg: 70,
          health_goals: ['Weight Loss', 'Muscle Building'],
          workout_time: '18:00',
          sleep_time: '22:00',
          wake_up_time: '06:00'
        },
        healthScore: 75,
        analysis: 'Good health with room for improvement',
        recommendations: ['Exercise regularly', 'Eat balanced meals', 'Get enough sleep'],
        userInput: 'I want to get fit and healthy'
      }
    });

    if (error) {
      console.log(`❌ health-plans Error: ${error.message}`);
      return false;
    }

    console.log('✅ health-plans Response:');
    console.log(`- Success: ${data.success}`);
    console.log(`- Plans generated: ${data.plans?.length || 0}`);
    console.log(`- Error: ${data.error || 'None'}`);
    if (data.plans && data.plans.length > 0) {
      console.log(`- First plan: ${data.plans[0].title}`);
    }
    return true;
  } catch (error) {
    console.log(`❌ health-plans Error: ${error.message}`);
    return false;
  }
}

async function testPlanActivities() {
  try {
    console.log('🔍 Testing plan-activities function...');
    
    const { data, error } = await supabase.functions.invoke('plan-activities', {
      body: {
        planId: 'test-plan-123',
        userProfile: {
          age: 30,
          gender: 'Male',
          health_goals: ['Weight Loss', 'Muscle Building']
        }
      }
    });

    if (error) {
      console.log(`❌ plan-activities Error: ${error.message}`);
      return false;
    }

    console.log('✅ plan-activities Response:');
    console.log(`- Success: ${data.success}`);
    console.log(`- Activities generated: ${data.activities?.length || 0}`);
    console.log(`- Error: ${data.error || 'None'}`);
    return true;
  } catch (error) {
    console.log(`❌ plan-activities Error: ${error.message}`);
    return false;
  }
}

async function testHealthScore() {
  try {
    console.log('🔍 Testing health-score function...');
    
    const { data, error } = await supabase.functions.invoke('health-score', {
      body: {
        userProfile: {
          age: 30,
          gender: 'Male',
          height_cm: 175,
          weight_kg: 70,
          health_goals: ['Weight Loss', 'Muscle Building'],
          chronic_conditions: [],
          medications: []
        }
      }
    });

    if (error) {
      console.log(`❌ health-score Error: ${error.message}`);
      return false;
    }

    console.log('✅ health-score Response:');
    console.log(`- Success: ${data.success}`);
    console.log(`- Health Score: ${data.healthScore}`);
    console.log(`- Analysis: ${data.analysis ? 'Generated' : 'None'}`);
    console.log(`- Recommendations: ${data.recommendations?.length || 0}`);
    console.log(`- Error: ${data.error || 'None'}`);
    return true;
  } catch (error) {
    console.log(`❌ health-score Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Simple Supabase AI Functions Test');
  console.log('==============================================');
  
  const results = await Promise.all([
    testHealthPlans(),
    testPlanActivities(),
    testHealthScore()
  ]);
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('\n📊 Simple Supabase AI Test Results Summary');
  console.log('===========================================');
  console.log(`✅ PASS: ${passed}/${total} functions working`);
  
  if (passed === total) {
    console.log('🎉 All Supabase AI functions are working correctly!');
  } else {
    console.log('⚠️  Some Supabase AI functions need attention.');
  }
}

runTests().catch(console.error);
