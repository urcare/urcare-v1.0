import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Apple, 
  Dumbbell, 
  Heart, 
  Moon, 
  Target, 
  TrendingUp, 
  Zap 
} from 'lucide-react';

interface StructuredHealthPlanProps {
  structured: {
    summary: {
      healthScore: string;
      calorieTarget: string;
      bmi: string;
      keyRecommendations: string[];
    };
    sections: {
      healthAssessment: string;
      nutritionPlan: string;
      fitnessPlan: string;
      lifestyleOptimization: string;
      healthMonitoring: string;
      potentialRisks: string;
      urCareBenefits: string;
      nextSteps: string;
    };
  };
}

export const StructuredHealthPlan: React.FC<StructuredHealthPlanProps> = ({ structured }) => {
  const healthScore = parseInt(structured.summary.healthScore) || 0;
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderSection = (title: string, content: string, icon: React.ReactNode) => {
    if (!content) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            {content.split('\n').map((line, index) => (
              <p key={index} className="mb-2 text-gray-700">
                {line.trim()}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Health Score Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Your Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {structured.summary.healthScore}
              </div>
              <div className="text-sm text-gray-600">Health Score</div>
              <Progress 
                value={healthScore} 
                className={`mt-2 ${getHealthScoreProgressColor(healthScore)}`}
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {structured.summary.calorieTarget}
              </div>
              <div className="text-sm text-gray-600">Daily Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {structured.summary.bmi}
              </div>
              <div className="text-sm text-gray-600">BMI</div>
            </div>
          </div>
          
          {/* Key Recommendations */}
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Key Recommendations:</h4>
            <div className="space-y-2">
              {structured.summary.keyRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Assessment */}
      {renderSection(
        'Health Assessment',
        structured.sections.healthAssessment,
        <Heart className="h-5 w-5 text-red-500" />
      )}

      {/* Nutrition Plan */}
      {renderSection(
        'Nutrition Plan',
        structured.sections.nutritionPlan,
        <Apple className="h-5 w-5 text-green-500" />
      )}

      {/* Fitness Plan */}
      {renderSection(
        'Fitness Plan',
        structured.sections.fitnessPlan,
        <Dumbbell className="h-5 w-5 text-blue-500" />
      )}

      {/* Lifestyle Optimization */}
      {renderSection(
        'Lifestyle Optimization',
        structured.sections.lifestyleOptimization,
        <Moon className="h-5 w-5 text-indigo-500" />
      )}

      {/* Health Monitoring */}
      {renderSection(
        'Health Monitoring',
        structured.sections.healthMonitoring,
        <TrendingUp className="h-5 w-5 text-purple-500" />
      )}

      {/* Potential Health Risks */}
      {renderSection(
        'Potential Health Risks',
        structured.sections.potentialRisks,
        <Target className="h-5 w-5 text-orange-500" />
      )}

      {/* How UrCare Will Help */}
      {renderSection(
        'How UrCare Will Help',
        structured.sections.urCareBenefits,
        <Zap className="h-5 w-5 text-yellow-500" />
      )}

      {/* Actionable Next Steps */}
      {renderSection(
        'Actionable Next Steps',
        structured.sections.nextSteps,
        <Target className="h-5 w-5 text-green-500" />
      )}
    </div>
  );
};
