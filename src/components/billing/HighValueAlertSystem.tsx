
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  DollarSign,
  Crown,
  Shield,
  Clock,
  User,
  Building,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface HighValueAlert {
  id: string;
  patient: {
    name: string;
    category: 'VIP' | 'Corporate' | 'International' | 'Insurance';
    priority: 'High' | 'Critical' | 'Emergency';
  };
  procedure: string;
  estimatedCost: number;
  actualCost?: number;
  department: string;
  doctor: string;
  alertTriggers: string[];
  approvals: Array<{
    role: string;
    name: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    timestamp?: string;
    notes?: string;
  }>;
  status: 'Alert Triggered' | 'Under Review' | 'Approved' | 'Escalated' | 'Resolved';
  createdAt: string;
  deadline: string;
}

export const HighValueAlertSystem = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const highValueAlerts: HighValueAlert[] = [
    {
      id: 'HVA001',
      patient: {
        name: 'John Doe',
        category: 'VIP',
        priority: 'Critical'
      },
      procedure: 'Complex Cardiac Surgery',
      estimatedCost: 45000.00,
      department: 'Cardiothoracic Surgery',
      doctor: 'Dr. Williams',
      alertTriggers: ['Amount > $10,000', 'VIP Patient', 'High-risk procedure'],
      approvals: [
        { role: 'Department Head', name: 'Dr. Smith', status: 'Approved', timestamp: '2024-06-01 10:30', notes: 'Medically necessary' },
        { role: 'Finance Manager', name: 'Ms. Johnson', status: 'Approved', timestamp: '2024-06-01 11:00' },
        { role: 'Medical Director', name: 'Dr. Brown', status: 'Pending', notes: 'Reviewing case complexity' },
        { role: 'Insurance Coordinator', name: 'Mr. Davis', status: 'Pending' }
      ],
      status: 'Under Review',
      createdAt: '2024-06-01 09:45',
      deadline: '2024-06-01 16:00'
    },
    {
      id: 'HVA002',
      patient: {
        name: 'Jane Wilson',
        category: 'International',
        priority: 'High'
      },
      procedure: 'Neurosurgical Intervention',
      estimatedCost: 28500.00,
      actualCost: 31200.00,
      department: 'Neurosurgery',
      doctor: 'Dr. Martinez',
      alertTriggers: ['Amount > $10,000', 'International Patient', 'Cost variance > 10%'],
      approvals: [
        { role: 'Department Head', name: 'Dr. Garcia', status: 'Approved', timestamp: '2024-06-01 08:15' },
        { role: 'Finance Manager', name: 'Ms. Johnson', status: 'Approved', timestamp: '2024-06-01 08:45' },
        { role: 'Medical Director', name: 'Dr. Brown', status: 'Approved', timestamp: '2024-06-01 09:30' }
      ],
      status: 'Approved',
      createdAt: '2024-06-01 08:00',
      deadline: '2024-06-01 12:00'
    }
  ];

  const getPatientCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'VIP': Crown,
      'Corporate': Building,
      'International': User,
      'Insurance': Shield
    };
    return icons[category] || User;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: { [key: string]: string } = {
      'High': 'bg-amber-100 text-amber-800',
      'Critical': 'bg-red-100 text-red-800',
      'Emergency': 'bg-purple-100 text-purple-800'
    };
    return variants[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Alert Triggered': 'bg-red-100 text-red-800',
      'Under Review': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-green-100 text-green-800',
      'Escalated': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getApprovalStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'Pending': Clock,
      'Approved': CheckCircle,
      'Rejected': XCircle
    };
    return icons[status] || Clock;
  };

  const calculateApprovalProgress = (approvals: any[]) => {
    const approved = approvals.filter(a => a.status === 'Approved').length;
    return (approved / approvals.length) * 100;
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Overdue';
    if (diffHours <= 2) return `${diffHours}h remaining`;
    return `${diffHours}h remaining`;
  };

  const handleApprove = (alertId: string, role: string) => {
    console.log(`Approving alert ${alertId} for role ${role}`);
  };

  const handleReject = (alertId: string, role: string) => {
    console.log(`Rejecting alert ${alertId} for role ${role}`);
  };

  const handleEscalate = (alertId: string) => {
    console.log(`Escalating alert ${alertId}`);
  };

  const filteredAlerts = filterStatus === 'all' 
    ? highValueAlerts 
    : highValueAlerts.filter(alert => alert.status.toLowerCase().includes(filterStatus.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">High-Value Alert System</h2>
          <p className="text-gray-600">Automated alerts and approvals for high-value transactions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <Bell className="w-4 h-4" />
            <span>{filteredAlerts.filter(a => a.status === 'Alert Triggered' || a.status === 'Under Review').length} active alerts</span>
          </div>
          
          <select 
            className="px-3 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Alerts</option>
            <option value="triggered">Alert Triggered</option>
            <option value="review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-red-600">
                  ${highValueAlerts.reduce((sum, alert) => sum + alert.estimatedCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-purple-600">
                  {highValueAlerts.filter(a => a.patient.priority === 'Critical').length}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VIP Patients</p>
                <p className="text-3xl font-bold text-amber-600">
                  {highValueAlerts.filter(a => a.patient.category === 'VIP').length}
                </p>
              </div>
              <Crown className="w-12 h-12 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-blue-600">
                  {highValueAlerts.reduce((sum, alert) => 
                    sum + alert.approvals.filter(a => a.status === 'Pending').length, 0
                  )}
                </p>
              </div>
              <Clock className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Value Alerts List */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => {
          const CategoryIcon = getPatientCategoryIcon(alert.patient.category);
          const approvalProgress = calculateApprovalProgress(alert.approvals);
          const timeRemaining = getTimeRemaining(alert.deadline);
          
          return (
            <Card key={alert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{alert.id} - {alert.patient.name}</CardTitle>
                      <CardDescription>{alert.procedure} - {alert.department}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityBadge(alert.patient.priority)}>
                      {alert.patient.priority}
                    </Badge>
                    <Badge className={getStatusBadge(alert.status)}>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Patient & Cost Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4" />
                      Patient Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-500">Category</label>
                        <p className="font-medium">{alert.patient.category}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Doctor</label>
                        <p className="text-sm">{alert.doctor}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Estimated Cost</label>
                        <p className="text-xl font-bold text-red-600">
                          ${alert.estimatedCost.toLocaleString()}
                        </p>
                      </div>
                      {alert.actualCost && (
                        <div>
                          <label className="text-sm text-gray-500">Actual Cost</label>
                          <p className="text-lg font-semibold text-blue-600">
                            ${alert.actualCost.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alert Triggers */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Alert Triggers</h4>
                    <div className="space-y-2">
                      {alert.alertTriggers.map((trigger, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-700">{trigger}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Deadline</span>
                        <span className={timeRemaining.includes('Overdue') ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          {timeRemaining}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{alert.deadline}</p>
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Approval Progress</h4>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{approvalProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={approvalProgress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      {alert.approvals.map((approval, index) => {
                        const StatusIcon = getApprovalStatusIcon(approval.status);
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4" />
                              <div>
                                <p className="text-sm font-medium">{approval.role}</p>
                                <p className="text-xs text-gray-600">{approval.name}</p>
                              </div>
                            </div>
                            <Badge 
                              className={`text-xs ${
                                approval.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                approval.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {approval.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {alert.status === 'Under Review' && (
                    <>
                      <Button 
                        onClick={() => handleApprove(alert.id, 'current')}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      
                      <Button 
                        onClick={() => handleReject(alert.id, 'current')}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    onClick={() => handleEscalate(alert.id)}
                    variant="outline"
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
