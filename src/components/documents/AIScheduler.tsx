
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, Brain, Bell, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface AISchedulerProps {
  medications: any[];
  onScheduleUpdate: (medicationId: string, times: string[]) => void;
  smartRemindersEnabled: boolean;
}

export const AIScheduler = ({ medications, onScheduleUpdate, smartRemindersEnabled }: AISchedulerProps) => {
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [learningMode, setLearningMode] = useState(true);

  useEffect(() => {
    if (smartRemindersEnabled) {
      generateAIRecommendations();
    }
  }, [medications, smartRemindersEnabled]);

  const generateAIRecommendations = () => {
    // Mock AI recommendations based on medication patterns
    const recommendations = medications.map(med => {
      const currentTimes = med.reminderTimes || ['08:00'];
      let optimizedTimes = [...currentTimes];
      let reasoning = '';

      // AI logic for optimization
      if (med.frequency === 'Twice daily') {
        optimizedTimes = ['08:00', '20:00'];
        reasoning = 'Optimized for 12-hour spacing to maintain consistent blood levels';
      } else if (med.frequency === 'Three times daily') {
        optimizedTimes = ['08:00', '14:00', '20:00'];
        reasoning = 'Spaced evenly throughout waking hours for optimal absorption';
      } else if (med.instructions && med.instructions.includes('with meals')) {
        optimizedTimes = ['08:00', '12:30', '18:30'];
        reasoning = 'Aligned with typical meal times for better absorption and reduced side effects';
      }

      return {
        medicationId: med.id,
        medicationName: med.name,
        currentTimes: currentTimes,
        optimizedTimes: optimizedTimes,
        reasoning: reasoning,
        adherenceImprovement: Math.round(Math.random() * 15 + 5), // 5-20% improvement
        confidence: Math.round(Math.random() * 30 + 70) // 70-100% confidence
      };
    });

    setAiRecommendations(recommendations);
  };

  const handleApplyRecommendation = (recommendation: any) => {
    onScheduleUpdate(recommendation.medicationId, recommendation.optimizedTimes);
    toast.success(`AI schedule applied for ${recommendation.medicationName}`);
    
    // Remove applied recommendation
    setAiRecommendations(prev => 
      prev.filter(rec => rec.medicationId !== recommendation.medicationId)
    );
  };

  const upcomingReminders = medications.flatMap(med => 
    med.reminderTimes.map((time: string) => ({
      id: `${med.id}-${time}`,
      medication: med.name,
      time: time,
      dosage: med.dosage,
      status: 'pending'
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Smart Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <Label className="text-base">AI Learning Mode</Label>
              <p className="text-sm text-gray-600">AI analyzes your patterns to optimize reminder timing</p>
            </div>
            <Switch checked={learningMode} onCheckedChange={setLearningMode} />
          </div>

          {/* AI Recommendations */}
          {smartRemindersEnabled && aiRecommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Optimization Suggestions
              </h3>
              {aiRecommendations.map((rec) => (
                <Card key={rec.medicationId} className="border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{rec.medicationName}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rec.reasoning}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {rec.confidence}% confident
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-sm text-gray-600">Current Schedule</Label>
                        <div className="flex gap-1 mt-1">
                          {rec.currentTimes.map((time: string, idx: number) => (
                            <Badge key={idx} variant="outline">{time}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">AI Recommended</Label>
                        <div className="flex gap-1 mt-1">
                          {rec.optimizedTimes.map((time: string, idx: number) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">{time}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-green-600">
                        Expected adherence improvement: +{rec.adherenceImprovement}%
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Dismiss
                        </Button>
                        <Button size="sm" onClick={() => handleApplyRecommendation(rec)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Today's Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Reminder Schedule
            </h3>
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium">{reminder.time}</p>
                      <p className="text-sm text-gray-600">{reminder.medication} - {reminder.dosage}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Test Reminders
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Sync Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
