
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { MoodEntry, MoodType } from '@/types/emotionalHealth';
import { Calendar, MessageCircle } from 'lucide-react';

interface MoodTrackerProps {
  onMoodSubmit: (mood: MoodEntry) => void;
  recentEntries: MoodEntry[];
}

const moodOptions = [
  { mood: 'very_happy' as MoodType, emoji: '😄', label: 'Very Happy', color: 'text-green-500' },
  { mood: 'happy' as MoodType, emoji: '😊', label: 'Happy', color: 'text-green-400' },
  { mood: 'excited' as MoodType, emoji: '🤩', label: 'Excited', color: 'text-yellow-500' },
  { mood: 'calm' as MoodType, emoji: '😌', label: 'Calm', color: 'text-blue-400' },
  { mood: 'neutral' as MoodType, emoji: '😐', label: 'Neutral', color: 'text-gray-400' },
  { mood: 'sad' as MoodType, emoji: '😢', label: 'Sad', color: 'text-blue-500' },
  { mood: 'very_sad' as MoodType, emoji: '😭', label: 'Very Sad', color: 'text-blue-600' },
  { mood: 'anxious' as MoodType, emoji: '😰', label: 'Anxious', color: 'text-purple-500' },
  { mood: 'stressed' as MoodType, emoji: '😫', label: 'Stressed', color: 'text-red-500' },
  { mood: 'angry' as MoodType, emoji: '😠', label: 'Angry', color: 'text-red-600' },
];

export function MoodTracker({ onMoodSubmit, recentEntries }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!selectedMood) return;

    const selectedMoodOption = moodOptions.find(m => m.mood === selectedMood);
    if (!selectedMoodOption) return;

    const moodEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      mood: selectedMood,
      emoji: selectedMoodOption.emoji,
      intensity: intensity[0],
      timestamp: new Date(),
      notes: notes || undefined,
    };

    onMoodSubmit(moodEntry);
    
    // Reset form
    setSelectedMood(null);
    setIntensity([5]);
    setNotes('');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Track Your Mood
          </CardTitle>
          <CardDescription>
            How are you feeling right now? Select your mood and intensity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Select your mood</Label>
            <div className="grid grid-cols-5 gap-3 mt-3">
              {moodOptions.map((option) => (
                <button
                  key={option.mood}
                  onClick={() => setSelectedMood(option.mood)}
                  className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                    selectedMood === option.mood
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">
                  Intensity: {intensity[0]}/10
                </Label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-medium">
                  Optional notes
                </Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's on your mind? Any triggers or thoughts..."
                  className="w-full mt-2 p-3 border rounded-lg resize-none h-20"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Log Mood
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Mood History</CardTitle>
          <CardDescription>
            Your last 7 mood entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No mood entries yet. Start by logging your current mood!
            </p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <div className="font-medium capitalize">
                        {entry.mood.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Intensity: {entry.intensity}/10
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
