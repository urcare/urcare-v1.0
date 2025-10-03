import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Flame, Target, Dumbbell, CheckCircle } from 'lucide-react';

interface HealthPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string[];
  estimatedCalories: number;
  equipment: string[];
  benefits: string[];
}

interface HealthPlansVerticalListProps {
  plans: HealthPlan[];
  onSelectPlan: (plan: HealthPlan) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function HealthPlansVerticalList({ plans, onSelectPlan }: HealthPlansVerticalListProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Personalized Health Plans
        </h2>
        <p className="text-gray-600">
          Choose the plan that best fits your goals and lifestyle
        </p>
      </div>

      <div className="space-y-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.title}
                    </h3>
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {plan.difficulty}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => onSelectPlan(plan)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Select
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  {/* Duration */}
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{plan.duration}</span>
                  </div>

                  {/* Calories */}
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">{plan.estimatedCalories} cal</span>
                  </div>

                  {/* Focus Areas */}
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{plan.focusAreas[0]}</span>
                  </div>

                  {/* Equipment */}
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-700">{plan.equipment[0]}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {plan.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-1 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
