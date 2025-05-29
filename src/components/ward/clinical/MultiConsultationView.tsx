
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Calendar, Clock, User, Stethoscope, Brain, Heart } from 'lucide-react';

interface Consultation {
  id: string;
  doctorName: string;
  specialty: string;
  requestDate: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  reason: string;
  notes?: string;
  scheduledDate?: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  primaryDiagnosis: string;
  consultations: Consultation[];
}

const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    mrn: 'MRN001234',
    primaryDiagnosis: 'Chest Pain - Rule out MI',
    consultations: [
      {
        id: 'C001',
        doctorName: 'Dr. Emily Johnson',
        specialty: 'Cardiology',
        requestDate: '2024-01-22 09:00',
        status: 'scheduled',
        priority: 'urgent',
        reason: 'Evaluate chest pain, abnormal ECG',
        scheduledDate: '2024-01-22 14:00'
      },
      {
        id: 'C002',
        doctorName: 'Dr. Michael Chen',
        specialty: 'Pulmonology',
        requestDate: '2024-01-22 10:30',
        status: 'pending',
        priority: 'routine',
        reason: 'Chronic cough evaluation'
      },
      {
        id: 'C003',
        doctorName: 'Dr. Sarah Williams',
        specialty: 'Endocrinology',
        requestDate: '2024-01-21 15:00',
        status: 'completed',
        priority: 'routine',
        reason: 'Diabetes management consultation',
        notes: 'Insulin regimen adjusted. Follow-up in 2 weeks.'
      }
    ]
  }
];

export const MultiConsultationView = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);
  const [newNote, setNewNote] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'cardiology': return Heart;
      case 'neurology': return Brain;
      default: return Stethoscope;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Multi-Consultation View
          </CardTitle>
          <CardDescription>
            Comprehensive view of multiple specialist consultations for complex cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Complex Cases</h3>
              {patients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className={`cursor-pointer transition-shadow ${selectedPatient.id === patient.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{patient.name}</h4>
                      <Badge variant="outline">{patient.mrn}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{patient.primaryDiagnosis}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>{patient.age}y, {patient.gender}</span>
                      <Badge className="bg-purple-500">
                        {patient.consultations.length} Consults
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Patient Details and Consultations */}
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {selectedPatient.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedPatient.primaryDiagnosis}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">MRN</span>
                      <p className="font-medium">{selectedPatient.mrn}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Age/Gender</span>
                      <p className="font-medium">{selectedPatient.age}y, {selectedPatient.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Consultations</span>
                      <p className="font-medium">{selectedPatient.consultations.length} Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="timeline">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                  <TabsTrigger value="by-specialty">By Specialty</TabsTrigger>
                  <TabsTrigger value="communications">Communications</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="space-y-4">
                  {selectedPatient.consultations.map((consultation) => {
                    const SpecialtyIcon = getSpecialtyIcon(consultation.specialty);
                    return (
                      <Card key={consultation.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  <SpecialtyIcon className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{consultation.doctorName}</h4>
                                <p className="text-sm text-gray-600">{consultation.specialty}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(consultation.priority)}>
                                {consultation.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(consultation.status)}>
                                {consultation.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm"><strong>Reason:</strong> {consultation.reason}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span><strong>Requested:</strong> {consultation.requestDate}</span>
                            </div>
                            {consultation.scheduledDate && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span><strong>Scheduled:</strong> {consultation.scheduledDate}</span>
                              </div>
                            )}
                          </div>

                          {consultation.notes && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm"><strong>Notes:</strong> {consultation.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {consultation.status === 'pending' && (
                              <>
                                <Button size="sm">Schedule</Button>
                                <Button size="sm" variant="outline">Priority+</Button>
                              </>
                            )}
                            {consultation.status === 'scheduled' && (
                              <>
                                <Button size="sm">Reschedule</Button>
                                <Button size="sm" variant="outline">Add Notes</Button>
                              </>
                            )}
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="by-specialty">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-gray-600">Consultations grouped by medical specialty</p>
                      {/* Specialty grouping implementation */}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="communications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inter-consultant Communications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Add communication note or coordination message..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button>Send to All Consultants</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
