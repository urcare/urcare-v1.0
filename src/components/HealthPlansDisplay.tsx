import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Flame, Dumbbell, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface HealthPlansDisplayProps {
  plans: HealthPlan[];
  onSelectPlan: (plan: HealthPlan) => void;
}

const HealthPlansDisplay: React.FC<HealthPlansDisplayProps> = ({ plans, onSelectPlan }) => {
  const navigate = useNavigate();

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

  const handleSelectPlan = (plan: HealthPlan) => {
    onSelectPlan(plan);
    navigate('/workout-dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Personalized Health Plans
        </h2>
        <p className="text-gray-600">
          Choose the plan that best fits your goals and lifestyle
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {plan.title}
                  </CardTitle>
                  <Badge className={getDifficultyColor(plan.difficulty)}>
                    {plan.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Duration and Calories */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Flame className="w-4 h-4" />
                    <span>{plan.estimatedCalories} cal</span>
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {plan.focusAreas.slice(0, 3).map((area, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {plan.focusAreas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{plan.focusAreas.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Dumbbell className="w-4 h-4 mr-1" />
                    Equipment
                  </h4>
                  <p className="text-xs text-gray-600">
                    {plan.equipment.length > 0 
                      ? plan.equipment.join(', ') 
                      : 'No equipment needed'
                    }
                  </p>
                </div>

                {/* Key Benefits */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Key Benefits
                  </h4>
                  <ul className="space-y-1">
                    {plan.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Select This Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Plans Available
          </h3>
          <p className="text-gray-600">
            Please try generating health plans again.
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthPlansDisplay;
