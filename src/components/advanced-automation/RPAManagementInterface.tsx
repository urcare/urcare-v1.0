
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot,
  Play,
  Pause,
  Square,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Download
} from 'lucide-react';

export const RPAManagementInterface = () => {
  const [selectedBot, setSelectedBot] = useState(null);

  const rpaQueues = [
    {
      id: 1,
      name: 'Patient Registration Automation',
      status: 'running',
      tasksInQueue: 23,
      completedToday: 147,
      averageTime: '2.3 min',
      successRate: 98.5,
      lastRun: '5 min ago'
    },
    {
      id: 2,
      name: 'Insurance Verification Bot',
      status: 'running',
      tasksInQueue: 8,
      completedToday: 89,
      averageTime: '4.1 min',
      successRate: 94.2,
      lastRun: '2 min ago'
    },
    {
      id: 3,
      name: 'Lab Results Processing',
      status: 'paused',
      tasksInQueue: 45,
      completedToday: 203,
      averageTime: '1.8 min',
      successRate: 99.1,
      lastRun: '15 min ago'
    }
  ];

  const botPerformance = [
    {
      bot: 'Patient Registration',
      tasks: 147,
      success: 145,
      errors: 2,
      avgTime: '2.3 min'
    },
    {
      bot: 'Insurance Verification',
      tasks: 89,
      success: 84,
      errors: 5,
      avgTime: '4.1 min'
    },
    {
      bot: 'Lab Results',
      tasks: 203,
      success: 201,
      errors: 2,
      avgTime: '1.8 min'
    }
  ];

  const exceptions = [
    {
      id: 1,
      bot: 'Insurance Verification Bot',
      error: 'Network timeout during provider verification',
      timestamp: '2024-06-09 14:23:45',
      status: 'resolved',
      action: 'Retry with increased timeout'
    },
    {
      id: 2,
      bot: 'Patient Registration',
      error: 'Invalid insurance number format',
      timestamp: '2024-06-09 14:18:12',
      status: 'pending',
      action: 'Manual review required'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'stopped': return <Square className="h-4 w-4 text-red-600" />;
      default: return <Bot className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Bot Dashboard</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* RPA Bot Status */}
          <div className="grid gap-4">
            {rpaQueues.map((queue) => (
              <Card key={queue.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(queue.status)}
                        <div>
                          <div className="font-medium">{queue.name}</div>
                          <div className="text-sm text-gray-600">
                            Last run: {queue.lastRun}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(queue.status)}>
                        {queue.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Queue</div>
                        <div className="font-medium">{queue.tasksInQueue} tasks</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Completed Today</div>
                        <div className="font-medium">{queue.completedToday}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Success Rate</div>
                        <div className="font-medium text-green-600">{queue.successRate}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Avg Time</div>
                        <div className="font-medium">{queue.averageTime}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        {queue.status === 'running' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Bot Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Bot Performance Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {botPerformance.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Bot className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium">{bot.bot}</div>
                        <div className="text-sm text-gray-600">Average Time: {bot.avgTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{bot.tasks}</div>
                        <div className="text-sm text-gray-600">Total Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{bot.success}</div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{bot.errors}</div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {((bot.success / bot.tasks) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="space-y-4">
          {/* Exception Handling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Exception Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exceptions.map((exception) => (
                  <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <AlertCircle className={`h-5 w-5 ${exception.status === 'resolved' ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <div className="font-medium">{exception.bot}</div>
                        <div className="text-sm text-gray-700">{exception.error}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exception.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{exception.action}</div>
                        <Badge variant={exception.status === 'resolved' ? 'default' : 'destructive'}>
                          {exception.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
