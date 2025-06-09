
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  FileText,
  Calendar,
  Settings,
  TrendingUp
} from 'lucide-react';

export const MaintenanceWorkflowInterface = () => {
  const [workOrders] = useState([
    {
      id: 'WO-2024-001',
      title: 'MRI Scanner Calibration',
      equipment: 'MRI-001',
      priority: 'high',
      type: 'Preventive',
      status: 'in_progress',
      assignedTechnician: 'John Smith',
      estimatedDuration: 4,
      actualDuration: 2.5,
      scheduledDate: '2024-06-09',
      completionDate: null,
      department: 'Radiology',
      description: 'Quarterly calibration and performance verification',
      partsRequired: ['Calibration Kit', 'Test Phantoms'],
      cost: 1250
    },
    {
      id: 'WO-2024-002',
      title: 'Ventilator Emergency Repair',
      equipment: 'VENT-003',
      priority: 'critical',
      type: 'Corrective',
      status: 'pending',
      assignedTechnician: 'Maria Garcia',
      estimatedDuration: 6,
      actualDuration: null,
      scheduledDate: '2024-06-09',
      completionDate: null,
      department: 'ICU',
      description: 'Pressure sensor malfunction - immediate repair required',
      partsRequired: ['Pressure Sensor', 'Control Board'],
      cost: 3200
    },
    {
      id: 'WO-2024-003',
      title: 'CT Scanner Routine Maintenance',
      equipment: 'CT-002',
      priority: 'medium',
      type: 'Preventive',
      status: 'scheduled',
      assignedTechnician: 'David Wilson',
      estimatedDuration: 3,
      actualDuration: null,
      scheduledDate: '2024-06-10',
      completionDate: null,
      department: 'Emergency',
      description: 'Monthly maintenance and cleaning cycle',
      partsRequired: ['Cleaning Supplies', 'Filter Replacement'],
      cost: 450
    },
    {
      id: 'WO-2024-004',
      title: 'X-Ray Tube Replacement',
      equipment: 'XRAY-004',
      priority: 'high',
      type: 'Corrective',
      status: 'completed',
      assignedTechnician: 'Sarah Chen',
      estimatedDuration: 8,
      actualDuration: 7.5,
      scheduledDate: '2024-06-07',
      completionDate: '2024-06-08',
      department: 'OR 3',
      description: 'X-ray tube end of life replacement',
      partsRequired: ['X-Ray Tube Assembly', 'Cooling System'],
      cost: 15600
    }
  ]);

  const [workflowMetrics] = useState({
    totalWorkOrders: 47,
    completedToday: 6,
    inProgress: 8,
    overdue: 3,
    avgCompletionTime: 4.2,
    onTimeCompletion: 94.8
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-700 border-red-300 bg-red-50';
      case 'high': return 'text-orange-700 border-orange-300 bg-orange-50';
      case 'medium': return 'text-yellow-700 border-yellow-300 bg-yellow-50';
      case 'low': return 'text-green-700 border-green-300 bg-green-50';
      default: return 'text-gray-700 border-gray-300 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 border-green-300';
      case 'in_progress': return 'text-blue-700 border-blue-300';
      case 'scheduled': return 'text-purple-700 border-purple-300';
      case 'pending': return 'text-orange-700 border-orange-300';
      case 'overdue': return 'text-red-700 border-red-300';
      default: return 'text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Settings className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Wrench className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{workflowMetrics.totalWorkOrders}</div>
            <div className="text-sm text-gray-600">Total Work Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{workflowMetrics.completedToday}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{workflowMetrics.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{workflowMetrics.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{workflowMetrics.avgCompletionTime.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Avg Completion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{workflowMetrics.onTimeCompletion.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">On-Time Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Work Orders Alert */}
      {workOrders.some(wo => wo.priority === 'critical') && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Critical Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-700">
                <Wrench className="h-4 w-4" />
                <span>Ventilator emergency repair (VENT-003) - requires immediate attention</span>
              </div>
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <span>3 work orders are overdue and require technician dispatch</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Orders */}
      <div className="space-y-4">
        {workOrders.map((order) => (
          <Card key={order.id} className={`border-l-4 ${order.priority === 'critical' ? 'border-l-red-500' : order.priority === 'high' ? 'border-l-orange-500' : 'border-l-blue-500'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wrench className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <p className="text-sm text-gray-600">{order.id} • {order.equipment} • {order.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <Badge variant="outline" className={getPriorityColor(order.priority)}>
                    {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Type & Duration</div>
                  <div className="text-lg font-semibold text-blue-600">{order.type}</div>
                  <div className="text-xs text-gray-500">
                    Est: {order.estimatedDuration}h
                    {order.actualDuration && ` • Actual: ${order.actualDuration}h`}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Assigned Technician
                  </div>
                  <div className="text-lg font-semibold">{order.assignedTechnician}</div>
                  <div className="text-xs text-gray-500">Lead technician</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    {new Date(order.scheduledDate).toLocaleDateString()}
                  </div>
                  {order.completionDate && (
                    <div className="text-xs text-green-500">
                      Completed: {new Date(order.completionDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Cost</div>
                  <div className="text-lg font-semibold text-green-600">
                    ${order.cost.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Parts & labor</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-sm font-medium text-gray-800 mb-1">Description</div>
                <div className="text-sm text-gray-700">{order.description}</div>
              </div>

              {/* Parts Required */}
              {order.partsRequired.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Parts Required</div>
                  <div className="flex flex-wrap gap-2">
                    {order.partsRequired.map((part, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <Button size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Assign Technician
                  </Button>
                )}
                {order.status === 'in_progress' && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Equipment Location
                </Button>
                {order.priority === 'critical' && (
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technician Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Technician Performance & Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">John Smith</div>
              <div className="text-sm text-gray-600 mb-2">Senior Biomedical Tech</div>
              <div className="space-y-1">
                <div className="text-sm">Completion rate: <span className="font-semibold text-green-600">98.2%</span></div>
                <div className="text-sm">Avg time: <span className="font-semibold text-blue-600">3.8h</span></div>
                <div className="text-sm">Current workload: <span className="font-semibold text-yellow-600">85%</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">Maria Garcia</div>
              <div className="text-sm text-gray-600 mb-2">Electronics Specialist</div>
              <div className="space-y-1">
                <div className="text-sm">Completion rate: <span className="font-semibold text-green-600">96.7%</span></div>
                <div className="text-sm">Avg time: <span className="font-semibold text-blue-600">4.2h</span></div>
                <div className="text-sm">Current workload: <span className="font-semibold text-red-600">92%</span></div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold">David Wilson</div>
              <div className="text-sm text-gray-600 mb-2">Imaging Tech</div>
              <div className="space-y-1">
                <div className="text-sm">Completion rate: <span className="font-semibold text-green-600">94.1%</span></div>
                <div className="text-sm">Avg time: <span className="font-semibold text-blue-600">4.6h</span></div>
                <div className="text-sm">Current workload: <span className="font-semibold text-green-600">72%</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
