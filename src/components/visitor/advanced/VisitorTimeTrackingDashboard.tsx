
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  AlertTriangle, 
  Bell,
  Timer,
  Users,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const VisitorTimeTrackingDashboard = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('today');

  const activeVisitors = [
    {
      id: '1',
      name: 'John Smith',
      category: 'Family',
      checkIn: '09:30',
      timeLimit: '18:00',
      timeElapsed: 5.5,
      timeRemaining: 3.5,
      location: 'Patient Room 205',
      status: 'normal',
      graceUsed: false
    },
    {
      id: '2',
      name: 'Emily Johnson',
      category: 'Contractor',
      checkIn: '08:00',
      timeLimit: '12:00',
      timeElapsed: 6.5,
      timeRemaining: -2.5,
      location: 'Maintenance Area',
      status: 'overstay',
      graceUsed: true
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      category: 'Medical Consultant',
      checkIn: '14:15',
      timeLimit: '17:00',
      timeElapsed: 0.75,
      timeRemaining: 2.25,
      location: 'Conference Room A',
      status: 'normal',
      graceUsed: false
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      category: 'Family',
      checkIn: '10:00',
      timeLimit: '18:00',
      timeElapsed: 7.5,
      timeRemaining: 0.5,
      location: 'ICU',
      status: 'warning',
      graceUsed: false
    }
  ];

  const overstayAlerts = [
    {
      id: '1',
      visitor: 'Emily Johnson',
      overstayTime: '2.5 hours',
      location: 'Maintenance Area',
      severity: 'high',
      lastNotified: '14:30',
      responded: false
    },
    {
      id: '2',
      visitor: 'Mark Davis',
      overstayTime: '45 minutes',
      location: 'Patient Room 302',
      severity: 'medium',
      lastNotified: '14:15',
      responded: true
    }
  ];

  const graceSettings = {
    standardGrace: 30, // minutes
    familyGrace: 60,
    contractorGrace: 15,
    vipGrace: 120,
    emergencyExtension: 240
  };

  const getStatusBadge = (status) => {
    const config = {
      normal: { label: 'On Time', className: 'bg-green-100 text-green-800' },
      warning: { label: 'Warning', className: 'bg-yellow-100 text-yellow-800' },
      overstay: { label: 'Overstay', className: 'bg-red-100 text-red-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const config = {
      low: { label: 'Low', className: 'bg-blue-100 text-blue-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-red-100 text-red-800' }
    };
    return <Badge className={config[severity].className}>{config[severity].label}</Badge>;
  };

  const calculateProgress = (elapsed, total) => {
    return Math.min((elapsed / total) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Visitor Time Tracking Dashboard</h3>
          <p className="text-gray-600">Overstay alerts, automatic notifications, and grace period management</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Grace Settings
          </Button>
          <Button>
            <Bell className="w-4 h-4 mr-2" />
            Notification Config
          </Button>
        </div>
      </div>

      {/* Time Tracking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">47</div>
                <div className="text-sm text-gray-600">Active Visitors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Near Time Limit</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Overstaying</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Timer className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">6.2</div>
                <div className="text-sm text-gray-600">Avg Visit Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Visitor Time Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Visitor Time Tracking
          </CardTitle>
          <CardDescription>Real-time monitoring of visitor time limits and overstays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeVisitors.map((visitor) => (
              <div key={visitor.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{visitor.name}</h4>
                      {getStatusBadge(visitor.status)}
                      {visitor.graceUsed && (
                        <Badge variant="outline">Grace Used</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{visitor.category} • {visitor.location}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">Check-in: {visitor.checkIn}</p>
                    <p className="text-sm text-gray-600">Limit: {visitor.timeLimit}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Progress</span>
                    <span>{visitor.timeElapsed}h elapsed / {visitor.timeRemaining > 0 ? `${visitor.timeRemaining}h remaining` : `${Math.abs(visitor.timeRemaining)}h over`}</span>
                  </div>
                  <Progress 
                    value={calculateProgress(visitor.timeElapsed, visitor.timeElapsed + Math.max(visitor.timeRemaining, 0))} 
                    className={`h-3 ${visitor.status === 'overstay' ? 'bg-red-100' : visitor.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {visitor.status === 'normal' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Within time limit</span>
                      </>
                    )}
                    {visitor.status === 'warning' && (
                      <>
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Approaching time limit</span>
                      </>
                    )}
                    {visitor.status === 'overstay' && (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Time limit exceeded</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {visitor.status === 'warning' && (
                      <Button size="sm" variant="outline">
                        <Bell className="w-4 h-4 mr-1" />
                        Notify
                      </Button>
                    )}
                    {visitor.status === 'overstay' && (
                      <Button size="sm">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Take Action
                      </Button>
                    )}
                    <Button size="sm" variant="outline">Extend Time</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overstay Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Overstay Alerts
          </CardTitle>
          <CardDescription>Visitors who have exceeded their allowed time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overstayAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg bg-red-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-red-900">{alert.visitor}</h4>
                    <p className="text-sm text-red-700">Overstay: {alert.overstayTime}</p>
                    <p className="text-sm text-red-600">{alert.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    {alert.responded ? (
                      <Badge className="bg-green-100 text-green-800">Responded</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">No Response</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-red-600">Last notified: {alert.lastNotified}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Send Reminder</Button>
                    <Button size="sm">Contact Security</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grace Period Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Grace Period Configuration
          </CardTitle>
          <CardDescription>Automatic grace periods by visitor category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Standard Visitors</h4>
              <div className="text-2xl font-bold text-blue-600">{graceSettings.standardGrace} min</div>
              <p className="text-sm text-gray-600">Default grace period</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Family Members</h4>
              <div className="text-2xl font-bold text-green-600">{graceSettings.familyGrace} min</div>
              <p className="text-sm text-gray-600">Extended for patient visits</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Contractors</h4>
              <div className="text-2xl font-bold text-orange-600">{graceSettings.contractorGrace} min</div>
              <p className="text-sm text-gray-600">Strict time limits</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">VIP Guests</h4>
              <div className="text-2xl font-bold text-purple-600">{graceSettings.vipGrace} min</div>
              <p className="text-sm text-gray-600">Extended courtesy period</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Emergency Extension</h4>
              <div className="text-2xl font-bold text-red-600">{graceSettings.emergencyExtension} min</div>
              <p className="text-sm text-gray-600">Special circumstances</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
