import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Heart, 
  Shield, 
  ChevronDown, 
  ChevronUp,
  Target,
  Zap,
  Users,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedPlanCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    duration: string;
    focusAreas?: string[];
    benefits?: string[];
    
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
  };
  onSelect?: (plan: any) => void;
  isSelected?: boolean;
  className?: string;
}

export const EnhancedPlanCard: React.FC<EnhancedPlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'gentle':
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'balanced':
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'intensive':
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    } ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
            <CardDescription className="text-sm leading-relaxed mb-3">
              {plan.description}
            </CardDescription>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${getDifficultyColor(plan.difficulty)} text-xs px-2 py-1`}>
                {plan.difficulty}
              </Badge>
              <span className="text-sm text-gray-500">{plan.duration}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {plan.successFactors && (
            <div className="bg-purple-50 p-2 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Heart className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">Success Rate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-purple-500 h-1 rounded-full" 
                    style={{ width: `${plan.successFactors.probability}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-bold ${getSuccessColor(plan.successFactors.probability)}`}>
                  {plan.successFactors.probability}%
                </span>
              </div>
            </div>
          )}
          
          {plan.effortAnalysis && (
            <div className="bg-orange-50 p-2 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-medium text-orange-800">Time</span>
              </div>
              <p className="text-xs text-orange-700">{plan.effortAnalysis.timeCommitment}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onSelect && (
          <Button
            onClick={() => onSelect(plan)}
            className={`w-full ${
              isSelected 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Button>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 pb-4">
              <div className="space-y-4">
                
                {/* Personalized Reasoning */}
                {plan.personalizedReasoning && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 text-sm">Why This Plan Fits You</h4>
                    </div>
                    <p className="text-sm text-blue-800 mb-2">{plan.personalizedReasoning.whyThisPlan}</p>
                    <p className="text-xs text-blue-700">{plan.personalizedReasoning.userProfileFit}</p>
                  </div>
                )}

                {/* Predicted Outcomes */}
                {plan.predictedOutcomes && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-green-900 text-sm">Your Predicted Results</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {plan.predictedOutcomes.weightChange && (
                        <div>
                          <span className="text-green-800 font-medium">Weight Loss:</span>
                          <p className="text-green-700">{plan.predictedOutcomes.weightChange.final}</p>
                        </div>
                      )}
                      {plan.predictedOutcomes.healthScoreImprovement && (
                        <div>
                          <span className="text-green-800 font-medium">Health Score:</span>
                          <p className="text-green-700">
                            {plan.predictedOutcomes.healthScoreImprovement.current} → {plan.predictedOutcomes.healthScoreImprovement.target}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Effort Analysis */}
                {plan.effortAnalysis && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold text-orange-900 text-sm">Effort & Commitment</h4>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Intensity:</span>
                        <span className="text-orange-700">{plan.effortAnalysis.intensityLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sustainability:</span>
                        <span className="text-orange-700">{plan.effortAnalysis.sustainabilityScore}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Assessment */}
                {plan.riskAssessment && (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-red-900 text-sm">Risk Assessment</h4>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Injury Risk:</span>
                        <span className="text-red-700">{plan.riskAssessment.injuryRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Burnout Risk:</span>
                        <span className="text-red-700">{plan.riskAssessment.burnoutRisk}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparison Metrics */}
                {plan.comparisonMetrics && (
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-semibold text-indigo-900 text-sm">Plan Comparison</h4>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="text-indigo-700">{plan.comparisonMetrics.speedToResults}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI:</span>
                        <span className="text-indigo-700">{plan.comparisonMetrics.resultsVsEffort}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ranking:</span>
                        <span className="text-indigo-700">#{plan.comparisonMetrics.sustainabilityRanking}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Focus Areas */}
                {plan.focusAreas && plan.focusAreas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {plan.focusAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {plan.benefits && plan.benefits.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">Key Benefits</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {plan.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
