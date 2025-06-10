
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Trophy, MessageSquare, Home, Star, Play, Share } from 'lucide-react';

export const PatientEngagementPlatform = () => {
  const [selectedTab, setSelectedTab] = useState('content');

  const educationalContent = [
    {
      id: 1,
      title: 'Understanding Your Knee Recovery',
      type: 'Article',
      category: 'Post-Surgery',
      duration: '5 min read',
      rating: 4.8,
      completed: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Safe Movement Techniques',
      type: 'Video',
      category: 'Exercise',
      duration: '12 min',
      rating: 4.9,
      completed: false,
      progress: 60
    },
    {
      id: 3,
      title: 'Managing Pain During Recovery',
      type: 'Interactive Guide',
      category: 'Pain Management',
      duration: '8 min',
      rating: 4.7,
      completed: false,
      progress: 0
    },
    {
      id: 4,
      title: 'Home Exercise Basics',
      type: 'Video Series',
      category: 'Exercise',
      duration: '25 min',
      rating: 4.9,
      completed: false,
      progress: 30
    }
  ];

  const homePrograms = [
    {
      id: 1,
      name: 'Morning Mobility Routine',
      exercises: 6,
      duration: 20,
      completionRate: 85,
      lastCompleted: '2024-01-12',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      name: 'Strength Building Program',
      exercises: 8,
      duration: 30,
      completionRate: 72,
      lastCompleted: '2024-01-11',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      name: 'Balance and Coordination',
      exercises: 5,
      duration: 15,
      completionRate: 90,
      lastCompleted: '2024-01-12',
      difficulty: 'Beginner'
    }
  ];

  const achievements = [
    {
      id: 1,
      name: 'First Week Champion',
      description: 'Completed all exercises for 7 consecutive days',
      earned: true,
      earnedDate: '2024-01-08',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      name: 'Knowledge Seeker',
      description: 'Completed 10 educational modules',
      earned: true,
      earnedDate: '2024-01-10',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      id: 3,
      name: 'Consistency Master',
      description: 'Maintained 90% completion rate for a month',
      earned: false,
      progress: 75,
      icon: Star,
      color: 'text-purple-600'
    },
    {
      id: 4,
      name: 'Community Helper',
      description: 'Helped 5 other patients in forums',
      earned: false,
      progress: 40,
      icon: Users,
      color: 'text-green-600'
    }
  ];

  const progressData = [
    { metric: 'Exercise Compliance', value: 85, target: 90, unit: '%' },
    { metric: 'Content Engagement', value: 78, target: 75, unit: '%' },
    { metric: 'Community Participation', value: 42, target: 50, unit: 'posts' },
    { metric: 'Goal Achievement', value: 7, target: 10, unit: 'goals' }
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Article': return 'bg-blue-100 text-blue-800';
      case 'Video': return 'bg-red-100 text-red-800';
      case 'Interactive Guide': return 'bg-green-100 text-green-800';
      case 'Video Series': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Engagement Platform</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
          <Button className="bg-cyan-600 hover:bg-cyan-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Community Forum
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Content Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-sm text-gray-600">Modules completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-green-600" />
              Home Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-sm text-gray-600">Compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <p className="text-sm text-gray-600">Badges earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">42</div>
            <p className="text-sm text-gray-600">Forum posts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Educational Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {educationalContent.map((content) => (
                <Card key={content.id} className={`border-l-4 ${content.completed ? 'border-l-green-500' : 'border-l-blue-500'}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{content.title}</h3>
                          <p className="text-sm text-gray-600">{content.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(content.type)} variant="outline">
                            {content.type}
                          </Badge>
                          {content.completed && (
                            <Badge className="bg-green-500 text-white">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{content.duration}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {content.rating}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{content.progress}%</span>
                        </div>
                        <Progress value={content.progress} className="h-2" />
                      </div>
                      
                      <Button size="sm" className="w-full">
                        <Play className="h-3 w-3 mr-1" />
                        {content.completed ? 'Review' : 'Continue'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Home Exercise Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homePrograms.map((program) => (
                <Card key={program.id} className="border-l-4 border-l-cyan-500">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{program.name}</h3>
                          <p className="text-sm text-gray-600">
                            {program.exercises} exercises • {program.duration} min
                          </p>
                        </div>
                        <Badge className={getDifficultyColor(program.difficulty)} variant="outline">
                          {program.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Completion Rate</span>
                          <span>{program.completionRate}%</span>
                        </div>
                        <Progress value={program.completionRate} className="h-2" />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Last completed: {program.lastCompleted}
                      </div>
                      
                      <Button size="sm" className="w-full" variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Start Program
                      </Button>
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
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`border-l-4 ${achievement.earned ? 'border-l-yellow-500' : 'border-l-gray-300'}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                      <div>
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    
                    {achievement.earned ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-500 text-white">Earned</Badge>
                        <span className="text-sm text-gray-600">{achievement.earnedDate}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {progressData.map((data, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-sm mb-2">{data.metric}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold text-cyan-600">
                      {data.value}{data.unit}
                    </span>
                    <span className="text-sm text-gray-600">
                      Target: {data.target}{data.unit}
                    </span>
                  </div>
                  <Progress 
                    value={data.unit === '%' ? data.value : (data.value / data.target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
