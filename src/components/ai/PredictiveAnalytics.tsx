
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, AlertTriangle, Target, Activity, Heart, Zap, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface HealthPrediction {
  id: string;
  condition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
  confidence: number;
}

interface TrendData {
  date: string;
  value: number;
  prediction?: number;
}

export const PredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState<HealthPrediction[]>([
    {
      id: '1',
      condition: 'Hypertension',
      riskLevel: 'medium',
      probability: 35,
      timeframe: '6 months',
      factors: ['Family history', 'Sedentary lifestyle', 'High sodium intake'],
      recommendations: ['Increase physical activity', 'Reduce salt intake', 'Monitor blood pressure regularly'],
      confidence: 78
    },
    {
      id: '2',
      condition: 'Type 2 Diabetes',
      riskLevel: 'low',
      probability: 12,
      timeframe: '2 years',
      factors: ['BMI slightly elevated', 'Age factor'],
      recommendations: ['Maintain healthy weight', 'Regular glucose screening', 'Balanced diet'],
      confidence: 85
    },
    {
      id: '3',
      condition: 'Heart Disease',
      riskLevel: 'medium',
      probability: 28,
      timeframe: '5 years',
      factors: ['Cholesterol levels', 'Stress levels', 'Exercise patterns'],
      recommendations: ['Stress management', 'Cardio exercise', 'Cholesterol monitoring'],
      confidence: 72
    }
  ]);

  const [trendData, setTrendData] = useState<TrendData[]>([
    { date: 'Jan', value: 120, prediction: 122 },
    { date: 'Feb', value: 118, prediction: 120 },
    { date: 'Mar', value: 115, prediction: 118 },
    { date: 'Apr', value: 112, prediction: 115 },
    { date: 'May', value: 110, prediction: 112 },
    { date: 'Jun', value: 108, prediction: 110 }
  ]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return Shield;
      case 'medium': return Target;
      case 'high': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Predictive Health Analytics
          </CardTitle>
          <CardDescription>
            Advanced AI analysis of your health patterns and future risk predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">87%</div>
              <p className="text-sm text-gray-600">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-sm text-gray-600">Risk Factors Identified</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-sm text-gray-600">Recommendations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <p className="text-sm text-gray-600">Health Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Risk Predictions</TabsTrigger>
          <TabsTrigger value="trends">Health Trends</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((prediction) => {
              const RiskIcon = getRiskIcon(prediction.riskLevel);
              return (
                <Card key={prediction.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <RiskIcon className="h-5 w-5" />
                        {prediction.condition}
                      </CardTitle>
                      <Badge className={getRiskColor(prediction.riskLevel)}>
                        {prediction.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Risk Probability</span>
                        <span className="text-sm font-medium">{prediction.probability}%</span>
                      </div>
                      <Progress value={prediction.probability} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">AI Confidence</span>
                        <span className="text-sm font-medium">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Timeframe: {prediction.timeframe}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Risk Factors:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {prediction.factors.map((factor, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Recommendations:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Trend Analysis</CardTitle>
              <CardDescription>AI-powered analysis of your health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="#DBEAFE" 
                    name="Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prediction" 
                    stroke="#F59E0B" 
                    strokeDasharray="5 5"
                    name="AI Prediction"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><strong>Positive Trend:</strong> Your blood pressure has improved 15% over the last 3 months</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm"><strong>Attention Needed:</strong> Sleep pattern irregularity detected in recent weeks</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm"><strong>Achievement:</strong> Maintained consistent exercise routine for 2 months</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Personalized Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Steps</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="w-20 h-2" />
                    <span className="text-sm text-gray-600">7.8K/10K</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sleep Quality</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-20 h-2" />
                    <span className="text-sm text-gray-600">9.2/10</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Hydration</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="text-sm text-gray-600">5.2/8 glasses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
