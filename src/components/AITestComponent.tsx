import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Loader2 } from 'lucide-react';

export const AITestComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testHealthScore = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const testProfile = {
        id: 'test-user',
        full_name: 'Test User',
        age: '30',
        gender: 'Male',
        height_cm: '175',
        weight_kg: '70',
        blood_group: 'O+',
        diet_type: 'Balanced',
        chronic_conditions: [],
        health_goals: ['Weight Loss', 'Fitness'],
        wake_up_time: '06:00',
        sleep_time: '22:00',
        work_start: '09:00',
        work_end: '17:00',
        breakfast_time: '07:00',
        lunch_time: '13:00',
        dinner_time: '19:00',
        workout_time: '18:00',
        workout_type: 'Cardio',
        routine_flexibility: 'Moderate',
        smoking: 'No',
        drinking: 'Occasionally',
        allergies: [],
        family_history: [],
        lifestyle: 'Active',
        stress_levels: 'Moderate',
        mental_health: 'Good',
        hydration_habits: 'Good',
        occupation: 'Software Developer'
      };

      const { data, error } = await supabase.functions.invoke('health-score', {
        body: {
          userProfile: testProfile,
          userInput: 'Test health assessment',
          uploadedFiles: [],
          voiceTranscript: ''
        }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      setTestResults(data);
      console.log('✅ Health Score Test Result:', data);
    } catch (err) {
      console.error('❌ Health Score Test Error:', err);
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testHealthPlans = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const testProfile = {
        id: 'test-user',
        full_name: 'Test User',
        age: '30',
        gender: 'Male',
        height_cm: '175',
        weight_kg: '70',
        blood_group: 'O+',
        diet_type: 'Balanced',
        chronic_conditions: [],
        health_goals: ['Weight Loss', 'Fitness'],
        wake_up_time: '06:00',
        sleep_time: '22:00',
        work_start: '09:00',
        work_end: '17:00',
        breakfast_time: '07:00',
        lunch_time: '13:00',
        dinner_time: '19:00',
        workout_time: '18:00',
        workout_type: 'Cardio',
        routine_flexibility: 'Moderate',
        smoking: 'No',
        drinking: 'Occasionally',
        allergies: [],
        family_history: [],
        lifestyle: 'Active',
        stress_levels: 'Moderate',
        mental_health: 'Good',
        hydration_habits: 'Good',
        occupation: 'Software Developer'
      };

      const { data, error } = await supabase.functions.invoke('health-plans', {
        body: {
          userProfile: testProfile,
          healthScore: 75,
          userInput: 'Generate personalized health plans'
        }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      setTestResults(data);
      console.log('✅ Health Plans Test Result:', data);
    } catch (err) {
      console.error('❌ Health Plans Test Error:', err);
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>AI Functions Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={testHealthScore} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Health Score'}
          </Button>
          <Button 
            onClick={testHealthPlans} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test Health Plans'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">❌ Error: {error}</p>
          </div>
        )}

        {testResults && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">✅ Test Results:</h4>
            <pre className="text-xs text-green-800 overflow-auto max-h-60">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITestComponent;
