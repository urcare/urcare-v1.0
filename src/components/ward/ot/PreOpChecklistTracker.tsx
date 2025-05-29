
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckSquare, Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';

export const PreOpChecklistTracker = () => {
  const [selectedPatient, setSelectedPatient] = useState('');

  const patients = [
    { id: 1, name: 'John Doe', procedure: 'CABG', scheduled: '09:00', room: 'OT-1' },
    { id: 2, name: 'Jane Smith', procedure: 'Hip Replacement', scheduled: '08:00', room: 'OT-2' },
    { id: 3, name: 'Mike Wilson', procedure: 'Appendectomy', scheduled: '14:00', room: 'OT-3' },
  ];

  const checklistItems = [
    { id: 1, category: 'Patient Identification', item: 'Patient identity verified with 2 identifiers', completed: true, verifiedBy: 'Nurse Johnson', time: '07:30' },
    { id: 2, category: 'Patient Identification', item: 'Surgical site marked and verified', completed: true, verifiedBy: 'Dr. Smith', time: '07:35' },
    { id: 3, category: 'Medical History', item: 'Allergies documented and communicated', completed: true, verifiedBy: 'Nurse Johnson', time: '07:32' },
    { id: 4, category: 'Medical History', item: 'Current medications reviewed', completed: true, verifiedBy: 'Dr. Smith', time: '07:40' },
    { id: 5, category: 'Consent', item: 'Informed consent obtained and signed', completed: true, verifiedBy: 'Dr. Smith', time: '07:45' },
    { id: 6, category: 'Consent', item: 'Anesthesia consent obtained', completed: false, verifiedBy: '', time: '' },
    { id: 7, category: 'Pre-operative Care', item: 'NPO status confirmed (minimum 8 hours)', completed: true, verifiedBy: 'Nurse Johnson', time: '07:50' },
    { id: 8, category: 'Pre-operative Care', item: 'Pre-operative shower/skin prep completed', completed: false, verifiedBy: '', time: '' },
    { id: 9, category: 'Lab Results', item: 'Blood work reviewed and within normal limits', completed: true, verifiedBy: 'Dr. Smith', time: '07:55' },
    { id: 10, category: 'Lab Results', item: 'Imaging results reviewed', completed: false, verifiedBy: '', time: '' },
    { id: 11, category: 'Equipment', item: 'Required surgical instruments sterilized and ready', completed: false, verifiedBy: '', time: '' },
    { id: 12, category: 'Equipment', item: 'Anesthesia equipment checked', completed: false, verifiedBy: '', time: '' },
  ];

  const [checklist, setChecklist] = useState(checklistItems);

  const getCompletionPercentage = () => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const getStatusColor = () => {
    const percentage = getCompletionPercentage();
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, completed: !item.completed, verifiedBy: !item.completed ? 'Current User' : '', time: !item.completed ? new Date().toLocaleTimeString() : '' }
        : item
    ));
  };

  const groupedChecklist = checklist.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklistItems>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-blue-600" />
          Pre-Operative Checklist Tracker
        </h2>
        <Button className="bg-green-600 hover:bg-green-700">
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map(patient => (
          <Card key={patient.id} className={`cursor-pointer transition-all ${selectedPatient === patient.name ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedPatient(patient.name)}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{patient.name}</h3>
                  <Badge variant="outline">{patient.room}</Badge>
                </div>
                <p className="text-sm text-gray-600">{patient.procedure}</p>
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Scheduled: {patient.scheduled}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Pre-Op Checklist: {selectedPatient}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getStatusColor()}`}>
                  {getCompletionPercentage()}% Complete
                </span>
                {getCompletionPercentage() === 100 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(groupedChecklist).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">{category}</h3>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.id} className={`border rounded-lg p-4 ${item.completed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={item.completed}
                            onCheckedChange={() => toggleChecklistItem(item.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${item.completed ? 'text-green-800' : 'text-red-800'}`}>
                              {item.item}
                            </p>
                            {item.completed && (
                              <div className="mt-2 text-sm text-green-600">
                                <p>✓ Verified by: {item.verifiedBy}</p>
                                <p>✓ Time: {item.time}</p>
                              </div>
                            )}
                            {!item.completed && (
                              <div className="mt-2 space-y-2">
                                <Input placeholder="Verified by" className="text-sm" />
                                <Textarea placeholder="Notes (optional)" className="text-sm" rows={2} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Final Verification</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <Label>All checklist items completed and verified</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <Label>Patient ready for surgery</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <Label>OR team notified</Label>
                </div>
              </div>
              <Button className="w-full mt-4" disabled={getCompletionPercentage() !== 100}>
                Mark Patient Ready for Surgery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
