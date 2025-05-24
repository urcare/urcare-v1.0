
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Target, Calendar, Award } from 'lucide-react';

interface AdherenceData {
  medication: string;
  currentScore: number;
  weeklyScore: number;
  monthlyScore: number;
  trend: 'up' | 'down' | 'stable';
  missedDoses: number;
  totalDoses: number;
  lastTaken: Date;
  streak: number;
}

const sampleAdherenceData: AdherenceData[] = [
  {
    medication: 'Lisinopril 10mg',
    currentScore: 95,
    weeklyScore: 92,
    monthlyScore: 88,
    trend: 'up',
    missedDoses: 2,
    totalDoses: 30,
    lastTaken: new Date('2024-01-20T08:00:00'),
    streak: 7
  },
  {
    medication: 'Metformin 500mg',
    currentScore: 78,
    weeklyScore: 85,
    monthlyScore: 82,
    trend: 'down',
    missedDoses: 8,
    totalDoses: 60,
    lastTaken: new Date('2024-01-19T20:00:00'),
    streak: 3
  }
];

export const AdherenceScoring = () => {
  const [adherenceData] = useState<AdherenceData[]>(sampleAdherenceData);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const overallScore = Math.round(
    adherenceData.reduce((acc, med) => acc + med.currentScore, 0) / adherenceData.length
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Medication Adherence Scoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <Badge className={`text-lg px-3 py-1 ${getScoreColor(overallScore)}`}>
              Grade: {getScoreGrade(overallScore)}
            </Badge>
            <p className="text-gray-600">Overall Adherence Score</p>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Time Frame Selector */}
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant={timeframe === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeframe('week')}
          >
            This Week
          </Button>
          <Button
            size="sm"
            variant={timeframe === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeframe('month')}
          >
            This Month
          </Button>
          <Button
            size="sm"
            variant={timeframe === 'all' ? 'default' : 'outline'}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </Button>
        </div>

        {/* Individual Medication Scores */}
        <div className="space-y-4">
          <h4 className="font-medium">Individual Medication Scores</h4>
          <div className="space-y-3">
            {adherenceData.map((med, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">{med.medication}</h5>
                    <p className="text-sm text-gray-600">
                      Last taken: {med.lastTaken.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getScoreColor(med.currentScore)}`}>
                      {med.currentScore}%
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(med.trend)}
                      <span className="text-sm text-gray-600">
                        {med.trend === 'up' ? 'Improving' : med.trend === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    </div>
                  </div>
                </div>

                <Progress value={med.currentScore} className="h-2" />

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{med.streak}</div>
                    <div className="text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{med.totalDoses - med.missedDoses}/{med.totalDoses}</div>
                    <div className="text-gray-600">Doses Taken</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-medium">{med.missedDoses}</div>
                    <div className="text-gray-600">Missed</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-gold text-yellow-800">🏆</Badge>
              <span>7-day perfect streak for Lisinopril</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="bg-silver text-gray-800">🥈</Badge>
              <span>90%+ adherence for 2 weeks</span>
            </div>
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Tips to Improve Adherence</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Set up smart reminders based on your routine</li>
            <li>• Use pill organizers for weekly planning</li>
            <li>• Link medication times to daily habits</li>
            <li>• Share your progress with family members</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
