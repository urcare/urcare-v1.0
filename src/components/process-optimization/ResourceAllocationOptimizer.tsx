
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bed,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ResourceData {
  id: string;
  resourceType: string;
  department: string;
  currentCapacity: number;
  maxCapacity: number;
  utilizationRate: number;
  demandForecast: number;
  efficiency: number;
  status: 'optimal' | 'overloaded' | 'underutilized';
  recommendation: string;
}

const mockResources: ResourceData[] = [
  {
    id: 'RES001',
    resourceType: 'ICU Beds',
    department: 'Critical Care',
    currentCapacity: 18,
    maxCapacity: 20,
    utilizationRate: 90,
    demandForecast: 95,
    efficiency: 87,
    status: 'overloaded',
    recommendation: 'Consider temporary capacity expansion'
  },
  {
    id: 'RES002',
    resourceType: 'Operating Rooms',
    department: 'Surgery',
    currentCapacity: 6,
    maxCapacity: 8,
    utilizationRate: 75,
    demandForecast: 82,
    efficiency: 92,
    status: 'optimal',
    recommendation: 'Maintain current allocation'
  },
  {
    id: 'RES003',
    resourceType: 'Nursing Staff',
    department: 'General Ward',
    currentCapacity: 24,
    maxCapacity: 30,
    utilizationRate: 80,
    demandForecast: 85,
    efficiency: 78,
    status: 'optimal',
    recommendation: 'Monitor for peak demand periods'
  }
];

export const ResourceAllocationOptimizer = () => {
  const [resources] = useState<ResourceData[]>(mockResources);
  const [selectedResource, setSelectedResource] = useState<ResourceData | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500 text-white';
      case 'overloaded': return 'bg-red-500 text-white';
      case 'underutilized': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return CheckCircle;
      case 'overloaded': return AlertTriangle;
      case 'underutilized': return ArrowDown;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resource Allocation Optimizer
          </CardTitle>
          <CardDescription>
            Real-time capacity analysis with demand forecasting and efficiency optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">85%</p>
                    <p className="text-sm text-gray-600">Avg Utilization</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {resources.filter(r => r.status === 'optimal').length}
                    </p>
                    <p className="text-sm text-gray-600">Optimal Resources</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {resources.filter(r => r.status === 'overloaded').length}
                    </p>
                    <p className="text-sm text-gray-600">Overloaded</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-sm text-gray-600">Efficiency Score</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resource Status Overview</h3>
              {resources.map((resource) => {
                const StatusIcon = getStatusIcon(resource.status);
                return (
                  <Card 
                    key={resource.id} 
                    className={`cursor-pointer transition-colors ${selectedResource?.id === resource.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{resource.resourceType}</h4>
                          <p className="text-sm text-gray-600 mb-1">{resource.department}</p>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {resource.utilizationRate}% Utilized
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(resource.status)}>
                          {resource.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Utilization</span>
                          <span className="font-bold">{resource.utilizationRate}%</span>
                        </div>
                        <Progress value={resource.utilizationRate} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Bed className="h-3 w-3" />
                            <span>{resource.currentCapacity}/{resource.maxCapacity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>Forecast: {resource.demandForecast}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedResource ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedResource.resourceType}</CardTitle>
                    <CardDescription>{selectedResource.department} Department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Capacity Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current: <strong>{selectedResource.currentCapacity}</strong></p>
                            <p>Maximum: <strong>{selectedResource.maxCapacity}</strong></p>
                            <p>Utilization: <strong>{selectedResource.utilizationRate}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Performance</h4>
                          <div className="space-y-1 text-sm">
                            <p>Efficiency: <strong>{selectedResource.efficiency}%</strong></p>
                            <p>Forecast: <strong>{selectedResource.demandForecast}%</strong></p>
                            <p>Status: <strong>{selectedResource.status}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Demand Forecast</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Predicted Demand</span>
                            <span className="font-bold">{selectedResource.demandForecast}%</span>
                          </div>
                          <Progress value={selectedResource.demandForecast} className="h-2" />
                          <div className="flex items-center gap-2 text-sm">
                            {selectedResource.demandForecast > selectedResource.utilizationRate ? (
                              <ArrowUp className="h-4 w-4 text-red-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-green-600" />
                            )}
                            <span>
                              {Math.abs(selectedResource.demandForecast - selectedResource.utilizationRate)}% 
                              {selectedResource.demandForecast > selectedResource.utilizationRate ? ' increase' : ' decrease'} expected
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendation</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded">
                          <p className="font-medium text-blue-800">Optimization Suggestion</p>
                          <p className="text-blue-700">{selectedResource.recommendation}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Efficiency Improvements</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-green-50 p-2 rounded">
                            <p className="font-medium text-green-800">Workflow Optimization</p>
                            <p className="text-green-700">Implement automated scheduling to improve resource allocation</p>
                          </div>
                          <div className="text-sm bg-yellow-50 p-2 rounded">
                            <p className="font-medium text-yellow-800">Capacity Planning</p>
                            <p className="text-yellow-700">Consider peak hour adjustments for better utilization</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Optimization
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Analytics
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Staff Allocation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a resource to view detailed allocation metrics and optimization recommendations</p>
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
