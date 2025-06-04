
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Bell
} from 'lucide-react';

interface SOPCompliance {
  id: string;
  sopName: string;
  department: string;
  complianceRate: number;
  lastAudit: string;
  nextAudit: string;
  violations: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  assignedStaff: number;
  completedTraining: number;
}

const mockCompliance: SOPCompliance[] = [
  {
    id: 'SOP001',
    sopName: 'Infection Control Protocol',
    department: 'ICU',
    complianceRate: 96,
    lastAudit: '2024-01-15',
    nextAudit: '2024-02-15',
    violations: 2,
    status: 'compliant',
    assignedStaff: 25,
    completedTraining: 24
  },
  {
    id: 'SOP002',
    sopName: 'Medication Administration',
    department: 'General Ward',
    complianceRate: 89,
    lastAudit: '2024-01-20',
    nextAudit: '2024-02-20',
    violations: 5,
    status: 'warning',
    assignedStaff: 18,
    completedTraining: 16
  },
  {
    id: 'SOP003',
    sopName: 'Emergency Response',
    department: 'Emergency',
    complianceRate: 75,
    lastAudit: '2024-01-10',
    nextAudit: '2024-02-10',
    violations: 8,
    status: 'non-compliant',
    assignedStaff: 22,
    completedTraining: 18
  }
];

export const SOPComplianceDashboard = () => {
  const [compliance] = useState<SOPCompliance[]>(mockCompliance);
  const [selectedSOP, setSelectedSOP] = useState<SOPCompliance | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'non-compliant': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'non-compliant': return AlertCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            SOP Compliance Dashboard
          </CardTitle>
          <CardDescription>
            Automated compliance monitoring with performance tracking and violation alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {compliance.filter(s => s.status === 'compliant').length}
                    </p>
                    <p className="text-sm text-gray-600">Compliant SOPs</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {compliance.filter(s => s.status === 'warning').length}
                    </p>
                    <p className="text-sm text-gray-600">Warnings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {compliance.filter(s => s.status === 'non-compliant').length}
                    </p>
                    <p className="text-sm text-gray-600">Non-Compliant</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                    <p className="text-sm text-gray-600">Avg Compliance</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SOP Compliance Status</h3>
              {compliance.map((sop) => {
                const StatusIcon = getStatusIcon(sop.status);
                return (
                  <Card 
                    key={sop.id} 
                    className={`cursor-pointer transition-colors ${selectedSOP?.id === sop.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                    onClick={() => setSelectedSOP(sop)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{sop.sopName}</h4>
                          <p className="text-sm text-gray-600 mb-1">{sop.department}</p>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {sop.complianceRate}% Compliance
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(sop.status)}>
                          {sop.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Compliance Rate</span>
                          <span className="font-bold">{sop.complianceRate}%</span>
                        </div>
                        <Progress value={sop.complianceRate} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-3 text-sm">
                          <div className="flex items-center gap-1 text-gray-500">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{sop.violations} violations</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Users className="h-3 w-3" />
                            <span>{sop.completedTraining}/{sop.assignedStaff} trained</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedSOP ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSOP.sopName}</CardTitle>
                    <CardDescription>{selectedSOP.department} Department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Compliance Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Rate: <strong>{selectedSOP.complianceRate}%</strong></p>
                            <p>Violations: <strong>{selectedSOP.violations}</strong></p>
                            <p>Status: <strong>{selectedSOP.status}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Training Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Staff: <strong>{selectedSOP.assignedStaff}</strong></p>
                            <p>Trained: <strong>{selectedSOP.completedTraining}</strong></p>
                            <p>Pending: <strong>{selectedSOP.assignedStaff - selectedSOP.completedTraining}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Audit Schedule</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>Last Audit: {selectedSOP.lastAudit}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
                            <Bell className="h-4 w-4 text-green-600" />
                            <span>Next Audit: {selectedSOP.nextAudit}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Automated Recommendations</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-yellow-50 p-2 rounded">
                            <p className="font-medium text-yellow-800">Training Alert</p>
                            <p className="text-yellow-700">
                              {selectedSOP.assignedStaff - selectedSOP.completedTraining} staff members need compliance training
                            </p>
                          </div>
                          <div className="text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium text-blue-800">Process Improvement</p>
                            <p className="text-blue-700">
                              Review violation patterns to identify improvement opportunities
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <FileText className="h-4 w-4 mr-1" />
                          View SOP Details
                        </Button>
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-1" />
                          Schedule Training
                        </Button>
                        <Button variant="outline">
                          <Bell className="h-4 w-4 mr-1" />
                          Set Reminders
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an SOP to view detailed compliance metrics and recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
