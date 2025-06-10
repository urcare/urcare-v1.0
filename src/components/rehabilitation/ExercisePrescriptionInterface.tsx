
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Play, Clock, Target, Plus, Video, CheckCircle } from 'lucide-react';

export const ExercisePrescriptionInterface = () => {
  const [selectedProgram, setSelectedProgram] = useState('program-1');

  const exercisePrograms = [
    {
      id: 'program-1',
      name: 'Post-Knee Surgery Recovery',
      patient: 'John Smith',
      therapist: 'Dr. Sarah Williams',
      exercises: 8,
      duration: 45,
      frequency: '3x/week',
      compliance: 85,
      status: 'active'
    },
    {
      id: 'program-2',
      name: 'Stroke Rehabilitation - Upper Limb',
      patient: 'Maria Garcia',
      therapist: 'Mike Johnson',
      exercises: 12,
      duration: 60,
      frequency: '5x/week',
      compliance: 92,
      status: 'active'
    },
    {
      id: 'program-3',
      name: 'Speech Articulation Exercises',
      patient: 'Robert Wilson',
      therapist: 'Dr. Emily Chen',
      exercises: 6,
      duration: 30,
      frequency: '2x/day',
      compliance: 78,
      status: 'needs-review'
    }
  ];

  const exercises = [
    {
      id: 1,
      name: 'Knee Flexion',
      type: 'Range of Motion',
      sets: 3,
      reps: 15,
      duration: null,
      difficulty: 'Beginner',
      hasVideo: true,
      completed: true,
      notes: 'Increase range by 5 degrees'
    },
    {
      id: 2,
      name: 'Quad Strengthening',
      type: 'Strength',
      sets: 2,
      reps: 10,
      duration: null,
      difficulty: 'Intermediate',
      hasVideo: true,
      completed: true,
      notes: 'Hold for 5 seconds'
    },
    {
      id: 3,
      name: 'Balance Training',
      type: 'Balance',
      sets: 1,
      reps: null,
      duration: 60,
      difficulty: 'Beginner',
      hasVideo: true,
      completed: false,
      notes: 'Use wall support if needed'
    },
    {
      id: 4,
      name: 'Walking Practice',
      type: 'Functional',
      sets: 1,
      reps: null,
      duration: 600,
      difficulty: 'Intermediate',
      hasVideo: false,
      completed: false,
      notes: 'Gradually increase distance'
    }
  ];

  const exerciseCategories = [
    { name: 'Range of Motion', count: 12, color: 'bg-blue-100 text-blue-800' },
    { name: 'Strength', count: 8, color: 'bg-red-100 text-red-800' },
    { name: 'Balance', count: 6, color: 'bg-green-100 text-green-800' },
    { name: 'Functional', count: 10, color: 'bg-purple-100 text-purple-800' },
    { name: 'Cardiovascular', count: 5, color: 'bg-orange-100 text-orange-800' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500 text-white';
      case 'needs-review': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exercise Prescription</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Exercise Library
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Exercise Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercisePrograms.map((program) => (
                <div 
                  key={program.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProgram === program.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedProgram(program.id)}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{program.name}</h3>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{program.patient}</p>
                    <p className="text-xs text-gray-500">{program.therapist}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{program.exercises} exercises</span>
                      <span>{program.duration}min</span>
                      <span>{program.frequency}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Compliance</span>
                        <span>{program.compliance}%</span>
                      </div>
                      <Progress value={program.compliance} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exercise Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className={`border-l-4 ${exercise.completed ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {exercise.name}
                            {exercise.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </h3>
                          <Badge className={getDifficultyColor(exercise.difficulty)} variant="outline">
                            {exercise.difficulty}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {exercise.hasVideo && (
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              Video
                            </Button>
                          )}
                          <Badge variant="outline">{exercise.type}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {exercise.sets && (
                          <div>
                            <span className="text-gray-600">Sets:</span>
                            <div className="font-bold">{exercise.sets}</div>
                          </div>
                        )}
                        {exercise.reps && (
                          <div>
                            <span className="text-gray-600">Reps:</span>
                            <div className="font-bold">{exercise.reps}</div>
                          </div>
                        )}
                        {exercise.duration && (
                          <div>
                            <span className="text-gray-600">Duration:</span>
                            <div className="font-bold">{formatDuration(exercise.duration)}</div>
                          </div>
                        )}
                      </div>
                      
                      {exercise.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Notes:</strong> {exercise.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {exerciseCategories.map((category) => (
              <div key={category.name} className="p-4 border rounded-lg text-center">
                <Badge className={category.color} variant="outline">
                  {category.name}
                </Badge>
                <div className="text-2xl font-bold mt-2">{category.count}</div>
                <p className="text-sm text-gray-600">exercises</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Weekly Compliance</h3>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-sm text-green-600">Above target</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Exercises Completed</h3>
              <div className="text-2xl font-bold text-blue-600">124</div>
              <p className="text-sm text-blue-600">This week</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Active Programs</h3>
              <div className="text-2xl font-bold text-purple-600">15</div>
              <p className="text-sm text-purple-600">Currently assigned</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-800">Avg. Session Time</h3>
              <div className="text-2xl font-bold text-orange-600">42</div>
              <p className="text-sm text-orange-600">minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
