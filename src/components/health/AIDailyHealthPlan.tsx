import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  Pill, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  aiHealthAssistantService, 
  UserHealthProfile, 
  PersonalizedDailyPlan 
} from '@/services/aiHealthAssistantService';

interface AIDailyHealthPlanProps {
  userProfile: UserHealthProfile;
  onPlanGenerated?: (plan: PersonalizedDailyPlan) => void;
  className?: string;
}

const AIDailyHealthPlan: React.FC<AIDailyHealthPlanProps> = ({
  userProfile,
  onPlanGenerated,
  className = ''
}) => {
  const [plan, setPlan] = useState<PersonalizedDailyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load existing plan
    loadExistingPlan();
  }, []);

  const loadExistingPlan = async () => {
    try {
      // This would need to be implemented with actual user ID
      // const existingPlan = await aiHealthAssistantService.getLatestPlan(userId);
      // if (existingPlan) setPlan(existingPlan);
    } catch (error) {
      console.error('Error loading existing plan:', error);
    }
  };

  const generateNewPlan = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const newPlan = await aiHealthAssistantService.generateDailyPlan(userProfile);
      setPlan(newPlan);
      onPlanGenerated?.(newPlan);
      
      // Save plan to database (would need actual user ID)
      // await aiHealthAssistantService.savePlan(userId, newPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
      setError('Failed to generate health plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Utensils className="w-4 h-4" />;
      case 'exercise': return <Dumbbell className="w-4 h-4" />;
      case 'detox': return <Droplets className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'lifestyle': return <Heart className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800 border-green-200';
      case 'exercise': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'detox': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medication': return 'bg-red-100 text-red-800 border-red-200';
      case 'lifestyle': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!plan) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Daily Health Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generate Your Personalized Daily Plan
            </h3>
            <p className="text-gray-600 mb-6">
              Get a comprehensive daily schedule tailored to your health goals, 
              including nutrition, exercise, detoxification, medication optimization, 
              and lifestyle integration.
            </p>
            <Button 
              onClick={generateNewPlan} 
              disabled={isGenerating}
              className="w-full"
              size="lg"
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
            {error && (
              <p className="text-red-600 text-sm mt-3">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Your Daily Health Plan
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Generated on {new Date(plan.date).toLocaleDateString()}
              </p>
            </div>
            <Button 
              onClick={generateNewPlan} 
              disabled={isGenerating}
              variant="outline"
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="schedule">Daily Schedule</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="detox">Detox</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Daily Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hour-by-Hour Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {item.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`${getCategoryColor(item.category)}`}
                        >
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </Badge>
                        {item.duration && (
                          <span className="text-sm text-gray-500">
                            {item.duration}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.activity}
                      </h4>
                      {item.instructions && (
                        <p className="text-sm text-gray-700 mb-2">
                          {item.instructions}
                        </p>
                      )}
                      {item.notes && (
                        <p className="text-sm text-gray-500 italic">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Daily Targets</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Calories</span>
                      <span className="font-semibold text-green-700">{plan.nutritionSummary.totalCalories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Protein</span>
                      <span className="font-semibold text-blue-700">{plan.nutritionSummary.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Carbohydrates</span>
                      <span className="font-semibold text-yellow-700">{plan.nutritionSummary.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Fats</span>
                      <span className="font-semibold text-purple-700">{plan.nutritionSummary.fats}g</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Hydration</span>
                      <span className="font-semibold text-cyan-700">{plan.nutritionSummary.hydration}ml</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Meal Schedule</h4>
                  <div className="space-y-3">
                    {plan.schedule
                      .filter(item => item.category === 'nutrition')
                      .map((meal, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{meal.time}</span>
                          </div>
                          <p className="text-sm text-gray-700">{meal.activity}</p>
                          {meal.instructions && (
                            <p className="text-xs text-gray-500 mt-1">{meal.instructions}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5" />
                Exercise Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Daily Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Total Duration</span>
                      <span className="font-semibold text-blue-700">{plan.exerciseSummary.totalDuration} min</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Intensity</span>
                      <span className="font-semibold text-green-700 capitalize">{plan.exerciseSummary.intensity}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Exercise Types</h5>
                    <div className="flex flex-wrap gap-2">
                      {plan.exerciseSummary.types.map((type, index) => (
                        <Badge key={index} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Workout Sessions</h4>
                  <div className="space-y-3">
                    {plan.schedule
                      .filter(item => item.category === 'exercise')
                      .map((exercise, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-blue-900">{exercise.time}</span>
                          </div>
                          <p className="text-sm text-blue-800 font-medium">{exercise.activity}</p>
                          {exercise.instructions && (
                            <p className="text-xs text-blue-600 mt-1">{exercise.instructions}</p>
                          )}
                          {exercise.duration && (
                            <span className="text-xs text-blue-500">{exercise.duration}</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detox Tab */}
        <TabsContent value="detox">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                Detoxification & Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Hydration Target</h4>
                  <div className="p-4 bg-cyan-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-cyan-700 mb-1">
                      {plan.detoxSummary.hydrationTarget}ml
                    </div>
                    <p className="text-sm text-cyan-600">Daily water intake goal</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Detox Strategies</h5>
                    <ul className="space-y-2">
                      {plan.detoxSummary.strategies.map((strategy, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Daily Detox Activities</h4>
                  <div className="space-y-3">
                    {plan.schedule
                      .filter(item => item.category === 'detox')
                      .map((detox, index) => (
                        <div key={index} className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span className="font-medium text-purple-900">{detox.time}</span>
                          </div>
                          <p className="text-sm text-purple-800 font-medium">{detox.activity}</p>
                          {detox.instructions && (
                            <p className="text-xs text-purple-600 mt-1">{detox.instructions}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Key Takeaways
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Lifestyle Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Lifestyle Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.lifestyleTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Medication Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medication Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.medicationSchedule.medications.map((med, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-red-900">{med.name}</span>
                        <span className="text-sm text-red-600">{med.time}</span>
                      </div>
                      <p className="text-xs text-red-700">{med.instructions}</p>
                    </div>
                  ))}
                  {plan.medicationSchedule.interactions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Interactions</h5>
                      <ul className="space-y-1">
                        {plan.medicationSchedule.interactions.map((interaction, index) => (
                          <li key={index} className="text-xs text-red-600">
                            {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Important Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDailyHealthPlan;
