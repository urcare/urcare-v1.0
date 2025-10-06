// Test what API keys are available in Supabase environment
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvnkpserdydhnqbigfbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmtwc2VyZHlkaG5xYmlnZmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzQ4MzQsImV4cCI6MjA1MDA1MDgzNH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseSecrets() {
  console.log('🧪 Testing Supabase secrets...\n');
  
  try {
    // Test health-plans function to see what keys it's using
    const { data, error } = await supabase.functions.invoke('health-plans', {
      body: {
        userProfile: {
          id: 'test',
          age: 25,
          gender: 'male',
          height: 175,
          weight: 70,
          activity_level: 'moderate',
          health_goals: ['gain_weight'],
          medical_conditions: [],
          medications: [],
          allergies: [],
          sleep_hours: 8,
          stress_level: 3,
          diet_type: 'balanced',
          exercise_frequency: 3,
          chronic_conditions: [],
          family_history: [],
          lifestyle_factors: [],
          wake_up_time: '07:00',
          sleep_time: '23:00',
          workout_time: '18:00'
        }
      }
    });

    if (error) {
      console.log('❌ Error:', error);
      return;
    }

    console.log('✅ Health Plans Response:');
    console.log('   Success:', data.success);
    console.log('   Plans Count:', data.plans?.length || 0);
    console.log('   Provider:', data.meta?.provider || 'Unknown');
    
    if (data.plans?.length > 0) {
      console.log('   First Plan:', data.plans[0].title);
    }

  } catch (err) {
    console.log('❌ Test Error:', err.message);
  }
}

testSupabaseSecrets().catch(console.error);
