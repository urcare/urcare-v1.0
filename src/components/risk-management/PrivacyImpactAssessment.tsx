
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search
} from 'lucide-react';

export const PrivacyImpactAssessment = () => {
  const [assessments, setAssessments] = useState([
    {
      id: 'PIA001',
      projectName: 'Patient Portal Enhancement',
      dataTypes: ['Personal Health Info', 'Contact Details', 'Payment Info'],
      riskLevel: 'High',
      status: 'In Progress',
      completionDate: '2024-02-15',
      compliance: 85,
      reviewer: 'Privacy Officer',
      lastUpdated: '2024-01-22'
    },
    {
      id: 'PIA002',
      projectName: 'AI Diagnostic System',
      dataTypes: ['Medical Images', 'Patient History', 'Biometric Data'],
      riskLevel: 'Critical',
      status: 'Under Review',
      completionDate: '2024-02-28',
      compliance: 92,
      reviewer: 'Chief Privacy Officer',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'PIA003',
      projectName: 'Mobile App Update',
      dataTypes: ['Location Data', 'Usage Analytics', 'Device Info'],
      riskLevel: 'Medium',
      status: 'Completed',
      completionDate: '2024-01-30',
      compliance: 96,
      reviewer: 'Data Protection Officer',
      lastUpdated: '2024-01-18'
    }
  ]);

  const [questionnaire, setQuestionnaire] = useState({
    projectName: '',
    dataCollected: '',
    processingPurpose: '',
    dataRetention: '',
    thirdPartySharing: false,
    consentMechanism: '',
    securityMeasures: ''
  });

  const getRiskColor = (level: string) => {
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
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateRiskScore = (assessment: any) => {
    let score = 0;
    if (assessment.riskLevel === 'Critical') score += 40;
    else if (assessment.riskLevel === 'High') score += 30;
    else if (assessment.riskLevel === 'Medium') score += 20;
    else score += 10;
    
    score += assessment.dataTypes.length * 5;
    score = Math.min(100, score);
    return score;
  };

  return (
    <div className="space-y-6">
      {/* PIA Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600">Active PIAs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">7</div>
            <div className="text-sm text-gray-600">High Risk Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Privacy Impact Assessments
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="h-3 w-3 mr-1" />
              New PIA
            </Button>
            <Button size="sm" variant="outline">
              <Search className="h-3 w-3 mr-1" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((pia) => (
              <div key={pia.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{pia.projectName}</div>
                    <div className="text-sm text-gray-600">ID: {pia.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(pia.riskLevel)}>
                      {pia.riskLevel} Risk
                    </Badge>
                    <Badge className={getStatusColor(pia.status)}>
                      {pia.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Data Types Processed</div>
                    <div className="flex flex-wrap gap-1">
                      {pia.dataTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Reviewer</div>
                      <div className="font-medium">{pia.reviewer}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Due Date</div>
                      <div className="font-medium">{pia.completionDate}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Compliance Progress</span>
                    <span>{pia.compliance}%</span>
                  </div>
                  <Progress value={pia.compliance} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Risk Score: <span className="font-medium">{calculateRiskScore(pia)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
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

      {/* Automated Questionnaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Impact Assessment Questionnaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={questionnaire.projectName}
                  onChange={(e) => setQuestionnaire({...questionnaire, projectName: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="dataCollected">Types of Data Collected</Label>
                <Input
                  id="dataCollected"
                  value={questionnaire.dataCollected}
                  onChange={(e) => setQuestionnaire({...questionnaire, dataCollected: e.target.value})}
                  placeholder="e.g., Personal health information, contact details"
                />
              </div>
              <div>
                <Label htmlFor="processingPurpose">Purpose of Processing</Label>
                <Input
                  id="processingPurpose"
                  value={questionnaire.processingPurpose}
                  onChange={(e) => setQuestionnaire({...questionnaire, processingPurpose: e.target.value})}
                  placeholder="Describe the purpose"
                />
              </div>
              <div>
                <Label htmlFor="dataRetention">Data Retention Period</Label>
                <Input
                  id="dataRetention"
                  value={questionnaire.dataRetention}
                  onChange={(e) => setQuestionnaire({...questionnaire, dataRetention: e.target.value})}
                  placeholder="e.g., 7 years, indefinite"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="consentMechanism">Consent Mechanism</Label>
                <Input
                  id="consentMechanism"
                  value={questionnaire.consentMechanism}
                  onChange={(e) => setQuestionnaire({...questionnaire, consentMechanism: e.target.value})}
                  placeholder="How is consent obtained?"
                />
              </div>
              <div>
                <Label htmlFor="securityMeasures">Security Measures</Label>
                <Input
                  id="securityMeasures"
                  value={questionnaire.securityMeasures}
                  onChange={(e) => setQuestionnaire({...questionnaire, securityMeasures: e.target.value})}
                  placeholder="Describe security controls"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-2">Automated Risk Assessment</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Sensitivity:</span>
                    <span className="text-orange-600 font-medium">High</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Risk:</span>
                    <span className="text-red-600 font-medium">Critical</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Compliance Gap:</span>
                    <span className="text-yellow-600 font-medium">Medium</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Generate PIA Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remediation Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Remediation & Compliance Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium">Critical Actions</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Update consent forms for AI processing</div>
                <div>• Implement data encryption at rest</div>
                <div>• Establish data retention policies</div>
                <div>• Conduct privacy training</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Upcoming Deadlines</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>• GDPR compliance review - Feb 15</div>
                <div>• HIPAA audit preparation - Feb 28</div>
                <div>• Staff training completion - Mar 10</div>
                <div>• Policy updates - Mar 15</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Completed Tasks</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>• Data mapping exercise</div>
                <div>• Vendor assessments</div>
                <div>• Access control review</div>
                <div>• Incident response plan</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
