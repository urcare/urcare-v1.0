
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Heart,
  AlertTriangle,
  Target,
  Activity,
  Brain,
  Zap
} from 'lucide-react';

export const MentalHealthAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');

  const populationMetrics = {
    totalPatients: 1247,
    activePatients: 892,
    highRiskPatients: 45,
    newPatients: 127,
    avgRiskScore: 3.2,
    outcomeImprovement: 68,
    treatmentAdherence: 82,
    crisisInterventions: 12
  };

  const treatmentOutcomes = [
    {
      category: 'Depression',
      totalPatients: 420,
      improved: 285,
      stable: 98,
      declined: 37,
      improvementRate: 68,
      avgSessionsToImprovement: 8.5
    },
    {
      category: 'Anxiety',
      totalPatients: 315,
      improved: 234,
      stable: 62,
      declined: 19,
      improvementRate: 74,
      avgSessionsToImprovement: 6.2
    },
    {
      category: 'PTSD',
      totalPatients: 156,
      improved: 98,
      stable: 45,
      declined: 13,
      improvementRate: 63,
      avgSessionsToImprovement: 12.3
    },
    {
      category: 'Bipolar',
      totalPatients: 89,
      improved: 56,
      stable: 28,
      declined: 5,
      improvementRate: 63,
      avgSessionsToImprovement: 15.7
    }
  ];

  const qualityIndicators = [
    {
      indicator: 'Screening Completion Rate',
      value: 94,
      target: 90,
      status: 'excellent',
      trend: 'up'
    },
    {
      indicator: 'Treatment Plan Adherence',
      value: 82,
      target: 85,
      status: 'good',
      trend: 'stable'
    },
    {
      indicator: 'Crisis Response Time',
      value: 15,
      target: 30,
      unit: 'minutes',
      status: 'excellent',
      trend: 'down'
    },
    {
      indicator: 'Patient Satisfaction',
      value: 4.6,
      target: 4.0,
      unit: '/5',
      status: 'excellent',
      trend: 'up'
    },
    {
      indicator: 'Readmission Rate',
      value: 12,
      target: 15,
      unit: '%',
      status: 'good',
      trend: 'down'
    },
    {
      indicator: 'Treatment Completion',
      value: 78,
      target: 80,
      unit: '%',
      status: 'good',
      trend: 'up'
    }
  ];

  const riskStratification = [
    { level: 'Low Risk', count: 645, percentage: 52, color: 'bg-green-500' },
    { level: 'Medium Risk', count: 357, percentage: 28, color: 'bg-yellow-500' },
    { level: 'High Risk', count: 200, percentage: 16, color: 'bg-orange-500' },
    { level: 'Critical Risk', count: 45, percentage: 4, color: 'bg-red-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      case 'stable': return <Activity className="h-3 w-3 text-gray-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mental Health Analytics</h2>
        <div className="flex gap-2">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="population" className="w-full">
        <TabsList>
          <TabsTrigger value="population">Population Health</TabsTrigger>
          <TabsTrigger value="outcomes">Treatment Outcomes</TabsTrigger>
          <TabsTrigger value="quality">Quality Indicators</TabsTrigger>
          <TabsTrigger value="risk">Risk Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="population" className="space-y-4">
          {/* Population Health Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Patients</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.totalPatients}</div>
                <div className="text-sm text-green-600">All time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Active Patients</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.activePatients}</div>
                <div className="text-sm text-green-600">Currently in treatment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">High Risk</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.highRiskPatients}</div>
                <div className="text-sm text-red-600">Require immediate attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">New Patients</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.newPatients}</div>
                <div className="text-sm text-purple-600">This month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Avg Risk Score</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.avgRiskScore}</div>
                <div className="text-sm text-gray-600">Out of 10</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Improvement</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.outcomeImprovement}%</div>
                <div className="text-sm text-green-600">Showing improvement</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Adherence</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.treatmentAdherence}%</div>
                <div className="text-sm text-blue-600">Treatment adherence</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-gray-600">Crisis Events</span>
                </div>
                <div className="text-2xl font-bold">{populationMetrics.crisisInterventions}</div>
                <div className="text-sm text-red-600">This month</div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Stratification Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Risk Stratification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskStratification.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${risk.color}`}></div>
                      <span className="font-medium">{risk.level}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${risk.color}`}
                          style={{ width: `${risk.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{risk.percentage}%</span>
                      <span className="text-sm text-gray-600 w-16">{risk.count} patients</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Treatment Outcomes by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {treatmentOutcomes.map((outcome, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-lg">{outcome.category}</h3>
                      <Badge variant="outline">{outcome.totalPatients} patients</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Treatment Outcomes</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Improved</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${(outcome.improved / outcome.totalPatients) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{outcome.improved}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Stable</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-500 h-2 rounded-full"
                                  style={{ width: `${(outcome.stable / outcome.totalPatients) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{outcome.stable}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Declined</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${(outcome.declined / outcome.totalPatients) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{outcome.declined}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Key Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Improvement Rate:</span>
                            <span className="font-medium text-green-600">{outcome.improvementRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Sessions to Improvement:</span>
                            <span className="font-medium">{outcome.avgSessionsToImprovement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Success Rate:</span>
                            <span className="font-medium text-blue-600">
                              {Math.round(((outcome.improved + outcome.stable) / outcome.totalPatients) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quality Indicators Scorecard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {qualityIndicators.map((indicator, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">{indicator.indicator}</h3>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(indicator.trend)}
                        <Badge className={getStatusColor(indicator.status)}>
                          {indicator.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">
                          {indicator.value}{indicator.unit || '%'}
                        </span>
                        <span className="text-sm text-gray-600">
                          Target: {indicator.target}{indicator.unit || '%'}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            indicator.value >= indicator.target ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ 
                            width: `${Math.min((indicator.value / (indicator.target * 1.2)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {indicator.value >= indicator.target ? 
                          `Exceeds target by ${indicator.value - indicator.target}${indicator.unit || '%'}` :
                          `Below target by ${indicator.target - indicator.value}${indicator.unit || '%'}`
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  High-Risk Patient Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-medium text-red-800 mb-2">Critical Alerts</h3>
                    <div className="text-2xl font-bold text-red-600 mb-1">5</div>
                    <div className="text-sm text-red-600">Patients requiring immediate intervention</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Suicide Risk</span>
                      <span className="font-medium">3 patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Violence Risk</span>
                      <span className="font-medium">1 patient</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Self-Harm Risk</span>
                      <span className="font-medium">2 patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Treatment Non-compliance</span>
                      <span className="font-medium">8 patients</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-blue-600" />
                  Protective Factors Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">Strong Support Systems</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">78%</div>
                    <div className="text-sm text-blue-600">Patients with identified support networks</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Family Support</span>
                      <span className="font-medium">654 patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peer Support Groups</span>
                      <span className="font-medium">234 patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employment/Education</span>
                      <span className="font-medium">512 patients</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Religious/Spiritual</span>
                      <span className="font-medium">298 patients</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Depression Severity Trends</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mild</span>
                      <span className="text-green-600">↓ 12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moderate</span>
                      <span className="text-yellow-600">→ 3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Severe</span>
                      <span className="text-red-600">↑ 8%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Anxiety Levels</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mild</span>
                      <span className="text-green-600">↓ 15%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Moderate</span>
                      <span className="text-yellow-600">↓ 5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Severe</span>
                      <span className="text-red-600">↑ 2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Crisis Events</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Month</span>
                      <span className="text-gray-600">18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Change</span>
                      <span className="text-green-600">↓ 33%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
