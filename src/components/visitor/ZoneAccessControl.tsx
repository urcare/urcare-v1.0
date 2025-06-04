
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Shield, 
  Users,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

export const ZoneAccessControl = () => {
  const [selectedZone, setSelectedZone] = useState('icu');

  const hospitalZones = [
    {
      id: 'icu',
      name: 'Intensive Care Unit',
      level: 'high_security',
      status: 'restricted',
      currentVisitors: 3,
      maxCapacity: 5,
      accessRequirements: ['Family approval', 'Medical clearance', 'Time restrictions'],
      restrictions: 'Family members only, 2 visitors max per patient, 30-min visits'
    },
    {
      id: 'emergency',
      name: 'Emergency Department',
      level: 'high_security',
      status: 'limited',
      currentVisitors: 8,
      maxCapacity: 15,
      accessRequirements: ['Staff approval', 'Emergency contact'],
      restrictions: '1 visitor per patient, must wait in designated areas'
    },
    {
      id: 'patient_rooms',
      name: 'Patient Rooms',
      level: 'medium_security',
      status: 'open',
      currentVisitors: 45,
      maxCapacity: 80,
      accessRequirements: ['Patient consent', 'Visitor registration'],
      restrictions: 'Visiting hours 6 AM - 10 PM, 4 visitors max per room'
    },
    {
      id: 'surgery',
      name: 'Operating Rooms',
      level: 'maximum_security',
      status: 'closed',
      currentVisitors: 0,
      maxCapacity: 0,
      accessRequirements: ['Authorized personnel only'],
      restrictions: 'Absolutely no visitor access'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      level: 'high_security',
      status: 'restricted',
      currentVisitors: 2,
      maxCapacity: 3,
      accessRequirements: ['Business approval', 'Escort required'],
      restrictions: 'Vendors and contractors only, escort mandatory'
    },
    {
      id: 'cafeteria',
      name: 'Cafeteria',
      level: 'low_security',
      status: 'open',
      currentVisitors: 23,
      maxCapacity: 50,
      accessRequirements: ['Basic registration'],
      restrictions: 'Open to all visitors during operating hours'
    },
    {
      id: 'admin',
      name: 'Administration',
      level: 'medium_security',
      status: 'business_hours',
      currentVisitors: 5,
      maxCapacity: 10,
      accessRequirements: ['Appointment required', 'ID verification'],
      restrictions: 'Business visitors only, 9 AM - 5 PM weekdays'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Areas',
      level: 'high_security',
      status: 'restricted',
      currentVisitors: 4,
      maxCapacity: 8,
      accessRequirements: ['Work authorization', 'Safety training', 'Escort required'],
      restrictions: 'Contractors only, safety equipment mandatory'
    }
  ];

  const accessLogs = [
    {
      id: '1',
      time: '14:30',
      visitor: 'John Smith',
      zone: 'ICU',
      action: 'Entry Granted',
      status: 'success'
    },
    {
      id: '2',
      time: '14:15',
      visitor: 'Emily Johnson',
      zone: 'Administration',
      action: 'Access Denied',
      status: 'denied'
    },
    {
      id: '3',
      time: '13:45',
      visitor: 'Mike Wilson',
      zone: 'Patient Rooms',
      action: 'Entry Granted',
      status: 'success'
    },
    {
      id: '4',
      time: '13:30',
      visitor: 'Sarah Brown',
      zone: 'Pharmacy',
      action: 'Escort Assigned',
      status: 'pending'
    }
  ];

  const securityAlerts = [
    {
      id: '1',
      time: '14:25',
      message: 'Unauthorized access attempt at Surgery entrance',
      severity: 'high',
      zone: 'Operating Rooms'
    },
    {
      id: '2',
      time: '13:15',
      message: 'Visitor overstayed time limit in ICU',
      severity: 'medium',
      zone: 'ICU'
    },
    {
      id: '3',
      time: '12:45',
      message: 'Emergency evacuation protocol activated',
      severity: 'critical',
      zone: 'Emergency Department'
    }
  ];

  const getSecurityLevelBadge = (level) => {
    const levelConfig = {
      low_security: { label: 'Low Security', className: 'bg-green-100 text-green-800' },
      medium_security: { label: 'Medium Security', className: 'bg-yellow-100 text-yellow-800' },
      high_security: { label: 'High Security', className: 'bg-orange-100 text-orange-800' },
      maximum_security: { label: 'Maximum Security', className: 'bg-red-100 text-red-800' }
    };
    const config = levelConfig[level];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Open', className: 'bg-green-100 text-green-800', icon: Unlock },
      restricted: { label: 'Restricted', className: 'bg-yellow-100 text-yellow-800', icon: Lock },
      closed: { label: 'Closed', className: 'bg-red-100 text-red-800', icon: Lock },
      limited: { label: 'Limited', className: 'bg-blue-100 text-blue-800', icon: Users },
      business_hours: { label: 'Business Hours', className: 'bg-purple-100 text-purple-800', icon: Clock }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getActionBadge = (status) => {
    if (status === 'success') return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    if (status === 'denied') return <Badge className="bg-red-100 text-red-800">Denied</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-orange-100 text-orange-800' },
      critical: { label: 'Critical', className: 'bg-red-100 text-red-800' }
    };
    const config = severityConfig[severity];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Zone-Based Access Control</h3>
          <p className="text-gray-600">Interactive hospital maps with permission assignments and restricted area marking</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Zone Settings
          </Button>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            Hospital Map
          </Button>
        </div>
      </div>

      {/* Hospital Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Hospital Map
          </CardTitle>
          <CardDescription>Real-time zone status and visitor distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            {hospitalZones.map((zone) => (
              <div
                key={zone.id}
                className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
                  selectedZone === zone.id ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedZone(zone.id)}
              >
                <div className="text-center">
                  <h4 className="font-medium text-sm mb-2">{zone.name}</h4>
                  <div className="space-y-1">
                    {getStatusBadge(zone.status)}
                    <div className="text-xs text-gray-600">
                      {zone.currentVisitors}/{zone.maxCapacity} visitors
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Zone Access Configuration</CardTitle>
            <CardDescription>Security settings and access requirements by zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hospitalZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`p-4 border rounded-lg ${
                    selectedZone === zone.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getSecurityLevelBadge(zone.level)}
                        {getStatusBadge(zone.status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Current/Max</div>
                      <div className="font-medium">{zone.currentVisitors}/{zone.maxCapacity}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Access Requirements:</p>
                      <ul className="list-disc list-inside text-gray-600">
                        {zone.accessRequirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Restrictions:</p>
                      <p className="text-gray-600">{zone.restrictions}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-1" />
                      View Visitors
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Monitoring
            </CardTitle>
            <CardDescription>Real-time security alerts and access logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Security Alerts */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Active Alerts
                </h4>
                <div className="space-y-2">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg bg-red-50">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {alert.time} • {alert.zone}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Logs */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Recent Access Activity
                </h4>
                <div className="space-y-2">
                  {accessLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{log.visitor}</p>
                        <p className="text-xs text-gray-600">{log.time} • {log.zone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{log.action}</span>
                        {getActionBadge(log.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
