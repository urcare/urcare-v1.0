
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Lock,
  Shield,
  Eye,
  CheckCircle,
  AlertTriangle,
  Settings,
  FileText,
  Search
} from 'lucide-react';

export const PrivacyByDesignInterface = () => {
  const [privacyPatterns, setPrivacyPatterns] = useState([
    {
      id: 'PP001',
      name: 'Data Minimization',
      category: 'Collection',
      description: 'Collect only necessary data for specific purpose',
      implementation: 'Form field validation and purpose-based collection',
      compliance: ['GDPR', 'CCPA'],
      status: 'Implemented',
      coverage: 85.2
    },
    {
      id: 'PP002',
      name: 'Purpose Limitation',
      category: 'Processing',
      description: 'Use data only for stated purposes',
      implementation: 'Access controls and usage monitoring',
      compliance: ['GDPR', 'HIPAA'],
      status: 'Partially Implemented',
      coverage: 72.8
    },
    {
      id: 'PP003',
      name: 'Storage Limitation',
      category: 'Retention',
      description: 'Retain data only as long as necessary',
      implementation: 'Automated retention policies and deletion',
      compliance: ['GDPR', 'SOX'],
      status: 'Under Development',
      coverage: 45.1
    }
  ]);

  const [privacyAssessments, setPrivacyAssessments] = useState([
    {
      id: 'PIA001',
      project: 'New Patient Portal',
      dataTypes: ['PHI', 'Contact Information', 'Financial Data'],
      riskLevel: 'High',
      completionStatus: 'In Progress',
      assessor: 'Privacy Officer',
      dueDate: '2024-01-30',
      mitigations: 5
    },
    {
      id: 'PIA002',
      project: 'Analytics Dashboard Enhancement',
      dataTypes: ['Anonymized Health Data', 'Usage Statistics'],
      riskLevel: 'Medium',
      completionStatus: 'Completed',
      assessor: 'Data Protection Team',
      dueDate: '2024-01-25',
      mitigations: 3
    },
    {
      id: 'PIA003',
      project: 'Third-Party Integration',
      dataTypes: ['Patient Demographics', 'Appointment Data'],
      riskLevel: 'High',
      completionStatus: 'Pending Review',
      assessor: 'Privacy Officer',
      dueDate: '2024-02-05',
      mitigations: 8
    }
  ]);

  const [complianceChecks, setComplianceChecks] = useState([
    {
      regulation: 'GDPR',
      articles: ['Art. 25 - Data Protection by Design', 'Art. 32 - Security Measures'],
      compliance: 92.5,
      lastCheck: '2024-01-20',
      issues: 3,
      status: 'Compliant'
    },
    {
      regulation: 'HIPAA',
      articles: ['164.312 - Technical Safeguards', '164.308 - Administrative Safeguards'],
      compliance: 88.7,
      lastCheck: '2024-01-18',
      issues: 7,
      status: 'Minor Issues'
    },
    {
      regulation: 'CCPA',
      articles: ['1798.100 - Consumer Rights', '1798.115 - Disclosure Requirements'],
      compliance: 95.2,
      lastCheck: '2024-01-22',
      issues: 1,
      status: 'Compliant'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Implemented': return 'bg-green-100 text-green-800';
      case 'Partially Implemented': return 'bg-yellow-100 text-yellow-800';
      case 'Under Development': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending Review': return 'bg-orange-100 text-orange-800';
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Minor Issues': return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy by Design Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">Privacy Patterns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Active PIAs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">92.1%</div>
            <div className="text-sm text-gray-600">Privacy Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">11</div>
            <div className="text-sm text-gray-600">Open Issues</div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Design Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Design Patterns
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Settings className="h-3 w-3 mr-1" />
              New Pattern
            </Button>
            <Button size="sm" variant="outline">
              <Search className="h-3 w-3 mr-1" />
              Pattern Library
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privacyPatterns.map((pattern) => (
              <div key={pattern.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{pattern.name}</div>
                    <div className="text-sm text-gray-600">Category: {pattern.category} | ID: {pattern.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(pattern.status)}>
                      {pattern.status}
                    </Badge>
                    <div className="text-sm font-medium">{pattern.coverage}% Coverage</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="text-sm">{pattern.description}</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Implementation</div>
                  <div className="bg-gray-50 p-2 rounded text-sm">{pattern.implementation}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {pattern.compliance.map((comp, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Impact Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Privacy Impact Assessments
          </CardTitle>
          <Button size="sm">
            <FileText className="h-3 w-3 mr-1" />
            New PIA
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {privacyAssessments.map((pia) => (
              <div key={pia.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{pia.project}</div>
                    <div className="text-sm text-gray-600">PIA ID: {pia.id} | Assessor: {pia.assessor}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(pia.riskLevel)}>
                      {pia.riskLevel} Risk
                    </Badge>
                    <Badge className={getStatusColor(pia.completionStatus)}>
                      {pia.completionStatus}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Data Types</div>
                    <div className="flex flex-wrap gap-1">
                      {pia.dataTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Due Date</div>
                    <div className="font-medium">{pia.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Mitigations Identified</div>
                    <div className="font-medium">{pia.mitigations}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Assessment
                  </Button>
                  {pia.completionStatus === 'Pending Review' && (
                    <Button size="sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Review PIA
                    </Button>
                  )}
                  {pia.completionStatus === 'In Progress' && (
                    <Button size="sm" variant="outline">
                      Continue Assessment
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Privacy Compliance Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceChecks.map((check, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{check.regulation}</div>
                    <div className="text-sm text-gray-600">Last Check: {check.lastCheck}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(check.status)}>
                      {check.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{check.compliance}%</div>
                      <div className="text-xs text-gray-600">Compliance</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">Relevant Articles</div>
                  <div className="flex flex-wrap gap-1">
                    {check.articles.map((article, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {article}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Outstanding Issues:</span>
                    <span className={`font-medium ml-1 ${check.issues > 5 ? 'text-red-600' : check.issues > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {check.issues}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Report
                    </Button>
                    {check.issues > 0 && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Address Issues
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Assessment Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Quick Privacy Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" placeholder="Enter project name" />
              </div>
              <div>
                <Label htmlFor="dataProcessing">Data Processing Type</Label>
                <Input id="dataProcessing" placeholder="Collection/Processing/Storage" />
              </div>
              <div>
                <Label htmlFor="dataSubjects">Data Subjects</Label>
                <Input id="dataSubjects" placeholder="Patients/Staff/Visitors" />
              </div>
              <Button className="w-full">
                Start Privacy Assessment
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Privacy Principles Checklist</div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Proactive not Reactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Privacy as the Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Full Functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>End-to-End Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Visibility and Transparency</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
