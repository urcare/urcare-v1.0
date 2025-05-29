
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList, Clock, User, Stethoscope, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RoundEntry {
  id: string;
  patientId: string;
  patientName: string;
  roomNumber: string;
  doctorName: string;
  timestamp: string;
  notes: string;
  vitals: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'routine' | 'urgent' | 'critical';
}

const mockRounds: RoundEntry[] = [
  {
    id: 'R001',
    patientId: 'P001',
    patientName: 'John Smith',
    roomNumber: '101',
    doctorName: 'Dr. Johnson',
    timestamp: '08:30 AM',
    notes: 'Patient showing good recovery. Pain levels reduced. Continue current medication.',
    vitals: {
      bloodPressure: '120/80',
      temperature: '98.6°F',
      heartRate: '72 bpm',
      oxygenSaturation: '98%'
    },
    status: 'completed',
    priority: 'routine'
  },
  {
    id: 'R002',
    patientId: 'P002',
    patientName: 'Sarah Johnson',
    roomNumber: '203',
    doctorName: 'Dr. Smith',
    timestamp: '09:15 AM',
    notes: 'Patient experiencing mild discomfort. Monitoring required.',
    vitals: {
      bloodPressure: '135/85',
      temperature: '99.2°F',
      heartRate: '85 bpm',
      oxygenSaturation: '96%'
    },
    status: 'in-progress',
    priority: 'urgent'
  },
  {
    id: 'R003',
    patientId: 'P003',
    patientName: 'Mike Davis',
    roomNumber: '105',
    doctorName: 'Dr. Wilson',
    timestamp: '10:00 AM',
    notes: '',
    vitals: {
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      oxygenSaturation: ''
    },
    status: 'pending',
    priority: 'routine'
  }
];

export const DailyRoundsLog = () => {
  const [rounds, setRounds] = useState<RoundEntry[]>(mockRounds);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [newNotes, setNewNotes] = useState('');

  const handleUpdateRound = (roundId: string, updates: Partial<RoundEntry>) => {
    setRounds(prev => prev.map(round => 
      round.id === roundId ? { ...round, ...updates } : round
    ));
    toast.success('Round updated successfully');
  };

  const handleCompleteRound = (roundId: string) => {
    const round = rounds.find(r => r.id === roundId);
    if (round && newNotes.trim()) {
      handleUpdateRound(roundId, { 
        status: 'completed', 
        notes: newNotes.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setNewNotes('');
      setSelectedRound(null);
    } else {
      toast.error('Please add notes before completing the round');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'routine': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const completedRounds = rounds.filter(r => r.status === 'completed').length;
  const pendingRounds = rounds.filter(r => r.status === 'pending').length;
  const inProgressRounds = rounds.filter(r => r.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedRounds}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{inProgressRounds}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingRounds}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{rounds.length}</div>
            <div className="text-sm text-gray-600">Total Rounds</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Daily Rounds Log
          </CardTitle>
          <CardDescription>
            Auto daily rounds with patient notes and vital monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rounds.map((round) => (
              <div 
                key={round.id}
                className={`border rounded-lg p-4 ${
                  selectedRound === round.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{round.patientName}</h3>
                    <Badge variant="outline">{round.patientId}</Badge>
                    <Badge variant="outline">Room {round.roomNumber}</Badge>
                    <Badge className={getPriorityColor(round.priority)}>
                      {round.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(round.status)}>
                    {round.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{round.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{round.timestamp}</span>
                  </div>
                </div>

                {round.vitals.bloodPressure && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-600">Blood Pressure</div>
                      <div className="font-medium">{round.vitals.bloodPressure}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Temperature</div>
                      <div className="font-medium">{round.vitals.temperature}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Heart Rate</div>
                      <div className="font-medium">{round.vitals.heartRate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Oxygen Sat.</div>
                      <div className="font-medium">{round.vitals.oxygenSaturation}</div>
                    </div>
                  </div>
                )}

                {round.notes && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Notes:</div>
                    <div className="text-sm">{round.notes}</div>
                  </div>
                )}

                <div className="flex gap-2">
                  {round.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleUpdateRound(round.id, { status: 'in-progress' });
                      }}
                    >
                      Start Round
                    </Button>
                  )}
                  
                  {round.status === 'in-progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedRound(round.id === selectedRound ? null : round.id)}
                    >
                      {selectedRound === round.id ? 'Cancel' : 'Add Notes'}
                    </Button>
                  )}

                  {round.status === 'completed' && (
                    <Button size="sm" variant="outline" disabled>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </Button>
                  )}
                </div>

                {selectedRound === round.id && round.status === 'in-progress' && (
                  <div className="mt-4 p-4 border-t space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Round Notes</label>
                      <Textarea
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="Enter patient observations, treatment notes, recommendations..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-600">Blood Pressure</label>
                        <input 
                          type="text" 
                          className="w-full text-sm border rounded px-2 py-1"
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Temperature</label>
                        <input 
                          type="text" 
                          className="w-full text-sm border rounded px-2 py-1"
                          placeholder="98.6°F"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Heart Rate</label>
                        <input 
                          type="text" 
                          className="w-full text-sm border rounded px-2 py-1"
                          placeholder="72 bpm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Oxygen Sat.</label>
                        <input 
                          type="text" 
                          className="w-full text-sm border rounded px-2 py-1"
                          placeholder="98%"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleCompleteRound(round.id)}
                      disabled={!newNotes.trim()}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Round
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Round
            </Button>
            <Button variant="outline" size="sm">
              <ClipboardList className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Assign Doctor
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Round
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
