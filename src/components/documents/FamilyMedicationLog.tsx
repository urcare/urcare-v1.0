
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MedicationLog {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  takenAt: Date;
  administeredBy: string;
  notes?: string;
  status: 'taken' | 'missed' | 'late';
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const sampleFamilyMembers: FamilyMember[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Primary Caregiver', avatar: 'SJ' },
  { id: '2', name: 'Mike Johnson', role: 'Spouse', avatar: 'MJ' },
  { id: '3', name: 'Lisa Chen', role: 'Nurse', avatar: 'LC' }
];

const sampleLogs: MedicationLog[] = [
  {
    id: '1',
    patientName: 'John Doe',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet',
    takenAt: new Date('2024-01-20T08:00:00'),
    administeredBy: 'Sarah Johnson',
    status: 'taken'
  },
  {
    id: '2',
    patientName: 'John Doe',
    medication: 'Metformin 500mg',
    dosage: '2 tablets',
    takenAt: new Date('2024-01-20T12:15:00'),
    administeredBy: 'Mike Johnson',
    status: 'late',
    notes: 'Patient was sleeping, administered 15 minutes late'
  }
];

export const FamilyMedicationLog = () => {
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(sampleLogs);
  const [familyMembers] = useState<FamilyMember[]>(sampleFamilyMembers);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const handleLogMedication = () => {
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      patientName: 'John Doe',
      medication: 'New Medication',
      dosage: '1 tablet',
      takenAt: new Date(),
      administeredBy: selectedMember || 'Unknown',
      status: 'taken'
    };
    
    setMedicationLogs(prev => [newLog, ...prev]);
    toast.success('Medication administration logged');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missed': return <Clock className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Medication Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Caregivers Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Active Caregivers</h4>
          <div className="flex gap-3">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2 p-2 border rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarContent>{member.avatar}</AvatarContent>
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Entry */}
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Quick Log Entry</h4>
          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder="Select caregiver" />
              </SelectTrigger>
              <SelectContent>
                {familyMembers.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleLogMedication}>
              <Plus className="h-4 w-4 mr-2" />
              Log Medication
            </Button>
          </div>
        </div>

        {/* Recent Logs */}
        <div className="space-y-3">
          <h4 className="font-medium">Recent Activity</h4>
          <div className="space-y-3">
            {medicationLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium">{log.medication}</h5>
                    <p className="text-sm text-gray-600">
                      {log.dosage} for {log.patientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(log.status)}>
                      {getStatusIcon(log.status)}
                      <span className="ml-1">{log.status}</span>
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">
                      {log.takenAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Avatar className="h-6 w-6">
                    <AvatarContent>
                      {familyMembers.find(m => m.name === log.administeredBy)?.avatar || 'U'}
                    </AvatarContent>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span>Administered by {log.administeredBy}</span>
                </div>
                
                {log.notes && (
                  <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                    Note: {log.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
