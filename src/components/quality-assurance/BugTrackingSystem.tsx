
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Calendar,
  TrendingDown,
  Filter
} from 'lucide-react';

export const BugTrackingSystem = () => {
  const [selectedBug, setSelectedBug] = useState<string | null>(null);

  const bugs = [
    {
      id: 'BUG-001',
      title: 'Login fails with special characters in password',
      description: 'Users cannot login when password contains special characters like @, #, $',
      severity: 'high',
      priority: 'urgent',
      status: 'open',
      assignee: 'John Smith',
      reporter: 'Alice Johnson',
      created: '2024-06-13 08:30',
      updated: '2024-06-13 09:15',
      environment: 'production',
      component: 'Authentication',
      labels: ['security', 'login'],
      reproducible: true
    },
    {
      id: 'BUG-002',
      title: 'Performance degradation in patient search',
      description: 'Search takes over 5 seconds when database has more than 10k records',
      severity: 'medium',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Mike Davis',
      reporter: 'Sarah Wilson',
      created: '2024-06-12 14:20',
      updated: '2024-06-13 07:45',
      environment: 'staging',
      component: 'Search Engine',
      labels: ['performance', 'database'],
      reproducible: true
    },
    {
      id: 'BUG-003',
      title: 'PDF export button not visible on mobile',
      description: 'Export to PDF button is hidden on mobile devices due to responsive layout issue',
      severity: 'low',
      priority: 'medium',
      status: 'resolved',
      assignee: 'Emma Brown',
      reporter: 'Tom Anderson',
      created: '2024-06-11 10:15',
      updated: '2024-06-13 06:30',
      environment: 'production',
      component: 'UI Components',
      labels: ['mobile', 'ui'],
      reproducible: true
    },
    {
      id: 'BUG-004',
      title: 'Medication dosage calculation incorrect for pediatric patients',
      description: 'Weight-based dosage calculation shows wrong values for patients under 12 years',
      severity: 'critical',
      priority: 'critical',
      status: 'open',
      assignee: 'Dr. Lisa Chen',
      reporter: 'Nurse Manager',
      created: '2024-06-13 09:00',
      updated: '2024-06-13 09:45',
      environment: 'production',
      component: 'Clinical Calculations',
      labels: ['critical', 'pediatric', 'medication'],
      reproducible: true
    }
  ];

  const bugStats = {
    total: 847,
    open: 234,
    inProgress: 89,
    resolved: 524,
    critical: 12,
    high: 67,
    medium: 145,
    low: 89
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bug className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Bug Tracking System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{bugStats.open}</div>
              <div className="text-sm text-gray-600">Open Bugs</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{bugStats.inProgress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{bugStats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{bugStats.critical}</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Bugs</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button size="sm">
                  <Bug className="h-4 w-4 mr-1" />
                  New Bug
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bugs.map((bug) => (
                <Card 
                  key={bug.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedBug === bug.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedBug(bug.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(bug.status)}
                        <div>
                          <h4 className="font-semibold">{bug.id}</h4>
                          <p className="text-sm font-medium">{bug.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <Badge className={getSeverityColor(bug.severity)}>
                          {bug.severity}
                        </Badge>
                        <Badge className={getPriorityColor(bug.priority)}>
                          {bug.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{bug.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-medium">Assignee</div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {bug.assignee}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Component</div>
                        <div className="text-gray-600">{bug.component}</div>
                      </div>
                      <div>
                        <div className="font-medium">Environment</div>
                        <div className="text-gray-600">{bug.environment}</div>
                      </div>
                      <div>
                        <div className="font-medium">Updated</div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {bug.updated}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      {bug.labels.map((label, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(bug.status)}>
                        {bug.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Comment
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
            <CardTitle>Bug Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Resolution Trends
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average Resolution Time:</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Bug Resolution:</span>
                  <span className="font-medium">4.2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Reopened Bugs:</span>
                  <span className="font-medium">8.7%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Bug Distribution by Severity</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Critical</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-2/12 h-2 bg-red-500 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">{bugStats.critical}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">High</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-8/12 h-2 bg-orange-500 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">{bugStats.high}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Medium</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-full h-2 bg-yellow-500 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">{bugStats.medium}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Low</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded">
                      <div className="w-9/12 h-2 bg-green-500 rounded"></div>
                    </div>
                    <span className="text-sm font-medium">{bugStats.low}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Component Impact Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Authentication:</span>
                  <span className="font-medium text-red-600">15 bugs</span>
                </div>
                <div className="flex justify-between">
                  <span>UI Components:</span>
                  <span className="font-medium text-orange-600">12 bugs</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-medium text-yellow-600">8 bugs</span>
                </div>
                <div className="flex justify-between">
                  <span>API Endpoints:</span>
                  <span className="font-medium text-blue-600">6 bugs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
