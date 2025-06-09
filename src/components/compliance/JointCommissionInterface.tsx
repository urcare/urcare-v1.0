
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  Search
} from 'lucide-react';

export const JointCommissionInterface = () => {
  const [standardTracking, setStandardTracking] = useState([
    {
      id: 'PC.01.02.07',
      category: 'Patient Care',
      standard: 'Pain Assessment and Management',
      compliance: 94.2,
      lastAssessed: '2024-01-15',
      findings: 1,
      status: 'Compliant',
      evidenceCount: 15,
      nextReview: '2024-07-15'
    },
    {
      id: 'IM.02.01.01',
      category: 'Information Management',
      standard: 'Patient Record Accuracy',
      compliance: 88.7,
      lastAssessed: '2024-01-10',
      findings: 3,
      status: 'Needs Improvement',
      evidenceCount: 12,
      nextReview: '2024-06-10'
    },
    {
      id: 'IC.02.01.01',
      category: 'Infection Control',
      standard: 'Hand Hygiene Program',
      compliance: 96.8,
      lastAssessed: '2024-01-20',
      findings: 0,
      status: 'Compliant',
      evidenceCount: 22,
      nextReview: '2024-08-20'
    }
  ]);

  const [evidenceCollection, setEvidenceCollection] = useState([
    {
      id: 'EV001',
      standard: 'PC.01.02.07',
      type: 'Policy Document',
      title: 'Pain Management Protocol v3.2',
      uploadDate: '2024-01-15',
      reviewer: 'Quality Manager',
      status: 'Approved',
      category: 'Documentation'
    },
    {
      id: 'EV002',
      standard: 'IM.02.01.01',
      type: 'Training Record',
      title: 'EMR Data Entry Training Completion',
      uploadDate: '2024-01-12',
      reviewer: 'Training Coordinator',
      status: 'Under Review',
      category: 'Training'
    },
    {
      id: 'EV003',
      standard: 'IC.02.01.01',
      type: 'Audit Report',
      title: 'Monthly Hand Hygiene Compliance Audit',
      uploadDate: '2024-01-18',
      reviewer: 'Infection Control Nurse',
      status: 'Approved',
      category: 'Performance Data'
    }
  ]);

  const surveyPreparation = {
    overallReadiness: 87.5,
    documentsComplete: 156,
    totalDocuments: 178,
    standardsCompliant: 42,
    totalStandards: 47,
    criticalFindings: 2,
    lastSurvey: '2021-09-15',
    nextSurvey: '2024-09-15'
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Needs Improvement':
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Joint Commission Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{surveyPreparation.overallReadiness}%</div>
            <div className="text-sm text-gray-600">Survey Readiness</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{surveyPreparation.standardsCompliant}</div>
            <div className="text-sm text-gray-600">Compliant Standards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{surveyPreparation.criticalFindings}</div>
            <div className="text-sm text-gray-600">Critical Findings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">238</div>
            <div className="text-sm text-gray-600">Days to Survey</div>
          </CardContent>
        </Card>
      </div>

      {/* Standards Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Joint Commission Standards Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {standardTracking.map((standard) => (
              <div key={standard.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{standard.standard}</div>
                    <div className="text-sm text-gray-600">{standard.id} • {standard.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(standard.status)}>
                      {standard.status}
                    </Badge>
                    {standard.findings > 0 && (
                      <Badge variant="outline">
                        {standard.findings} Findings
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Compliance Score</div>
                    <div className={`font-medium ${getComplianceColor(standard.compliance)}`}>
                      {standard.compliance}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Evidence Items</div>
                    <div className="font-medium">{standard.evidenceCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Review</div>
                    <div className="font-medium">{standard.nextReview}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      View Evidence
                    </Button>
                    {standard.findings > 0 && (
                      <Button size="sm">
                        Address Findings
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Progress</span>
                    <span className="text-sm font-medium">{standard.compliance}%</span>
                  </div>
                  <Progress value={standard.compliance} className="h-2" />
                </div>

                {standard.findings > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {standard.findings} findings require corrective action plan
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Evidence Collection & Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evidenceCollection.map((evidence) => (
              <div key={evidence.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{evidence.title}</div>
                    <div className="text-sm text-gray-600">{evidence.type} • Standard: {evidence.standard}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(evidence.status)}>
                      {evidence.status}
                    </Badge>
                    <Badge variant="outline">
                      {evidence.category}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Evidence ID</div>
                    <div className="font-medium">{evidence.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Upload Date</div>
                    <div className="font-medium">{evidence.uploadDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Reviewer</div>
                    <div className="font-medium">{evidence.reviewer}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Search className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button className="w-full" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Evidence
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Survey Preparation Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Survey Preparation Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Documentation Completeness</span>
                  <span className="text-sm text-gray-600">
                    {surveyPreparation.documentsComplete}/{surveyPreparation.totalDocuments}
                  </span>
                </div>
                <Progress 
                  value={(surveyPreparation.documentsComplete / surveyPreparation.totalDocuments) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Standards Compliance</span>
                  <span className="text-sm text-gray-600">
                    {surveyPreparation.standardsCompliant}/{surveyPreparation.totalStandards}
                  </span>
                </div>
                <Progress 
                  value={(surveyPreparation.standardsCompliant / surveyPreparation.totalStandards) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Survey Readiness</span>
                  <span className="text-sm text-gray-600">{surveyPreparation.overallReadiness}%</span>
                </div>
                <Progress value={surveyPreparation.overallReadiness} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Next Survey</div>
                <div className="text-lg font-bold text-blue-600">{surveyPreparation.nextSurvey}</div>
                <div className="text-sm text-blue-700">238 days remaining</div>
              </div>

              {surveyPreparation.criticalFindings > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Critical Findings</span>
                  </div>
                  <div className="text-sm text-red-700">
                    {surveyPreparation.criticalFindings} critical findings require immediate resolution before survey.
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Button className="w-full">
                  Generate Mock Survey Report
                </Button>
                <Button className="w-full" variant="outline">
                  View Survey Checklist
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
