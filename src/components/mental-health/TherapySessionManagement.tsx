
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Calendar,
  Clock,
  User,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Video,
  MapPin
} from 'lucide-react';

export const TherapySessionManagement = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const upcomingSessions = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      therapist: 'Dr. Emily Brown',
      date: '2024-01-16',
      time: '10:00 AM',
      type: 'CBT',
      duration: 60,
      mode: 'in-person',
      status: 'scheduled'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      therapist: 'Dr. James Wilson',
      date: '2024-01-16',
      time: '2:00 PM',
      type: 'DBT',
      duration: 90,
      mode: 'virtual',
      status: 'confirmed'
    },
    {
      id: 3,
      patientName: 'Emily Davis',
      therapist: 'Dr. Sarah Martinez',
      date: '2024-01-17',
      time: '11:00 AM',
      type: 'EMDR',
      duration: 60,
      mode: 'in-person',
      status: 'pending'
    }
  ];

  const treatmentPlans = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      diagnosis: 'Major Depressive Disorder',
      goals: ['Reduce depressive symptoms', 'Improve sleep quality', 'Increase social engagement'],
      interventions: ['CBT', 'Behavioral Activation', 'Sleep Hygiene'],
      progress: 65,
      sessions: 8,
      duration: '12 weeks'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      diagnosis: 'Borderline Personality Disorder',
      goals: ['Emotional regulation', 'Interpersonal effectiveness', 'Distress tolerance'],
      interventions: ['DBT', 'Mindfulness', 'Crisis Survival Skills'],
      progress: 45,
      sessions: 12,
      duration: '20 weeks'
    }
  ];

  const progressNotes = [
    {
      id: 1,
      sessionId: 1,
      date: '2024-01-09',
      therapist: 'Dr. Emily Brown',
      patientName: 'Sarah Johnson',
      sessionType: 'CBT',
      duration: 60,
      objectives: 'Address negative thought patterns',
      interventions: 'Cognitive restructuring exercises',
      progress: 'Patient identified 3 cognitive distortions',
      homework: 'Complete thought record worksheet',
      nextSteps: 'Continue CBT techniques, introduce behavioral activation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === 'virtual' ? Video : MapPin;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList>
          <TabsTrigger value="sessions">Session Schedule</TabsTrigger>
          <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="notes">Progress Notes</TabsTrigger>
          <TabsTrigger value="outcomes">Outcome Measures</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Therapy Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => {
                  const ModeIcon = getModeIcon(session.mode);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{session.time}</span>
                        </div>
                        <div>
                          <div className="font-medium">{session.patientName}</div>
                          <div className="text-sm text-gray-600">{session.therapist}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ModeIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{session.mode}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{session.type}</div>
                          <div className="text-sm text-gray-600">{session.duration} min</div>
                        </div>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient">Patient</Label>
                  <Input id="patient" placeholder="Select patient" />
                </div>
                <div>
                  <Label htmlFor="therapist">Therapist</Label>
                  <Input id="therapist" placeholder="Select therapist" />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div>
                  <Label htmlFor="type">Session Type</Label>
                  <Input id="type" placeholder="CBT, DBT, EMDR, etc." />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="60" />
                </div>
              </div>
              <Button className="w-full">Schedule Session</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="space-y-4">
            {treatmentPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.patientName}</span>
                    <Badge variant="outline">{plan.diagnosis}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Treatment Goals
                        </h4>
                        <ul className="text-sm space-y-1">
                          {plan.goals.map((goal, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Interventions</h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.interventions.map((intervention, index) => (
                            <Badge key={index} variant="secondary">{intervention}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Progress Overview
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{plan.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Sessions Completed</div>
                          <div className="font-medium">{plan.sessions}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Treatment Duration</div>
                          <div className="font-medium">{plan.duration}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Progress Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{note.patientName}</h3>
                        <div className="text-sm text-gray-600">
                          {note.therapist} • {note.date} • {note.sessionType} ({note.duration} min)
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit Note</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-1">Session Objectives</h4>
                        <p className="text-gray-600">{note.objectives}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Interventions</h4>
                        <p className="text-gray-600">{note.interventions}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Progress Made</h4>
                        <p className="text-gray-600">{note.progress}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Homework Assigned</h4>
                        <p className="text-gray-600">{note.homework}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Next Steps</h4>
                      <p className="text-sm text-gray-600">{note.nextSteps}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Progress Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session">Session</Label>
                  <Input id="session" placeholder="Select session" />
                </div>
                <div>
                  <Label htmlFor="duration-note">Duration (minutes)</Label>
                  <Input id="duration-note" type="number" placeholder="60" />
                </div>
              </div>
              <div>
                <Label htmlFor="objectives">Session Objectives</Label>
                <Textarea id="objectives" placeholder="What were the main objectives for this session?" />
              </div>
              <div>
                <Label htmlFor="interventions-note">Interventions Used</Label>
                <Textarea id="interventions-note" placeholder="What therapeutic interventions were used?" />
              </div>
              <div>
                <Label htmlFor="progress-note">Progress Made</Label>
                <Textarea id="progress-note" placeholder="What progress did the patient make?" />
              </div>
              <div>
                <Label htmlFor="homework-note">Homework Assigned</Label>
                <Textarea id="homework-note" placeholder="What homework or exercises were assigned?" />
              </div>
              <Button className="w-full">Save Progress Note</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Outcome Measurement Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Beck Depression Inventory</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">14</div>
                    <div className="text-sm text-gray-600">Mild Depression</div>
                    <div className="text-xs text-gray-500 mt-2">Last assessment: Jan 10</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">GAF Score</h3>
                    <div className="text-2xl font-bold text-green-600 mb-1">75</div>
                    <div className="text-sm text-gray-600">Good Functioning</div>
                    <div className="text-xs text-gray-500 mt-2">Last assessment: Jan 8</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Quality of Life Scale</h3>
                    <div className="text-2xl font-bold text-purple-600 mb-1">8.2</div>
                    <div className="text-sm text-gray-600">Above Average</div>
                    <div className="text-xs text-gray-500 mt-2">Last assessment: Jan 5</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
