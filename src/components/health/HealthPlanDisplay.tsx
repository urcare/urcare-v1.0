import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Apple, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Heart, 
  Target, 
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { healthPlanService, HealthPlan, HealthMetrics } from '@/services/healthPlanService';
import { useAuth } from '@/contexts/AuthContext';

interface HealthPlanDisplayProps {
  className?: string;
  showGenerateButton?: boolean;
}

export const HealthPlanDisplay: React.FC<HealthPlanDisplayProps> = ({
  className = '',
  showGenerateButton = true
}) => {
  const { user } = useAuth();
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadHealthPlan();
    }
  }, [user?.id]);

  const loadHealthPlan = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const plan = await healthPlanService.getUserHealthPlan(user.id);
      setHealthPlan(plan);
    } catch (error) {
      console.error('Error loading health plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewPlan = async () => {
    if (!user?.id) return;
    
    setIsGenerating(true);
    try {
      const plan = await healthPlanService.generateHealthPlan(user.id);
      setHealthPlan(plan);
    } catch (error) {
      console.error('Error generating health plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthPlan) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Your Health Plan
          </CardTitle>
          <CardDescription>
            Generate a personalized health plan based on your onboarding data
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            No health plan found. Generate one based on your profile data to get started.
          </p>
          {showGenerateButton && (
            <Button 
              onClick={generateNewPlan} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Health Plan
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const { metrics, nutrition, workout, lifestyle, monitoring, nextSteps } = healthPlan;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Health Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Health Overview
          </CardTitle>
          <CardDescription>
            Your current health metrics and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.bmi}</div>
              <div className="text-sm text-gray-600">BMI</div>
              <Badge variant="outline" className="mt-1">{metrics.weightStatus}</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.bmr}</div>
              <div className="text-sm text-gray-600">BMR (calories)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.tdee}</div>
              <div className="text-sm text-gray-600">Daily Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.healthScore}</div>
              <div className="text-sm text-gray-600">Health Score</div>
              <Progress value={metrics.healthScore} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Plan Tabs */}
      <Tabs defaultValue="nutrition" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="w-4 h-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Workout
          </TabsTrigger>
          <TabsTrigger value="lifestyle" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Lifestyle
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Nutrition Plan</CardTitle>
              <CardDescription>
                {nutrition.dailyCalories} calories per day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Macronutrients */}
              <div className="space-y-4">
                <h4 className="font-semibold">Macronutrient Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{nutrition.protein.grams}g</div>
                      <div className="text-sm text-blue-600">Protein ({nutrition.protein.percentage}%)</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Sources: {nutrition.protein.sources.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{nutrition.carbohydrates.grams}g</div>
                      <div className="text-sm text-green-600">Carbs ({nutrition.carbohydrates.percentage}%)</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Sources: {nutrition.carbohydrates.sources.slice(0, 3).join(', ')}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{nutrition.fats.grams}g</div>
                      <div className="text-sm text-yellow-600">Fats ({nutrition.fats.percentage}%)</div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Sources: {nutrition.fats.sources.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Timing */}
              <div className="space-y-4">
                <h4 className="font-semibold">Meal Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                    <div className="font-semibold">Breakfast</div>
                    <div className="text-sm text-gray-600">{nutrition.mealTiming.breakfast}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto text-green-500 mb-2" />
                    <div className="font-semibold">Lunch</div>
                    <div className="text-sm text-gray-600">{nutrition.mealTiming.lunch}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto text-purple-500 mb-2" />
                    <div className="font-semibold">Dinner</div>
                    <div className="text-sm text-gray-600">{nutrition.mealTiming.dinner}</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                    <div className="font-semibold">Hydration</div>
                    <div className="text-sm text-gray-600">{nutrition.hydration}L/day</div>
                  </div>
                </div>
              </div>

              {/* Sample Meals */}
              <div className="space-y-4">
                <h4 className="font-semibold">Sample Meal Ideas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-600 mb-2">Breakfast</h5>
                    <ul className="space-y-1 text-sm">
                      {nutrition.sampleMeals.breakfast.map((meal, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {meal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-600 mb-2">Lunch</h5>
                    <ul className="space-y-1 text-sm">
                      {nutrition.sampleMeals.lunch.map((meal, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {meal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workout Tab */}
        <TabsContent value="workout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout Plan</CardTitle>
              <CardDescription>
                {workout.frequency} days per week, {workout.duration} minutes per session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weekly Schedule */}
              <div className="space-y-4">
                <h4 className="font-semibold">Weekly Workout Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {Object.entries(workout.schedule).map(([day, session]) => (
                    <div key={day} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm">{day.slice(0, 3)}</div>
                      <div className="text-xs text-gray-600 mt-1">{session.type}</div>
                      <div className="text-xs text-gray-500 mt-1">{session.duration}min</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise Types */}
              <div className="space-y-4">
                <h4 className="font-semibold">Exercise Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h5 className="font-medium text-red-600 mb-2">Cardio</h5>
                    <ul className="space-y-1 text-sm">
                      {workout.types.cardio.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-600 mb-2">Strength</h5>
                    <ul className="space-y-1 text-sm">
                      {workout.types.strength.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-600 mb-2">Flexibility</h5>
                    <ul className="space-y-1 text-sm">
                      {workout.types.flexibility.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-orange-600 mb-2">Recovery</h5>
                    <ul className="space-y-1 text-sm">
                      {workout.types.recovery.slice(0, 3).map((exercise, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Progression */}
              <div className="space-y-4">
                <h4 className="font-semibold">4-Week Progression Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(workout.progression).map(([week, goals]) => (
                    <div key={week} className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-600 mb-2 capitalize">{week}</h5>
                      <ul className="space-y-1 text-sm">
                        {goals.map((goal, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Optimization</CardTitle>
              <CardDescription>
                Sleep, stress management, and daily routine recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sleep */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Sleep Recommendations
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Recommended Hours:</span>
                    <Badge variant="secondary">{lifestyle.sleep.recommendedHours} hours</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Schedule: {lifestyle.sleep.schedule}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {lifestyle.sleep.tips.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Stress Management */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-green-500" />
                  Stress Management
                </h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    {lifestyle.stressManagement.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Daily Routine */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  Daily Routine
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-600 mb-2">Morning</h5>
                    <ul className="space-y-1 text-sm">
                      {lifestyle.dailyRoutine.morning.map((activity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-purple-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-600 mb-2">Afternoon</h5>
                    <ul className="space-y-1 text-sm">
                      {lifestyle.dailyRoutine.afternoon.map((activity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-orange-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <h5 className="font-medium text-indigo-600 mb-2">Evening</h5>
                    <ul className="space-y-1 text-sm">
                      {lifestyle.dailyRoutine.evening.map((activity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-indigo-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Habits */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  Habit Formation
                </h4>
                <div className="bg-red-50 p-4 rounded-lg">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {lifestyle.habits.map((habit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-red-500" />
                        {habit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Monitoring</CardTitle>
              <CardDescription>
                Track your progress and stay on top of your health goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Key Metrics to Track
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monitoring.keyMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <Info className="w-4 h-4 inline mr-1" />
                  Frequency: {monitoring.frequency}
                </div>
              </div>

              {/* Warning Signs */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Warning Signs to Watch For
                </h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    {monitoring.warningSigns.map((sign, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Action Plan
                </h4>
                <Tabs defaultValue="immediate" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="immediate">Immediate</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="immediate" className="space-y-2">
                    <ul className="space-y-2">
                      {nextSteps.immediate.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="weekly" className="space-y-2">
                    <ul className="space-y-2">
                      {nextSteps.weekly.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="space-y-2">
                    <ul className="space-y-2">
                      {nextSteps.monthly.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Regenerate Button */}
      {showGenerateButton && (
        <div className="text-center">
          <Button 
            onClick={generateNewPlan} 
            disabled={isGenerating}
            variant="outline"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Regenerating Plan...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Regenerate Health Plan
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(healthPlan.generatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};
