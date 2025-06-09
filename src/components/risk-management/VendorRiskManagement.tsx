
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Users,
  Shield
} from 'lucide-react';

export const VendorRiskManagement = () => {
  const [vendors, setVendors] = useState([
    {
      id: 'VEN001',
      name: 'CloudHealth Systems',
      category: 'Healthcare Technology',
      riskScore: 85,
      contractValue: 250000,
      contractExpiry: '2024-12-31',
      status: 'Active',
      lastAssessment: '2024-01-15',
      criticalFindings: 3,
      complianceStatus: 'Non-Compliant',
      businessCriticality: 'High'
    },
    {
      id: 'VEN002',
      name: 'SecureData Inc',
      category: 'Data Security',
      riskScore: 45,
      contractValue: 180000,
      contractExpiry: '2024-08-15',
      status: 'Active',
      lastAssessment: '2024-01-20',
      criticalFindings: 1,
      complianceStatus: 'Compliant',
      businessCriticality: 'Critical'
    },
    {
      id: 'VEN003',
      name: 'MedDevice Corp',
      category: 'Medical Equipment',
      riskScore: 92,
      contractValue: 500000,
      contractExpiry: '2024-06-30',
      status: 'Under Review',
      lastAssessment: '2024-01-10',
      criticalFindings: 5,
      complianceStatus: 'Partial',
      businessCriticality: 'Critical'
    }
  ]);

  const [assessmentWorkflow, setAssessmentWorkflow] = useState([
    {
      step: 'Initial Screening',
      status: 'Completed',
      dueDate: '2024-01-15',
      assignee: 'Procurement Team'
    },
    {
      step: 'Security Assessment',
      status: 'In Progress',
      dueDate: '2024-01-25',
      assignee: 'Security Team'
    },
    {
      step: 'Financial Evaluation',
      status: 'Pending',
      dueDate: '2024-02-01',
      assignee: 'Finance Team'
    },
    {
      step: 'Legal Review',
      status: 'Pending',
      dueDate: '2024-02-05',
      assignee: 'Legal Department'
    }
  ]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-red-100';
    if (score >= 60) return 'bg-orange-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Vendor Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">142</div>
            <div className="text-sm text-gray-600">Active Vendors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">18</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">23</div>
            <div className="text-sm text-gray-600">Contracts Expiring</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Vendor Risk Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-sm text-gray-600">{vendor.category} - ID: {vendor.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getRiskBgColor(vendor.riskScore)} ${getRiskColor(vendor.riskScore)}`}>
                      Risk: {vendor.riskScore}
                    </div>
                    <Badge className={getCriticalityColor(vendor.businessCriticality)}>
                      {vendor.businessCriticality}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Contract Value</div>
                    <div className="font-medium">${vendor.contractValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expires</div>
                    <div className="font-medium">{vendor.contractExpiry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Assessment</div>
                    <div className="font-medium">{vendor.lastAssessment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Critical Findings</div>
                    <div className="font-medium text-red-600">{vendor.criticalFindings}</div>
                  </div>
                  <div>
                    <Badge className={getComplianceColor(vendor.complianceStatus)}>
                      {vendor.complianceStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Next review due: <span className="font-medium">March 15, 2024</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      Assessment
                    </Button>
                    <Button size="sm" variant="outline">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Contract
                    </Button>
                    <Button size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vendor Assessment Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Assessment Steps</h3>
              {assessmentWorkflow.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {step.status === 'Completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : step.status === 'In Progress' ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-gray-600">
                      Due: {step.dueDate} | Assigned: {step.assignee}
                    </div>
                  </div>
                  <Badge className={getStepStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Performance Tracking</h3>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Assessment Progress</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Completion</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Pending Actions</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Security questionnaire responses</div>
                  <div>• Financial documentation review</div>
                  <div>• Insurance certificate verification</div>
                  <div>• Reference checks completion</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Key Metrics</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Avg Assessment Time: 14 days</div>
                  <div>Risk Reduction: 23%</div>
                  <div>Compliance Rate: 89%</div>
                  <div>Contract Renewals: 92%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Lifecycle Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Expiring Soon</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>MedDevice Corp</span>
                  <span className="text-orange-600">60 days</span>
                </div>
                <div className="flex justify-between">
                  <span>TechSupport LLC</span>
                  <span className="text-orange-600">85 days</span>
                </div>
                <div className="flex justify-between">
                  <span>CloudServices Inc</span>
                  <span className="text-red-600">30 days</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Contract Values</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Portfolio</span>
                  <span className="font-medium">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span>High Risk Vendors</span>
                  <span className="text-red-600">$890K</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Contract Value</span>
                  <span>$67K</span>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Performance Metrics</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SLA Compliance</span>
                  <span className="text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Incidents</span>
                  <span className="text-orange-600">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendor Satisfaction</span>
                  <span className="text-green-600">4.2/5</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
