import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HealthPlanDetailedView } from "@/components/HealthPlanDetailedView";
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Health Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the plan that best fits your lifestyle and goals. Each plan is AI-generated and personalized for you.
        </p>
      </div>

      {/* Detailed Plan Cards */}
      <div className="space-y-6">
        {plans.map((plan, index) => (
          <HealthPlanDetailedView
            key={plan.id}
            plan={plan}
            onStartPlan={onSelectPlan}
            isSelected={selectedPlanId === plan.id}
          />
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="bg-white shadow-lg border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Plan Comparison
          </CardTitle>
          <CardDescription className="text-lg">
            Compare key features across all plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-900">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 font-medium text-gray-700">Difficulty</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4">
                      <Badge className={difficultyColors[plan.difficulty]}>
                        {getDifficultyLabel(plan.difficulty)}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-700">Duration</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 text-gray-600">
                      {plan.duration_weeks} weeks
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-700">Daily Activities</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 text-gray-600">
                      {plan.activities.length}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-700">Focus Areas</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 text-gray-600">
                      {plan.focus_areas.length}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-700">Weight Loss Goal</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 text-gray-600">
                      {plan.health_metrics.weight_loss_goal}kg
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 font-medium text-gray-700">Fitness Improvement</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center py-4 text-gray-600">
                      +{plan.health_metrics.fitness_improvement}%
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


