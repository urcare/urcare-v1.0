
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Calendar,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Video
} from 'lucide-react';

export const TumorBoardCollaboration = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  const tumorBoardCases = [
    {
      id: 1,
      patientInitials: 'S.J.',
      age: 54,
      diagnosis: 'Breast Cancer Stage IIIA',
      caseType: 'New Diagnosis',
      presentingPhysician: 'Dr. Jennifer Smith',
      scheduledDate: '2024-01-25 14:00',
      priority: 'high',
      status: 'scheduled',
      specialtiesRequired: ['Medical Oncology', 'Radiation Oncology', 'Surgery', 'Pathology'],
      keyQuestions: ['Neoadjuvant vs adjuvant therapy', 'Surgery timing', 'Radiation planning']
    },
    {
      id: 2,
      patientInitials: 'M.C.',
      age: 67,
      diagnosis: 'NSCLC Stage IV with Brain Mets',
      caseType: 'Complex Case',
      presentingPhysician: 'Dr. Robert Kumar',
      scheduledDate: '2024-01-26 15:30',
      priority: 'urgent',
      status: 'in-review',
      specialtiesRequired: ['Medical Oncology', 'Radiation Oncology', 'Neurosurgery', 'Radiology'],
      keyQuestions: ['Brain radiation vs surgery', 'Systemic therapy options', 'Quality of life']
    },
    {
      id: 3,
      patientInitials: 'M.R.',
      age: 62,
      diagnosis: 'Colorectal Cancer with Liver Mets',
      caseType: 'Treatment Planning',
      presentingPhysician: 'Dr. Lisa Wang',
      scheduledDate: '2024-01-27 13:00',
      priority: 'standard',
      status: 'completed',
      specialtiesRequired: ['Medical Oncology', 'Surgery', 'Radiology', 'Pathology'],
      keyQuestions: ['Resectability assessment', 'Neoadjuvant strategy', 'Liver surgery timing']
    }
  ];

  const boardMembers = [
    {
      name: 'Dr. Jennifer Smith',
      specialty: 'Medical Oncology',
      attendance: 'confirmed',
      caseLoad: 3
    },
    {
      name: 'Dr. Robert Kumar',
      specialty: 'Radiation Oncology',
      attendance: 'confirmed',
      caseLoad: 2
    },
    {
      name: 'Dr. Lisa Wang',
      specialty: 'Surgical Oncology',
      attendance: 'tentative',
      caseLoad: 4
    },
    {
      name: 'Dr. Mark Johnson',
      specialty: 'Pathology',
      attendance: 'confirmed',
      caseLoad: 5
    },
    {
      name: 'Dr. Emily Brown',
      specialty: 'Radiology',
      attendance: 'confirmed',
      caseLoad: 3
    },
    {
      name: 'Dr. Sarah Wilson',
      specialty: 'Palliative Care',
      attendance: 'confirmed',
      caseLoad: 2
    }
  ];

  const recentDecisions = [
    {
      id: 1,
      patientInitials: 'A.B.',
      date: '2024-01-22',
      diagnosis: 'Lung Adenocarcinoma',
      decision: 'Neoadjuvant chemotherapy followed by surgery',
      consensus: 'unanimous',
      followUp: 'Re-staging in 6 weeks',
      documentedBy: 'Dr. Jennifer Smith'
    },
    {
      id: 2,
      patientInitials: 'C.D.',
      date: '2024-01-20',
      diagnosis: 'Pancreatic Cancer',
      decision: 'Palliative chemotherapy with best supportive care',
      consensus: 'majority',
      followUp: 'Palliative care consultation',
      documentedBy: 'Dr. Robert Kumar'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (attendance) => {
    switch(attendance) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'tentative': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upcoming Tumor Board Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tumor Board Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tumorBoardCases.map((case_) => (
              <Card 
                key={case_.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedCase?.id === case_.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedCase(case_)}
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">Patient {case_.patientInitials}</h3>
                      <p className="text-sm text-gray-600">Age: {case_.age}</p>
                      <p className="text-sm text-gray-600">{case_.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{case_.caseType}</p>
                      <p className="text-sm text-gray-600">Presenter: {case_.presentingPhysician}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{case_.scheduledDate}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Key Questions:</h4>
                      <div className="space-y-1">
                        {case_.keyQuestions.slice(0, 2).map((question, index) => (
                          <p key={index} className="text-xs text-gray-600">• {question}</p>
                        ))}
                        {case_.keyQuestions.length > 2 && (
                          <p className="text-xs text-gray-500">+{case_.keyQuestions.length - 2} more</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(case_.priority)}>
                          {case_.priority}
                        </Badge>
                        <Badge className={getStatusColor(case_.status)}>
                          {case_.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Required Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {case_.specialtiesRequired.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Board Member Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tumor Board Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boardMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.specialty}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getAttendanceColor(member.attendance)}>
                        {member.attendance}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {member.caseLoad} cases
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recent Board Decisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDecisions.map((decision) => (
              <Card key={decision.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-medium">Patient {decision.patientInitials}</h3>
                      <p className="text-sm text-gray-600">{decision.diagnosis}</p>
                      <p className="text-sm text-gray-600">{decision.date}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium mb-1">Decision:</h4>
                      <p className="text-sm text-gray-700">{decision.decision}</p>
                      <p className="text-sm text-gray-600 mt-1">Follow-up: {decision.followUp}</p>
                    </div>
                    <div>
                      <Badge className={decision.consensus === 'unanimous' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {decision.consensus}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        Documented by: {decision.documentedBy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tumor Board Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tumor Board Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tumorBoardCases.filter(case_ => case_.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {boardMembers.filter(member => member.attendance === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tumorBoardCases.filter(case_ => case_.priority === 'urgent' || case_.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority Cases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {recentDecisions.length}
              </div>
              <div className="text-sm text-gray-600">Recent Decisions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
