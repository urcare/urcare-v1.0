
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Settings
} from 'lucide-react';

export const ComplianceReportingDashboard = () => {
  const [selectedAccreditation, setSelectedAccreditation] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const complianceOverview = {
    overallCompliance: 98.5,
    activeCertifications: 4,
    upcomingInspections: 2,
    openFindings: 3,
    documentsUpToDate: 96.8,
    trainingCompliance: 94.2
  };

  const accreditationStatus = [
    {
      body: 'CAP (College of American Pathologists)',
      status: 'active',
      score: 98.9,
      lastInspection: '2023-08-15',
      nextInspection: '2025-08-15',
      openFindings: 1,
      certificate: 'CAP-2023-789456'
    },
    {
      body: 'CLIA (Clinical Laboratory Improvement)',
      status: 'active',
      score: 97.8,
      lastInspection: '2023-11-20',
      nextInspection: '2025-11-20',
      openFindings: 2,
      certificate: 'CLIA-45D2089567'
    },
    {
      body: 'ISO 15189 Medical Laboratories',
      status: 'active',
      score: 99.2,
      lastInspection: '2023-06-10',
      nextInspection: '2026-06-10',
      openFindings: 0,
      certificate: 'ISO-15189-2023-123'
    },
    {
      body: 'Joint Commission',
      status: 'pending',
      score: 96.5,
      lastInspection: '2023-12-05',
      nextInspection: '2024-12-05',
      openFindings: 0,
      certificate: 'JC-LAB-2024-001'
    }
  ];

  const complianceChecklist = [
    {
      category: 'Personnel Qualifications',
      totalItems: 24,
      completed: 23,
      compliance: 95.8,
      dueItems: 1,
      status: 'warning'
    },
    {
      category: 'Quality Control',
      totalItems: 18,
      completed: 18,
      compliance: 100.0,
      dueItems: 0,
      status: 'excellent'
    },
    {
      category: 'Proficiency Testing',
      totalItems: 12,
      completed: 11,
      compliance: 91.7,
      dueItems: 1,
      status: 'warning'
    },
    {
      category: 'Safety Procedures',
      totalItems: 15,
      completed: 15,
      compliance: 100.0,
      dueItems: 0,
      status: 'excellent'
    },
    {
      category: 'Document Control',
      totalItems: 22,
      completed: 20,
      compliance: 90.9,
      dueItems: 2,
      status: 'warning'
    },
    {
      category: 'Equipment Maintenance',
      totalItems: 16,
      completed: 16,
      compliance: 100.0,
      dueItems: 0,
      status: 'excellent'
    }
  ];

  const upcomingRequirements = [
    {
      requirement: 'Annual QC Review',
      dueDate: '2024-02-15',
      assignedTo: 'Quality Manager',
      priority: 'high',
      progress: 65,
      accreditation: 'CAP'
    },
    {
      requirement: 'Staff Competency Assessment',
      dueDate: '2024-02-28',
      assignedTo: 'Lab Supervisor',
      priority: 'medium',
      progress: 30,
      accreditation: 'CLIA'
    },
    {
      requirement: 'Temperature Log Validation',
      dueDate: '2024-02-10',
      assignedTo: 'Compliance Officer',
      priority: 'high',
      progress: 85,
      accreditation: 'ISO 15189'
    },
    {
      requirement: 'Safety Training Update',
      dueDate: '2024-03-01',
      assignedTo: 'Safety Coordinator',
      priority: 'medium',
      progress: 15,
      accreditation: 'Joint Commission'
    }
  ];

  const auditFindings = [
    {
      id: 'CAP-001',
      finding: 'Temperature monitoring documentation incomplete',
      severity: 'minor',
      correctionPlan: 'Implement automated temperature logging system',
      dueDate: '2024-02-20',
      status: 'in-progress',
      progress: 70
    },
    {
      id: 'CLIA-002',
      finding: 'Personnel qualification records missing',
      severity: 'major',
      correctionPlan: 'Update all personnel files with current qualifications',
      dueDate: '2024-02-15',
      status: 'pending',
      progress: 25
    },
    {
      id: 'CLIA-003',
      finding: 'QC procedure not followed consistently',
      severity: 'minor',
      correctionPlan: 'Retrain staff on QC procedures and implement checklist',
      dueDate: '2024-02-25',
      status: 'in-progress',
      progress: 50
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Compliance Reporting Dashboard</h3>
          <p className="text-gray-600">Accreditation management and regulatory compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedAccreditation} 
            onChange={(e) => setSelectedAccreditation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Accreditations</option>
            <option value="cap">CAP</option>
            <option value="clia">CLIA</option>
            <option value="iso">ISO 15189</option>
            <option value="joint">Joint Commission</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-900">{complianceOverview.overallCompliance}%</p>
            <p className="text-xs text-green-700">Overall Compliance</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-900">{complianceOverview.activeCertifications}</p>
            <p className="text-xs text-blue-700">Active Certifications</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-orange-900">{complianceOverview.upcomingInspections}</p>
            <p className="text-xs text-orange-700">Upcoming Inspections</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-900">{complianceOverview.openFindings}</p>
            <p className="text-xs text-red-700">Open Findings</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-purple-900">{complianceOverview.documentsUpToDate}%</p>
            <p className="text-xs text-purple-700">Documents Current</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-indigo-900">{complianceOverview.trainingCompliance}%</p>
            <p className="text-xs text-indigo-700">Training Compliance</p>
          </CardContent>
        </Card>
      </div>

      {/* Accreditation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Accreditation Status</CardTitle>
          <CardDescription>Current status of all laboratory accreditations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accreditationStatus.map((accred, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                accred.status === 'active' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{accred.body}</h4>
                    <p className="text-sm text-gray-600">Certificate: {accred.certificate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      accred.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                    } text-white text-xs`}>
                      {accred.status}
                    </Badge>
                    <span className="text-lg font-bold text-gray-900">{accred.score}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Inspection</p>
                    <p className="font-medium">{accred.lastInspection}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Next Inspection</p>
                    <p className="font-medium">{accred.nextInspection}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Open Findings</p>
                    <p className={`font-medium ${accred.openFindings > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {accred.openFindings}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
            <CardDescription>Regulatory requirement tracking by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceChecklist.map((category, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{category.category}</h5>
                    <Badge className={`text-xs ${
                      category.status === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white`}>
                      {category.compliance}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Completed</p>
                      <p className="font-medium">{category.completed}/{category.totalItems}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Items</p>
                      <p className={`font-medium ${category.dueItems > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {category.dueItems}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium capitalize">{category.status}</p>
                    </div>
                  </div>
                  <Progress value={category.compliance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Requirements</CardTitle>
            <CardDescription>Pending compliance activities and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRequirements.map((req, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{req.requirement}</h5>
                      <p className="text-sm text-gray-600">Due: {req.dueDate}</p>
                    </div>
                    <Badge className={`text-xs ${
                      req.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    } text-white`}>
                      {req.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-medium">{req.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Accreditation</p>
                      <p className="font-medium">{req.accreditation}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{req.progress}%</span>
                    </div>
                    <Progress value={req.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Open Audit Findings</CardTitle>
          <CardDescription>Current corrective action plans and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditFindings.map((finding, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                finding.severity === 'major' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{finding.id}</h4>
                    <p className="text-sm text-gray-700">{finding.finding}</p>
                  </div>
                  <Badge className={`text-xs ${
                    finding.severity === 'major' ? 'bg-red-500' : 'bg-yellow-500'
                  } text-white`}>
                    {finding.severity}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700">Correction Plan:</p>
                  <p className="text-sm text-gray-600">{finding.correctionPlan}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-medium">{finding.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <Badge variant="outline" className={`text-xs ${
                      finding.status === 'in-progress' ? 'border-blue-500 text-blue-700' : 'border-yellow-500 text-yellow-700'
                    }`}>
                      {finding.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{finding.progress}%</span>
                  </div>
                  <Progress value={finding.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
