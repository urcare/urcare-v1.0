
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Pill, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MedicationLog {
  id: string;
  medicationName: string;
  dosage: string;
  takenAt: string;
  effectiveness: number;
  sideEffects?: string;
  symptomsBefore: number;
  symptomsAfter: number;
  notes?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  condition: string;
  active: boolean;
}

export const MedicationEffectivenessTracker = () => {
  const [medications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2024-01-01',
      condition: 'High Blood Pressure',
      active: true
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2023-12-15',
      condition: 'Diabetes',
      active: true
    }
  ]);

  const [logs, setLogs] = useState<MedicationLog[]>([
    {
      id: '1',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      takenAt: '2024-01-20 08:00',
      effectiveness: 8,
      symptomsBefore: 6,
      symptomsAfter: 3,
      notes: 'Feeling much better, no headaches'
    },
    {
      id: '2',
      medicationName: 'Metformin',
      dosage: '500mg',
      takenAt: '2024-01-20 07:30',
      effectiveness: 7,
      sideEffects: 'Mild stomach upset',
      symptomsBefore: 5,
      symptomsAfter: 2,
      notes: 'Blood sugar stable'
    }
  ]);

  const [newLog, setNewLog] = useState({
    medicationName: '',
    effectiveness: 5,
    sideEffects: '',
    symptomsBefore: 5,
    symptomsAfter: 5,
    notes: ''
  });

  const effectivenessLabels = {
    1: 'Not Effective',
    2: 'Slightly Effective',
    3: 'Somewhat Effective',
    4: 'Moderately Effective',
    5: 'Effective',
    6: 'Very Effective',
    7: 'Highly Effective',
    8: 'Extremely Effective',
    9: 'Outstanding',
    10: 'Perfect'
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness <= 3) return { color: 'text-red-600', bg: 'bg-red-100' };
    if (effectiveness <= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (effectiveness <= 7) return { color: 'text-blue-600', bg: 'bg-blue-100' };
    return { color: 'text-green-600', bg: 'bg-green-100' };
  };

  const addLog = () => {
    if (!newLog.medicationName) {
      toast.error('Please select a medication');
      return;
    }

    const selectedMed = medications.find(m => m.name === newLog.medicationName);
    if (!selectedMed) {
      toast.error('Medication not found');
      return;
    }

    const log: MedicationLog = {
      id: `log_${Date.now()}`,
      medicationName: newLog.medicationName,
      dosage: selectedMed.dosage,
      takenAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      effectiveness: newLog.effectiveness,
      sideEffects: newLog.sideEffects || undefined,
      symptomsBefore: newLog.symptomsBefore,
      symptomsAfter: newLog.symptomsAfter,
      notes: newLog.notes || undefined
    };

    setLogs(prev => [log, ...prev]);
    setNewLog({
      medicationName: '',
      effectiveness: 5,
      sideEffects: '',
      symptomsBefore: 5,
      symptomsAfter: 5,
      notes: ''
    });

    const improvement = log.symptomsBefore - log.symptomsAfter;
    if (improvement >= 3) {
      toast.success('Great improvement logged! Your medication seems to be working well.');
    } else if (improvement <= 0) {
      toast.warning('No improvement or symptoms worsened. Consider discussing with your doctor.');
    } else {
      toast.success('Medication effectiveness logged successfully!');
    }
  };

  const getMedicationStats = (medName: string) => {
    const medLogs = logs.filter(l => l.medicationName === medName);
    if (medLogs.length === 0) return null;

    const avgEffectiveness = medLogs.reduce((sum, l) => sum + l.effectiveness, 0) / medLogs.length;
    const avgImprovement = medLogs.reduce((sum, l) => sum + (l.symptomsBefore - l.symptomsAfter), 0) / medLogs.length;
    const sideEffectsCount = medLogs.filter(l => l.sideEffects).length;

    return {
      avgEffectiveness: Math.round(avgEffectiveness * 10) / 10,
      avgImprovement: Math.round(avgImprovement * 10) / 10,
      sideEffectsRate: Math.round((sideEffectsCount / medLogs.length) * 100),
      totalLogs: medLogs.length
    };
  };

  const getTrend = (medName: string) => {
    const medLogs = logs.filter(l => l.medicationName === medName);
    if (medLogs.length < 2) return null;

    const recent = medLogs[0].effectiveness;
    const previous = medLogs[1].effectiveness;
    return recent > previous ? 'improving' : recent < previous ? 'declining' : 'stable';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Medication Effectiveness Tracker
          </CardTitle>
          <CardDescription>
            Track how well your medications are working and identify patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{medications.filter(m => m.active).length}</div>
              <p className="text-sm text-gray-600">Active Medications</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{logs.length}</div>
              <p className="text-sm text-gray-600">Total Logs</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {logs.length > 0 ? Math.round((logs.reduce((sum, l) => sum + l.effectiveness, 0) / logs.length) * 10) / 10 : 0}
              </div>
              <p className="text-sm text-gray-600">Avg Effectiveness</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {logs.filter(l => l.sideEffects).length}
              </div>
              <p className="text-sm text-gray-600">Side Effects Reported</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Log Medication Effectiveness</h3>
              <div className="space-y-3">
                <div>
                  <Label>Medication</Label>
                  <Select value={newLog.medicationName} onValueChange={(value) => setNewLog(prev => ({ ...prev, medicationName: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {medications.filter(m => m.active).map((med) => (
                        <SelectItem key={med.id} value={med.name}>
                          {med.name} ({med.dosage})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Effectiveness: {effectivenessLabels[newLog.effectiveness as keyof typeof effectivenessLabels]}</Label>
                  <Slider
                    value={[newLog.effectiveness]}
                    onValueChange={([value]) => setNewLog(prev => ({ ...prev, effectiveness: value }))}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 - Not Effective</span>
                    <span>10 - Perfect</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Symptoms Before</Label>
                    <Slider
                      value={[newLog.symptomsBefore]}
                      onValueChange={([value]) => setNewLog(prev => ({ ...prev, symptomsBefore: value }))}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {newLog.symptomsBefore}/10
                    </div>
                  </div>
                  <div>
                    <Label>Symptoms After</Label>
                    <Slider
                      value={[newLog.symptomsAfter]}
                      onValueChange={([value]) => setNewLog(prev => ({ ...prev, symptomsAfter: value }))}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <div className="text-center text-sm text-gray-600 mt-1">
                      {newLog.symptomsAfter}/10
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Side Effects (Optional)</Label>
                  <Input
                    value={newLog.sideEffects}
                    onChange={(e) => setNewLog(prev => ({ ...prev, sideEffects: e.target.value }))}
                    placeholder="Any side effects experienced?"
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newLog.notes}
                    onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional observations..."
                    rows={2}
                  />
                </div>

                <Button onClick={addLog} className="w-full">
                  Log Effectiveness
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Logs</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => {
                  const effectivenessInfo = getEffectivenessColor(log.effectiveness);
                  const improvement = log.symptomsBefore - log.symptomsAfter;
                  
                  return (
                    <div key={log.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{log.medicationName}</h4>
                          <Badge className={`${effectivenessInfo.bg} ${effectivenessInfo.color} text-xs`}>
                            {log.effectiveness}/10
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {log.takenAt.slice(11)}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Symptom Change:</span>
                          <span className={improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-600'}>
                            {improvement > 0 ? '-' : '+'}{Math.abs(improvement)} points
                          </span>
                        </div>
                        {log.sideEffects && (
                          <div className="flex items-start gap-1">
                            <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5" />
                            <span><strong>Side Effects:</strong> {log.sideEffects}</span>
                          </div>
                        )}
                        {log.notes && <div><strong>Notes:</strong> {log.notes}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medication Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications.filter(m => m.active).map((medication) => {
              const stats = getMedicationStats(medication.name);
              const trend = getTrend(medication.name);
              
              if (!stats) {
                return (
                  <div key={medication.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{medication.name}</h4>
                    <p className="text-sm text-gray-600">No effectiveness data logged yet</p>
                  </div>
                );
              }

              const effectivenessInfo = getEffectivenessColor(stats.avgEffectiveness);
              
              return (
                <div key={medication.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{medication.name}</h4>
                    <div className="flex items-center gap-2">
                      {trend && (
                        <>
                          {trend === 'improving' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {trend === 'declining' && <TrendingDown className="h-4 w-4 text-red-500" />}
                          <span className="text-xs text-gray-500">{trend}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Avg Effectiveness</span>
                      <span className={effectivenessInfo.color}>{stats.avgEffectiveness}/10</span>
                    </div>
                    <Progress value={stats.avgEffectiveness * 10} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Avg Improvement: </span>
                        <span className={stats.avgImprovement > 0 ? 'text-green-600' : 'text-red-600'}>
                          {stats.avgImprovement > 0 ? '+' : ''}{stats.avgImprovement}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Side Effects: </span>
                        <span>{stats.sideEffectsRate}%</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Based on {stats.totalLogs} log{stats.totalLogs !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
