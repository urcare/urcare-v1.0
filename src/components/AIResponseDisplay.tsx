import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, Heart, Activity, Target, TrendingUp } from 'lucide-react';

interface AIResponseDisplayProps {
  healthScore?: number;
  healthScoreAnalysis?: string;
  healthScoreRecommendations?: string[];
  healthPlans?: any[];
  selectedPlan?: any;
  isLoading?: boolean;
  error?: string;
}

export const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({
  healthScore,
  healthScoreAnalysis,
  healthScoreRecommendations,
  healthPlans,
  selectedPlan,
  isLoading,
  error
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'plans' | 'schedule'>('score');

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg font-medium">AI is analyzing your health data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <Brain className="h-5 w-5" />
            <span className="font-medium">AI Analysis Error</span>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Health Score Section */}
      {healthScore && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>AI Health Score</span>
              <Badge variant="outline" className="ml-auto">
                {healthScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Health Score Visual */}
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`${healthScore >= 80 ? 'text-green-500' : healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${healthScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{healthScore}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {healthScore >= 80 ? 'Excellent Health!' : 
                   healthScore >= 60 ? 'Good Health' : 
                   healthScore >= 40 ? 'Needs Improvement' : 'Critical Health Issues'}
                </h3>
                <p className="text-sm text-gray-600">
                  {healthScore >= 80 ? 'Keep up the great work!' : 
                   healthScore >= 60 ? 'Minor improvements needed' : 
                   healthScore >= 40 ? 'Significant changes recommended' : 'Immediate attention required'}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            {healthScoreAnalysis && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">AI Analysis</h4>
                <p className="text-blue-800 text-sm">{healthScoreAnalysis}</p>
              </div>
            )}

            {/* AI Recommendations */}
            {healthScoreRecommendations && healthScoreRecommendations.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">AI Recommendations</h4>
                <ul className="space-y-1">
                  {healthScoreRecommendations.map((recommendation, index) => (
                    <li key={index} className="text-green-800 text-sm flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Health Plans Section */}
      {healthPlans && healthPlans.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>AI-Generated Health Plans</span>
              <Badge variant="outline" className="ml-auto">
                {healthPlans.length} Plans
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {healthPlans.map((plan, index) => (
                <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{plan.name || plan.title}</CardTitle>
                    <Badge 
                      variant={plan.difficulty === 'beginner' ? 'default' : 
                              plan.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                      className="w-fit"
                    >
                      {plan.difficulty?.toUpperCase() || 'CUSTOM'}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {plan.description}
                    </p>
                    
                    {plan.duration_weeks && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>{plan.duration_weeks} weeks</span>
                      </div>
                    )}

                    {plan.focus_areas && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Focus Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.focus_areas.map((area: string, areaIndex: number) => (
                            <Badge key={areaIndex} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.expected_outcomes && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Expected Outcomes:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {plan.expected_outcomes.map((outcome: string, outcomeIndex: number) => (
                            <li key={outcomeIndex} className="flex items-start space-x-1">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.activities && plan.activities.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">
                          Activities: {plan.activities.length}
                        </p>
                        <div className="text-xs text-gray-600">
                          {plan.activities.slice(0, 3).map((activity: any, activityIndex: number) => (
                            <div key={activityIndex} className="flex items-center space-x-1">
                              <span className="text-blue-500">•</span>
                              <span>{activity.title || activity.activity}</span>
                            </div>
                          ))}
                          {plan.activities.length > 3 && (
                            <div className="text-gray-500">
                              +{plan.activities.length - 3} more activities
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Plan Schedule */}
      {selectedPlan && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Your Selected Plan: {selectedPlan.title || selectedPlan.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {selectedPlan.description}
              </p>
              
              {selectedPlan.activities && selectedPlan.activities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Today's Activities</h4>
                  <div className="space-y-2">
                    {selectedPlan.activities.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title || activity.activity}</p>
                          {activity.scheduled_time && (
                            <p className="text-xs text-gray-500">{activity.scheduled_time}</p>
                          )}
                        </div>
                        {activity.duration && (
                          <Badge variant="outline" className="text-xs">
                            {activity.duration}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIResponseDisplay;
