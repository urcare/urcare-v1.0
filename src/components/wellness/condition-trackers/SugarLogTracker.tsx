
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Droplets } from 'lucide-react';
import { toast } from 'sonner';

interface BloodSugarReading {
  id: string;
  value: number;
  timestamp: string;
  type: 'fasting' | 'before-meal' | 'after-meal' | 'bedtime' | 'random';
  notes?: string;
}

export const SugarLogTracker = () => {
  const [readings, setReadings] = useState<BloodSugarReading[]>([
    {
      id: '1',
      value: 95,
      timestamp: '2024-01-20 07:00',
      type: 'fasting',
      notes: 'Feeling good'
    },
    {
      id: '2',
      value: 140,
      timestamp: '2024-01-20 12:30',
      type: 'after-meal',
      notes: 'Lunch with rice'
    },
    {
      id: '3',
      value: 180,
      timestamp: '2024-01-20 19:15',
      type: 'after-meal',
      notes: 'Large dinner'
    }
  ]);

  const [newReading, setNewReading] = useState({
    value: '',
    type: '',
    notes: ''
  });

  const getSugarLevel = (value: number, type: string) => {
    const ranges = {
      'fasting': { normal: [70, 100], prediabetic: [100, 126], diabetic: 126 },
      'random': { normal: [70, 140], prediabetic: [140, 200], diabetic: 200 },
      'after-meal': { normal: [70, 140], prediabetic: [140, 200], diabetic: 200 },
      'before-meal': { normal: [70, 130], prediabetic: [130, 180], diabetic: 180 },
      'bedtime': { normal: [100, 140], prediabetic: [140, 180], diabetic: 180 }
    };

    const range = ranges[type as keyof typeof ranges] || ranges.random;
    
    if (value < range.normal[0]) return { level: 'low', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (value <= range.normal[1]) return { level: 'normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (value <= range.prediabetic[1]) return { level: 'high', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'very-high', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const addReading = () => {
    if (!newReading.value || !newReading.type) {
      toast.error('Please enter blood sugar value and type');
      return;
    }

    const reading: BloodSugarReading = {
      id: `reading_${Date.now()}`,
      value: Number(newReading.value),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      type: newReading.type as any,
      notes: newReading.notes
    };

    setReadings(prev => [reading, ...prev]);
    setNewReading({ value: '', type: '', notes: '' });
    
    const level = getSugarLevel(reading.value, reading.type);
    if (level.level === 'very-high') {
      toast.error('High blood sugar detected! Consider contacting your healthcare provider.');
    } else if (level.level === 'low') {
      toast.warning('Low blood sugar detected! Consider having a quick snack.');
    } else {
      toast.success('Blood sugar reading logged successfully!');
    }
  };

  const getAverage = (period: string) => {
    const now = new Date();
    const periodStart = new Date();
    
    if (period === '7days') periodStart.setDate(now.getDate() - 7);
    else if (period === '30days') periodStart.setMonth(now.getMonth() - 1);
    
    const periodReadings = readings.filter(r => new Date(r.timestamp) >= periodStart);
    return periodReadings.length > 0 
      ? Math.round(periodReadings.reduce((sum, r) => sum + r.value, 0) / periodReadings.length)
      : 0;
  };

  const getTrendIcon = () => {
    if (readings.length < 2) return null;
    const recent = readings[0].value;
    const previous = readings[1].value;
    return recent > previous ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Blood Sugar Log
          </CardTitle>
          <CardDescription>
            Track and monitor your blood glucose levels throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{getAverage('7days')}</div>
              <p className="text-sm text-gray-600">7-Day Average (mg/dL)</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{readings.length}</div>
              <p className="text-sm text-gray-600">Total Readings</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                {readings.length > 0 ? readings[0].value : '--'}
                {getTrendIcon()}
              </div>
              <p className="text-sm text-gray-600">Latest Reading</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Add New Reading</h3>
              <div className="space-y-3">
                <div>
                  <Label>Blood Sugar (mg/dL)</Label>
                  <Input
                    type="number"
                    value={newReading.value}
                    onChange={(e) => setNewReading(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Enter reading"
                  />
                </div>
                <div>
                  <Label>Reading Type</Label>
                  <Select value={newReading.type} onValueChange={(value) => setNewReading(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">Fasting</SelectItem>
                      <SelectItem value="before-meal">Before Meal</SelectItem>
                      <SelectItem value="after-meal">After Meal</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={newReading.notes}
                    onChange={(e) => setNewReading(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about food, activity, etc."
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
                  const level = getSugarLevel(reading.value, reading.type);
                  return (
                    <div key={reading.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{reading.value} mg/dL</span>
                          <Badge className={`${level.bg} ${level.color} text-xs`}>
                            {level.level.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {reading.timestamp.slice(11)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="capitalize">{reading.type.replace('-', ' ')}</span>
                        {reading.notes && ` • ${reading.notes}`}
                      </div>
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
