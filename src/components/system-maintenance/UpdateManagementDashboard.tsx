
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Shield, 
  Bug, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const UpdateManagementDashboard = () => {
  const [selectedUpdate, setSelectedUpdate] = useState<string | null>(null);

  const pendingUpdates = [
    {
      id: '1',
      name: 'Security Patch KB5034441',
      version: '1.2.3',
      type: 'security',
      severity: 'critical',
      size: '45.2 MB',
      releaseDate: '2024-01-15',
      systems: ['Web Server', 'API Gateway'],
      dependencies: ['KB5034440'],
      testStatus: 'passed',
      rolloutStage: 'staging'
    },
    {
      id: '2',
      name: 'Database Engine Update',
      version: '2.1.0',
      type: 'feature',
      severity: 'medium',
      size: '125.7 MB',
      releaseDate: '2024-01-12',
      systems: ['Database Server'],
      dependencies: [],
      testStatus: 'in-progress',
      rolloutStage: 'testing'
    },
    {
      id: '3',
      name: 'Bug Fix Package',
      version: '1.1.8',
      type: 'bugfix',
      severity: 'low',
      size: '12.3 MB',
      releaseDate: '2024-01-10',
      systems: ['Application Server'],
      dependencies: [],
      testStatus: 'failed',
      rolloutStage: 'development'
    }
  ];

  const deploymentHistory = [
    {
      update: 'Security Patch KB5034440',
      deployedAt: '2024-01-14 02:00 UTC',
      status: 'successful',
      duration: '45 minutes',
      systems: 8
    },
    {
      update: 'Application Framework 3.2.1',
      deployedAt: '2024-01-12 01:30 UTC',
      status: 'rolled-back',
      duration: '2 hours',
      systems: 12
    },
    {
      update: 'OS Security Update',
      deployedAt: '2024-01-10 03:00 UTC',
      status: 'successful',
      duration: '1.5 hours',
      systems: 15
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4 text-red-600" />;
      case 'feature': return <Star className="h-4 w-4 text-blue-600" />;
      case 'bugfix': return <Bug className="h-4 w-4 text-green-600" />;
      default: return <Download className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rolled-back': return <RefreshCw className="h-4 w-4 text-orange-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Update Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Critical Updates</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Total Pending</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-sm text-gray-600">Rollbacks (30d)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUpdates.map((update) => (
                <Card 
                  key={update.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedUpdate === update.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedUpdate(update.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(update.type)}
                        <div>
                          <h4 className="font-semibold">{update.name}</h4>
                          <p className="text-sm text-gray-600">Version {update.version}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getSeverityColor(update.severity)}>
                          {update.severity}
                        </Badge>
                        <Badge className={getTestStatusColor(update.testStatus)}>
                          {update.testStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Size</div>
                        <div className="text-gray-600">{update.size}</div>
                      </div>
                      <div>
                        <div className="font-medium">Release Date</div>
                        <div className="text-gray-600">{update.releaseDate}</div>
                      </div>
                      <div>
                        <div className="font-medium">Systems</div>
                        <div className="text-gray-600">{update.systems.join(', ')}</div>
                      </div>
                      <div>
                        <div className="font-medium">Stage</div>
                        <div className="text-gray-600">{update.rolloutStage}</div>
                      </div>
                    </div>

                    {update.dependencies.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Dependencies: </span>
                        {update.dependencies.join(', ')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                      <Button size="sm" variant="outline">
                        Test
                      </Button>
                      <Button size="sm" variant="ghost">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staged Deployment Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div>
                  <h4 className="font-medium">Development</h4>
                  <p className="text-sm text-gray-600">3 updates deployed</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div>
                  <h4 className="font-medium">Testing</h4>
                  <p className="text-sm text-gray-600">2 updates in testing</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                <div>
                  <h4 className="font-medium">Staging</h4>
                  <p className="text-sm text-gray-600">1 update ready</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Production</h4>
                  <p className="text-sm text-gray-600">Awaiting approval</p>
                </div>
                <Badge variant="outline">Idle</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Canary Deployment</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Traffic Percentage</span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Increase
                </Button>
                <Button size="sm" variant="outline">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Rollback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deployment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deploymentHistory.map((deployment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <h4 className="font-medium">{deployment.update}</h4>
                    <p className="text-sm text-gray-600">{deployment.deployedAt}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">{deployment.duration}</div>
                  <div className="text-sm text-gray-600">{deployment.systems} systems</div>
                </div>
                
                <Badge className={deployment.status === 'successful' ? 'bg-green-100 text-green-800' : 
                                 deployment.status === 'rolled-back' ? 'bg-orange-100 text-orange-800' : 
                                 'bg-red-100 text-red-800'}>
                  {deployment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
