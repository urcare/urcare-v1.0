import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const SupabaseFunctionDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const testFunction = async (functionName: string, body: any) => {
    setIsLoading(true);
    try {
      console.log(`🧪 Testing ${functionName}...`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        console.error(`❌ ${functionName} error:`, error);
        setTestResults(prev => ({
          ...prev,
          [functionName]: {
            success: false,
            error: error.message,
            status: error.status || 'Unknown'
          }
        }));
      } else {
        console.log(`✅ ${functionName} success:`, data);
        setTestResults(prev => ({
          ...prev,
          [functionName]: {
            success: true,
            data: data,
            status: 'Success'
          }
        }));
      }
    } catch (err) {
      console.error(`❌ ${functionName} exception:`, err);
      setTestResults(prev => ({
        ...prev,
        [functionName]: {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          status: 'Exception'
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testHealthScore = () => {
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

    testFunction('health-score', {
      userProfile: testProfile,
      userInput: 'Test health assessment',
      uploadedFiles: [],
      voiceTranscript: ''
    });
  };

  const testHealthPlans = () => {
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

    testFunction('health-plans', {
      userProfile: testProfile,
      healthScore: 75,
      userInput: 'Generate personalized health plans'
    });
  };


  const testPlanActivities = () => {
    const testPlan = {
      id: 'plan_1',
      name: 'Test Plan',
      title: 'Test Health Plan',
      description: 'A test health plan',
      difficulty: 'beginner',
      duration_weeks: 12,
      focus_areas: ['Weight Loss', 'Fitness']
    };

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

    testFunction('plan-activities', {
      selectedPlan: testPlan,
      userProfile: testProfile
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Supabase Functions Debug</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={testHealthScore} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span>Test Health Score</span>
          </Button>
          
          <Button 
            onClick={testHealthPlans} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span>Test Health Plans</span>
          </Button>
          
          <Button 
            onClick={testPlanActivities} 
            disabled={isLoading}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span>Test Plan Activities</span>
          </Button>
        </div>

        {/* Results Display */}
        <div className="space-y-3">
          {Object.entries(testResults).map(([functionName, result]: [string, any]) => (
            <div key={functionName} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{functionName}</h4>
                <div className="flex items-center space-x-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
              
              {result.success ? (
                <div className="text-sm text-green-700">
                  <p>✅ Function executed successfully</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">View Response</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <div className="text-sm text-red-700">
                  <p>❌ Function failed: {result.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseFunctionDebug;
