
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
import { Activity, TrendingUp, TrendingDown, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: number;
  timestamp: string;
  triggers?: string;
  relief?: string;
  duration: string;
  notes?: string;
}

export const SymptomSeverityTracker = () => {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([
    {
      id: '1',
      symptom: 'Headache',
      severity: 6,
      timestamp: '2024-01-20 14:30',
      triggers: 'Stress, lack of sleep',
      relief: 'Ibuprofen, dark room',
      duration: '3 hours',
      notes: 'Started after morning meeting'
    },
    {
      id: '2',
      symptom: 'Joint Pain',
      severity: 4,
      timestamp: '2024-01-20 08:00',
      triggers: 'Weather change',
      relief: 'Gentle stretching',
      duration: '2 hours',
      notes: 'Worse in the morning'
    },
    {
      id: '3',
      symptom: 'Fatigue',
      severity: 8,
      timestamp: '2024-01-19 16:00',
      triggers: 'Poor sleep, heavy workload',
      relief: 'Rest, caffeine',
      duration: '6+ hours',
      notes: 'Very difficult to concentrate'
    }
  ]);

  const [newSymptom, setNewSymptom] = useState({
    symptom: '',
    severity: 5,
    triggers: '',
    relief: '',
    duration: '',
    notes: ''
  });

  const severityLabels = {
    1: 'Very Mild',
    2: 'Mild',
    3: 'Mild-Moderate',
    4: 'Moderate',
    5: 'Moderate-Severe',
    6: 'Severe',
    7: 'Very Severe',
    8: 'Extremely Severe',
    9: 'Unbearable',
    10: 'Emergency'
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return { color: 'text-green-600', bg: 'bg-green-100' };
    if (severity <= 4) return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (severity <= 6) return { color: 'text-orange-600', bg: 'bg-orange-100' };
    if (severity <= 8) return { color: 'text-red-600', bg: 'bg-red-100' };
    return { color: 'text-red-800', bg: 'bg-red-200' };
  };

  const addSymptom = () => {
    if (!newSymptom.symptom) {
      toast.error('Please enter a symptom name');
      return;
    }

    const entry: SymptomEntry = {
      id: `symptom_${Date.now()}`,
      symptom: newSymptom.symptom,
      severity: newSymptom.severity,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      triggers: newSymptom.triggers || undefined,
      relief: newSymptom.relief || undefined,
      duration: newSymptom.duration,
      notes: newSymptom.notes || undefined
    };

    setSymptoms(prev => [entry, ...prev]);
    setNewSymptom({
      symptom: '',
      severity: 5,
      triggers: '',
      relief: '',
      duration: '',
      notes: ''
    });

    if (entry.severity >= 9) {
      toast.error('High severity symptom logged! Consider seeking immediate medical attention.');
    } else if (entry.severity >= 7) {
      toast.warning('Severe symptom logged. Monitor closely and consider medical consultation.');
    } else {
      toast.success('Symptom logged successfully!');
    }
  };

  const getSymptomTrend = (symptomName: string) => {
    const symptomEntries = symptoms.filter(s => s.symptom.toLowerCase() === symptomName.toLowerCase());
    if (symptomEntries.length < 2) return null;
    
    const recent = symptomEntries[0].severity;
    const previous = symptomEntries[1].severity;
    return recent > previous ? 'worsening' : recent < previous ? 'improving' : 'stable';
  };

  const getAverageSeverity = (symptomName?: string) => {
    const relevantSymptoms = symptomName 
      ? symptoms.filter(s => s.symptom.toLowerCase() === symptomName.toLowerCase())
      : symptoms;
    
    if (relevantSymptoms.length === 0) return 0;
    return Math.round(relevantSymptoms.reduce((sum, s) => sum + s.severity, 0) / relevantSymptoms.length);
  };

  const uniqueSymptoms = [...new Set(symptoms.map(s => s.symptom))];
  const highSeverityCount = symptoms.filter(s => s.severity >= 7).length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Symptom Severity Tracker
          </CardTitle>
          <CardDescription>
            Track symptom patterns, triggers, and relief methods to identify trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{symptoms.length}</div>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{uniqueSymptoms.length}</div>
              <p className="text-sm text-gray-600">Unique Symptoms</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{getAverageSeverity()}</div>
              <p className="text-sm text-gray-600">Avg Severity</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{highSeverityCount}</div>
              <p className="text-sm text-gray-600">High Severity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Log New Symptom</h3>
              <div className="space-y-3">
                <div>
                  <Label>Symptom Name</Label>
                  <Input
                    value={newSymptom.symptom}
                    onChange={(e) => setNewSymptom(prev => ({ ...prev, symptom: e.target.value }))}
                    placeholder="e.g., Headache, Joint Pain, Nausea"
                  />
                </div>
                
                <div>
                  <Label>Severity: {severityLabels[newSymptom.severity as keyof typeof severityLabels]}</Label>
                  <Slider
                    value={[newSymptom.severity]}
                    onValueChange={([value]) => setNewSymptom(prev => ({ ...prev, severity: value }))}
                    min={1}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 - Very Mild</span>
                    <span>10 - Emergency</span>
                  </div>
                </div>

                <div>
                  <Label>Duration</Label>
                  <Select value={newSymptom.duration} onValueChange={(value) => setNewSymptom(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long has this lasted?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="few-minutes">Few minutes</SelectItem>
                      <SelectItem value="30-minutes">30 minutes</SelectItem>
                      <SelectItem value="1-hour">1 hour</SelectItem>
                      <SelectItem value="2-3-hours">2-3 hours</SelectItem>
                      <SelectItem value="half-day">Half day</SelectItem>
                      <SelectItem value="full-day">Full day</SelectItem>
                      <SelectItem value="multiple-days">Multiple days</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Possible Triggers</Label>
                  <Input
                    value={newSymptom.triggers}
                    onChange={(e) => setNewSymptom(prev => ({ ...prev, triggers: e.target.value }))}
                    placeholder="Stress, weather, food, etc."
                  />
                </div>

                <div>
                  <Label>Relief Methods</Label>
                  <Input
                    value={newSymptom.relief}
                    onChange={(e) => setNewSymptom(prev => ({ ...prev, relief: e.target.value }))}
                    placeholder="What helped or might help?"
                  />
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={newSymptom.notes}
                    onChange={(e) => setNewSymptom(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any other relevant details..."
                    rows={2}
                  />
                </div>

                <Button onClick={addSymptom} className="w-full">
                  Log Symptom
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Entries</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {symptoms.map((entry) => {
                  const severityInfo = getSeverityColor(entry.severity);
                  const trend = getSymptomTrend(entry.symptom);
                  
                  return (
                    <div key={entry.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{entry.symptom}</h4>
                          <Badge className={`${severityInfo.bg} ${severityInfo.color} text-xs`}>
                            {entry.severity}/10
                          </Badge>
                          {trend && (
                            <div className="flex items-center gap-1">
                              {trend === 'worsening' && <TrendingUp className="h-3 w-3 text-red-500" />}
                              {trend === 'improving' && <TrendingDown className="h-3 w-3 text-green-500" />}
                              <span className="text-xs text-gray-500">{trend}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {entry.timestamp.slice(11)}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div><strong>Duration:</strong> {entry.duration}</div>
                        {entry.triggers && <div><strong>Triggers:</strong> {entry.triggers}</div>}
                        {entry.relief && <div><strong>Relief:</strong> {entry.relief}</div>}
                        {entry.notes && <div><strong>Notes:</strong> {entry.notes}</div>}
                      </div>

                      {entry.severity >= 9 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          High severity - Consider seeking medical attention
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uniqueSymptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uniqueSymptoms.map((symptom) => {
                const symptomEntries = symptoms.filter(s => s.symptom === symptom);
                const avgSeverity = getAverageSeverity(symptom);
                const trend = getSymptomTrend(symptom);
                const severityInfo = getSeverityColor(avgSeverity);
                
                return (
                  <div key={symptom} className="p-4 border rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{symptom}</h4>
                        {trend && (
                          <div className="flex items-center gap-1">
                            {trend === 'worsening' && <TrendingUp className="h-4 w-4 text-red-500" />}
                            {trend === 'improving' && <TrendingDown className="h-4 w-4 text-green-500" />}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Average Severity</span>
                          <span className={severityInfo.color}>{avgSeverity}/10</span>
                        </div>
                        <Progress value={avgSeverity * 10} className="h-2" />
                        <div className="text-sm text-gray-600">
                          {symptomEntries.length} entries recorded
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
