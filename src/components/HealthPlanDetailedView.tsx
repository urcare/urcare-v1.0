import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Star,
  Calendar,
  Activity,
  ArrowRight,
  Play
} from "lucide-react";
import React from "react";

interface HealthPlanActivity {
  id: string;
  title: string;
  description: string;
  type: 'nutrition' | 'exercise' | 'sleep' | 'hydration' | 'meditation' | 'other';
  scheduled_time: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  metrics?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    steps?: number;
    heart_rate?: number;
    water_intake?: number;
  };
}

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  focus_areas: string[];
  expected_outcomes: string[];
  activities: HealthPlanActivity[];
  health_metrics: {
    weight_loss_goal: number;
    muscle_gain_goal: number;
    fitness_improvement: number;
    energy_level: number;
    sleep_quality: number;
    stress_reduction: number;
  };
  weekly_schedule: {
    [key: string]: HealthPlanActivity[];
  };
}

interface HealthPlanDetailedViewProps {
  plan: HealthPlan;
  onStartPlan?: (plan: HealthPlan) => void;
  onViewDetails?: (plan: HealthPlan) => void;
  isSelected?: boolean;
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

const getActivityIcon = (type: string) => {
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const HealthPlanDetailedView: React.FC<HealthPlanDetailedViewProps> = ({
  plan,
  onStartPlan,
  onViewDetails,
  isSelected = false
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

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isSelected 
        ? 'ring-2 ring-emerald-500 shadow-lg' 
        : 'hover:shadow-md'
    }`}>
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
              <Badge className={`${difficultyColors[plan.difficulty]} border font-medium`}>
                {difficultyIcons[plan.difficulty]} {getDifficultyLabel(plan.difficulty)}
              </Badge>
            </div>
            <CardDescription className="text-base text-gray-600 mb-3">
              {plan.description}
            </CardDescription>
            
            {/* Duration and Activities Count */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{plan.duration_weeks} weeks</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                <span>{plan.activities.length} activities</span>
              </div>
            </div>
          </div>
          
          {isSelected && (
            <div className="flex items-center gap-1 text-emerald-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Selected</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Focus Areas */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Focus Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {plan.focus_areas.map((area, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Health Metrics */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Expected Improvements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plan.health_metrics).map(([metric, value]) => (
              <div key={metric} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric)}
                    <span className="text-sm font-medium text-gray-700">
                      {getMetricLabel(metric)}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    +{value}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(value, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activities Preview */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Daily Activities Preview
          </h4>
          <div className="space-y-2">
            {plan.activities.slice(0, 5).map((activity, idx) => (
              <div key={activity.id || idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{activity.title}</span>
                    <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{activity.scheduled_time}</span>
                    <span>{activity.duration} min</span>
                  </div>
                </div>
              </div>
            ))}
            {plan.activities.length > 5 && (
              <div className="text-center text-sm text-gray-500 py-2">
                +{plan.activities.length - 5} more activities
              </div>
            )}
          </div>
        </div>

        {/* Expected Outcomes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Expected Outcomes
          </h4>
          <ul className="space-y-2">
            {plan.expected_outcomes.map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onStartPlan && (
            <Button 
              onClick={() => onStartPlan(plan)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start This Plan
            </Button>
          )}
          {onViewDetails && (
            <Button 
              onClick={() => onViewDetails(plan)}
              variant="outline"
              className="flex-1"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
