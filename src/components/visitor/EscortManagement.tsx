
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  Users, 
  Bell,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Navigation
} from 'lucide-react';

export const EscortManagement = () => {
  const [selectedEscort, setSelectedEscort] = useState(null);

  const escortRequests = [
    {
      id: '1',
      visitor: 'Emily Johnson',
      company: 'Medical Supplies Co',
      destination: 'Pharmacy Department',
      requestTime: '14:30',
      scheduledTime: '15:00',
      duration: '45 minutes',
      reason: 'Equipment delivery and training',
      status: 'assigned',
      assignedEscort: 'Security Officer A',
      priority: 'medium'
    },
    {
      id: '2',
      visitor: 'Robert Brown',
      company: 'Construction LLC',
      destination: 'Maintenance Areas',
      requestTime: '08:15',
      scheduledTime: '08:30',
      duration: '2 hours',
      reason: 'HVAC system inspection',
      status: 'in_progress',
      assignedEscort: 'Facilities Manager',
      priority: 'high'
    },
    {
      id: '3',
      visitor: 'David Wilson',
      company: 'IT Solutions',
      destination: 'Server Room',
      requestTime: '13:45',
      scheduledTime: '16:00',
      duration: '1 hour',
      reason: 'Network equipment upgrade',
      status: 'pending',
      assignedEscort: null,
      priority: 'low'
    }
  ];

  const availableEscorts = [
    {
      id: '1',
      name: 'Security Officer A',
      department: 'Security',
      status: 'available',
      currentLocation: 'Main Entrance',
      specializations: ['High-security areas', 'VIP guests'],
      contactInfo: 'ext. 2101',
      activeAssignments: 0
    },
    {
      id: '2',
      name: 'Facilities Manager',
      department: 'Maintenance',
      status: 'busy',
      currentLocation: 'Basement Level',
      specializations: ['Technical areas', 'Construction oversight'],
      contactInfo: 'ext. 2205',
      activeAssignments: 1
    },
    {
      id: '3',
      name: 'Admin Coordinator',
      department: 'Administration',
      status: 'available',
      currentLocation: 'Admin Office',
      specializations: ['Business visitors', 'Office tours'],
      contactInfo: 'ext. 2050',
      activeAssignments: 0
    },
    {
      id: '4',
      name: 'Security Officer B',
      department: 'Security',
      status: 'on_break',
      currentLocation: 'Staff Break Room',
      specializations: ['General escort', 'Emergency response'],
      contactInfo: 'ext. 2102',
      activeAssignments: 0
    }
  ];

  const activeEscorts = [
    {
      id: '1',
      escort: 'Facilities Manager',
      visitor: 'Robert Brown',
      startTime: '08:30',
      estimatedEnd: '10:30',
      currentLocation: 'Basement - HVAC Room',
      route: ['Main Entrance', 'Elevator B', 'Basement Level', 'HVAC Room'],
      alerts: ['Safety equipment required', 'Restricted area access']
    },
    {
      id: '2',
      escort: 'Security Officer C',
      visitor: 'Dr. VIP Guest',
      startTime: '14:00',
      estimatedEnd: '15:30',
      currentLocation: 'ICU Tour',
      route: ['VIP Entrance', 'Executive Office', 'ICU', 'Conference Room'],
      alerts: ['VIP protocol active', 'Media restrictions']
    }
  ];

  const escortAlerts = [
    {
      id: '1',
      time: '14:45',
      message: 'Escort overdue: Robert Brown assignment exceeded time limit',
      severity: 'medium',
      escort: 'Facilities Manager'
    },
    {
      id: '2',
      time: '13:30',
      message: 'Security breach: Unescorted visitor detected in restricted area',
      severity: 'high',
      escort: 'Security Officer A'
    },
    {
      id: '3',
      time: '12:15',
      message: 'Route deviation: Emily Johnson took unauthorized path',
      severity: 'low',
      escort: 'Admin Coordinator'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      assigned: { label: 'Assigned', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'In Progress', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getEscortStatusBadge = (status) => {
    const statusConfig = {
      available: { label: 'Available', className: 'bg-green-100 text-green-800' },
      busy: { label: 'Busy', className: 'bg-red-100 text-red-800' },
      on_break: { label: 'On Break', className: 'bg-yellow-100 text-yellow-800' },
      off_duty: { label: 'Off Duty', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-red-100 text-red-800' }
    };
    const config = priorityConfig[priority];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getSeverityBadge = (severity) => {
    const severityConfig = {
      low: { label: 'Low', className: 'bg-green-100 text-green-800' },
      medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'High', className: 'bg-red-100 text-red-800' }
    };
    const config = severityConfig[severity];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Escort Management System</h3>
          <p className="text-gray-600">Automatic escort assignments and real-time tracking capabilities</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Send Alert
          </Button>
          <Button>
            <UserCheck className="w-4 h-4 mr-2" />
            Assign Escort
          </Button>
        </div>
      </div>

      {/* Escort Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-sm text-gray-600">Available Escorts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Navigation className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Active Escorts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escort Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Escort Requests
          </CardTitle>
          <CardDescription>Pending and active escort assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escortRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{request.visitor}</h4>
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                    <p className="text-sm text-gray-600">{request.company}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">Scheduled: {request.scheduledTime}</p>
                    <p className="text-xs text-gray-500">Duration: {request.duration}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="font-medium">{request.destination}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="font-medium">{request.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assigned Escort</p>
                    <p className="font-medium">{request.assignedEscort || 'Not assigned'}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Requested at: {request.requestTime}
                  </div>
                  
                  <div className="flex gap-2">
                    {request.status === 'pending' && (
                      <Button size="sm">Assign Escort</Button>
                    )}
                    {request.status === 'in_progress' && (
                      <Button size="sm" variant="outline">
                        <MapPin className="w-4 h-4 mr-1" />
                        Track
                      </Button>
                    )}
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Escorts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Available Escorts
            </CardTitle>
            <CardDescription>Staff members available for escort duties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableEscorts.map((escort) => (
                <div key={escort.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{escort.name}</h4>
                      <p className="text-sm text-gray-600">{escort.department}</p>
                    </div>
                    {getEscortStatusBadge(escort.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                    <div>
                      <p className="text-gray-500">Current Location</p>
                      <p className="font-medium">{escort.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <p>{escort.contactInfo}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm mb-1">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {escort.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Active: {escort.activeAssignments} assignments
                    </span>
                    {escort.status === 'available' && (
                      <Button size="sm">Assign</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Escorts Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Active Escort Tracking
            </CardTitle>
            <CardDescription>Real-time tracking of ongoing escort assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeEscorts.map((escort) => (
                <div key={escort.id} className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{escort.escort}</h4>
                      <p className="text-sm text-gray-600">Escorting: {escort.visitor}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <Navigation className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Started</p>
                      <p className="font-medium">{escort.startTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Est. End</p>
                      <p className="font-medium">{escort.estimatedEnd}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm mb-1">Current Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{escort.currentLocation}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-500 text-sm mb-1">Planned Route</p>
                    <div className="flex flex-wrap gap-1">
                      {escort.route.map((stop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {index + 1}. {stop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {escort.alerts.length > 0 && (
                    <div className="mb-3">
                      <p className="text-gray-500 text-sm mb-1">Active Alerts</p>
                      <div className="space-y-1">
                        {escort.alerts.map((alert, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="w-3 h-3 text-yellow-600" />
                            <span>{alert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escort Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Escort Alerts & Notifications
          </CardTitle>
          <CardDescription>Real-time alerts and security notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escortAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-600">{alert.time} • {alert.escort}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <Button size="sm" variant="outline">Resolve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
