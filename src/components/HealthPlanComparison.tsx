import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Target, 
  TrendingUp, 
  Zap, 
  Heart, 
  Dumbbell, 
  Utensils, 
  Moon,
  Droplets,
  Brain,
  CheckCircle,
  Star
} from "lucide-react";
import React from "react";

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: any[];
  health_metrics: {
    weight_loss_goal: number;
    muscle_gain_goal: number;
    fitness_improvement: number;
    energy_level: number;
    sleep_quality: number;
    stress_reduction: number;
  };
}

interface HealthPlanComparisonProps {
  plans: HealthPlan[];
  onSelectPlan: (plan: HealthPlan) => void;
  selectedPlanId?: string;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200"
};

const difficultyIcons = {
  beginner: "🟢",
  intermediate: "🟡", 
  advanced: "🔴"
};

export const HealthPlanComparison: React.FC<HealthPlanComparisonProps> = ({
  plans,
  onSelectPlan,
  selectedPlanId
}) => {
  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getMetricIcon = (metric: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      weight_loss_goal: <TrendingUp className="w-4 h-4" />,
      muscle_gain_goal: <Dumbbell className="w-4 h-4" />,
      fitness_improvement: <Zap className="w-4 h-4" />,
      energy_level: <Heart className="w-4 h-4" />,
      sleep_quality: <Moon className="w-4 h-4" />,
      stress_reduction: <Brain className="w-4 h-4" />
    };
    return iconMap[metric] || <Target className="w-4 h-4" />;
  };

  const getMetricLabel = (metric: string) => {
    const labelMap: { [key: string]: string } = {
      weight_loss_goal: "Weight Loss",
      muscle_gain_goal: "Muscle Gain", 
      fitness_improvement: "Fitness",
      energy_level: "Energy",
      sleep_quality: "Sleep",
      stress_reduction: "Stress Relief"
    };
    return labelMap[metric] || metric;
  };

  const getActivityTypeIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      nutrition: <Utensils className="w-4 h-4" />,
      exercise: <Dumbbell className="w-4 h-4" />,
      sleep: <Moon className="w-4 h-4" />,
      hydration: <Droplets className="w-4 h-4" />,
      meditation: <Brain className="w-4 h-4" />,
      other: <Target className="w-4 h-4" />
    };
    return iconMap[type] || <Target className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Health Plan
        </h2>
        <p className="text-gray-600">
          Select the plan that best fits your lifestyle and goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 hover:shadow-lg ${
              selectedPlanId === plan.id 
                ? 'ring-2 ring-emerald-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            {/* Difficulty Badge */}
            <div className="absolute -top-3 left-4">
              <Badge 
                className={`${difficultyColors[plan.difficulty]} border font-medium`}
              >
                {difficultyIcons[plan.difficulty]} {getDifficultyLabel(plan.difficulty)}
              </Badge>
            </div>

            {/* Popular Badge for Intermediate */}
            {plan.difficulty === 'intermediate' && (
              <div className="absolute -top-3 right-4">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="pt-6">
              <CardTitle className="text-xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {plan.description}
              </CardDescription>
              
              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{plan.duration_weeks} weeks</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Focus Areas */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Focus Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {plan.focus_areas.map((area, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Health Metrics */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Expected Improvements</h4>
                <div className="space-y-2">
                  {Object.entries(plan.health_metrics).map(([metric, value]) => (
                    <div key={metric} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(metric)}
                        <span className="text-sm text-gray-600">
                          {getMetricLabel(metric)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={Math.min(value, 100)} 
                          className="w-16 h-2"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          +{value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Activities Preview */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Daily Activities</h4>
                <div className="space-y-1">
                  {plan.activities.slice(0, 3).map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      {getActivityTypeIcon(activity.type)}
                      <span className="truncate">{activity.title}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{activity.scheduled_time}</span>
                    </div>
                  ))}
                  {plan.activities.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{plan.activities.length - 3} more activities
                    </div>
                  )}
                </div>
              </div>

              {/* Expected Outcomes */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Expected Outcomes</h4>
                <ul className="space-y-1">
                  {plan.expected_outcomes.slice(0, 3).map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select Button */}
              <Button
                onClick={() => onSelectPlan(plan)}
                className={`w-full ${
                  selectedPlanId === plan.id
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Select This Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <CardDescription>
            Compare key features across all plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-2 font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Difficulty</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-2">
                      <Badge className={difficultyColors[plan.difficulty]}>
                        {getDifficultyLabel(plan.difficulty)}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Duration</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-2">
                      {plan.duration_weeks} weeks
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Daily Activities</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-2">
                      {plan.activities.length}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 font-medium">Focus Areas</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-2">
                      {plan.focus_areas.length}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


