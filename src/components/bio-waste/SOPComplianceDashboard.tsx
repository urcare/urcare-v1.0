
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Settings
} from 'lucide-react';

export const SOPComplianceDashboard = () => {
  const complianceMetrics = {
    overall: 94,
    wasteSegregation: 98,
    documentation: 92,
    training: 88,
    equipment: 96
  };

  const violations = [
    {
      id: 'V001',
      type: 'Improper Segregation',
      location: 'Ward B - Room 205',
      severity: 'Medium',
      timestamp: '2024-06-04 14:30:00',
      status: 'open',
      assignedTo: 'Compliance Officer - Mohan Singh',
      correctedAction: 'Re-training scheduled for staff'
    },
    {
      id: 'V002',
      type: 'Missing Documentation',
      location: 'Operating Room 3',
      severity: 'High',
      timestamp: '2024-06-04 12:15:00',
      status: 'resolved',
      assignedTo: 'Documentation Lead - Priya Kumari',
      correctedAction: 'Documentation system updated'
    },
    {
      id: 'V003',
      type: 'PPE Compliance',
      location: 'Laboratory Section',
      severity: 'Low',
      timestamp: '2024-06-04 10:45:00',
      status: 'in-progress',
      assignedTo: 'Safety Officer - Rajesh Kumar',
      correctedAction: 'Additional PPE stations installed'
    }
  ];

  const sopChecklists = [
    {
      id: 'SOP001',
      name: 'Daily Waste Collection',
      compliance: 96,
      lastUpdate: '2024-06-04 09:00:00',
      items: 12,
      violations: 1
    },
    {
      id: 'SOP002',
      name: 'Waste Segregation Protocol',
      compliance: 92,
      lastUpdate: '2024-06-04 08:30:00',
      items: 8,
      violations: 2
    },
    {
      id: 'SOP003',
      name: 'PPE Usage Guidelines',
      compliance: 88,
      lastUpdate: '2024-06-04 07:45:00',
      items: 6,
      violations: 1
    },
    {
      id: 'SOP004',
      name: 'Documentation Requirements',
      compliance: 94,
      lastUpdate: '2024-06-04 11:15:00',
      items: 10,
      violations: 1
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const config = {
      Low: { className: 'bg-green-100 text-green-800' },
      Medium: { className: 'bg-yellow-100 text-yellow-800' },
      High: { className: 'bg-red-100 text-red-800' },
      Critical: { className: 'bg-purple-100 text-purple-800' }
    };
    return <Badge className={config[severity].className}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      open: { label: 'Open', className: 'bg-red-100 text-red-800' },
      'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' }
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">SOP Compliance Dashboard</h3>
          <p className="text-gray-600">Automated checklists, violation detection, and corrective actions</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure SOPs
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{complianceMetrics.overall}%</div>
              <div className="text-sm text-gray-600">Overall Compliance</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{complianceMetrics.wasteSegregation}%</div>
              <div className="text-xs text-gray-600 mb-2">Waste Segregation</div>
              <Progress value={complianceMetrics.wasteSegregation} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{complianceMetrics.documentation}%</div>
              <div className="text-xs text-gray-600 mb-2">Documentation</div>
              <Progress value={complianceMetrics.documentation} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{complianceMetrics.training}%</div>
              <div className="text-xs text-gray-600 mb-2">Training</div>
              <Progress value={complianceMetrics.training} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{complianceMetrics.equipment}%</div>
              <div className="text-xs text-gray-600 mb-2">Equipment</div>
              <Progress value={complianceMetrics.equipment} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SOP Checklists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Automated SOP Checklists
          </CardTitle>
          <CardDescription>Real-time compliance monitoring and automated checks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sopChecklists.map((sop) => (
              <div key={sop.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{sop.name}</h4>
                    <p className="text-sm text-gray-600">
                      {sop.items} items • {sop.violations} violations • Updated: {sop.lastUpdate}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{sop.compliance}%</div>
                    <Progress value={sop.compliance} className="w-24 h-2" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Checklist</Button>
                  <Button size="sm" variant="outline">Run Check</Button>
                  {sop.violations > 0 && (
                    <Button size="sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      View Violations
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Violation Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Violation Detection & Management
          </CardTitle>
          <CardDescription>Track compliance violations and corrective actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violations.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{violation.type}</h4>
                      {getSeverityBadge(violation.severity)}
                      {getStatusBadge(violation.status)}
                    </div>
                    <p className="text-sm text-gray-600">{violation.location}</p>
                    <p className="text-sm text-gray-500">ID: {violation.id} • {violation.timestamp}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {violation.status === 'open' && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {violation.status === 'in-progress' && (
                      <Clock className="w-6 h-6 text-blue-600" />
                    )}
                    {violation.status === 'resolved' && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="ml-2 font-medium">{violation.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Corrective Action:</span>
                    <span className="ml-2">{violation.correctedAction}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">View Details</Button>
                  {violation.status === 'open' && (
                    <Button size="sm">Assign Action</Button>
                  )}
                  {violation.status === 'in-progress' && (
                    <Button size="sm">Mark Resolved</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
