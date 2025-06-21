
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, AlertTriangle, Heart, Activity, Target, Lightbulb, Star } from 'lucide-react';
import { toast } from 'sonner';

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'nutrition' | 'exercise' | 'medication' | 'sleep' | 'mental-health' | 'prevention';
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  timestamp: Date;
}

interface RiskFactor {
  id: string;
  name: string;
  riskLevel: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  description: string;
  mitigationSteps: string[];
}

interface HealthPrediction {
  id: string;
  condition: string;
  probability: number;
  timeframe: string;
  preventionTips: string[];
  nextSteps: string[];
}

export const SmartHealthInsights = () => {
  const [insights, setInsights] = useState<HealthInsight[]>([
    {
      id: '1',
      title: 'Blood Pressure Trend Alert',
      description: 'Your blood pressure readings have shown an upward trend over the past 2 weeks.',
      severity: 'medium',
      category: 'prevention',
      confidence: 87,
      actionable: true,
      recommendations: [
        'Reduce sodium intake to less than 2300mg per day',
        'Increase physical activity to 150 minutes per week',
        'Schedule a follow-up with your cardiologist'
      ],
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Sleep Quality Improvement',
      description: 'Your sleep patterns indicate potential sleep apnea. Consider a sleep study.',
      severity: 'high',
      category: 'sleep',
      confidence: 92,
      actionable: true,
      recommendations: [
        'Maintain consistent sleep schedule',
        'Avoid caffeine 6 hours before bedtime',
        'Consider sleep study evaluation'
      ],
      timestamp: new Date()
    }
  ]);

  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: '1',
      name: 'Cardiovascular Risk',
      riskLevel: 35,
      trend: 'increasing',
      description: 'Based on your recent vitals and family history',
      mitigationSteps: [
        'Regular cardio exercise',
        'Mediterranean diet',
        'Stress management techniques'
      ]
    },
    {
      id: '2',
      name: 'Diabetes Risk',
      riskLevel: 22,
      trend: 'stable',
      description: 'Pre-diabetic indicators in recent lab results',
      mitigationSteps: [
        'Low glycemic index foods',
        'Regular glucose monitoring',
        'Weight management'
      ]
    }
  ]);

  const [predictions, setPredictions] = useState<HealthPrediction[]>([
    {
      id: '1',
      condition: 'Hypertension',
      probability: 68,
      timeframe: 'Next 2 years',
      preventionTips: [
        'Maintain healthy weight',
        'Regular exercise routine',
        'Limit alcohol consumption'
      ],
      nextSteps: [
        'Monthly BP monitoring',
        'Nutritionist consultation',
        'Stress management program'
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('insights');
  const [overallHealthScore, setOverallHealthScore] = useState(78);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getRiskColor = (level: number) => {
    if (level >= 70) return 'text-red-600';
    if (level >= 40) return 'text-orange-600';
    if (level >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleInsightAction = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, actionable: false }
        : insight
    ));
    toast.success('Action plan created for this insight');
  };

  const generateNewInsights = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'AI analyzing your health data...',
        success: 'New health insights generated!',
        error: 'Failed to generate insights'
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Health Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{overallHealthScore}</div>
              <div className="text-sm text-gray-600">Overall Health Score</div>
              <Progress value={overallHealthScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{insights.filter(i => i.actionable).length}</div>
              <div className="text-sm text-gray-600">Active Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">{riskFactors.length}</div>
              <div className="text-sm text-gray-600">Risk Factors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={generateNewInsights} className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Generate New Insights
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('predictions')}>
          <TrendingUp className="h-4 w-4 mr-2" />
          View Predictions
        </Button>
        <Button variant="outline" onClick={() => setActiveTab('recommendations')}>
          <Target className="h-4 w-4 mr-2" />
          Action Plans
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="recommendations">Care Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge className={getSeverityColor(insight.severity)}>
                        {insight.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">AI Recommendations:</h5>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {insight.actionable && (
                    <Button 
                      size="sm" 
                      onClick={() => handleInsightAction(insight.id)}
                      className="ml-4"
                    >
                      Create Action Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {riskFactors.map((factor) => (
            <Card key={factor.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{factor.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getRiskColor(factor.riskLevel)}`}>
                      {factor.riskLevel}% Risk
                    </span>
                    <Badge variant={factor.trend === 'increasing' ? 'destructive' : 'default'}>
                      {factor.trend}
                    </Badge>
                  </div>
                </div>
                
                <Progress value={factor.riskLevel} className="mb-3" />
                <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Mitigation Steps:</h5>
                  <ul className="space-y-1">
                    {factor.mitigationSteps.map((step, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{prediction.condition}</h4>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getRiskColor(prediction.probability)}`}>
                      {prediction.probability}%
                    </div>
                    <div className="text-xs text-gray-500">{prediction.timeframe}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Prevention Tips:</h5>
                    <ul className="space-y-1">
                      {prediction.preventionTips.map((tip, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Heart className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Next Steps:</h5>
                    <ul className="space-y-1">
                      {prediction.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <Activity className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Alert>
            <Star className="h-4 w-4" />
            <AlertDescription>
              Personalized care plans based on your health data and AI analysis.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>This Week's Focus Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Cardiovascular Health</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 30min walking daily</li>
                    <li>• Monitor BP twice weekly</li>
                    <li>• Reduce sodium intake</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Sleep Optimization</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Consistent bedtime routine</li>
                    <li>• No screens 1hr before bed</li>
                    <li>• Track sleep quality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
