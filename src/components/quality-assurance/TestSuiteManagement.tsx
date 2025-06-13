
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  BarChart3,
  Filter
} from 'lucide-react';

export const TestSuiteManagement = () => {
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);

  const testSuites = [
    {
      id: '1',
      name: 'User Authentication Tests',
      category: 'functional',
      status: 'passed',
      coverage: 95.2,
      totalTests: 87,
      passedTests: 85,
      failedTests: 2,
      skippedTests: 0,
      lastRun: '2024-06-13 09:30',
      duration: '12m 34s',
      environment: 'staging'
    },
    {
      id: '2',
      name: 'Payment Integration Tests',
      category: 'integration',
      status: 'failed',
      coverage: 78.9,
      totalTests: 124,
      passedTests: 108,
      failedTests: 14,
      skippedTests: 2,
      lastRun: '2024-06-13 09:15',
      duration: '18m 42s',
      environment: 'staging'
    },
    {
      id: '3',
      name: 'UI Component Tests',
      category: 'unit',
      status: 'running',
      coverage: 92.1,
      totalTests: 342,
      passedTests: 298,
      failedTests: 0,
      skippedTests: 44,
      lastRun: '2024-06-13 09:45',
      duration: '6m 18s',
      environment: 'local'
    },
    {
      id: '4',
      name: 'Performance Tests',
      category: 'performance',
      status: 'pending',
      coverage: 67.4,
      totalTests: 45,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 45,
      lastRun: '2024-06-12 15:20',
      duration: '24m 15s',
      environment: 'production'
    }
  ];

  const testCategories = [
    { name: 'Unit Tests', count: 1247, passed: 1198, failed: 49 },
    { name: 'Integration Tests', count: 324, passed: 298, failed: 26 },
    { name: 'Functional Tests', count: 156, passed: 142, failed: 14 },
    { name: 'Performance Tests', count: 78, passed: 65, failed: 13 },
    { name: 'Security Tests', count: 92, passed: 88, failed: 4 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'unit': return 'bg-blue-100 text-blue-800';
      case 'integration': return 'bg-purple-100 text-purple-800';
      case 'functional': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Suite Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">598</div>
              <div className="text-sm text-gray-600">Total Test Suites</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">87.5%</div>
              <div className="text-sm text-gray-600">Avg Coverage</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1897</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">15m</div>
              <div className="text-sm text-gray-600">Avg Runtime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Suites</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Run All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testSuites.map((suite) => (
                <Card 
                  key={suite.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedSuite === suite.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedSuite(suite.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(suite.status)}
                        <h4 className="font-semibold">{suite.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(suite.category)}>
                          {suite.category}
                        </Badge>
                        <Badge className={getStatusColor(suite.status)}>
                          {suite.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Coverage</div>
                        <div className="text-gray-600">{suite.coverage}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Tests</div>
                        <div className="text-gray-600">{suite.totalTests}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-600">{suite.duration}</div>
                      </div>
                      <div>
                        <div className="font-medium">Environment</div>
                        <div className="text-gray-600">{suite.environment}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span>{((suite.passedTests / suite.totalTests) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={(suite.passedTests / suite.totalTests) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Last run: {suite.lastRun}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Categories Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCategories.map((category, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{category.name}</h4>
                  <Badge variant="outline">{category.count} tests</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-green-600">
                    Passed: {category.passed}
                  </div>
                  <div className="text-red-600">
                    Failed: {category.failed}
                  </div>
                </div>

                <Progress 
                  value={(category.passed / category.count) * 100} 
                  className="h-2"
                />
              </div>
            ))}

            <Card className="p-4 bg-blue-50">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Coverage Heatmap
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[95, 87, 92, 78, 89, 94, 83, 91, 76, 88, 93, 85, 79, 90, 86, 82].map((coverage, i) => (
                  <div 
                    key={i} 
                    className={`h-8 rounded text-xs flex items-center justify-center text-white font-medium ${
                      coverage >= 90 ? 'bg-green-500' :
                      coverage >= 80 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  >
                    {coverage}%
                  </div>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Test Execution Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Daily Tests</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Unit Tests:</span>
                  <span className="font-medium">06:00 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span>Integration Tests:</span>
                  <span className="font-medium">12:00 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span>Smoke Tests:</span>
                  <span className="font-medium">18:00 UTC</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Weekly Tests</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Full Regression:</span>
                  <span className="font-medium">Sunday 02:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Performance Tests:</span>
                  <span className="font-medium">Saturday 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Scan:</span>
                  <span className="font-medium">Friday 22:00</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">On-Demand</h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  Run Critical Path Tests
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Run Feature Tests
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Run API Tests
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
