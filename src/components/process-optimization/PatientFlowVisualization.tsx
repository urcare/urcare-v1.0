
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  Users, 
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react';

interface FlowData {
  id: string;
  stage: string;
  currentPatients: number;
  averageWaitTime: number;
  throughput: number;
  bottleneckRisk: number;
  efficiency: number;
  status: 'optimal' | 'congested' | 'critical';
  recommendations: string[];
}

const mockFlowData: FlowData[] = [
  {
    id: 'FLOW001',
    stage: 'Registration',
    currentPatients: 12,
    averageWaitTime: 8,
    throughput: 45,
    bottleneckRisk: 25,
    efficiency: 87,
    status: 'optimal',
    recommendations: ['Maintain current staffing', 'Monitor peak hours']
  },
  {
    id: 'FLOW002',
    stage: 'Triage',
    currentPatients: 18,
    averageWaitTime: 15,
    throughput: 32,
    bottleneckRisk: 65,
    efficiency: 72,
    status: 'congested',
    recommendations: ['Add additional triage nurse', 'Implement fast-track for low-acuity patients']
  },
  {
    id: 'FLOW003',
    stage: 'Consultation',
    currentPatients: 25,
    averageWaitTime: 35,
    throughput: 28,
    bottleneckRisk: 85,
    efficiency: 68,
    status: 'critical',
    recommendations: ['Increase physician coverage', 'Optimize appointment scheduling', 'Consider telemedicine options']
  },
  {
    id: 'FLOW004',
    stage: 'Diagnostics',
    currentPatients: 8,
    averageWaitTime: 12,
    throughput: 40,
    bottleneckRisk: 30,
    efficiency: 82,
    status: 'optimal',
    recommendations: ['Continue current operations', 'Prepare for increased demand']
  }
];

export const PatientFlowVisualization = () => {
  const [flowData] = useState<FlowData[]>(mockFlowData);
  const [selectedStage, setSelectedStage] = useState<FlowData | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500 text-white';
      case 'congested': return 'bg-yellow-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 40) return 'text-green-600';
    if (risk < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Patient Flow Visualization
          </CardTitle>
          <CardDescription>
            Real-time bottleneck identification with throughput optimization and capacity management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {flowData.reduce((sum, stage) => sum + stage.currentPatients, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Patients</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">36</p>
                    <p className="text-sm text-gray-600">Avg Throughput</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">18 min</p>
                    <p className="text-sm text-gray-600">Avg Wait Time</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">77%</p>
                    <p className="text-sm text-gray-600">Flow Efficiency</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Flow Stages</h3>
              
              {/* Flow Visualization */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Current Flow Status</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4" />
                    <span>Live Update</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {flowData.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      <div 
                        className={`min-w-32 p-3 bg-white rounded border-2 cursor-pointer transition-colors ${
                          selectedStage?.id === stage.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedStage(stage)}
                      >
                        <div className="text-center">
                          <div className="text-sm font-medium">{stage.stage}</div>
                          <div className="text-2xl font-bold text-blue-600">{stage.currentPatients}</div>
                          <div className="text-xs text-gray-500">{stage.averageWaitTime} min</div>
                          <Badge className={`mt-1 ${getStatusColor(stage.status)}`} size="sm">
                            {stage.status}
                          </Badge>
                        </div>
                      </div>
                      {index < flowData.length - 1 && (
                        <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Stage Details */}
              <div className="space-y-3">
                {flowData.map((stage) => (
                  <Card 
                    key={stage.id} 
                    className={`cursor-pointer transition-colors ${selectedStage?.id === stage.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                    onClick={() => setSelectedStage(stage)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">{stage.currentPatients} patients waiting</p>
                        </div>
                        <Badge className={getStatusColor(stage.status)}>
                          {stage.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Wait Time:</span>
                          <span className="font-medium ml-1">{stage.averageWaitTime} min</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Throughput:</span>
                          <span className="font-medium ml-1">{stage.throughput}/hr</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Efficiency:</span>
                          <span className="font-medium ml-1">{stage.efficiency}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Bottleneck Risk:</span>
                          <span className={`font-medium ml-1 ${getRiskColor(stage.bottleneckRisk)}`}>
                            {stage.bottleneckRisk}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              {selectedStage ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedStage.stage} Stage</CardTitle>
                    <CardDescription>Detailed flow analysis and optimization recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Patients: <strong>{selectedStage.currentPatients}</strong></p>
                            <p>Wait Time: <strong>{selectedStage.averageWaitTime} min</strong></p>
                            <p>Throughput: <strong>{selectedStage.throughput}/hr</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance</h4>
                          <div className="space-y-1 text-sm">
                            <p>Efficiency: <strong>{selectedStage.efficiency}%</strong></p>
                            <p>Status: <strong>{selectedStage.status}</strong></p>
                            <p>Risk Level: <strong className={getRiskColor(selectedStage.bottleneckRisk)}>
                              {selectedStage.bottleneckRisk}%
                            </strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Bottleneck Risk Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Risk Level</span>
                            <span className={`font-bold ${getRiskColor(selectedStage.bottleneckRisk)}`}>
                              {selectedStage.bottleneckRisk}%
                            </span>
                          </div>
                          <Progress value={selectedStage.bottleneckRisk} className="h-2" />
                          <div className="flex items-center gap-2 text-sm">
                            {selectedStage.bottleneckRisk > 70 ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : (
                              <Target className="h-4 w-4 text-green-600" />
                            )}
                            <span>
                              {selectedStage.bottleneckRisk > 70 ? 'High risk of bottleneck' : 'Acceptable risk level'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <div className="space-y-2">
                          {selectedStage.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-700">{rec}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Optimization Strategies</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-green-50 p-2 rounded">
                            <p className="font-medium text-green-800">Short-term</p>
                            <p className="text-green-700">Adjust staffing levels during peak hours</p>
                          </div>
                          <div className="text-sm bg-yellow-50 p-2 rounded">
                            <p className="font-medium text-yellow-800">Medium-term</p>
                            <p className="text-yellow-700">Implement process improvements and automation</p>
                          </div>
                          <div className="text-sm bg-purple-50 p-2 rounded">
                            <p className="font-medium text-purple-800">Long-term</p>
                            <p className="text-purple-700">Consider capacity expansion or workflow redesign</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Adjust Staffing
                        </Button>
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Optimize Flow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a flow stage to view detailed metrics and optimization recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
