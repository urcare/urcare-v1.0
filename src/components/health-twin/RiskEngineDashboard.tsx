
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Heart, Brain, Activity, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RiskFactor } from '@/types/healthTwin';

interface RiskEngineDashboardProps {
  riskFactors: RiskFactor[];
  onUpdateRisk: (riskId: string, updates: Partial<RiskFactor>) => void;
}

export function RiskEngineDashboard({ riskFactors, onUpdateRisk }: RiskEngineDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="h-4 w-4 text-green-600" />;
      case 'moderate': return <Minus className="h-4 w-4 text-yellow-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lifestyle': return <Activity className="h-4 w-4" />;
      case 'genetic': return <Heart className="h-4 w-4" />;
      case 'environmental': return <Shield className="h-4 w-4" />;
      case 'medical': return <Brain className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredRisks = selectedCategory === 'all' 
    ? riskFactors 
    : riskFactors.filter(risk => risk.category === selectedCategory);

  const overallRiskScore = riskFactors.length > 0 
    ? Math.round(riskFactors.reduce((sum, risk) => sum + risk.score, 0) / riskFactors.length)
    : 0;

  const riskCounts = {
    critical: riskFactors.filter(r => r.level === 'critical').length,
    high: riskFactors.filter(r => r.level === 'high').length,
    moderate: riskFactors.filter(r => r.level === 'moderate').length,
    low: riskFactors.filter(r => r.level === 'low').length,
  };

  const categories = ['lifestyle', 'genetic', 'environmental', 'medical'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Health Risk Engine
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your health risks based on conditions, lifestyle, and genetics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overall Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{overallRiskScore}</div>
                <div className="text-sm text-gray-600">Overall Risk Score</div>
                <Progress value={overallRiskScore} className="mt-2" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{riskCounts.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
                <div className="flex justify-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{riskCounts.high}</div>
                <div className="text-sm text-gray-600">High</div>
                <div className="flex justify-center mt-1">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{riskCounts.moderate}</div>
                <div className="text-sm text-gray-600">Moderate</div>
                <div className="flex justify-center mt-1">
                  <Minus className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{riskCounts.low}</div>
                <div className="text-sm text-gray-600">Low</div>
                <div className="flex justify-center mt-1">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All Risks</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                  {getCategoryIcon(category)}
                  <span className="hidden sm:inline">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4">
              {filteredRisks.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-gray-500">No risk factors found for this category</div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredRisks.map(risk => (
                    <Card key={risk.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getRiskIcon(risk.level)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{risk.name}</h3>
                              <Badge className={getRiskColor(risk.level)}>
                                {risk.level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {getCategoryIcon(risk.category)}
                                <span className="ml-1">{risk.category}</span>
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{risk.description}</p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Risk Score:</span>
                                <div className="flex-1 max-w-xs">
                                  <Progress value={risk.score} className="h-2" />
                                </div>
                                <span className="text-sm font-medium">{risk.score}/100</span>
                              </div>
                              
                              {risk.recommendations.length > 0 && (
                                <div>
                                  <div className="text-sm font-medium mb-1">Recommendations:</div>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {risk.recommendations.slice(0, 3).map((rec, index) => (
                                      <li key={index} className="flex items-start gap-1">
                                        <span className="text-blue-500 mt-1">•</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Risk Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Risk Trends
          </CardTitle>
          <CardDescription>
            Track how your health risks change over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>Risk trend chart would be displayed here</div>
              <div className="text-sm">Connect health data to see trends</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
