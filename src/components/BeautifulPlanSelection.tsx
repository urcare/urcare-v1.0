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
  Star,
  Users,
  Loader2
} from "lucide-react";
import React from "react";

interface HealthPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'Gentle' | 'Balanced' | 'Intensive';
  duration_weeks: number;
  duration?: string;
  focus_areas: string[];
  focusAreas?: string[];
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
  
  // Enhanced personalization fields
  personalizedReasoning?: {
    whyThisPlan: string;
    userProfileFit: string;
    adaptations: string[];
  };
  predictedOutcomes?: {
    weightChange: {
      week2: string;
      week6: string;
      week12: string;
      final: string;
    };
    bmiChange: {
      current: string;
      target: string;
      improvement: string;
    };
    healthScoreImprovement: {
      current: number;
      target: number;
      timeline: string;
    };
    energyLevels: string;
    fitnessGains: string;
    milestones: Array<{
      week: number;
      achievement: string;
      metrics: string;
    }>;
  };
  effortAnalysis?: {
    timeCommitment: string;
    intensityLevel: string;
    difficultyProgression: string;
    sustainabilityScore: number;
  };
  riskAssessment?: {
    challenges: string[];
    injuryRisk: string;
    burnoutRisk: string;
    mitigationStrategies: string[];
    conditionWarnings?: string[];
  };
  successFactors?: {
    criticalFactors: string[];
    potentialBarriers: string[];
    supportNeeded: string[];
    probability: number;
  };
  comparisonMetrics?: {
    speedToResults: string;
    intensityVsOthers: string;
    resultsVsEffort: number;
    sustainabilityRanking: number;
  };
}

interface HealthScore {
  current: number;
  projected: number;
  improvements: string[];
}

interface BeautifulPlanSelectionProps {
  plans: HealthPlan[];
  healthScore: HealthScore | null;
  onSelectPlan: (plan: HealthPlan) => void;
  selectedPlanId?: string;
  generating?: boolean;
  progress?: number;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
  Gentle: "bg-green-100 text-green-800 border-green-200",
  Balanced: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Intensive: "bg-red-100 text-red-800 border-red-200"
};

const difficultyIcons = {
  beginner: "🟢",
  intermediate: "🟡", 
  advanced: "🔴",
  Gentle: "🟢",
  Balanced: "🟡",
  Intensive: "🔴"
};

export const BeautifulPlanSelection: React.FC<BeautifulPlanSelectionProps> = ({
  plans,
  healthScore,
  onSelectPlan,
  selectedPlanId,
  generating = false,
  progress = 0
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

  if (generating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating Your Health Plans
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI is analyzing your profile and creating personalized health plans...
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Choose Your Health Plan
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span>{plans.length} Plans Available</span>
          </div>
        </div>

        {/* Plan Cards - Horizontal 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-600 transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 ${
                selectedPlanId === plan.id 
                  ? 'ring-4 ring-blue-400 shadow-3xl scale-105' 
                  : 'hover:shadow-2xl'
              }`}
            >
              {/* Difficulty Badge */}
              <div className="absolute -top-3 right-4">
                <Badge 
                  className={`${
                    plan.difficulty === 'beginner' 
                      ? 'bg-blue-100 text-blue-800 border-blue-200' 
                      : plan.difficulty === 'intermediate'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  } border font-medium px-3 py-1`}
                >
                  {getDifficultyLabel(plan.difficulty)}
                </Badge>
              </div>

              {/* Duration - Top Right */}
              <div className="flex items-center gap-2 text-yellow-300 text-sm mb-4 justify-end">
                <Clock className="w-4 h-4" />
                <span>{plan.duration_weeks} weeks</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-yellow-300 mb-3">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-white text-sm mb-6 leading-relaxed">
                {plan.description}
              </p>

              {/* Focus Areas */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.focus_areas.slice(0, 3).map((area, idx) => (
                    <span key={idx} className="bg-purple-800 text-white text-xs px-3 py-1 rounded-full">
                      {area}
                    </span>
                  ))}
                  {plan.focus_areas.length > 3 && (
                    <span className="bg-purple-800 text-white text-xs px-3 py-1 rounded-full">
                      +{plan.focus_areas.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-6">
                <p className="text-white text-sm">
                  {plan.activities.length} activities planned
                </p>
              </div>

              {/* Expected Results */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Expected Results</h4>
                <div className="space-y-2">
                  {Object.entries(plan.health_metrics).slice(0, 2).map(([metric, value]) => (
                    <div key={metric} className="text-white text-sm">
                      {metric === 'weight_loss_goal' && (
                        <span>{value}kg weight loss</span>
                      )}
                      {metric === 'fitness_improvement' && (
                        <span>+{value}% fitness</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Personalization Sections */}
              
              {/* Personalized Reasoning */}
              {plan.personalizedReasoning && (
                <div className="mb-6 bg-blue-900/30 rounded-lg p-4 border border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-blue-300" />
                    <h4 className="text-blue-300 font-semibold text-sm">Why This Plan Fits You</h4>
                  </div>
                  <p className="text-white text-xs leading-relaxed mb-2">
                    {plan.personalizedReasoning.whyThisPlan}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {plan.personalizedReasoning.userProfileFit}
                  </p>
                </div>
              )}

              {/* Predicted Outcomes */}
              {plan.predictedOutcomes && (
                <div className="mb-6 bg-green-900/30 rounded-lg p-4 border border-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <h4 className="text-green-300 font-semibold text-sm">Your Predicted Results</h4>
                  </div>
                  {plan.predictedOutcomes.weightChange && (
                    <div className="text-white text-xs space-y-1 mb-2">
                      <div className="flex justify-between">
                        <span>Week 6:</span>
                        <span className="text-green-300">{plan.predictedOutcomes.weightChange.week6}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Week 12:</span>
                        <span className="text-green-300">{plan.predictedOutcomes.weightChange.week12}</span>
                      </div>
                    </div>
                  )}
                  {plan.predictedOutcomes.healthScoreImprovement && (
                    <div className="text-white text-xs">
                      <div className="flex justify-between">
                        <span>Health Score:</span>
                        <span className="text-green-300">
                          {plan.predictedOutcomes.healthScoreImprovement.current} → {plan.predictedOutcomes.healthScoreImprovement.target}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Effort Analysis */}
              {plan.effortAnalysis && (
                <div className="mb-6 bg-orange-900/30 rounded-lg p-4 border border-orange-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-300" />
                    <h4 className="text-orange-300 font-semibold text-sm">Effort & Commitment</h4>
                  </div>
                  <div className="text-white text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="text-orange-300">{plan.effortAnalysis.timeCommitment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      <span className="text-orange-300">{plan.effortAnalysis.intensityLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sustainability:</span>
                      <span className="text-orange-300">{plan.effortAnalysis.sustainabilityScore}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Factors */}
              {plan.successFactors && (
                <div className="mb-6 bg-purple-900/30 rounded-lg p-4 border border-purple-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-purple-300" />
                    <h4 className="text-purple-300 font-semibold text-sm">Success Probability</h4>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full" 
                        style={{ width: `${plan.successFactors.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-purple-300 font-bold text-sm">{plan.successFactors.probability}%</span>
                  </div>
                  <p className="text-white text-xs">
                    Based on your profile and commitment level
                  </p>
                </div>
              )}

              {/* Risk Assessment */}
              {plan.riskAssessment && (
                <div className="mb-6 bg-red-900/30 rounded-lg p-4 border border-red-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-300" />
                    <h4 className="text-red-300 font-semibold text-sm">Risk Assessment</h4>
                  </div>
                  <div className="text-white text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Injury Risk:</span>
                      <span className="text-red-300">{plan.riskAssessment.injuryRisk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burnout Risk:</span>
                      <span className="text-red-300">{plan.riskAssessment.burnoutRisk}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Metrics */}
              {plan.comparisonMetrics && (
                <div className="mb-6 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-indigo-300" />
                    <h4 className="text-indigo-300 font-semibold text-sm">Plan Comparison</h4>
                  </div>
                  <div className="text-white text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="text-indigo-300">{plan.comparisonMetrics.speedToResults}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI:</span>
                      <span className="text-indigo-300">{plan.comparisonMetrics.resultsVsEffort}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ranking:</span>
                      <span className="text-indigo-300">#{plan.comparisonMetrics.sustainabilityRanking}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={() => {
                  console.log("Select plan button clicked for plan:", plan);
                  onSelectPlan(plan);
                }}
                className={`w-full py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                  selectedPlanId === plan.id
                    ? 'bg-yellow-400 text-emerald-900 hover:bg-yellow-300'
                    : 'bg-yellow-400 text-emerald-900 hover:bg-yellow-300'
                }`}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
