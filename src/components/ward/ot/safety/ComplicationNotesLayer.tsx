
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Eye, Calendar, User, Clock } from 'lucide-react';

export const ComplicationNotesLayer = () => {
  const [selectedSurgery, setSelectedSurgery] = useState('');

  const surgeries = [
    { id: 1, patient: 'John Doe', procedure: 'CABG', date: '2024-01-15', room: 'OT-1', surgeon: 'Dr. Smith' },
    { id: 2, patient: 'Jane Smith', procedure: 'Hip Replacement', date: '2024-01-15', room: 'OT-2', surgeon: 'Dr. Johnson' },
    { id: 3, patient: 'Mike Wilson', procedure: 'Appendectomy', date: '2024-01-14', room: 'OT-3', surgeon: 'Dr. Brown' },
  ];

  const complications = [
    {
      id: 1,
      surgeryId: 1,
      type: 'Intraoperative',
      severity: 'Major',
      description: 'Unexpected bleeding requiring additional intervention',
      reportedBy: 'Dr. Smith',
      time: '10:45 AM',
      actions: 'Additional sutures applied, blood transfusion initiated',
      outcome: 'Resolved'
    },
    {
      id: 2,
      surgeryId: 2,
      type: 'Postoperative',
      severity: 'Minor',
      description: 'Mild wound site infection',
      reportedBy: 'Nurse Johnson',
      time: '2:30 PM',
      actions: 'Antibiotic treatment started, wound care protocol initiated',
      outcome: 'Monitoring'
    }
  ];

  const complicationTypes = ['Intraoperative', 'Postoperative', 'Equipment-related', 'Anesthesia-related'];
  const severityLevels = ['Minor', 'Moderate', 'Major', 'Critical'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Minor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          Complication Notes & Tracking
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Complication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report New Complication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Surgery Case</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select surgery" />
                    </SelectTrigger>
                    <SelectContent>
                      {surgeries.map(surgery => (
                        <SelectItem key={surgery.id} value={surgery.id.toString()}>
                          {surgery.patient} - {surgery.procedure}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Complication Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {complicationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Severity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time of Occurrence</Label>
                  <Input type="time" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the complication" rows={3} />
              </div>
              <div>
                <Label>Immediate Actions Taken</Label>
                <Textarea placeholder="Actions and interventions performed" rows={3} />
              </div>
              <div>
                <Label>Current Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="monitoring">Under Monitoring</SelectItem>
                    <SelectItem value="ongoing">Ongoing Treatment</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Submit Complication Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {surgeries.map(surgery => (
          <Card key={surgery.id} className={`cursor-pointer transition-all ${selectedSurgery === surgery.patient ? 'ring-2 ring-red-500' : ''}`} onClick={() => setSelectedSurgery(surgery.patient)}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{surgery.patient}</h3>
                  <Badge variant="outline">{surgery.room}</Badge>
                </div>
                <p className="text-sm text-gray-600">{surgery.procedure}</p>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <Calendar className="h-3 w-3" />
                  {surgery.date}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <User className="h-3 w-3" />
                  {surgery.surgeon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSurgery && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Complications for {selectedSurgery}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complications.filter(comp => {
                const surgery = surgeries.find(s => s.patient === selectedSurgery);
                return surgery && comp.surgeryId === surgery.id;
              }).map(complication => (
                <div key={complication.id} className={`border rounded-lg p-4 ${getSeverityColor(complication.severity)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{complication.type}</Badge>
                        <Badge className={getSeverityColor(complication.severity)}>{complication.severity}</Badge>
                      </div>
                      <h3 className="font-semibold">{complication.description}</h3>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {complication.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {complication.reportedBy}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium text-sm">Actions Taken:</h4>
                      <p className="text-sm">{complication.actions}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant={complication.outcome === 'Resolved' ? 'default' : 'secondary'}>
                        {complication.outcome}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {complications.filter(comp => {
                const surgery = surgeries.find(s => s.patient === selectedSurgery);
                return surgery && comp.surgeryId === surgery.id;
              }).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No complications reported for this surgery</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
