import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Calendar, 
  Clock, 
  Heart, 
  Target, 
  TrendingUp, 
  Zap,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingToHealthProfileMapper } from '@/services/onboardingToHealthProfileMapper';
import { aiHealthAssistantService, UserHealthProfile, PersonalizedDailyPlan } from '@/services/aiHealthAssistantService';
import AIDailyHealthPlan from '@/components/health/AIDailyHealthPlan';

interface AIHealthDashboardProps {
  className?: string;
}

const AIHealthDashboard: React.FC<AIHealthDashboardProps> = ({ className = '' }) => {
  const { profile } = useAuth();
  const [healthProfile, setHealthProfile] = useState<UserHealthProfile | null>(null);
  const [dailyPlan, setDailyPlan] = useState<PersonalizedDailyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [insights, setInsights] = useState<{
    healthScore: number;
    recommendations: string[];
    nextSteps: string[];
  } | null>(null);

  useEffect(() => {
    if (profile) {
      generateHealthProfile();
    }
  }, [profile]);

  const generateHealthProfile = () => {
    if (!profile) return;

    try {
      // Map onboarding data to health profile format
      const mappedProfile = OnboardingToHealthProfileMapper.mapToHealthProfile(profile);
      setHealthProfile(mappedProfile);

      // Validate profile completeness
      const validation = OnboardingToHealthProfileMapper.validateProfileCompleteness(mappedProfile);
      setProfileCompleteness(validation.completeness);

      // Generate insights
      const profileInsights = OnboardingToHealthProfileMapper.getProfileInsights(mappedProfile);
      setInsights(profileInsights);

      // Try to load existing daily plan
      loadExistingPlan();
    } catch (error) {
      console.error('Error generating health profile:', error);
    }
  };

  const loadExistingPlan = async () => {
    if (!healthProfile) return;

    try {
      // This would load from database in production
      // const existingPlan = await aiHealthAssistantService.getLatestPlan(userId);
      // if (existingPlan) setDailyPlan(existingPlan);
    } catch (error) {
      console.error('Error loading existing plan:', error);
    }
  };

  const generateDailyPlan = async () => {
    if (!healthProfile) return;

    setIsGenerating(true);
    try {
      const plan = await aiHealthAssistantService.generateDailyPlan(healthProfile);
      setDailyPlan(plan);
      
      // Save plan to database (would need actual user ID)
      // await aiHealthAssistantService.savePlan(userId, plan);
    } catch (error) {
      console.error('Error generating daily plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanGenerated = (plan: PersonalizedDailyPlan) => {
    setDailyPlan(plan);
  };

  if (!profile || !healthProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Completeness & Health Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Completeness */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-600" />
              Profile Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Data Quality</span>
                <span className="text-sm font-semibold text-blue-600">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2" />
              <div className="text-xs text-gray-500">
                {profileCompleteness >= 80 ? 'Excellent profile data for AI analysis' :
                 profileCompleteness >= 60 ? 'Good profile data, consider adding more details' :
                 'Profile needs more information for optimal AI recommendations'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-green-600" />
              AI Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{insights.healthScore}</div>
                  <div className="text-sm text-gray-600">out of 100</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${insights.healthScore}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {insights.healthScore >= 80 ? 'Excellent health profile' :
                   insights.healthScore >= 60 ? 'Good health profile' :
                   'Health profile needs attention'}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Calculating...</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {insights && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI-Powered Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Personalized Tips
                </h4>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Next Steps
                </h4>
                <ul className="space-y-2">
                  {insights.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Profile Summary */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Your Health Profile Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{healthProfile.age}</div>
              <div className="text-xs text-blue-600">Age</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{healthProfile.height}cm</div>
              <div className="text-xs text-green-600">Height</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">{healthProfile.weight}kg</div>
              <div className="text-xs text-purple-600">Weight</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-semibold text-orange-700 capitalize">{healthProfile.bodyType}</div>
              <div className="text-xs text-orange-600">Body Type</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Health Conditions</h5>
              <div className="flex flex-wrap gap-2">
                {healthProfile.healthConditions.length > 0 ? (
                  healthProfile.healthConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                      {condition}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    No conditions reported
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Fitness Goals</h5>
              <div className="flex flex-wrap gap-2">
                {healthProfile.fitnessGoals.length > 0 ? (
                  healthProfile.fitnessGoals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {goal}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    No goals set
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Health Plan */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Your AI-Generated Daily Health Plan
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Personalized schedule based on your health profile and preferences
          </p>
        </CardHeader>
        <CardContent>
          {dailyPlan ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Plan generated on {new Date(dailyPlan.date).toLocaleDateString()}
                  </span>
                </div>
                <Button 
                  onClick={generateDailyPlan} 
                  disabled={isGenerating}
                  variant="outline"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              
              {/* Quick Plan Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800 mb-1">Nutrition</div>
                  <div className="text-xs text-green-600">
                    {dailyPlan.nutritionSummary.totalCalories} kcal daily target
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Exercise</div>
                  <div className="text-xs text-blue-600">
                    {dailyPlan.exerciseSummary.totalDuration} min daily activity
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 mb-1">Hydration</div>
                  <div className="text-xs text-purple-600">
                    {dailyPlan.detoxSummary.hydrationTarget}ml daily goal
                  </div>
                </div>
              </div>

              {/* Full Plan Component */}
              <AIDailyHealthPlan 
                userProfile={healthProfile}
                onPlanGenerated={handlePlanGenerated}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate Your Daily Health Plan
              </h3>
              <p className="text-gray-600 mb-6">
                Get a personalized daily schedule tailored to your health profile
              </p>
              <Button 
                onClick={generateDailyPlan} 
                disabled={isGenerating}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Daily Plan
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Quality Warning */}
      {profileCompleteness < 60 && (
        <Card className="border-0 shadow-md border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Profile Data Incomplete</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Your profile is only {profileCompleteness}% complete. For better AI recommendations, 
                  consider updating your health information in the profile section.
                </p>
                <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  Update Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIHealthDashboard;
