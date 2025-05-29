
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, User, Clock, FileText, Download, Plus } from 'lucide-react';

interface VisitRecord {
  id: string;
  patientId: string;
  patientName: string;
  bedNumber: string;
  date: string;
  time: string;
  visitType: 'rounds' | 'consultation' | 'procedure' | 'emergency' | 'discharge';
  doctor: string;
  notes: string;
  vitals?: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSat: string;
  };
  medications?: string[];
  followUpRequired: boolean;
  status: 'completed' | 'in-progress' | 'pending';
}

const mockVisits: VisitRecord[] = [
  {
    id: 'V001',
    patientId: 'W001',
    patientName: 'John Smith',
    bedNumber: 'A-101',
    date: '2024-01-21',
    time: '08:30',
    visitType: 'rounds',
    doctor: 'Dr. Johnson',
    notes: 'Patient showing improvement. Pneumonia responding well to antibiotics. No fever for 24 hours. Patient is alert and oriented.',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      oxygenSat: '98%'
    },
    medications: ['Amoxicillin 500mg', 'Acetaminophen 650mg'],
    followUpRequired: true,
    status: 'completed'
  },
  {
    id: 'V002',
    patientId: 'W002',
    patientName: 'Sarah Wilson',
    bedNumber: 'B-203',
    date: '2024-01-21',
    time: '14:15',
    visitType: 'consultation',
    doctor: 'Dr. Brown',
    notes: 'Cardiac function stable. EKG shows normal rhythm. Patient comfortable on current medication regimen.',
    vitals: {
      temperature: '99.0°F',
      bloodPressure: '140/85',
      heartRate: '88 bpm',
      oxygenSat: '95%'
    },
    medications: ['Metoprolol 50mg', 'Lisinopril 10mg'],
    followUpRequired: false,
    status: 'completed'
  }
];

export const VisitHistoryGenerator = () => {
  const [visits, setVisits] = useState<VisitRecord[]>(mockVisits);
  const [isAddingVisit, setIsAddingVisit] = useState(false);
  const [newVisit, setNewVisit] = useState<Partial<VisitRecord>>({
    visitType: 'rounds',
    status: 'completed',
    followUpRequired: false
  });

  const handleAddVisit = () => {
    if (newVisit.patientName && newVisit.notes) {
      const visit: VisitRecord = {
        id: `V${String(visits.length + 1).padStart(3, '0')}`,
        patientId: `W${String(visits.length + 1).padStart(3, '0')}`,
        patientName: newVisit.patientName || '',
        bedNumber: newVisit.bedNumber || '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        visitType: newVisit.visitType as any || 'rounds',
        doctor: newVisit.doctor || 'Current User',
        notes: newVisit.notes || '',
        vitals: newVisit.vitals,
        medications: newVisit.medications,
        followUpRequired: newVisit.followUpRequired || false,
        status: newVisit.status as any || 'completed'
      };

      setVisits(prev => [visit, ...prev]);
      setNewVisit({
        visitType: 'rounds',
        status: 'completed',
        followUpRequired: false
      });
      setIsAddingVisit(false);
    }
  };

  const getVisitTypeColor = (type: string) => {
    switch (type) {
      case 'rounds': return 'bg-blue-100 text-blue-800';
      case 'consultation': return 'bg-green-100 text-green-800';
      case 'procedure': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'discharge': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReport = (visit: VisitRecord) => {
    const report = `
VISIT DOCUMENTATION REPORT
========================

Patient Information:
- Name: ${visit.patientName}
- Bed Number: ${visit.bedNumber}
- Patient ID: ${visit.patientId}

Visit Details:
- Date: ${visit.date}
- Time: ${visit.time}
- Type: ${visit.visitType.toUpperCase()}
- Attending: ${visit.doctor}
- Status: ${visit.status.toUpperCase()}

Clinical Notes:
${visit.notes}

${visit.vitals ? `
Vital Signs:
- Temperature: ${visit.vitals.temperature}
- Blood Pressure: ${visit.vitals.bloodPressure}
- Heart Rate: ${visit.vitals.heartRate}
- Oxygen Saturation: ${visit.vitals.oxygenSat}
` : ''}

${visit.medications ? `
Medications:
${visit.medications.map(med => `- ${med}`).join('\n')}
` : ''}

Follow-up Required: ${visit.followUpRequired ? 'YES' : 'NO'}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit-report-${visit.id}-${visit.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Visit History Generator
              </CardTitle>
              <CardDescription>
                Auto-generate and manage patient visit documentation
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingVisit(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Visit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingVisit && (
            <Card className="mb-6 border-2 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add New Visit Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Patient Name"
                    value={newVisit.patientName || ''}
                    onChange={(e) => setNewVisit(prev => ({ ...prev, patientName: e.target.value }))}
                  />
                  <Input
                    placeholder="Bed Number"
                    value={newVisit.bedNumber || ''}
                    onChange={(e) => setNewVisit(prev => ({ ...prev, bedNumber: e.target.value }))}
                  />
                  <Select
                    value={newVisit.visitType}
                    onValueChange={(value) => setNewVisit(prev => ({ ...prev, visitType: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Visit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounds">Daily Rounds</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="discharge">Discharge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Attending Doctor"
                  value={newVisit.doctor || ''}
                  onChange={(e) => setNewVisit(prev => ({ ...prev, doctor: e.target.value }))}
                />

                <Textarea
                  placeholder="Visit notes and observations..."
                  value={newVisit.notes || ''}
                  onChange={(e) => setNewVisit(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingVisit(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVisit}>
                    Save Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {visits.map((visit) => (
              <Card key={visit.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{visit.patientName}</h3>
                      <Badge variant="outline">{visit.bedNumber}</Badge>
                      <Badge className={getVisitTypeColor(visit.visitType)}>
                        {visit.visitType.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={visit.status === 'completed' ? 'default' : 'secondary'}>
                        {visit.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => generateReport(visit)}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{visit.date} at {visit.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{visit.doctor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Visit ID: {visit.id}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Clinical Notes:</h4>
                    <p className="text-sm text-gray-700">{visit.notes}</p>
                  </div>

                  {visit.vitals && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="font-semibold">{visit.vitals.temperature}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="font-semibold">{visit.vitals.bloodPressure}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="font-semibold">{visit.vitals.heartRate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Oxygen Sat</p>
                        <p className="font-semibold">{visit.vitals.oxygenSat}</p>
                      </div>
                    </div>
                  )}

                  {visit.medications && visit.medications.length > 0 && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2">Medications:</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.medications.map((med, index) => (
                          <Badge key={index} variant="outline">{med}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {visit.followUpRequired && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <strong>⚠️ Follow-up Required</strong>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{visits.length}</p>
              <p className="text-sm text-gray-500">Total Visits</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">{visits.filter(v => v.visitType === 'rounds').length}</p>
              <p className="text-sm text-gray-500">Daily Rounds</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <User className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{visits.filter(v => v.visitType === 'consultation').length}</p>
              <p className="text-sm text-gray-500">Consultations</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Download className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{visits.filter(v => v.followUpRequired).length}</p>
              <p className="text-sm text-gray-500">Follow-ups Needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
