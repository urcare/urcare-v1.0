
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, AlertTriangle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BPReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: string;
  notes?: string;
}

export const BloodPressureTracker = () => {
  const [readings, setReadings] = useState<BPReading[]>([
    {
      id: '1',
      systolic: 118,
      diastolic: 78,
      pulse: 72,
      timestamp: '2024-01-20 08:00',
      notes: 'Morning reading'
    },
    {
      id: '2',
      systolic: 125,
      diastolic: 82,
      pulse: 75,
      timestamp: '2024-01-20 20:00',
      notes: 'Evening reading after dinner'
    },
    {
      id: '3',
      systolic: 142,
      diastolic: 89,
      pulse: 68,
      timestamp: '2024-01-19 14:30',
      notes: 'After stressful meeting'
    }
  ]);

  const [newReading, setNewReading] = useState({
    systolic: '',
    diastolic: '',
    pulse: '',
    notes: ''
  });

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) {
      return { category: 'Low', color: 'text-blue-600', bg: 'bg-blue-100', alert: 'warning' };
    } else if (systolic < 120 && diastolic < 80) {
      return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-100', alert: 'none' };
    } else if (systolic < 130 && diastolic < 80) {
      return { category: 'Elevated', color: 'text-yellow-600', bg: 'bg-yellow-100', alert: 'info' };
    } else if (systolic < 140 || diastolic < 90) {
      return { category: 'High Stage 1', color: 'text-orange-600', bg: 'bg-orange-100', alert: 'warning' };
    } else if (systolic < 180 && diastolic < 120) {
      return { category: 'High Stage 2', color: 'text-red-600', bg: 'bg-red-100', alert: 'danger' };
    } else {
      return { category: 'Crisis', color: 'text-red-800', bg: 'bg-red-200', alert: 'critical' };
    }
  };

  const addReading = () => {
    if (!newReading.systolic || !newReading.diastolic || !newReading.pulse) {
      toast.error('Please enter all blood pressure values');
      return;
    }

    const reading: BPReading = {
      id: `bp_${Date.now()}`,
      systolic: Number(newReading.systolic),
      diastolic: Number(newReading.diastolic),
      pulse: Number(newReading.pulse),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      notes: newReading.notes
    };

    setReadings(prev => [reading, ...prev]);
    setNewReading({ systolic: '', diastolic: '', pulse: '', notes: '' });
    
    const category = getBPCategory(reading.systolic, reading.diastolic);
    
    if (category.alert === 'critical') {
      toast.error('CRITICAL: Blood pressure crisis detected! Seek immediate medical attention!');
    } else if (category.alert === 'danger') {
      toast.error('HIGH: Blood pressure is elevated. Consider contacting your doctor.');
    } else if (category.alert === 'warning') {
      toast.warning(`Blood pressure reading: ${category.category}. Monitor closely.`);
    } else {
      toast.success('Blood pressure reading logged successfully!');
    }
  };

  const getAverage = (type: 'systolic' | 'diastolic' | 'pulse') => {
    if (readings.length === 0) return 0;
    return Math.round(readings.reduce((sum, r) => sum + r[type], 0) / readings.length);
  };

  const getTrend = (type: 'systolic' | 'diastolic') => {
    if (readings.length < 2) return null;
    const recent = readings[0][type];
    const previous = readings[1][type];
    return recent > previous ? 'up' : recent < previous ? 'down' : 'stable';
  };

  const highReadings = readings.filter(r => {
    const category = getBPCategory(r.systolic, r.diastolic);
    return category.alert === 'danger' || category.alert === 'critical';
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Blood Pressure Tracker
          </CardTitle>
          <CardDescription>
            Monitor your blood pressure and receive alerts for concerning readings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {highReadings.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                You have {highReadings.length} high blood pressure reading(s) recently. 
                Consider consulting with your healthcare provider.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
                {getAverage('systolic')}
                {getTrend('systolic') === 'up' && <TrendingUp className="h-4 w-4" />}
                {getTrend('systolic') === 'down' && <TrendingDown className="h-4 w-4" />}
              </div>
              <p className="text-sm text-gray-600">Avg Systolic</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-600">
                {getAverage('diastolic')}
                {getTrend('diastolic') === 'up' && <TrendingUp className="h-4 w-4" />}
                {getTrend('diastolic') === 'down' && <TrendingDown className="h-4 w-4" />}
              </div>
              <p className="text-sm text-gray-600">Avg Diastolic</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{getAverage('pulse')}</div>
              <p className="text-sm text-gray-600">Avg Pulse</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{readings.length}</div>
              <p className="text-sm text-gray-600">Total Readings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Add New Reading</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Systolic (mmHg)</Label>
                    <Input
                      type="number"
                      value={newReading.systolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, systolic: e.target.value }))}
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <Label>Diastolic (mmHg)</Label>
                    <Input
                      type="number"
                      value={newReading.diastolic}
                      onChange={(e) => setNewReading(prev => ({ ...prev, diastolic: e.target.value }))}
                      placeholder="80"
                    />
                  </div>
                </div>
                <div>
                  <Label>Pulse (bpm)</Label>
                  <Input
                    type="number"
                    value={newReading.pulse}
                    onChange={(e) => setNewReading(prev => ({ ...prev, pulse: e.target.value }))}
                    placeholder="72"
                  />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={newReading.notes}
                    onChange={(e) => setNewReading(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add context about this reading..."
                  />
                </div>
                <Button onClick={addReading} className="w-full">
                  Log Reading
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Recent Readings</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {readings.map((reading) => {
                  const category = getBPCategory(reading.systolic, reading.diastolic);
                  return (
                    <div key={reading.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                            {reading.systolic}/{reading.diastolic}
                          </span>
                          <Badge className={`${category.bg} ${category.color} text-xs`}>
                            {category.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {reading.timestamp.slice(11)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Pulse: {reading.pulse} bpm</span>
                        {reading.notes && ` • ${reading.notes}`}
                      </div>
                      {category.alert === 'critical' && (
                        <div className="mt-2 text-xs text-red-600 font-medium">
                          ⚠️ CRISIS LEVEL - Seek immediate medical attention
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
    </div>
  );
};
