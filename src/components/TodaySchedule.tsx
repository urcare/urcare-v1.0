import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Activity, Utensils, Moon, Sun, Eye, ArrowRight, Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: 'exercise' | 'meal' | 'rest' | 'work' | 'productivity' | 'hydration' | 'mindfulness';
  details?: string;
  instructions?: string[];
  equipment?: string[];
  difficulty?: string;
  calories?: number;
  subActivities?: {
    time: string;
    activity: string;
    duration: string;
  }[];
  meal?: any;
  workout?: any;
}

interface Plan {
  id: string;
  name?: string;
  title?: string;
  description: string;
  duration?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas?: string[];
  estimatedCalories?: number;
  calorieTarget?: number;
  macros?: {
    protein: number;
    carbs: number;
    fats: number;
  };
  workoutFrequency?: string;
  workoutStyle?: string;
  timeline?: {
    'week1-2': string;
    'week3-4': string;
    'month2': string;
    'month3': string;
  };
  impacts?: {
    primaryGoal: string;
    energy: string;
    physical: string;
    mental: string;
    sleep: string;
  };
  scheduleConstraints?: {
    workoutWindows: string[];
    mealPrepComplexity: string;
    recoveryTime: string;
  };
  equipment?: string[];
  benefits?: string[];
  activities?: Activity[];
}

interface TodayScheduleProps {
  plan?: Plan | null;
  plans?: Plan[];
  showPlans?: boolean;
  onSelectPlan?: (plan: Plan) => void;
  onViewPlanDetails?: (plan: Plan) => void;
  sequentialAIResult?: any;
  profile?: any;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ 
  plan, 
  plans = [], 
  showPlans = false, 
  onSelectPlan, 
  onViewPlanDetails,
  sequentialAIResult,
  profile
}) => {
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const navigate = useNavigate();



  // Generate full day schedule grouped by categories
  const generateFullDaySchedule = (): Activity[] => {
    const baseSchedule: Activity[] = [
      {
        id: 'wakeup-routine',
        title: 'Wakeup Routine',
        time: '06:00',
        duration: '30 min',
        type: 'rest',
        details: 'Start your day with energy and focus',
        subActivities: [
          {
            time: '06:00',
            activity: 'Drink 500ml water immediately upon waking',
            duration: '2 min'
          },
          {
            time: '06:05',
            activity: '5 minutes of light stretching',
            duration: '5 min'
          },
          {
            time: '06:10',
            activity: 'Open curtains for natural light',
            duration: '1 min'
          },
          {
            time: '06:11',
            activity: 'Set daily intention',
            duration: '2 min'
          },
          {
            time: '06:15',
            activity: '5 minutes of deep breathing exercises',
            duration: '5 min'
          }
        ]
      },
      {
        id: 'breakfast',
        title: 'Breakfast',
        time: '07:00',
        duration: '30 min',
        type: 'meal',
        details: 'Nutritious morning meal to fuel your day',
        subActivities: [
          {
            time: '07:00',
            activity: 'Prepare breakfast ingredients',
            duration: '5 min'
          },
          {
            time: '07:05',
            activity: 'Cook and serve meal',
            duration: '15 min'
          },
          {
            time: '07:20',
            activity: 'Eat mindfully and enjoy',
            duration: '10 min'
          }
        ]
      },
      {
        id: 'morning-exercise',
        title: 'Morning Exercise',
        time: '08:00',
        duration: '45 min',
        type: 'exercise',
        details: 'Energize your body and mind',
        subActivities: [
          {
            time: '08:00',
            activity: '5-minute warm-up (light cardio)',
            duration: '5 min'
          },
          {
            time: '08:05',
            activity: '20-30 minutes of main workout',
            duration: '30 min'
          },
          {
            time: '08:35',
            activity: '10 minutes of cool-down stretching',
            duration: '10 min'
          }
        ]
      },
      {
        id: 'work-session-1',
        title: 'Work Session 1',
        time: '09:00',
        duration: '2 hours',
        type: 'work',
        details: 'Focus on high-priority tasks',
        instructions: [
          'Review daily priorities',
          'Work on most important tasks first',
          'Take 5-minute breaks every 25 minutes',
          'Stay hydrated',
          'Maintain good posture'
        ]
      },
      {
        id: 'mid-morning-snack',
        title: 'Mid-Morning Snack',
        time: '10:30',
        duration: '15 min',
        type: 'meal',
        details: 'Sustained energy boost',
        instructions: [
          'Choose protein-rich snacks',
          'Include fruits or vegetables',
          'Avoid sugary options',
          'Drink water',
          'Eat mindfully'
        ]
      },
      {
        id: 'work-session-2',
        title: 'Work Session 2',
        time: '11:00',
        duration: '1 hour',
        type: 'work',
        details: 'Continue with productive work',
        instructions: [
          'Focus on medium-priority tasks',
          'Take regular breaks',
          'Stay hydrated',
          'Maintain energy levels',
          'Review progress'
        ]
      },
      {
        id: 'lunch',
        title: 'Lunch',
        time: '12:00',
        duration: '45 min',
        type: 'meal',
        details: 'Balanced midday meal',
        instructions: [
          'Include lean protein',
          'Add plenty of vegetables',
          'Choose whole grains',
          'Include healthy fats',
          'Take time to enjoy your meal'
        ]
      },
      {
        id: 'afternoon-work',
        title: 'Afternoon Work',
        time: '13:00',
        duration: '2 hours',
        type: 'work',
        details: 'Continue with afternoon tasks',
        instructions: [
          'Tackle remaining priorities',
          'Take breaks every hour',
          'Stay hydrated',
          'Maintain focus',
          'Review afternoon goals'
        ]
      },
      {
        id: 'afternoon-snack',
        title: 'Afternoon Snack',
        time: '15:00',
        duration: '15 min',
        type: 'meal',
        details: 'Prevent energy crash',
        instructions: [
          'Choose healthy options',
          'Include protein and fiber',
          'Avoid energy crashes',
          'Stay hydrated',
          'Listen to your body'
        ]
      },
      {
        id: 'evening-exercise',
        title: 'Evening Exercise',
        time: '17:00',
        duration: '45 min',
        type: 'exercise',
        details: 'Wind down with movement',
        instructions: [
          'Choose relaxing activities',
          'Focus on flexibility',
          'Include light cardio',
          'Practice deep breathing',
          'Cool down properly'
        ]
      },
      {
        id: 'dinner',
        title: 'Dinner',
        time: '18:00',
        duration: '45 min',
        type: 'meal',
        details: 'Light, nutritious evening meal',
        instructions: [
          'Keep portions moderate',
          'Include lean protein',
          'Add plenty of vegetables',
          'Choose lighter options',
          'Eat slowly and mindfully'
        ]
      },
      {
        id: 'evening-relaxation',
        title: 'Evening Relaxation',
        time: '19:00',
        duration: '1 hour',
        type: 'rest',
        details: 'Unwind and recharge',
        instructions: [
          'Read a book or magazine',
          'Listen to calming music',
          'Spend time with family',
          'Practice gratitude journaling',
          'Engage in hobbies'
        ]
      },
      {
        id: 'evening-meditation',
        title: 'Evening Meditation',
        time: '20:00',
        duration: '20 min',
        type: 'mindfulness',
        details: 'Reflect and prepare for tomorrow',
        instructions: [
          'Find a quiet space',
          'Review the day\'s events',
          'Practice gratitude',
          'Set tomorrow\'s intention',
          'Focus on breathing'
        ]
      },
      {
        id: 'wind-down',
        title: 'Wind Down',
        time: '21:00',
        duration: '1 hour',
        type: 'rest',
        details: 'Prepare for restful sleep',
        instructions: [
          'Avoid screens and bright lights',
          'Dim the lights',
          'Practice relaxation techniques',
          'Prepare bedroom for sleep',
          'Set out clothes for tomorrow'
        ]
      },
      {
        id: 'bedtime',
        title: 'Bedtime',
        time: '22:00',
        duration: '8 hours',
        type: 'rest',
        details: 'Restful sleep for recovery',
        instructions: [
          'Keep room cool and dark',
          'Avoid caffeine and heavy meals',
          'Practice deep breathing',
          'Get 7-9 hours of quality sleep',
          'Maintain consistent sleep schedule'
        ]
      }
    ];

    // If a plan is selected, merge its activities into the base schedule
    if (plan && plan.activities && plan.activities.length > 0) {
      const planActivities = plan.activities.map(activity => ({
        ...activity,
        type: activity.type as 'exercise' | 'meal' | 'rest' | 'work' | 'mindfulness' || 'exercise'
      }));

      // Replace activities at the same time slots
      const mergedSchedule = baseSchedule.map(baseActivity => {
        const planActivity = planActivities.find(pa => pa.time === baseActivity.time);
        return planActivity || baseActivity;
      });

      // Add any new activities from the plan that don't have time conflicts
      const newActivities = planActivities.filter(pa => 
        !baseSchedule.some(ba => ba.time === pa.time)
      );

      return [...mergedSchedule, ...newActivities].sort((a, b) => 
        a.time.localeCompare(b.time)
      );
    }

    return baseSchedule;
  };

  // Use AI-generated activities from the plan, or fallback to hardcoded schedule
  // console.log('🔍 TodaySchedule - Plan received:', plan);
  // console.log('🔍 TodaySchedule - Plan activities:', plan?.activities);
  // console.log('🔍 TodaySchedule - Sequential AI Result:', sequentialAIResult);
  
  // Convert sequential AI result to schedule format
  const getAISchedule = (): Activity[] => {
    // console.log('🔍 TodaySchedule - sequentialAIResult:', sequentialAIResult);
    
    if (sequentialAIResult?.step2?.schedule?.dailySchedule) {
      // console.log('🔍 TodaySchedule - dailySchedule found:', sequentialAIResult.step2.schedule.dailySchedule);
      
      return sequentialAIResult.step2.schedule.dailySchedule.map((activity: any, index: number) => ({
        id: `ai_activity_${index}`,
        title: activity.activity || activity.title || 'Activity',
        time: activity.time || '00:00',
        duration: activity.duration || '30 min',
        type: activity.type === 'meal' ? 'meal' : 
              activity.type === 'exercise' ? 'exercise' :
              activity.type === 'work' ? 'work' :
              activity.type === 'work_break' ? 'work' :
              activity.type === 'mindfulness' ? 'mindfulness' :
              activity.type === 'rest' ? 'rest' : 'rest',
        details: activity.details || activity.description || '',
        instructions: activity.instructions || [],
        calories: activity.calories || 0,
        subActivities: activity.subActivities?.map((sub: any, subIndex: number) => ({
          time: sub.time || activity.time,
          activity: sub.activity || '',
          duration: sub.duration || '5 min'
        })) || [],
        equipment: activity.equipment || [],
        meal: activity.meal ? {
          name: activity.meal.name,
          items: activity.meal.items?.map((item: any) => ({
            food: item.food,
            quantity: item.quantity,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            preparation: item.preparation
          })) || [],
          totalCalories: activity.meal.totalCalories,
          totalMacros: activity.meal.totalMacros,
          prepTime: activity.meal.prepTime,
          cookingInstructions: activity.meal.cookingInstructions,
          alternatives: activity.meal.alternatives
        } : undefined,
        workout: activity.workout ? {
          type: activity.workout.type,
          warmup: activity.workout.warmup?.map((w: any) => ({
            exercise: w.exercise,
            duration: w.duration,
            details: w.details
          })) || [],
          mainExercises: activity.workout.mainExercises?.map((ex: any) => ({
            exercise: ex.exercise,
            sets: ex.sets,
            reps: ex.reps,
            duration: ex.duration,
            details: ex.details
          })) || [],
          cooldown: activity.workout.cooldown?.map((c: any) => ({
            exercise: c.exercise,
            duration: c.duration,
            details: c.details
          })) || [],
          totalDuration: activity.workout.totalDuration,
          caloriesBurned: activity.workout.caloriesBurned,
          intensity: activity.workout.intensity,
          equipment: activity.workout.equipment
        } : undefined,
        difficulty: activity.type === 'exercise' ? activity.difficulty : undefined
      }));
    }
    
    // console.log('🔍 TodaySchedule - No AI schedule found, returning empty array');
    return [];
  };

  const aiSchedule = getAISchedule();
  // console.log('🔍 TodaySchedule - aiSchedule length:', aiSchedule.length);
  // console.log('🔍 TodaySchedule - aiSchedule:', aiSchedule);
  
  // Use AI-generated activities from the plan if available
  const schedule = aiSchedule.length > 0 
    ? aiSchedule 
    : (plan?.activities && plan.activities.length > 0 
    ? plan.activities 
        : generateFullDaySchedule());
        
    

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return <Activity className="w-4 h-4" />;
      case 'meal':
        return <Utensils className="w-4 h-4" />;
      case 'rest':
        return <Moon className="w-4 h-4" />;
      case 'work':
        return <Clock className="w-4 h-4" />;
      case 'productivity':
        return <Clock className="w-4 h-4" />;
      case 'hydration':
        return <Heart className="w-4 h-4" />;
      case 'mindfulness':
        return <Sun className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exercise':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'meal':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rest':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'work':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'productivity':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hydration':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'mindfulness':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewPlanDetails = () => {
    if (plan) {
      navigate('/health-plan-generation', { state: { selectedPlan: plan } });
    }
  };

  const togglePlanExpanded = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const handlePlanSelect = (selectedPlan: Plan) => {
    if (onSelectPlan) {
      onSelectPlan(selectedPlan);
    }
  };

  const handleViewDetails = (selectedPlan: Plan) => {
    if (onViewPlanDetails) {
      onViewPlanDetails(selectedPlan);
    } else {
      // Fallback: navigate directly to health plan generation page
      navigate('/health-plan-generation', { state: { selectedPlan } });
    }
  };

  const toggleExpanded = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Only show header for non-health insights views */}
      {showPlans && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {showPlans ? 'Choose Your Protocol' : 
             sequentialAIResult && !plan ? 'Algorithm-Generated Daily Protocol' :
             plan ? 'Your Daily Protocol' : 'Health Insights'}
          </h2>
          <p className="text-gray-600">
            {showPlans 
              ? 'Select a protocol that matches your goals and lifestyle' 
              : sequentialAIResult && !plan
              ? 'Your personalized protocol generated by our advanced algorithms'
              : plan 
              ? 'Follow your personalized daily activities'
              : 'Personalized tips to improve your health and wellness'
            }
          </p>
        </div>
      )}

      {/* Show Protocols, Activities, or Health Insights */}
      {sequentialAIResult && !showPlans && !plan ? (
        // Algorithm-Generated Protocol View
        <div className="space-y-4">
          {/* Algorithm Protocol Header - Only show when no protocol is selected */}
          {!plan && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 text-lg">
                          {sequentialAIResult.step1?.plans?.[0]?.name || 'Algorithm Health Protocol'}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          Algorithm Generated
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {sequentialAIResult.step1?.plans?.[0]?.description || 'Personalized health protocol generated by our advanced algorithms'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>🤖 Advanced Algorithms</span>
                        <span>⏱️ {sequentialAIResult.step1?.plans?.[0]?.duration || '4-6 weeks'}</span>
                        <span>🔥 {sequentialAIResult.step1?.plans?.[0]?.calorieTarget || 'N/A'} cal/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Activities Protocol */}
          <div className="space-y-3">
            {schedule.map((activity) => {
              const isExpanded = expandedActivities.has(activity.id);
              return (
                <Card 
                  key={activity.id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    isExpanded ? 'shadow-lg' : 'shadow-sm'
                  }`}
                >
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpanded(activity.id)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">{activity.title}</span>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {activity.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.calories && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                            🔥 {activity.calories} cal
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Activity Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {/* Activity Details */}
                        {activity.details && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Details</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {activity.details}
                            </p>
                          </div>
                        )}

                        {activity.subActivities && activity.subActivities.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Detailed Steps</h5>
                            <div className="space-y-2">
                              {activity.subActivities.map((subActivity, index) => (
                                <div key={`${activity.id}-sub-${index}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <span className="text-xs text-gray-500 font-mono w-12">{subActivity.time}</span>
                                  <span className="text-sm text-gray-700 flex-1">{subActivity.activity}</span>
                                  <span className="text-xs text-gray-500">{subActivity.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {activity.equipment && activity.equipment.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Equipment Needed</h5>
                            <div className="flex flex-wrap gap-1">
                              {activity.equipment.map((item, index) => (
                                <span 
                                  key={`${activity.id}-equipment-${index}`}
                                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {activity.meal && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Meal Details</h5>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <h6 className="font-medium text-green-800 mb-2">{activity.meal.name}</h6>
                              <div className="space-y-2 text-sm">
                                {activity.meal.items?.map((item: any, index: number) => (
                                  <div key={`${activity.id}-meal-${index}`} className="bg-white p-2 rounded border">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium">{item.food}</span>
                                      <span className="text-green-600 font-medium">{item.calories} cal</span>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1">Quantity: {item.quantity}</div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Macros: P{item.protein}g C{item.carbs}g F{item.fats}g
                                    </div>
                                    {item.preparation && (
                                      <div className="text-xs text-gray-600 italic">
                                        Prep: {item.preparation}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 pt-2 border-t border-green-200">
                                <div className="text-xs text-green-700 mb-1">
                                  Total: {activity.meal.totalCalories} calories | 
                                  P: {activity.meal.totalMacros?.protein}g | 
                                  C: {activity.meal.totalMacros?.carbs}g | 
                                  F: {activity.meal.totalMacros?.fats}g
                                </div>
                                {activity.meal.prepTime && (
                                  <div className="text-xs text-green-700 mb-1">
                                    Prep Time: {activity.meal.prepTime}
                                  </div>
                                )}
                                {activity.meal.cookingInstructions && (
                                  <div className="text-xs text-green-700">
                                    <div className="font-medium mb-1">Cooking Instructions:</div>
                                    <div className="whitespace-pre-line">{activity.meal.cookingInstructions}</div>
                                  </div>
                                )}
                                {activity.meal.alternatives && activity.meal.alternatives.length > 0 && (
                                  <div className="text-xs text-green-700 mt-2">
                                    <div className="font-medium mb-1">Alternatives:</div>
                                    <div>{activity.meal.alternatives.join(', ')}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {activity.workout && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Workout Details</h5>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="mb-3">
                                <div className="text-sm font-medium text-blue-800 mb-2">
                                  {activity.workout.type} Workout - {activity.workout.intensity} Level
                                </div>
                                <div className="text-xs text-blue-700">
                                  Duration: {activity.workout.totalDuration} | 
                                  Calories: {activity.workout.caloriesBurned} | 
                                  Intensity: {activity.workout.intensity}
                                </div>
                              </div>

                              {activity.workout.warmup && activity.workout.warmup.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="font-medium text-blue-800 mb-2 text-sm">Warm-up ({activity.workout.warmup[0]?.duration})</h6>
                                  <div className="space-y-1">
                                    {activity.workout.warmup.map((w: any, index: number) => (
                                      <div key={`${activity.id}-warmup-${index}`} className="text-xs text-blue-700">
                                        • {w.exercise} {w.details && `- ${w.details}`}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activity.workout.mainExercises && activity.workout.mainExercises.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="font-medium text-blue-800 mb-2 text-sm">Main Exercises</h6>
                                  <div className="space-y-2">
                                    {activity.workout.mainExercises.map((exercise: any, index: number) => (
                                      <div key={`${activity.id}-exercise-${index}`} className="bg-white p-2 rounded border">
                                        <div className="flex justify-between items-start mb-1">
                                          <span className="font-medium text-sm">{exercise.exercise}</span>
                                          <span className="text-blue-600 text-xs">{exercise.sets} sets × {exercise.reps} reps</span>
                                        </div>
                                        {exercise.duration && (
                                          <div className="text-xs text-gray-600 mb-1">Duration: {exercise.duration}</div>
                                        )}
                                        {exercise.details && (
                                          <div className="text-xs text-gray-500 italic">{exercise.details}</div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activity.workout.cooldown && activity.workout.cooldown.length > 0 && (
                                <div className="mb-3">
                                  <h6 className="font-medium text-blue-800 mb-2 text-sm">Cooldown ({activity.workout.cooldown[0]?.duration})</h6>
                                  <div className="space-y-1">
                                    {activity.workout.cooldown.map((c: any, index: number) => (
                                      <div key={`${activity.id}-cooldown-${index}`} className="text-xs text-blue-700">
                                        • {c.exercise} {c.details && `- ${c.details}`}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {activity.workout.equipment && activity.workout.equipment.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-blue-200">
                                  <div className="text-xs text-blue-700">
                                    <div className="font-medium mb-1">Equipment Needed:</div>
                                    <div>{activity.workout.equipment.join(', ')}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {activity.difficulty && activity.type === 'exercise' && (
                          <div>
                            <h5 className="font-medium text-gray-800 mb-2">Difficulty</h5>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(activity.difficulty)}`}>
                              {activity.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : showPlans ? (
        // Plans View
        <div className="space-y-4">
          {plans.map((planItem) => {
            const isExpanded = expandedPlans.has(planItem.id);
            return (
              <Card 
                key={planItem.id}
                className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                  isExpanded ? 'shadow-lg' : 'shadow-sm'
                }`}
                onClick={() => togglePlanExpanded(planItem.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-blue-100 text-blue-800 border-blue-200">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 text-lg">{planItem.name || planItem.title}</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(planItem.difficulty || '')}`}>
                            {planItem.difficulty || 'Not specified'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{planItem.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>⏱️ {planItem.duration || 'Not specified'}</span>
                          <span>🔥 {planItem.calorieTarget || planItem.estimatedCalories || 'N/A'} cal/day</span>
                          <span>💪 {planItem.workoutFrequency || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Plan Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Focus Areas</h4>
                          <div className="flex flex-wrap gap-1">
                            {planItem.focusAreas?.map((area, index) => (
                              <span 
                                key={`${planItem.id}-focus-${index}`}
                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                              >
                                {area}
                              </span>
                            )) || <span className="text-xs text-gray-500">Not specified</span>}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Nutrition Info</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Calories:</strong> {planItem.calorieTarget || planItem.estimatedCalories || 'N/A'} cal/day</p>
                            {planItem.macros && (
                              <p><strong>Macros:</strong> P{planItem.macros.protein}% C{planItem.macros.carbs}% F{planItem.macros.fats}%</p>
                            )}
                            <p><strong>Workout:</strong> {planItem.workoutFrequency || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {planItem.timeline && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Expected Timeline</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div><strong>Week 1-2:</strong> {planItem.timeline['week1-2']}</div>
                            <div><strong>Week 3-4:</strong> {planItem.timeline['week3-4']}</div>
                            <div><strong>Month 2:</strong> {planItem.timeline['month2']}</div>
                            <div><strong>Month 3:</strong> {planItem.timeline['month3']}</div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanSelect(planItem);
                          }}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Select Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : plan ? (
        // Schedule View - Show the selected plan's schedule
        <div className="space-y-4">
          {/* Plan Header */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-green-100 text-green-800 border-green-200">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-lg">{plan.name || plan.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(plan.difficulty || '')}`}>
                        {plan.difficulty || 'Not specified'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>⏱️ {plan.duration || 'Not specified'}</span>
                      <span>🔥 {plan.calorieTarget || plan.estimatedCalories || 'N/A'} cal/day</span>
                      <span>💪 {plan.workoutFrequency || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPlanExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Plan Details */}
              {isPlanExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Plan Overview</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Duration:</strong> {plan.duration || 'Not specified'}</p>
                        <p><strong>Difficulty:</strong> {plan.difficulty || 'Not specified'}</p>
                        <p><strong>Focus Areas:</strong> {plan.focusAreas?.join(', ') || 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Key Benefits</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {plan.benefits?.slice(0, 3).map((benefit, index) => (
                          <li key={`${plan.id}-benefit-${index}`}>{benefit}</li>
                        )) || <li>No benefits listed</li>}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleViewPlanDetails}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Go to Plan Page
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Activities Schedule */}
          <div className="space-y-3">
            {(!plan.activities || plan.activities.length === 0) ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-lg font-medium">No detailed schedule yet</p>
                  <p className="text-sm">Set this plan as default to generate your personalized daily schedule</p>
                </div>
                <Button 
                  onClick={() => onSelectPlan && onSelectPlan(plan)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Set as Default Plan
                </Button>
              </div>
            ) : (
              schedule.map((activity) => {
                const isExpanded = expandedActivities.has(activity.id);
                return (
                  <Card 
                    key={activity.id}
                    className={`transition-all duration-200 hover:shadow-md ${
                      isExpanded ? 'shadow-lg' : 'shadow-sm'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleExpanded(activity.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-800">{activity.title}</span>
                              <span className="text-sm text-gray-500">{activity.time}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {activity.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.calories && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              🔥 {activity.calories} cal
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Activity Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                          {/* Always show Instructions section */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              Instructions
                            </h5>
                            

                            {/* Show instructions if available */}
                            {activity.instructions && activity.instructions.length > 0 ? (
                              <div className="space-y-2">
                                {activity.instructions.map((instruction, index) => (
                                  <div key={`${activity.id}-instruction-${index}`} className="flex items-start space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                      {index + 1}
                                    </span>
                                    <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">No instructions available for this activity.</p>
                                <p className="text-xs text-gray-400 mt-1">This activity doesn't have detailed instructions yet.</p>
                              </div>
                            )}
                          </div>

                          {activity.subActivities && activity.subActivities.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Detailed Steps</h5>
                              <div className="space-y-2">
                                {activity.subActivities.map((subActivity, index) => (
                                  <div key={`${activity.id}-sub-${index}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <span className="text-xs text-gray-500 font-mono w-12">{subActivity.time}</span>
                                    <span className="text-sm text-gray-700 flex-1">{subActivity.activity}</span>
                                    <span className="text-xs text-gray-500">{subActivity.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {activity.equipment && activity.equipment.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Equipment Needed</h5>
                              <div className="flex flex-wrap gap-1">
                                {activity.equipment.map((item, index) => (
                                  <span 
                                    key={`${activity.id}-equipment-${index}`}
                                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {activity.meal && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Meal Details</h5>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <h6 className="font-medium text-green-800 mb-2">{activity.meal.name}</h6>
                                <div className="space-y-1 text-sm">
                                  {activity.meal.items?.map((item: any, index: number) => (
                                    <div key={`${activity.id}-meal-${index}`} className="flex justify-between">
                                      <span>{item.food} ({item.quantity})</span>
                                      <span className="text-green-600">{item.calories} cal</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-700">
                                  Total: {activity.meal.totalCalories} calories | 
                                  P: {activity.meal.totalMacros?.protein}g | 
                                  C: {activity.meal.totalMacros?.carbs}g | 
                                  F: {activity.meal.totalMacros?.fats}g
                                </div>
                              </div>
                            </div>
                          )}

                          {activity.workout && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Workout Details</h5>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-sm space-y-2">
                                  {activity.workout.mainExercises?.map((exercise: any, index: number) => (
                                    <div key={`${activity.id}-exercise-${index}`} className="flex justify-between">
                                      <span>{exercise.exercise}</span>
                                      <span className="text-blue-600">{exercise.sets} sets × {exercise.reps} reps</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-700">
                                  Duration: {activity.workout.totalDuration} | 
                                  Calories: {activity.workout.caloriesBurned} | 
                                  Intensity: {activity.workout.intensity}
                                </div>
                              </div>
                            </div>
                          )}

                          {activity.difficulty && activity.type === 'exercise' && (
                            <div>
                              <h5 className="font-medium text-gray-800 mb-2">Difficulty</h5>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(activity.difficulty)}`}>
                                {activity.difficulty}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      ) : (
        // Health Insights View - AI Generated Content
        <div className="space-y-4">
          {(() => {
            // Try to get AI health data from localStorage
            let aiHealthData = null;
            try {
              const storedHealthData = localStorage.getItem('aiHealthData');
              if (storedHealthData) {
                aiHealthData = JSON.parse(storedHealthData);
              }
            } catch (error) {
              console.warn('Failed to load AI health data:', error);
            }

            if (aiHealthData && aiHealthData.healthScoreAnalysis) {
              // Show AI-generated health insights
              return (
                <div className="space-y-4">
                  {/* Health Insights Header */}
                  <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-800">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span>Health Insights</span>
                  </div>
                  
                  {/* Health Analysis Content */}
                  <div className="space-y-4 px-4 py-3">
                    {/* Add personalized greeting */}
                    {aiHealthData.displayAnalysis && aiHealthData.displayAnalysis.greeting && (
                      <div className="text-sm font-medium text-gray-800 mb-3">
                        {aiHealthData.displayAnalysis.greeting.replace('Hi A,', `Hi ${profile?.full_name?.split(" ")[0] || 'User'},`)}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {aiHealthData.healthScoreAnalysis
                        .replace(/Health score: \d+\/100/g, '') // Remove health score display
                        .split('\n')
                        .filter(line => line.trim() !== '') // Remove empty lines
                        .map((line, index) => {
                          if (line.trim() === 'Recommendations:') {
                            return (
                              <div key={index} className="text-center font-bold text-gray-800 mt-4 mb-2">
                                {line}
                              </div>
                            );
                          }
                          return <div key={index}>{line}</div>;
                        })}
                    </div>
                    
                    {/* Negative Analysis Points */}
                    {aiHealthData.displayAnalysis && aiHealthData.displayAnalysis.negativeAnalysis && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Areas for Improvement
                        </h4>
                    <div className="space-y-2">
                      {aiHealthData.displayAnalysis.negativeAnalysis.map((point: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600">
                          🚨 {point.replace(/🚨\s*/, '')}
                        </div>
                      ))}
                    </div>
                      </div>
                    )}

                    {/* AI Recommendations */}
                    {aiHealthData.healthScoreRecommendations && aiHealthData.healthScoreRecommendations.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Key Recommendations
                        </h4>
                        <div className="space-y-2">
                          {aiHealthData.healthScoreRecommendations.slice(0, 3).map((recommendation: string, index: number) => (
                            <div key={index} className="text-sm text-gray-600">
                              💚 {recommendation.replace(/💚\s*/, '')}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              // Fallback to default welcome content
              return (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Heart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-medium">Welcome to Your Health Journey</p>
                    <p className="text-sm">Generate a personalized health plan to get started</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Set your health goals</p>
                    <p>• Get personalized recommendations</p>
                    <p>• Track your daily activities</p>
                    <p>• Monitor your progress</p>
                  </div>
                </div>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
};

export default TodaySchedule;