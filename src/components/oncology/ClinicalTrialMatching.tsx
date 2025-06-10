
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search,
  Filter,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Shield,
  Microscope
} from 'lucide-react';

export const ClinicalTrialMatching = () => {
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [matchingFilters, setMatchingFilters] = useState({
    cancerType: 'all',
    stage: 'all',
    status: 'all',
    location: 'all'
  });

  const [matchingProgress, setMatchingProgress] = useState({
    eligibilityScreening: 75,
    documentCollection: 60,
    consentProcess: 40,
    enrollment: 25
  });

  const clinicalTrials = [
    {
      id: 1,
      title: 'Phase III Immunotherapy Study for Advanced Lung Cancer',
      protocol: 'NSCLC-2024-001',
      sponsor: 'National Cancer Institute',
      phase: 'Phase III',
      cancerType: 'Lung Cancer',
      status: 'recruiting',
      matchScore: 95,
      eligiblePatients: 12,
      totalEnrolled: 45,
      targetEnrollment: 200,
      location: 'Multi-center',
      estimatedCompletion: '2026-12-31',
      primaryEndpoint: 'Overall Survival',
      description: 'Comparing combination immunotherapy with standard chemotherapy in patients with advanced non-small cell lung cancer'
    },
    {
      id: 2,
      title: 'Targeted Therapy for HER2+ Breast Cancer',
      protocol: 'BC-HER2-2024-002',
      sponsor: 'Oncology Research Consortium',
      phase: 'Phase II',
      cancerType: 'Breast Cancer',
      status: 'recruiting',
      matchScore: 88,
      eligiblePatients: 8,
      totalEnrolled: 28,
      targetEnrollment: 120,
      location: 'Regional Centers',
      estimatedCompletion: '2025-09-30',
      primaryEndpoint: 'Progression-free Survival',
      description: 'Evaluating novel HER2-targeted therapy in combination with standard treatment'
    },
    {
      id: 3,
      title: 'CAR-T Cell Therapy for Relapsed Lymphoma',
      protocol: 'LYMPH-CAR-2024-003',
      sponsor: 'Cell Therapy Institute',
      phase: 'Phase I/II',
      cancerType: 'Lymphoma',
      status: 'recruiting',
      matchScore: 82,
      eligiblePatients: 6,
      totalEnrolled: 15,
      targetEnrollment: 60,
      location: 'Specialized Centers',
      estimatedCompletion: '2025-06-30',
      primaryEndpoint: 'Safety and Efficacy',
      description: 'Novel CAR-T cell therapy for patients with relapsed or refractory B-cell lymphoma'
    }
  ];

  const patientMatches = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      age: 58,
      cancerType: 'Lung Cancer',
      stage: 'Stage IIIA',
      eligibilityStatus: 'eligible',
      matchedTrials: 3,
      enrollmentStatus: 'consenting',
      lastScreening: '2024-01-08'
    },
    {
      id: 2,
      patientName: 'Robert Chen',
      age: 45,
      cancerType: 'Breast Cancer',
      stage: 'Stage II',
      eligibilityStatus: 'screening',
      matchedTrials: 2,
      enrollmentStatus: 'evaluating',
      lastScreening: '2024-01-10'
    },
    {
      id: 3,
      patientName: 'Maria Rodriguez',
      age: 62,
      cancerType: 'Lymphoma',
      stage: 'Relapsed',
      eligibilityStatus: 'eligible',
      matchedTrials: 1,
      enrollmentStatus: 'enrolled',
      lastScreening: '2024-01-05'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'recruiting': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'eligible': return 'bg-green-100 text-green-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'consenting': return 'bg-orange-100 text-orange-800';
      case 'evaluating': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'Phase I': return 'bg-red-100 text-red-800';
      case 'Phase I/II': return 'bg-orange-100 text-orange-800';
      case 'Phase II': return 'bg-yellow-100 text-yellow-800';
      case 'Phase III': return 'bg-green-100 text-green-800';
      case 'Phase IV': return 'bg-blue-100 text-blue-800';
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
      {/* Clinical Trials Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Clinical Trial Search & Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Cancer Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={matchingFilters.cancerType}
                onChange={(e) => setMatchingFilters(prev => ({...prev, cancerType: e.target.value}))}
              >
                <option value="all">All Cancer Types</option>
                <option value="lung">Lung Cancer</option>
                <option value="breast">Breast Cancer</option>
                <option value="lymphoma">Lymphoma</option>
                <option value="colon">Colorectal Cancer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Stage</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={matchingFilters.stage}
                onChange={(e) => setMatchingFilters(prev => ({...prev, stage: e.target.value}))}
              >
                <option value="all">All Stages</option>
                <option value="early">Early Stage</option>
                <option value="advanced">Advanced</option>
                <option value="metastatic">Metastatic</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Trial Status</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={matchingFilters.status}
                onChange={(e) => setMatchingFilters(prev => ({...prev, status: e.target.value}))}
              >
                <option value="all">All Statuses</option>
                <option value="recruiting">Recruiting</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={matchingFilters.location}
                onChange={(e) => setMatchingFilters(prev => ({...prev, location: e.target.value}))}
              >
                <option value="all">All Locations</option>
                <option value="local">Local Centers</option>
                <option value="regional">Regional Centers</option>
                <option value="national">National</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </CardContent>
      </Card>

      {/* Available Clinical Trials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clinicalTrials.map((trial) => (
          <Card 
            key={trial.id}
            className={`cursor-pointer transition-all hover:shadow-md ${selectedTrial?.id === trial.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedTrial(trial)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  <span className="text-sm">{trial.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{trial.matchScore}%</span>
                </div>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className={getPhaseColor(trial.phase)}>
                  {trial.phase}
                </Badge>
                <Badge className={getStatusColor(trial.status)}>
                  {trial.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{trial.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Protocol:</span>
                    <p className="text-gray-600">{trial.protocol}</p>
                  </div>
                  <div>
                    <span className="font-medium">Cancer Type:</span>
                    <p className="text-gray-600">{trial.cancerType}</p>
                  </div>
                  <div>
                    <span className="font-medium">Sponsor:</span>
                    <p className="text-gray-600">{trial.sponsor}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-gray-600">{trial.location}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment Progress</span>
                    <span>{trial.totalEnrolled}/{trial.targetEnrollment}</span>
                  </div>
                  <Progress value={(trial.totalEnrolled / trial.targetEnrollment) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Users className="h-4 w-4" />
                    <span>{trial.eligiblePatients} eligible patients</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Est. completion: {trial.estimatedCompletion}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Matching Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Eligibility & Enrollment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientMatches.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{patient.patientName}</h3>
                        <Badge className={getStatusColor(patient.eligibilityStatus)}>
                          {patient.eligibilityStatus}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.age} years old • {patient.cancerType} • {patient.stage}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{patient.matchedTrials} matched trials</span>
                        <span>Last screening: {patient.lastScreening}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(patient.enrollmentStatus)}>
                        {patient.enrollmentStatus}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Process Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(matchingProgress).map(([area, progress]) => {
          const areaNames = {
            eligibilityScreening: 'Eligibility Screening',
            documentCollection: 'Document Collection',
            consentProcess: 'Consent Process',
            enrollment: 'Final Enrollment'
          };

          const areaIcons = {
            eligibilityScreening: CheckCircle,
            documentCollection: FileText,
            consentProcess: Shield,
            enrollment: Users
          };

          const IconComponent = areaIcons[area];

          return (
            <Card key={area}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {areaNames[area]}
                  </div>
                  {progress >= 100 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => updateMatchingProgress(area)}
                    disabled={progress >= 100}
                  >
                    {progress >= 100 ? 'Complete' : 'Update Progress'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trial Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Trial Communications & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Protocol Amendment Notification</h4>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                NSCLC-2024-001 protocol has been updated with new eligibility criteria. 
                Please review updated inclusion/exclusion criteria for current patients.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  View Amendment
                </Button>
                <Button size="sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Review Patients
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Enrollment Milestone Reached</h4>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                BC-HER2-2024-002 has reached 50% enrollment target. 
                Great work on patient recruitment and screening efforts!
              </p>
              <Button size="sm" variant="outline">
                <Star className="h-3 w-3 mr-1" />
                View Progress
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Safety Update Required</h4>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Please submit safety data updates for LYMPH-CAR-2024-003 
                enrolled patients by end of week.
              </p>
              <Button size="sm">
                <Shield className="h-3 w-3 mr-1" />
                Submit Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
