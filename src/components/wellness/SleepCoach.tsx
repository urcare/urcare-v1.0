
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Bed, Coffee, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
}

export const SleepCoach = () => {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([
    {
      id: '1',
      date: '2024-01-20',
      bedtime: '22:30',
      wakeTime: '07:00',
      duration: 8.5,
      quality: 8,
      mood: 'excellent'
    },
    {
      id: '2',
      date: '2024-01-19',
      bedtime: '23:15',
      wakeTime: '06:45',
      duration: 7.5,
      quality: 6,
      mood: 'good'
    },
    {
      id: '3',
      date: '2024-01-18',
      bedtime: '23:45',
      wakeTime: '07:15',
      duration: 7.5,
      quality: 5,
      mood: 'fair'
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    bedtime: '22:00',
    wakeTime: '07:00',
    quality: [7],
    mood: 'good' as SleepEntry['mood']
  });

  const calculateSleepStats = () => {
    const recentEntries = sleepEntries.slice(0, 7);
    const avgDuration = recentEntries.reduce((sum, entry) => sum + entry.duration, 0) / recentEntries.length;
    const avgQuality = recentEntries.reduce((sum, entry) => sum + entry.quality, 0) / recentEntries.length;
    
    return {
      avgDuration: Math.round(avgDuration * 10) / 10,
      avgQuality: Math.round(avgQuality * 10) / 10,
      consistency: recentEntries.length >= 7 ? 'Good' : 'Needs Improvement'
    };
  };

  const addSleepEntry = () => {
    const bedtimeHour = parseInt(newEntry.bedtime.split(':')[0]);
    const bedtimeMin = parseInt(newEntry.bedtime.split(':')[1]);
    const waketimeHour = parseInt(newEntry.wakeTime.split(':')[0]);
    const waketimeMin = parseInt(newEntry.wakeTime.split(':')[1]);
    
    // Calculate duration (handling overnight sleep)
    let duration = (waketimeHour + waketimeMin/60) - (bedtimeHour + bedtimeMin/60);
    if (duration < 0) duration += 24; // Handle overnight sleep
    
    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      bedtime: newEntry.bedtime,
      wakeTime: newEntry.wakeTime,
      duration: Math.round(duration * 10) / 10,
      quality: newEntry.quality[0],
      mood: newEntry.mood
    };
    
    setSleepEntries(prev => [entry, ...prev]);
    toast.success('Sleep entry added successfully!');
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = calculateSleepStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-500" />
            Sleep Coach
          </CardTitle>
          <CardDescription>
            Track your sleep patterns and get personalized insights for better rest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{stats.avgDuration}h</div>
              <div className="text-sm text-blue-600">Avg Sleep Duration</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.avgQuality}/10</div>
              <div className="text-sm text-green-600">Avg Sleep Quality</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Coffee className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-800">{stats.consistency}</div>
              <div className="text-sm text-purple-600">Sleep Consistency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Last Night's Sleep</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedtime</label>
              <input
                type="time"
                value={newEntry.bedtime}
                onChange={(e) => setNewEntry(prev => ({ ...prev, bedtime: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Wake Time</label>
              <input
                type="time"
                value={newEntry.wakeTime}
                onChange={(e) => setNewEntry(prev => ({ ...prev, wakeTime: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Sleep Quality: {newEntry.quality[0]}/10
            </label>
            <Slider
              value={newEntry.quality}
              onValueChange={(value) => setNewEntry(prev => ({ ...prev, quality: value }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Morning Mood</label>
            <div className="flex gap-2">
              {(['excellent', 'good', 'fair', 'poor'] as const).map((mood) => (
                <Button
                  key={mood}
                  variant={newEntry.mood === mood ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                  className="capitalize"
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
          
          <Button onClick={addSleepEntry} className="w-full">
            <Moon className="h-4 w-4 mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sleepEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">{entry.bedtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{entry.wakeTime}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {entry.duration}h
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Quality: {entry.quality}/10</Badge>
                  <Badge className={getMoodColor(entry.mood)}>
                    {entry.mood}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Coaching Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Consistency is Key</h4>
              <p className="text-sm text-blue-600">Try to go to bed and wake up at the same time every day</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">Pre-Sleep Routine</h4>
              <p className="text-sm text-purple-600">Create a relaxing routine 1 hour before bedtime</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Sleep Environment</h4>
              <p className="text-sm text-green-600">Keep your bedroom cool, dark, and quiet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
