
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Shield
} from 'lucide-react';

export const ClinicalTrialMatching = () => {
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [matchingProgress, setMatchingProgress] = useState({
    eligibilityScreening: 85,
    consentProcess: 70,
    enrollment: 60,
    randomization: 45,
    baselineAssessments: 75,
    treatmentInitiation: 55
  });

  const availableTrials = [
    {
      id: 'NCT05123456',
      title: 'Immunotherapy Combination in Advanced NSCLC',
      phase: 'Phase III',
      sponsor: 'National Cancer Institute',
      primaryEndpoint: 'Overall Survival',
      targetEnrollment: 450,
      currentEnrollment: 287,
      estimatedCompletion: '2025-12-31',
      status: 'recruiting',
      eligibilityCriteria: [
        'Stage IV NSCLC',
        'PD-L1 expression ≥50%',
        'ECOG PS 0-1',
        'Adequate organ function'
      ],
      exclusionCriteria: [
        'Prior immunotherapy',
        'Active autoimmune disease',
        'Brain metastases'
      ]
    },
    {
      id: 'NCT05234567',
      title: 'CAR-T Cell Therapy for Relapsed B-cell Lymphoma',
      phase: 'Phase II',
      sponsor: 'BioPharma Inc.',
      primaryEndpoint: 'Complete Response Rate',
      targetEnrollment: 120,
      currentEnrollment: 89,
      estimatedCompletion: '2024-08-30',
      status: 'recruiting',
      eligibilityCriteria: [
        'Relapsed/refractory B-cell lymphoma',
        'CD19+ tumor expression',
        'Failed ≥2 prior therapies',
        'Adequate cardiac function'
      ],
      exclusionCriteria: [
        'CNS involvement',
        'Prior CAR-T therapy',
        'Active infection'
      ]
    },
    {
      id: 'NCT05345678',
      title: 'Precision Medicine in Pancreatic Cancer',
      phase: 'Phase I/II',
      sponsor: 'University Medical Center',
      primaryEndpoint: 'Safety and Efficacy',
      targetEnrollment: 75,
      currentEnrollment: 34,
      estimatedCompletion: '2025-06-30',
      status: 'recruiting',
      eligibilityCriteria: [
        'Metastatic pancreatic adenocarcinoma',
        'Targetable mutation identified',
        'Progressive disease',
        'Life expectancy >3 months'
      ],
      exclusionCriteria: [
        'Prior targeted therapy for identified mutation',
        'Severe comorbidities',
        'Recent major surgery'
      ]
    }
  ];

  const patientScreening = [
    {
      id: 1,
      patientName: 'Michael Chen',
      age: 67,
      diagnosis: 'NSCLC Stage IV',
      biomarkers: 'PD-L1 75%, EGFR wild-type',
      matchedTrials: ['NCT05123456'],
      screeningStatus: 'eligible',
      consentStatus: 'pending',
      enrollmentDate: null,
      coordinatorNotes: 'Excellent candidate, patient very interested'
    },
    {
      id: 2,
      patientName: 'Sarah Williams',
      age: 52,
      diagnosis: 'Diffuse Large B-cell Lymphoma',
      biomarkers: 'CD19+, Ki-67 85%',
      matchedTrials: ['NCT05234567'],
      screeningStatus: 'screening',
      consentStatus: 'not-started',
      enrollmentDate: null,
      coordinatorNotes: 'Needs cardiac clearance, scheduled for next week'
    },
    {
      id: 3,
      patientName: 'Robert Martinez',
      age: 58,
      diagnosis: 'Pancreatic Adenocarcinoma',
      biomarkers: 'BRCA2 mutation, MSS',
      matchedTrials: ['NCT05345678'],
      screeningStatus: 'enrolled',
      consentStatus: 'completed',
      enrollmentDate: '2024-01-15',
      coordinatorNotes: 'Successfully enrolled, starting treatment cycle 1'
    }
  ];

  const trialDocumentation = [
    {
      trialId: 'NCT05123456',
      documentType: 'Informed Consent',
      version: '3.1',
      lastUpdated: '2024-01-10',
      status: 'current',
      requiredFor: 'All participants'
    },
    {
      trialId: 'NCT05123456',
      documentType: 'Investigator Brochure',
      version: '2.0',
      lastUpdated: '2023-12-15',
      status: 'current',
      requiredFor: 'Site staff'
    },
    {
      trialId: 'NCT05234567',
      documentType: 'Protocol Amendment',
      version: '1.2',
      lastUpdated: '2024-01-20',
      status: 'pending-approval',
      requiredFor: 'IRB review'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'recruiting': return 'bg-green-100 text-green-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'eligible': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'Phase I': return 'bg-blue-100 text-blue-800';
      case 'Phase II': return 'bg-purple-100 text-purple-800';
      case 'Phase III': return 'bg-green-100 text-green-800';
      case 'Phase I/II': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateMatchingProgress = (area) => {
    const newProgress = Math.min(100, matchingProgress[area] + 15);
    setMatchingProgress(prev => ({
      ...prev,
      [area]: newProgress
    }));
  };

  return (
    <div className="space-y-6">
      {/* Available Clinical Trials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Available Clinical Trials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableTrials.map((trial) => (
              <Card 
                key={trial.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedTrial?.id === trial.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedTrial(trial)}
              >
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <h3 className="font-medium">{trial.title}</h3>
                        <p className="text-sm text-gray-600">ID: {trial.id}</p>
                        <p className="text-sm text-gray-600">Sponsor: {trial.sponsor}</p>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <Badge className={getPhaseColor(trial.phase)}>
                            {trial.phase}
                          </Badge>
                          <Badge className={getStatusColor(trial.status)}>
                            {trial.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Primary: {trial.primaryEndpoint}
                        </p>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Enrollment: </span>
                            <span>{trial.currentEnrollment}/{trial.targetEnrollment}</span>
                          </div>
                          <Progress 
                            value={(trial.currentEnrollment / trial.targetEnrollment) * 100} 
                            className="h-2" 
                          />
                          <p className="text-xs text-gray-500">
                            Est. completion: {trial.estimatedCompletion}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Eligibility Criteria:</h4>
                        <div className="space-y-1">
                          {trial.eligibilityCriteria.slice(0, 3).map((criteria, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{criteria}</span>
                            </div>
                          ))}
                          {trial.eligibilityCriteria.length > 3 && (
                            <p className="text-xs text-gray-500">+{trial.eligibilityCriteria.length - 3} more criteria</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Exclusion Criteria:</h4>
                        <div className="space-y-1">
                          {trial.exclusionCriteria.slice(0, 3).map((criteria, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className="text-xs">{criteria}</span>
                            </div>
                          ))}
                          {trial.exclusionCriteria.length > 3 && (
                            <p className="text-xs text-gray-500">+{trial.exclusionCriteria.length - 3} more criteria</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Screening Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Screening & Enrollment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientScreening.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-medium">{patient.patientName}</h3>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                      <p className="text-sm text-gray-600">{patient.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Biomarkers:</p>
                      <p className="text-sm text-gray-600">{patient.biomarkers}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Matched Trials:</p>
                      <div className="space-y-1">
                        {patient.matchedTrials.map((trialId, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {trialId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-600">Screening:</span>
                          <Badge className={getStatusColor(patient.screeningStatus)} size="sm">
                            {patient.screeningStatus}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Consent:</span>
                          <Badge className={getStatusColor(patient.consentStatus)} size="sm">
                            {patient.consentStatus}
                          </Badge>
                        </div>
                        {patient.enrollmentDate && (
                          <p className="text-xs text-gray-600">
                            Enrolled: {patient.enrollmentDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Coordinator Notes:</p>
                      <p className="text-xs text-gray-600">{patient.coordinatorNotes}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trial Management Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Trial Management Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(matchingProgress).map(([area, progress]) => (
                <div key={area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {area.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{progress}%</span>
                      {progress === 100 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : progress >= 75 ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => updateMatchingProgress(area)}
                  >
                    Update Progress
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Trial Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trialDocumentation.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{doc.documentType}</div>
                    <div className="text-xs text-gray-600">
                      {doc.trialId} - Version {doc.version}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {doc.lastUpdated}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getStatusColor(doc.status)} size="sm">
                      {doc.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{doc.requiredFor}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Trial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Clinical Trial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {availableTrials.filter(trial => trial.status === 'recruiting').length}
              </div>
              <div className="text-sm text-gray-600">Active Trials</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {patientScreening.filter(patient => patient.screeningStatus === 'enrolled').length}
              </div>
              <div className="text-sm text-gray-600">Enrolled Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {patientScreening.filter(patient => patient.screeningStatus === 'screening' || patient.screeningStatus === 'eligible').length}
              </div>
              <div className="text-sm text-gray-600">In Screening</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(availableTrials.reduce((total, trial) => 
                  total + (trial.currentEnrollment / trial.targetEnrollment), 0
                ) / availableTrials.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Enrollment</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
