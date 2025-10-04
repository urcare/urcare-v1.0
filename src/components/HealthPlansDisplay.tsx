import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Target, Zap, CheckCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthPlan {
  id: string;
  title?: string;
  name?: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
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
  activities?: {
    time: string;
    title: string;
    description: string;
    duration: string;
    category: string;
  }[];
}

interface HealthPlansDisplayProps {
  plans: HealthPlan[];
  onSelectPlan: (plan: HealthPlan) => Promise<void>;
  selectedPlan?: HealthPlan | null;
  className?: string;
}

const HealthPlansDisplay: React.FC<HealthPlansDisplayProps> = ({
  plans,
  onSelectPlan,
  selectedPlan,
  className = ''
}) => {
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  const togglePlanExpansion = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const toggleActivityExpansion = (activityKey: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityKey)) {
      newExpanded.delete(activityKey);
    } else {
      newExpanded.add(activityKey);
    }
    setExpandedActivities(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return <Star className="w-4 h-4" />;
      case 'Intermediate':
        return <Target className="w-4 h-4" />;
      case 'Advanced':
        return <Zap className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wake up':
        return '🌅';
      case 'exercise':
        return '💪';
      case 'meals':
        return '🍽️';
      case 'work':
        return '💼';
      case 'hydration':
        return '💧';
      case 'recovery':
        return '🧘';
      default:
        return '⏰';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Personalized Health Protocols
        </h2>
        <p className="text-gray-600">
          Choose the protocol that best fits your lifestyle and goals
        </p>
      </div>

      <AnimatePresence>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-300 ${
              selectedPlan?.id === plan.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-lg'
            }`}>
              <CardHeader 
                className="cursor-pointer pb-3"
                onClick={() => togglePlanExpansion(plan.id)}
              >
                {/* Title and Description */}
                <div className="mb-3">
                  <CardTitle className="text-lg mb-1">{plan.title || plan.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </div>
                
                {/* Meta Information - Compact Single Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getDifficultyIcon(plan.difficulty)}
                      <Badge className={`${getDifficultyColor(plan.difficulty)} text-xs px-2 py-0.5`}>
                        {plan.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {plan.duration}
                    </div>
                  </div>
                  {expandedPlans.has(plan.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedPlans.has(plan.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0 pb-4">
                      <div className="space-y-6">
                        {/* Plan Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Zap className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">Calories</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {plan.calorieTarget || plan.estimatedCalories || 'N/A'} cal/day
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">Workout</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {plan.workoutFrequency || 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">Style</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {plan.workoutStyle || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Macros */}
                        {plan.macros && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Macro Breakdown</h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-3 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{plan.macros.protein}%</p>
                                <p className="text-sm text-gray-600">Protein</p>
                              </div>
                              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{plan.macros.carbs}%</p>
                                <p className="text-sm text-gray-600">Carbs</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{plan.macros.fats}%</p>
                                <p className="text-sm text-gray-600">Fats</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Focus Areas */}
                        {plan.focusAreas && plan.focusAreas.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Focus Areas</h4>
                            <div className="flex flex-wrap gap-2">
                              {plan.focusAreas.map((area, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timeline */}
                        {plan.timeline && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Expected Timeline</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Weeks 1-2:</span>
                                <span className="text-gray-600">{plan.timeline['week1-2']}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Weeks 3-4:</span>
                                <span className="text-gray-600">{plan.timeline['week3-4']}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Month 2:</span>
                                <span className="text-gray-600">{plan.timeline['month2']}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Month 3:</span>
                                <span className="text-gray-600">{plan.timeline['month3']}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Impacts */}
                        {plan.impacts && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Expected Impacts</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">Primary Goal</h5>
                                <p className="text-sm text-green-700">{plan.impacts.primaryGoal}</p>
                              </div>
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <h5 className="font-medium text-yellow-800 mb-2">Energy</h5>
                                <p className="text-sm text-yellow-700">{plan.impacts.energy}</p>
                              </div>
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <h5 className="font-medium text-blue-800 mb-2">Physical</h5>
                                <p className="text-sm text-blue-700">{plan.impacts.physical}</p>
                              </div>
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <h5 className="font-medium text-purple-800 mb-2">Mental</h5>
                                <p className="text-sm text-purple-700">{plan.impacts.mental}</p>
                              </div>
                              <div className="p-3 bg-indigo-50 rounded-lg col-span-1 md:col-span-2">
                                <h5 className="font-medium text-indigo-800 mb-2">Sleep</h5>
                                <p className="text-sm text-indigo-700">{plan.impacts.sleep}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Schedule Constraints */}
                        {plan.scheduleConstraints && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Schedule Info</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-800 mb-2">Workout Windows</h5>
                                <div className="space-y-1">
                                  {plan.scheduleConstraints.workoutWindows.map((window, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {window}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-800 mb-2">Meal Prep</h5>
                                <p className="text-sm text-gray-600 capitalize">
                                  {plan.scheduleConstraints.mealPrepComplexity} complexity
                                </p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-800 mb-2">Recovery</h5>
                                <p className="text-sm text-gray-600">
                                  {plan.scheduleConstraints.recoveryTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Daily Activities */}
                        <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Daily Activities
                        </h4>
                        
                        {plan.activities && plan.activities.length > 0 ? (
                          plan.activities.map((activity, activityIndex) => {
                            const activityKey = `${plan.id}-${activityIndex}`;
                            const isExpanded = expandedActivities.has(activityKey);
                            
                            return (
                              <div
                                key={activityIndex}
                                className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
                              >
                                <div 
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => toggleActivityExpansion(activityKey)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-lg">
                                      {getCategoryIcon(activity.category)}
                                    </span>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">
                                          {activity.title}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                          {activity.time}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {activity.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {activity.duration}
                                    </span>
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="mt-2 pt-2 border-t border-gray-100"
                                    >
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-gray-600">Category:</span>
                                          <span className="font-medium capitalize">
                                            {activity.category}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-gray-600">Duration:</span>
                                          <span className="font-medium">
                                            {activity.duration}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-gray-600">Time:</span>
                                          <span className="font-medium">
                                            {activity.time}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No detailed activities available for this plan.</p>
                            <p className="text-sm mt-1">Select this plan to get started!</p>
                          </div>
                        )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Button
                          onClick={() => onSelectPlan(plan)}
                          className={`w-full ${
                            selectedPlan?.id === plan.id
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white`}
                        >
                          {selectedPlan?.id === plan.id ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Selected Plan
                            </>
                          ) : (
                            'Select This Plan'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default HealthPlansDisplay;