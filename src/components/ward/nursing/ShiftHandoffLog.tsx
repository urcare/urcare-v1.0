
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, User, FileText, Plus, ArrowRight } from 'lucide-react';

export const ShiftHandoffLog = () => {
  const [selectedHandoff, setSelectedHandoff] = useState<number | null>(null);
  const [showNewHandoff, setShowNewHandoff] = useState(false);

  const handoffs = [
    {
      id: 1,
      fromShift: 'Day Shift',
      toShift: 'Evening Shift',
      fromNurse: 'Nurse Johnson',
      toNurse: 'Nurse Wilson',
      date: '2024-01-15',
      time: '15:00',
      status: 'completed',
      patients: [
        {
          name: 'John Doe',
          room: '301A',
          priority: 'high',
          notes: 'Post-op day 2. Pain well controlled. Monitor for signs of infection. Next pain medication due at 18:00.',
          vitals: 'Stable, BP 120/80, HR 72, Temp 98.6°F',
          concerns: 'Slight drainage from surgical site - documented and physician notified'
        },
        {
          name: 'Jane Smith',
          room: '302B',
          priority: 'medium',
          notes: 'Diabetic patient. Blood sugar levels stable. Diet compliance good.',
          vitals: 'BP 135/85, HR 68, Temp 99.1°F',
          concerns: 'None at this time'
        }
      ]
    },
    {
      id: 2,
      fromShift: 'Evening Shift',
      toShift: 'Night Shift',
      fromNurse: 'Nurse Wilson',
      toNurse: 'Nurse Davis',
      date: '2024-01-15',
      time: '23:00',
      status: 'in_progress',
      patients: [
        {
          name: 'Mike Brown',
          room: '303A',
          priority: 'low',
          notes: 'Recovering well. Ambulatory. Preparing for discharge tomorrow.',
          vitals: 'All normal',
          concerns: 'None'
        }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          Shift Handoff Log
        </h2>
        <Button onClick={() => setShowNewHandoff(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Handoff
        </Button>
      </div>

      {showNewHandoff && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Handoff Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromShift">From Shift</Label>
                <Input id="fromShift" placeholder="e.g., Day Shift" />
              </div>
              <div>
                <Label htmlFor="toShift">To Shift</Label>
                <Input id="toShift" placeholder="e.g., Evening Shift" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromNurse">From Nurse</Label>
                <Input id="fromNurse" placeholder="Nurse name" />
              </div>
              <div>
                <Label htmlFor="toNurse">To Nurse</Label>
                <Input id="toNurse" placeholder="Receiving nurse" />
              </div>
            </div>
            <div>
              <Label htmlFor="generalNotes">General Shift Notes</Label>
              <Textarea 
                id="generalNotes" 
                placeholder="Overall shift summary, unit status, any general concerns..."
                className="h-20"
              />
            </div>
            <div className="flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">Save Handoff</Button>
              <Button variant="outline" onClick={() => setShowNewHandoff(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Handoff List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Handoffs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {handoffs.map(handoff => (
              <div 
                key={handoff.id} 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedHandoff === handoff.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedHandoff(handoff.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{handoff.fromShift}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{handoff.toShift}</span>
                  </div>
                  <Badge className={
                    handoff.status === 'completed' 
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }>
                    {handoff.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span>{handoff.date} at {handoff.time}</span>
                    <span>{handoff.patients.length} patients</span>
                  </div>
                  <div className="mt-1">
                    <span>{handoff.fromNurse} → {handoff.toNurse}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Handoff Details */}
        {selectedHandoff && (
          <div className="lg:col-span-2">
            {(() => {
              const handoff = handoffs.find(h => h.id === selectedHandoff);
              if (!handoff) return null;
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Handoff Details
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      {handoff.fromShift} to {handoff.toShift} | {handoff.date} at {handoff.time}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Outgoing Nurse</h4>
                        <p className="text-gray-600">{handoff.fromNurse}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Incoming Nurse</h4>
                        <p className="text-gray-600">{handoff.toNurse}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Patient Reports ({handoff.patients.length})</h4>
                      <div className="space-y-4">
                        {handoff.patients.map((patient, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium">{patient.name}</h5>
                                <p className="text-sm text-gray-600">Room {patient.room}</p>
                              </div>
                              <Badge className={getPriorityColor(patient.priority)}>
                                {patient.priority.toUpperCase()} PRIORITY
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h6 className="font-medium text-sm text-gray-800">Care Notes</h6>
                                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                  {patient.notes}
                                </p>
                              </div>
                              
                              <div>
                                <h6 className="font-medium text-sm text-gray-800">Vital Signs</h6>
                                <p className="text-sm text-gray-700">{patient.vitals}</p>
                              </div>
                              
                              <div>
                                <h6 className="font-medium text-sm text-gray-800">Concerns</h6>
                                <p className={`text-sm p-2 rounded ${
                                  patient.concerns === 'None' || patient.concerns === 'None at this time'
                                    ? 'text-green-700 bg-green-50'
                                    : 'text-red-700 bg-red-50'
                                }`}>
                                  {patient.concerns}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <User className="h-4 w-4 mr-2" />
                        Acknowledge Receipt
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Print Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Handoff Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <p className="text-sm text-blue-800">Handoffs Today</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <p className="text-sm text-green-800">Completion Rate</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">12 min</div>
              <p className="text-sm text-yellow-800">Avg Duration</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <p className="text-sm text-purple-800">Patients Transferred</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
