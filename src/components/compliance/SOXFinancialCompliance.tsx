
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  FileText,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

export const SOXFinancialCompliance = () => {
  const [controlTesting, setControlTesting] = useState([
    {
      id: 'CT001',
      control: 'Revenue Recognition Controls',
      type: 'Automated',
      frequency: 'Daily',
      lastTested: '2024-01-22',
      status: 'Passed',
      effectiveness: 'Effective',
      deficiencies: 0
    },
    {
      id: 'CT002',
      control: 'Financial Reporting Close Process',
      type: 'Manual',
      frequency: 'Monthly',
      lastTested: '2024-01-15',
      status: 'Failed',
      effectiveness: 'Needs Improvement',
      deficiencies: 2
    },
    {
      id: 'CT003',
      control: 'Access Controls - Financial Systems',
      type: 'IT General Controls',
      frequency: 'Quarterly',
      lastTested: '2024-01-10',
      status: 'Passed',
      effectiveness: 'Effective',
      deficiencies: 0
    }
  ]);

  const [auditTrails, setAuditTrails] = useState([
    {
      id: 'AT001',
      transaction: 'Journal Entry Approval',
      user: 'finance.manager@hospital.com',
      amount: '$125,000',
      timestamp: '2024-01-22 14:30:00',
      approval: 'CFO Approved',
      segregation: 'Compliant'
    },
    {
      id: 'AT002',
      transaction: 'Expense Reimbursement',
      user: 'dept.head@hospital.com',
      amount: '$3,450',
      timestamp: '2024-01-22 11:15:00',
      approval: 'Auto-Approved',
      segregation: 'Compliant'
    },
    {
      id: 'AT003',
      transaction: 'Budget Adjustment',
      user: 'budget.analyst@hospital.com',
      amount: '$50,000',
      timestamp: '2024-01-22 09:45:00',
      approval: 'Pending Review',
      segregation: 'Under Review'
    }
  ]);

  const complianceMetrics = {
    overallCompliance: 95.1,
    controlsEffective: 42,
    totalControls: 47,
    criticalDeficiencies: 1,
    significantDeficiencies: 3,
    auditReadiness: 87.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Effective': return 'bg-green-100 text-green-800';
      case 'Needs Improvement': return 'bg-yellow-100 text-yellow-800';
      case 'Ineffective': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* SOX Compliance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{complianceMetrics.overallCompliance}%</div>
            <div className="text-sm text-gray-600">SOX Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{complianceMetrics.controlsEffective}</div>
            <div className="text-sm text-gray-600">Effective Controls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{complianceMetrics.criticalDeficiencies}</div>
            <div className="text-sm text-gray-600">Critical Deficiencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{complianceMetrics.auditReadiness}%</div>
            <div className="text-sm text-gray-600">Audit Readiness</div>
          </CardContent>
        </Card>
      </div>

      {/* Control Testing Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Financial Controls Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controlTesting.map((control) => (
              <div key={control.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{control.control}</div>
                    <div className="text-sm text-gray-600">{control.type} • {control.frequency}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(control.status)}>
                      {control.status}
                    </Badge>
                    <Badge className={getEffectivenessColor(control.effectiveness)}>
                      {control.effectiveness}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Control ID</div>
                    <div className="font-medium">{control.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Tested</div>
                    <div className="font-medium">{control.lastTested}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Deficiencies</div>
                    <div className="font-medium">{control.deficiencies}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Test Control
                    </Button>
                    {control.deficiencies > 0 && (
                      <Button size="sm" variant="destructive">
                        Address Issues
                      </Button>
                    )}
                  </div>
                </div>

                {control.deficiencies > 0 && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {control.deficiencies} deficiencies identified - remediation required
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Control Effectiveness Rate</div>
                <div className="text-sm text-gray-600">
                  {complianceMetrics.controlsEffective} of {complianceMetrics.totalControls} controls effective
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((complianceMetrics.controlsEffective / complianceMetrics.totalControls) * 100)}%
              </div>
            </div>
            <Progress 
              value={(complianceMetrics.controlsEffective / complianceMetrics.totalControls) * 100} 
              className="mt-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail & Transaction Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditTrails.map((trail) => (
              <div key={trail.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{trail.transaction}</div>
                    <div className="text-sm text-gray-600">{trail.user}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{trail.amount}</Badge>
                    <Badge className={trail.segregation === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {trail.segregation}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Transaction ID</div>
                    <div className="font-medium">{trail.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Timestamp</div>
                    <div className="font-medium">{trail.timestamp}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Approval Status</div>
                    <div className="font-medium">{trail.approval}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Review Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SOX Compliance Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Quarterly Report Status</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Management Assessment</span>
                    <span className="text-sm font-medium text-green-600">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Testing Documentation</span>
                    <span className="text-sm font-medium text-blue-600">In Progress</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Deficiency Remediation</span>
                    <span className="text-sm font-medium text-yellow-600">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">External Auditor Review</span>
                    <span className="text-sm font-medium text-gray-600">Scheduled</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Generate Compliance Report
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Action Required</span>
                </div>
                <div className="text-sm text-yellow-700">
                  {complianceMetrics.criticalDeficiencies} critical deficiency requires immediate attention before quarter-end reporting.
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Upcoming Deadlines</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Control Testing Completion</span>
                    <span className="font-medium">Feb 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Management Assessment</span>
                    <span className="font-medium">Feb 28, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SOX Report Filing</span>
                    <span className="font-medium">Mar 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
