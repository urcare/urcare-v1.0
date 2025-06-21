
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Pill, Clock, AlertTriangle, CheckCircle, Plus, Bell, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions: string;
  refillsLeft: number;
  lastTaken?: string;
  nextDue: string;
  adherence: number;
  sideEffects?: string[];
  familyVisible: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  canManage: boolean;
}

export const MedicationTracker = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-15',
      instructions: 'Take with water, preferably in the morning',
      refillsLeft: 3,
      lastTaken: '2024-06-20 08:00',
      nextDue: '2024-06-21 08:00',
      adherence: 92,
      sideEffects: ['Dry cough'],
      familyVisible: true
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-02-01',
      instructions: 'Take with meals to reduce stomach upset',
      refillsLeft: 1,
      lastTaken: '2024-06-20 19:30',
      nextDue: '2024-06-21 07:30',
      adherence: 88,
      familyVisible: false
    }
  ]);

  const [familyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Sarah (Daughter)', avatar: '/placeholder.svg', canManage: true },
    { id: '2', name: 'John (Spouse)', avatar: '/placeholder.svg', canManage: false }
  ]);

  const markAsTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { 
            ...med, 
            lastTaken: new Date().toISOString(),
            adherence: Math.min(100, med.adherence + 2)
          }
        : med
    ));
    toast.success('Medication marked as taken!');
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (nextDue: string) => {
    const dueTime = new Date(nextDue);
    const now = new Date();
    const diffHours = (dueTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    if (diffHours < 2) return <Badge className="bg-yellow-100 text-yellow-800">Due Soon</Badge>;
    return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-blue-600" />
            Smart Medication Management
          </CardTitle>
          <CardDescription>
            AI-powered medication tracking with family coordination
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Pill className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">{medications.length}</h3>
              <p className="text-sm text-gray-600">Active Medications</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">90%</h3>
              <p className="text-sm text-gray-600">Avg Adherence</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Bell className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <h3 className="font-bold text-orange-800">Smart</h3>
              <p className="text-sm text-gray-600">AI Reminders</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Family</h3>
              <p className="text-sm text-gray-600">Coordination</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Meds</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="family">Family View</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Current Medications</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
          
          <div className="grid gap-4">
            {medications.map((medication) => (
              <Card key={medication.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold">{medication.name}</h4>
                        {getStatusBadge(medication.nextDue)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Dosage:</strong> {medication.dosage}</p>
                          <p><strong>Frequency:</strong> {medication.frequency}</p>
                          <p><strong>Refills left:</strong> {medication.refillsLeft}</p>
                        </div>
                        <div>
                          <p><strong>Last taken:</strong> {medication.lastTaken ? new Date(medication.lastTaken).toLocaleString() : 'Not recorded'}</p>
                          <p><strong>Next due:</strong> {new Date(medication.nextDue).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">{medication.instructions}</p>
                      </div>
                    </div>
                    
                    <Button onClick={() => markAsTaken(medication.id)} className="ml-4">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Taken
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Adherence Rate</span>
                        <span className={`font-semibold ${getAdherenceColor(medication.adherence)}`}>
                          {medication.adherence}%
                        </span>
                      </div>
                      <Progress value={medication.adherence} className="h-2" />
                    </div>
                    
                    {medication.sideEffects && medication.sideEffects.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-800">Reported Side Effects</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {medication.sideEffects.map((effect, index) => (
                            <Badge key={index} className="bg-yellow-100 text-yellow-800">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <h3 className="text-lg font-semibold">Today's Schedule</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Metformin 500mg</h4>
                    <p className="text-sm text-gray-600">7:30 AM - With breakfast</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Taken</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Lisinopril 10mg</h4>
                    <p className="text-sm text-gray-600">8:00 AM - With water</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Taken</Badge>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Metformin 500mg</h4>
                    <p className="text-sm text-gray-600">7:30 PM - With dinner</p>
                  </div>
                  <Button size="sm">
                    Mark Taken
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Family Medication View</h3>
            <Button variant="outline">Manage Access</Button>
          </div>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Members with Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600">
                          {member.canManage ? 'Can manage medications' : 'View only access'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={member.canManage ? "default" : "outline"}>
                      {member.canManage ? "Manager" : "Viewer"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shared Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {medications.filter(med => med.familyVisible).map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">
                          {medication.adherence}% adherence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adherence Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Great Progress!</h4>
                  <p className="text-sm text-green-700">Your medication adherence has improved by 15% this month.</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Optimal Timing</h4>
                  <p className="text-sm text-blue-700">Taking medications with meals shows 20% better consistency.</p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Refill Reminder</h4>
                  <p className="text-sm text-yellow-700">Metformin refill needed in 5 days. Order now to avoid gaps.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800">Dosage Optimization</h4>
                  <p className="text-sm text-purple-700">Consider discussing timing adjustment with your doctor for better results.</p>
                </div>
                
                <div className="p-3 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-800">Interaction Alert</h4>
                  <p className="text-sm text-pink-700">No drug interactions detected. Continue current regimen.</p>
                </div>
                
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <h4 className="font-medium text-cyan-800">Health Goals</h4>
                  <p className="text-sm text-cyan-700">Your blood pressure targets are on track with current medication.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
