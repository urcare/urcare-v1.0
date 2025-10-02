import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Target, Zap, CheckCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  focusAreas?: string[];
  estimatedCalories?: number;
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
          Your Personalized Health Plans
        </h2>
        <p className="text-gray-600">
          Choose the plan that best fits your lifestyle and goals
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
                className="cursor-pointer"
                onClick={() => togglePlanExpansion(plan.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getDifficultyIcon(plan.difficulty)}
                      <Badge className={getDifficultyColor(plan.difficulty)}>
                        {plan.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {plan.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
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
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Daily Activities
                        </h4>
                        
                        {plan.activities && plan.activities.length > 0 ? (
                          plan.activities.map((activity, activityIndex) => {
                            const activityKey = `${plan.id}-${activityIndex}`;
                            const isExpanded = expandedActivities.has(activityKey);
                            
                            return (
                              <div
                                key={activityIndex}
                                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
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
                                      className="mt-3 pt-3 border-t border-gray-100"
                                    >
                                      <div className="space-y-2">
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

                      <div className="mt-6 pt-4 border-t border-gray-200">
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