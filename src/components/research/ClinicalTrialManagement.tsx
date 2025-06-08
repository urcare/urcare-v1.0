
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  FileText,
  Shield,
  Calendar
} from 'lucide-react';

export const ClinicalTrialManagement = () => {
  const [selectedPhase, setSelectedPhase] = useState('all');

  const trialMetrics = {
    activeTrials: 15,
    totalEnrollment: 3247,
    enrollmentRate: 82,
    adverseEvents: 23,
    protocolDeviations: 8,
    siteActivations: 45
  };

  const trials = [
    {
      id: 'CT-CARDIO-2024-001',
      title: 'Randomized Trial of Novel ACE Inhibitor in Heart Failure',
      phase: 'Phase III',
      status: 'recruiting',
      enrollment: { current: 245, target: 500 },
      sites: 12,
      sponsor: 'CardioTech Pharmaceuticals',
      startDate: '2024-01-15',
      estimatedCompletion: '2026-12-31',
      adverseEvents: 8,
      protocolDeviations: 3,
      lastUpdate: '2024-01-20'
    },
    {
      id: 'CT-NEURO-2023-045',
      title: 'Neuroprotective Agent for Stroke Recovery',
      phase: 'Phase II',
      status: 'active',
      enrollment: { current: 156, target: 200 },
      sites: 8,
      sponsor: 'NeuroScience Institute',
      startDate: '2023-09-01',
      estimatedCompletion: '2025-06-30',
      adverseEvents: 12,
      protocolDeviations: 2,
      lastUpdate: '2024-01-18'
    },
    {
      id: 'CT-ONCO-2024-012',
      title: 'Immunotherapy Combination in Advanced Melanoma',
      phase: 'Phase I',
      status: 'planning',
      enrollment: { current: 0, target: 50 },
      sites: 3,
      sponsor: 'Oncology Research Center',
      startDate: '2024-03-01',
      estimatedCompletion: '2025-03-01',
      adverseEvents: 0,
      protocolDeviations: 0,
      lastUpdate: '2024-01-15'
    }
  ];

  const adverseEvents = [
    {
      id: 'AE-001',
      trial: 'CT-CARDIO-2024-001',
      severity: 'serious',
      type: 'Cardiovascular',
      description: 'Acute myocardial infarction',
      reportedDate: '2024-01-18',
      status: 'investigating',
      relatedness: 'possibly_related'
    },
    {
      id: 'AE-002',
      trial: 'CT-NEURO-2023-045',
      severity: 'moderate',
      type: 'Neurological',
      description: 'Temporary confusion',
      reportedDate: '2024-01-16',
      status: 'resolved',
      relatedness: 'unrelated'
    },
    {
      id: 'AE-003',
      trial: 'CT-CARDIO-2024-001',
      severity: 'mild',
      type: 'Gastrointestinal',
      description: 'Nausea and vomiting',
      reportedDate: '2024-01-14',
      status: 'ongoing',
      relatedness: 'probably_related'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recruiting': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'serious': return 'bg-red-500';
      case 'moderate': return 'bg-orange-500';
      case 'mild': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Phase I': return 'bg-blue-100 text-blue-800';
      case 'Phase II': return 'bg-green-100 text-green-800';
      case 'Phase III': return 'bg-purple-100 text-purple-800';
      case 'Phase IV': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinical Trial Management</h2>
          <p className="text-gray-600">Trial enrollment tracking and adverse event reporting</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="phase1">Phase I</SelectItem>
              <SelectItem value="phase2">Phase II</SelectItem>
              <SelectItem value="phase3">Phase III</SelectItem>
              <SelectItem value="phase4">Phase IV</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            New Trial
          </Button>
        </div>
      </div>

      {/* Trial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">{trialMetrics.activeTrials}</p>
            <p className="text-sm text-blue-700">Active Trials</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{trialMetrics.totalEnrollment.toLocaleString()}</p>
            <p className="text-sm text-green-700">Total Enrollment</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{trialMetrics.enrollmentRate}%</p>
            <p className="text-sm text-purple-700">Enrollment Rate</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{trialMetrics.adverseEvents}</p>
            <p className="text-sm text-red-700">Adverse Events</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-900">{trialMetrics.protocolDeviations}</p>
            <p className="text-sm text-yellow-700">Protocol Deviations</p>
          </CardContent>
        </Card>
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-900">{trialMetrics.siteActivations}</p>
            <p className="text-sm text-teal-700">Active Sites</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trials */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Trials Portfolio</CardTitle>
            <CardDescription>Current trials and enrollment progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trials.map((trial) => (
                <div key={trial.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{trial.title}</h4>
                      <p className="text-sm text-gray-600">{trial.sponsor}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPhaseColor(trial.phase)}>
                        {trial.phase}
                      </Badge>
                      <Badge className={`${getStatusColor(trial.status)} text-white`}>
                        {trial.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Enrollment Progress</span>
                      <span className="font-medium">{trial.enrollment.current}/{trial.enrollment.target}</span>
                    </div>
                    <Progress value={(trial.enrollment.current / trial.enrollment.target) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>Sites: {trial.sites}</div>
                    <div>AEs: {trial.adverseEvents}</div>
                    <div>Start: {trial.startDate}</div>
                    <div>Est. Completion: {trial.estimatedCompletion}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Adverse Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Adverse Events</CardTitle>
            <CardDescription>Safety monitoring and event reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adverseEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.description}</h4>
                      <p className="text-sm text-gray-600">{event.type}</p>
                    </div>
                    <Badge className={`${getSeverityColor(event.severity)} text-white`}>
                      {event.severity}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Trial: {event.trial}</p>
                    <p>Relatedness: {event.relatedness.replace('_', ' ')}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Reported: {event.reportedDate}</span>
                    <Badge variant="outline" className={
                      event.status === 'resolved' ? 'border-green-500 text-green-700' :
                      event.status === 'investigating' ? 'border-yellow-500 text-yellow-700' :
                      'border-orange-500 text-orange-700'
                    }>
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
