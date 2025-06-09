
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Shield, 
  Activity,
  Eye,
  Clock,
  MapPin,
  User,
  TrendingUp,
  Bell,
  RefreshCw
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_auth' | 'suspicious_activity' | 'data_access' | 'privilege_escalation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  user: string;
  location: string;
  ip: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
}

interface ThreatMetric {
  category: string;
  current: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
}

export const SecurityMonitoringInterface = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'failed_auth',
      severity: 'high',
      timestamp: new Date(Date.now() - 300000),
      user: 'admin@hospital.com',
      location: 'New York, NY',
      ip: '192.168.1.100',
      description: '5 consecutive failed login attempts',
      status: 'investigating'
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'medium',
      timestamp: new Date(Date.now() - 600000),
      user: 'dr.smith@hospital.com',
      location: 'Chicago, IL',
      ip: '10.0.0.50',
      description: 'Unusual data access pattern detected',
      status: 'open'
    },
    {
      id: '3',
      type: 'data_access',
      severity: 'critical',
      timestamp: new Date(Date.now() - 900000),
      user: 'nurse.jones@hospital.com',
      location: 'Los Angeles, CA',
      ip: '172.16.0.25',
      description: 'Unauthorized patient record access',
      status: 'open'
    }
  ]);

  const [threatMetrics, setThreatMetrics] = useState<ThreatMetric[]>([
    { category: 'Failed Logins', current: 23, threshold: 50, trend: 'up' },
    { category: 'Suspicious IPs', current: 7, threshold: 15, trend: 'stable' },
    { category: 'Privilege Escalations', current: 2, threshold: 5, trend: 'down' },
    { category: 'Data Violations', current: 1, threshold: 3, trend: 'stable' }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate new security events
        if (Math.random() < 0.1) {
          const newEvent: SecurityEvent = {
            id: Date.now().toString(),
            type: ['login_attempt', 'failed_auth', 'suspicious_activity'][Math.floor(Math.random() * 3)] as any,
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
            timestamp: new Date(),
            user: `user${Math.floor(Math.random() * 1000)}@hospital.com`,
            location: ['New York, NY', 'Chicago, IL', 'Los Angeles, CA'][Math.floor(Math.random() * 3)],
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            description: 'Automated security alert',
            status: 'open'
          };
          
          setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const criticalEvents = securityEvents.filter(e => e.severity === 'critical').length;
  const openEvents = securityEvents.filter(e => e.status === 'open').length;

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Security Monitoring
            </span>
            <div className="flex items-center gap-2">
              <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isMonitoring ? 'Active' : 'Paused'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalEvents}</div>
              <div className="text-sm text-gray-600">Critical Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{openEvents}</div>
              <div className="text-sm text-gray-600">Open Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{securityEvents.length}</div>
              <div className="text-sm text-gray-600">Total Events (24h)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">97.2%</div>
              <div className="text-sm text-gray-600">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Threat Metrics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{metric.current}/{metric.threshold}</span>
                    <TrendingUp className={`h-4 w-4 ${
                      metric.trend === 'up' ? 'text-red-500' : 
                      metric.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </div>
                </div>
                <Progress 
                  value={(metric.current / metric.threshold) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-gray-600">
                  Threshold: {metric.threshold} | Trend: {metric.trend}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Security Events
            </span>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${
                      event.severity === 'critical' ? 'text-red-600' :
                      event.severity === 'high' ? 'text-orange-600' :
                      event.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`} />
                    <div>
                      <div className="font-medium">{event.description}</div>
                      <div className="text-sm text-gray-600">{formatTime(event.timestamp)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {event.user}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {event.ip}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incident Response */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Automated Response Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Account Lockout</h4>
              <p className="text-sm text-gray-600 mb-3">
                Automatically lock accounts after 5 failed attempts
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status: Active</span>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">IP Blocking</h4>
              <p className="text-sm text-gray-600 mb-3">
                Block suspicious IP addresses automatically
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status: Active</span>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Alert Escalation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Escalate critical alerts to security team
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Status: Active</span>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
