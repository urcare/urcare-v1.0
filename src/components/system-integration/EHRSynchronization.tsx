
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  ArrowLeftRight,
  GitMerge,
  Eye,
  Download,
  Settings,
  Zap,
  FileText
} from 'lucide-react';

export const EHRSynchronization = () => {
  const [syncStatus, setSyncStatus] = useState('idle');

  const ehrSystems = [
    {
      name: 'Epic EMR',
      status: 'connected',
      lastSync: '2 mins ago',
      recordCount: 15847,
      conflicts: 0,
      direction: 'bidirectional'
    },
    {
      name: 'Cerner EHR',
      status: 'syncing',
      lastSync: 'In progress',
      recordCount: 12456,
      conflicts: 3,
      direction: 'bidirectional'
    },
    {
      name: 'AllScripts',
      status: 'error',
      lastSync: '2 hours ago',
      recordCount: 8934,
      conflicts: 12,
      direction: 'inbound'
    }
  ];

  const syncActivities = [
    {
      id: 'SYNC001',
      timestamp: '14:32:15',
      system: 'Epic EMR',
      action: 'Patient Update',
      records: 245,
      status: 'completed',
      conflicts: 0
    },
    {
      id: 'SYNC002',
      timestamp: '14:28:33',
      system: 'Cerner EHR',
      action: 'Medication Sync',
      records: 89,
      status: 'processing',
      conflicts: 2
    },
    {
      id: 'SYNC003',
      timestamp: '14:25:47',
      system: 'AllScripts',
      action: 'Lab Results',
      records: 156,
      status: 'failed',
      conflicts: 5
    }
  ];

  const conflictResolutions = [
    {
      id: 'CONF001',
      patient: 'John Doe (MRN: 123456)',
      field: 'Patient Address',
      source1: 'Epic EMR',
      value1: '123 Main St, Sacramento, CA 95814',
      source2: 'Cerner EHR',
      value2: '123 Main Street, Sacramento, CA 95814',
      priority: 'low',
      status: 'pending'
    },
    {
      id: 'CONF002',
      patient: 'Jane Smith (MRN: 789012)',
      field: 'Allergy Information',
      source1: 'Epic EMR',
      value1: 'Penicillin - Severe',
      source2: 'AllScripts',
      value2: 'Penicillin - Moderate',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'CONF003',
      patient: 'Mike Johnson (MRN: 345678)',
      field: 'Emergency Contact',
      source1: 'Cerner EHR',
      value1: 'Sarah Johnson - Wife - (916) 555-1234',
      source2: 'Epic EMR',
      value2: 'Sarah Johnson - Spouse - (916) 555-1234',
      priority: 'medium',
      status: 'resolved'
    }
  ];

  const validationResults = [
    {
      category: 'Data Integrity',
      passed: 15423,
      failed: 24,
      warnings: 156,
      percentage: 98.8
    },
    {
      category: 'Format Validation',
      passed: 15547,
      failed: 52,
      warnings: 4,
      percentage: 99.6
    },
    {
      category: 'Business Rules',
      passed: 15234,
      failed: 89,
      warnings: 280,
      percentage: 97.6
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">EHR Synchronization</h3>
          <p className="text-gray-600">Monitor and manage EHR data synchronization across systems</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="tracking">Change Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* EHR System Status */}
          <Card>
            <CardHeader>
              <CardTitle>EHR System Status</CardTitle>
              <CardDescription>Real-time synchronization status across all connected EHR systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ehrSystems.map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        system.status === 'connected' ? 'bg-green-500' :
                        system.status === 'syncing' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h5 className="font-medium text-gray-900">{system.name}</h5>
                        <p className="text-sm text-gray-600">Last sync: {system.lastSync}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{system.recordCount.toLocaleString()} records</span>
                          <Badge variant="outline" className="text-xs">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            {system.direction}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        system.status === 'connected' ? 'border-green-500 text-green-700' :
                        system.status === 'syncing' ? 'border-blue-500 text-blue-700' :
                        'border-red-500 text-red-700'
                      }`}>
                        {system.status}
                      </Badge>
                      {system.conflicts > 0 && (
                        <p className="text-xs text-red-600 mt-1">{system.conflicts} conflicts</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sync Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sync Activities</CardTitle>
              <CardDescription>Latest synchronization operations and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncActivities.map((activity, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 border-l-4 rounded ${
                    activity.status === 'completed' ? 'border-l-green-500 bg-green-50' :
                    activity.status === 'processing' ? 'border-l-blue-500 bg-blue-50' :
                    'border-l-red-500 bg-red-50'
                  }`}>
                    <div className={`p-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100' :
                      activity.status === 'processing' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {activity.status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                       activity.status === 'processing' ? <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" /> :
                       <AlertTriangle className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{activity.action}</h5>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.system} • {activity.records} records</p>
                      {activity.conflicts > 0 && (
                        <p className="text-xs text-red-600">{activity.conflicts} conflicts detected</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Conflicts</CardTitle>
              <CardDescription>Resolve data conflicts between EHR systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflictResolutions.map((conflict, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{conflict.patient}</h5>
                        <p className="text-sm text-gray-600">Conflict in: {conflict.field}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${
                          conflict.priority === 'high' ? 'border-red-500 text-red-700' :
                          conflict.priority === 'medium' ? 'border-orange-500 text-orange-700' :
                          'border-gray-500 text-gray-700'
                        }`}>
                          {conflict.priority}
                        </Badge>
                        <Badge variant="outline" className={`${
                          conflict.status === 'pending' ? 'border-orange-500 text-orange-700' : 'border-green-500 text-green-700'
                        }`}>
                          {conflict.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 border rounded bg-blue-50">
                        <h6 className="font-medium text-blue-900 mb-1">{conflict.source1}</h6>
                        <p className="text-sm text-gray-700">{conflict.value1}</p>
                      </div>
                      <div className="p-3 border rounded bg-purple-50">
                        <h6 className="font-medium text-purple-900 mb-1">{conflict.source2}</h6>
                        <p className="text-sm text-gray-700">{conflict.value2}</p>
                      </div>
                    </div>

                    {conflict.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Use {conflict.source1}</Button>
                        <Button size="sm" variant="outline">Use {conflict.source2}</Button>
                        <Button size="sm" variant="outline">Manual Entry</Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation</CardTitle>
              <CardDescription>Validation results for synchronized data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {validationResults.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{result.category}</h5>
                      <Badge variant="outline" className={`${
                        result.percentage >= 99 ? 'border-green-500 text-green-700' :
                        result.percentage >= 95 ? 'border-orange-500 text-orange-700' :
                        'border-red-500 text-red-700'
                      }`}>
                        {result.percentage}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div className="text-center">
                        <p className="text-green-600 font-medium">{result.passed.toLocaleString()}</p>
                        <p className="text-gray-600">Passed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-orange-600 font-medium">{result.warnings.toLocaleString()}</p>
                        <p className="text-gray-600">Warnings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-red-600 font-medium">{result.failed.toLocaleString()}</p>
                        <p className="text-gray-600">Failed</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Tracking</CardTitle>
              <CardDescription>Track data changes and synchronization history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded text-center">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">15,847</p>
                    <p className="text-sm text-gray-600">Total Records Synced</p>
                  </div>
                  <div className="p-4 border rounded text-center">
                    <GitMerge className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">2,456</p>
                    <p className="text-sm text-gray-600">Changes Today</p>
                  </div>
                  <div className="p-4 border rounded text-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">15</p>
                    <p className="text-sm text-gray-600">Pending Conflicts</p>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <h6 className="font-medium text-gray-900 mb-3">Recent Changes</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Patient demographics updated</span>
                      <span className="text-gray-500">Epic EMR • 2 mins ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Lab results synchronized</span>
                      <span className="text-gray-500">Cerner EHR • 5 mins ago</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Medication list updated</span>
                      <span className="text-gray-500">AllScripts • 8 mins ago</span>
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
