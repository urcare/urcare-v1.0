
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  UserCheck, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Zap,
  Users,
  Building
} from 'lucide-react';

interface DischargeCase {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  admissionDate: string;
  dischargeReadiness: number;
  billingStatus: 'Complete' | 'Pending' | 'In Progress';
  pendingItems: string[];
  totalBill: number;
  clearanceStatus: 'Cleared' | 'Pending' | 'Blocked';
  estimatedDischarge: string;
}

interface WorkflowStep {
  step: string;
  status: 'Complete' | 'In Progress' | 'Pending';
  assignedTo: string;
  timeEstimate: string;
}

export const BillToDischargeIntegration = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ready' | 'pending' | 'blocked'>('all');

  const dischargeCases: DischargeCase[] = [
    {
      id: 'DC001',
      patientName: 'John Doe',
      patientId: 'REG001234',
      department: 'Cardiology',
      admissionDate: '2024-05-28',
      dischargeReadiness: 85,
      billingStatus: 'Pending',
      pendingItems: ['Final consultation fee', 'Pharmacy charges'],
      totalBill: 12500.00,
      clearanceStatus: 'Pending',
      estimatedDischarge: '2024-06-02 14:00'
    },
    {
      id: 'DC002',
      patientName: 'Jane Wilson',
      patientId: 'REG001235',
      department: 'Surgery',
      admissionDate: '2024-05-30',
      dischargeReadiness: 95,
      billingStatus: 'Complete',
      pendingItems: [],
      totalBill: 25600.00,
      clearanceStatus: 'Cleared',
      estimatedDischarge: '2024-06-01 16:30'
    },
    {
      id: 'DC003',
      patientName: 'Bob Chen',
      patientId: 'REG001236',
      department: 'ICU',
      admissionDate: '2024-05-25',
      dischargeReadiness: 45,
      billingStatus: 'In Progress',
      pendingItems: ['ICU charges', 'Equipment charges', 'Specialist consultation'],
      totalBill: 45800.00,
      clearanceStatus: 'Blocked',
      estimatedDischarge: '2024-06-03 10:00'
    }
  ];

  const workflowSteps: WorkflowStep[] = [
    { step: 'Medical Clearance', status: 'Complete', assignedTo: 'Dr. Smith', timeEstimate: '30 min' },
    { step: 'Billing Compilation', status: 'In Progress', assignedTo: 'Finance Team', timeEstimate: '45 min' },
    { step: 'Insurance Processing', status: 'Pending', assignedTo: 'TPA Coordinator', timeEstimate: '2 hours' },
    { step: 'Final Bill Generation', status: 'Pending', assignedTo: 'Billing System', timeEstimate: '15 min' },
    { step: 'Patient Settlement', status: 'Pending', assignedTo: 'Cash Counter', timeEstimate: '30 min' },
    { step: 'Discharge Summary', status: 'Pending', assignedTo: 'Medical Records', timeEstimate: '20 min' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Complete': 'bg-green-100 text-green-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Cleared': 'bg-green-100 text-green-800',
      'Blocked': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      'Complete': CheckCircle,
      'Cleared': CheckCircle,
      'Pending': Clock,
      'In Progress': Clock,
      'Blocked': AlertTriangle
    };
    return icons[status] || Clock;
  };

  const filteredCases = dischargeCases.filter(case_ => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'ready') return case_.dischargeReadiness >= 90;
    if (selectedFilter === 'pending') return case_.billingStatus === 'Pending';
    if (selectedFilter === 'blocked') return case_.clearanceStatus === 'Blocked';
    return true;
  });

  const totalCases = dischargeCases.length;
  const readyForDischarge = dischargeCases.filter(c => c.dischargeReadiness >= 90).length;
  const blockedDischarges = dischargeCases.filter(c => c.clearanceStatus === 'Blocked').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bill-to-Discharge Integration</h2>
          <p className="text-gray-600">Streamlined discharge workflow with billing clearance</p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'ready', 'pending', 'blocked'] as const).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={selectedFilter === filter ? 'bg-blue-600' : ''}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-blue-600">{totalCases}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready for Discharge</p>
                <p className="text-3xl font-bold text-green-600">{readyForDischarge}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked Discharges</p>
                <p className="text-3xl font-bold text-red-600">{blockedDischarges}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                <p className="text-3xl font-bold text-purple-600">3.2h</p>
              </div>
              <Clock className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discharge Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Discharge Workflow</CardTitle>
          <CardDescription>Step-by-step discharge process with time estimates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => {
              const StatusIcon = getStatusIcon(step.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.step}</h3>
                      <p className="text-sm text-gray-600">Assigned to: {step.assignedTo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Est. Time</p>
                      <p className="font-medium">{step.timeEstimate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={getStatusBadge(step.status)}>
                        {step.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Discharge Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Discharge Cases</CardTitle>
          <CardDescription>Real-time tracking of discharge readiness and billing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map((case_) => {
              const StatusIcon = getStatusIcon(case_.clearanceStatus);
              
              return (
                <div key={case_.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{case_.patientName}</h3>
                        <p className="text-sm text-gray-600">{case_.patientId} • {case_.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={getStatusBadge(case_.clearanceStatus)}>
                        {case_.clearanceStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Admission Date</p>
                      <p className="font-medium">{case_.admissionDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Bill</p>
                      <p className="font-semibold text-blue-600">${case_.totalBill.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Discharge</p>
                      <p className="font-medium">{case_.estimatedDischarge}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Billing Status</p>
                      <Badge className={getStatusBadge(case_.billingStatus)}>
                        {case_.billingStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Discharge Readiness</span>
                      <span className="text-sm font-semibold">{case_.dischargeReadiness}%</span>
                    </div>
                    <Progress value={case_.dischargeReadiness} className="h-3" />
                  </div>

                  {case_.pendingItems.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Pending Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {case_.pendingItems.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-amber-600 border-amber-600">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Bill
                    </Button>
                    
                    {case_.billingStatus === 'Complete' && case_.clearanceStatus === 'Cleared' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Auto Discharge
                      </Button>
                    )}
                    
                    {case_.clearanceStatus === 'Blocked' && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Resolve Issues
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
