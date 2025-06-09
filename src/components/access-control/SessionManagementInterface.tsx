
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock,
  Monitor,
  Smartphone,
  LogOut,
  AlertTriangle,
  Shield,
  Activity,
  Users
} from 'lucide-react';

export const SessionManagementInterface = () => {
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'SES001',
      user: 'Dr. Sarah Johnson',
      device: 'Hospital Workstation #23',
      location: 'Emergency Department',
      startTime: '2024-01-22 08:30:00',
      lastActivity: '2024-01-22 15:35:00',
      timeoutIn: 25,
      deviceType: 'Desktop',
      ipAddress: '192.168.1.45',
      status: 'Active'
    },
    {
      id: 'SES002',
      user: 'Nurse Michael Chen',
      device: 'Mobile Tablet #12',
      location: 'Ward 3A',
      startTime: '2024-01-22 07:00:00',
      lastActivity: '2024-01-22 15:33:00',
      timeoutIn: 7,
      deviceType: 'Tablet',
      ipAddress: '192.168.1.78',
      status: 'Warning'
    },
    {
      id: 'SES003',
      user: 'Admin Jane Smith',
      device: 'Admin Laptop',
      location: 'IT Department',
      startTime: '2024-01-22 09:15:00',
      lastActivity: '2024-01-22 15:30:00',
      timeoutIn: 2,
      deviceType: 'Laptop',
      ipAddress: '192.168.1.102',
      status: 'Critical'
    }
  ]);

  const [sessionPolicies, setSessionPolicies] = useState([
    {
      id: 'POL001',
      name: 'Standard Session Timeout',
      timeout: 30,
      applies: 'All Users',
      maxConcurrent: 3,
      enabled: true
    },
    {
      id: 'POL002',
      name: 'Emergency Extended Session',
      timeout: 120,
      applies: 'Emergency Staff',
      maxConcurrent: 5,
      enabled: true
    },
    {
      id: 'POL003',
      name: 'Administrative Session',
      timeout: 60,
      applies: 'Admin Users',
      maxConcurrent: 2,
      enabled: true
    }
  ]);

  const [concurrentSessions, setConcurrentSessions] = useState([
    {
      user: 'Dr. Emily Rodriguez',
      sessions: [
        { device: 'Workstation A', location: 'ICU', since: '08:00' },
        { device: 'Mobile Device', location: 'Ward 2B', since: '14:30' }
      ]
    },
    {
      user: 'Nurse Lisa Park',
      sessions: [
        { device: 'Tablet #8', location: 'Emergency', since: '06:30' },
        { device: 'Workstation C', location: 'Pharmacy', since: '15:00' },
        { device: 'Mobile App', location: 'Cafeteria', since: '15:20' }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'Desktop': case 'Workstation': return Monitor;
      case 'Tablet': case 'Mobile': return Smartphone;
      default: return Monitor;
    }
  };

  const getTimeoutProgress = (timeoutIn: number) => {
    const maxTimeout = 30;
    return ((maxTimeout - timeoutIn) / maxTimeout) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Session Management Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{activeSessions.length}</div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {activeSessions.filter(s => s.status === 'Warning' || s.status === 'Critical').length}
            </div>
            <div className="text-sm text-gray-600">Sessions at Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {concurrentSessions.reduce((acc, user) => acc + user.sessions.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Concurrent Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">4.2h</div>
            <div className="text-sm text-gray-600">Avg Session Length</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions with Timeout Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              return (
                <div key={session.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <DeviceIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">{session.user}</div>
                        <div className="text-sm text-gray-600">{session.device}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <LogOut className="h-3 w-3 mr-1" />
                        Force Logout
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium">{session.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Start Time</div>
                      <div className="font-medium">{session.startTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Activity</div>
                      <div className="font-medium">{session.lastActivity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">IP Address</div>
                      <div className="font-medium">{session.ipAddress}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Session Timeout</span>
                      <span className={session.timeoutIn <= 5 ? 'text-red-600 font-medium' : ''}>
                        {session.timeoutIn} minutes remaining
                      </span>
                    </div>
                    <Progress 
                      value={getTimeoutProgress(session.timeoutIn)} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Concurrent Session Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Concurrent Session Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {concurrentSessions.map((userSessions, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">{userSessions.user}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{userSessions.sessions.length} sessions</Badge>
                    {userSessions.sessions.length > 2 && (
                      <Badge className="bg-orange-100 text-orange-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        High Concurrency
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {userSessions.sessions.map((session, sessionIndex) => (
                    <div key={sessionIndex} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{session.device}</div>
                      <div className="text-gray-600">{session.location}</div>
                      <div className="text-gray-600">Since {session.since}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Policies Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session Timeout Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionPolicies.map((policy) => (
              <div key={policy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{policy.name}</div>
                  <div className="flex items-center gap-2">
                    <Badge className={policy.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {policy.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Timeout Duration</div>
                    <div className="font-medium">{policy.timeout} minutes</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Applies To</div>
                    <div className="font-medium">{policy.applies}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Max Concurrent</div>
                    <div className="font-medium">{policy.maxConcurrent} sessions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Session Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-20">
              <div className="text-center">
                <LogOut className="h-6 w-6 mx-auto mb-1" />
                <div>Force Logout All</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-1" />
                <div>Extend All Sessions</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-1" />
                <div>Lockdown Mode</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
