
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Bell
} from 'lucide-react';

export const RegulatoryChangeManagement = () => {
  const [regulatoryChanges, setRegulatoryChanges] = useState([
    {
      id: 'REG001',
      regulation: 'HIPAA Security Rule Update',
      authority: 'HHS',
      effectiveDate: '2024-06-01',
      impactLevel: 'High',
      status: 'Analyzing',
      affectedSystems: ['EHR', 'Patient Portal', 'Billing'],
      complianceGap: 'Medium',
      implementationCost: 125000,
      assignedTo: 'Compliance Team'
    },
    {
      id: 'REG002',
      regulation: 'FDA Medical Device Cybersecurity',
      authority: 'FDA',
      effectiveDate: '2024-09-15',
      impactLevel: 'Critical',
      status: 'Planning',
      affectedSystems: ['Medical Devices', 'Network Infrastructure'],
      complianceGap: 'High',
      implementationCost: 350000,
      assignedTo: 'Security Team'
    },
    {
      id: 'REG003',
      regulation: 'State Privacy Law Amendment',
      authority: 'State Regulatory Board',
      effectiveDate: '2024-03-30',
      impactLevel: 'Medium',
      status: 'Implementing',
      affectedSystems: ['Data Storage', 'Analytics Platform'],
      complianceGap: 'Low',
      implementationCost: 75000,
      assignedTo: 'Legal Department'
    }
  ]);

  const [impactAnalysis, setImpactAnalysis] = useState([
    {
      area: 'Technical Implementation',
      currentState: 'Non-Compliant',
      requiredActions: 8,
      progress: 25,
      dueDate: '2024-05-15'
    },
    {
      area: 'Policy Updates',
      currentState: 'In Progress',
      requiredActions: 12,
      progress: 67,
      dueDate: '2024-04-30'
    },
    {
      area: 'Staff Training',
      currentState: 'Not Started',
      requiredActions: 5,
      progress: 0,
      dueDate: '2024-05-30'
    },
    {
      area: 'Documentation',
      currentState: 'Compliant',
      requiredActions: 3,
      progress: 100,
      dueDate: '2024-04-15'
    }
  ]);

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzing': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Implementing': return 'bg-purple-100 text-purple-800';
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-orange-600';
      case 'Low': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const calculateDaysToDeadline = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Regulatory Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">18</div>
            <div className="text-sm text-gray-600">Active Changes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">Critical Impact</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">32</div>
            <div className="text-sm text-gray-600">Days to Next Deadline</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">78%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Change Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Regulatory Change Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatoryChanges.map((change) => (
              <div key={change.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{change.regulation}</div>
                    <div className="text-sm text-gray-600">
                      {change.authority} - ID: {change.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(change.impactLevel)}>
                      {change.impactLevel} Impact
                    </Badge>
                    <Badge className={getStatusColor(change.status)}>
                      {change.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Effective Date</div>
                    <div className="font-medium">{change.effectiveDate}</div>
                    <div className="text-xs text-orange-600">
                      {calculateDaysToDeadline(change.effectiveDate)} days
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance Gap</div>
                    <div className={`font-medium ${getGapColor(change.complianceGap)}`}>
                      {change.complianceGap}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Implementation Cost</div>
                    <div className="font-medium">${change.implementationCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned To</div>
                    <div className="font-medium">{change.assignedTo}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Analysis
                    </Button>
                    <Button size="sm">
                      Update
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Affected Systems</div>
                  <div className="flex flex-wrap gap-1">
                    {change.affectedSystems.map((system, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Next milestone: <span className="font-medium">Technical assessment completion</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Bell className="h-3 w-3 mr-1" />
                      Set Alert
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Regulatory Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactAnalysis.map((area, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{area.area}</div>
                    <div className="text-sm text-gray-600">
                      {area.requiredActions} required actions | Due: {area.dueDate}
                    </div>
                  </div>
                  <Badge className={getStatusColor(area.currentState)}>
                    {area.currentState}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Implementation Progress</span>
                    <span>{area.progress}%</span>
                  </div>
                  <Progress value={area.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Planning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Automated Policy Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Policy Automation Status</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Privacy Policies</span>
                    <span className="text-green-600">Updated</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Procedures</span>
                    <span className="text-yellow-600">In Progress</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Controls</span>
                    <span className="text-red-600">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incident Response</span>
                    <span className="text-green-600">Compliant</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Implementation Teams</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Technical Team: 5 active projects</div>
                  <div>• Legal Department: 3 policy reviews</div>
                  <div>• Compliance Office: 8 assessments</div>
                  <div>• Training Coordinator: 2 programs</div>
                </div>
              </div>

              <Button className="w-full">
                Generate Implementation Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Compliance Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <div className="font-medium text-red-800 mb-1">Urgent - 30 Days</div>
                <div className="text-sm text-red-700">
                  • FDA Medical Device Cybersecurity assessment
                  <br />
                  • State Privacy Law policy updates
                </div>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <div className="font-medium text-orange-800 mb-1">Important - 60 Days</div>
                <div className="text-sm text-orange-700">
                  • HIPAA Security Rule technical implementation
                  <br />
                  • Staff training program deployment
                </div>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                <div className="font-medium text-yellow-800 mb-1">Monitor - 90 Days</div>
                <div className="text-sm text-yellow-700">
                  • Documentation review completion
                  <br />
                  • Vendor compliance verification
                </div>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <div className="font-medium text-green-800 mb-1">Completed</div>
                <div className="text-sm text-green-700">
                  • Initial impact assessment
                  <br />
                  • Stakeholder notification
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
