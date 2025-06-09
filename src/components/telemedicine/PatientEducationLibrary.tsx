
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Play,
  Search,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Award,
  Download,
  Share
} from 'lucide-react';

export const PatientEducationLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const educationContent = [
    {
      id: 1,
      title: 'Understanding Diabetes Management',
      category: 'Diabetes',
      type: 'video',
      duration: '15:30',
      views: 2847,
      rating: 4.8,
      level: 'beginner',
      description: 'Learn the basics of managing type 2 diabetes through diet, exercise, and medication.',
      thumbnail: '/placeholder.svg',
      completed: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Heart-Healthy Nutrition Guide',
      category: 'Cardiology',
      type: 'interactive',
      duration: '12:45',
      views: 1923,
      rating: 4.6,
      level: 'intermediate',
      description: 'Interactive guide to creating heart-healthy meal plans and understanding nutrition labels.',
      thumbnail: '/placeholder.svg',
      completed: false,
      progress: 65
    },
    {
      id: 3,
      title: 'Managing Hypertension at Home',
      category: 'Cardiology',
      type: 'video',
      duration: '18:20',
      views: 3156,
      rating: 4.9,
      level: 'beginner',
      description: 'Practical tips for monitoring and managing blood pressure at home.',
      thumbnail: '/placeholder.svg',
      completed: false,
      progress: 30
    },
    {
      id: 4,
      title: 'Mental Health and Wellness',
      category: 'Mental Health',
      type: 'article',
      duration: '8:00',
      views: 1467,
      rating: 4.7,
      level: 'beginner',
      description: 'Understanding stress, anxiety, and depression with practical coping strategies.',
      thumbnail: '/placeholder.svg',
      completed: true,
      progress: 100
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: educationContent.length },
    { id: 'Diabetes', name: 'Diabetes', count: 1 },
    { id: 'Cardiology', name: 'Cardiology', count: 2 },
    { id: 'Mental Health', name: 'Mental Health', count: 1 }
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Diabetes Management Journey',
      modules: 8,
      duration: '2.5 hours',
      progress: 75,
      enrolled: 542,
      description: 'Comprehensive learning path for newly diagnosed diabetes patients'
    },
    {
      id: 2,
      title: 'Heart Health Mastery',
      modules: 12,
      duration: '4 hours',
      progress: 40,
      enrolled: 398,
      description: 'Complete guide to cardiovascular health and prevention'
    },
    {
      id: 3,
      title: 'Mental Wellness Foundation',
      modules: 6,
      duration: '1.5 hours',
      progress: 90,
      enrolled: 287,
      description: 'Building resilience and mental health awareness'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Knowledge Seeker',
      description: 'Completed 5 educational modules',
      icon: BookOpen,
      earned: true,
      date: '2024-06-05'
    },
    {
      id: 2,
      title: 'Health Champion',
      description: 'Maintained 7-day learning streak',
      icon: Award,
      earned: true,
      date: '2024-06-08'
    },
    {
      id: 3,
      title: 'Diabetes Expert',
      description: 'Completed diabetes learning path',
      icon: Star,
      earned: false,
      progress: 75
    }
  ];

  const filteredContent = educationContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'interactive': return <Users className="h-4 w-4" />;
      case 'article': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library" className="w-full">
        <TabsList>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search educational content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((content) => (
              <Card key={content.id} className="cursor-pointer hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    {getTypeIcon(content.type)}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getLevelColor(content.level)}>
                      {content.level}
                    </Badge>
                    {content.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{content.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{content.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{content.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{content.views} views</span>
                      <span>{content.category}</span>
                    </div>

                    {content.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{content.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all" 
                            style={{ width: `${content.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        {content.completed ? 'Review' : content.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          {/* Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Structured Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div key={path.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-lg">{path.title}</div>
                        <div className="text-sm text-gray-600">{path.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{path.enrolled} enrolled</div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {path.modules} modules
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-sm">
                        <div className="text-gray-600">Duration:</div>
                        <div className="font-medium">{path.duration}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Modules:</div>
                        <div className="font-medium">{path.modules}</div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Progress:</div>
                        <div className="font-medium">{path.progress}%</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Completion Progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all" 
                          style={{ width: `${path.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
                      </Button>
                      <Button variant="outline">
                        View Curriculum
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Learning Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Completed Modules</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">8.5</div>
                    <div className="text-sm text-gray-600">Hours Learned</div>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Current Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educationContent.filter(c => c.progress > 0 && c.progress < 100).map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getTypeIcon(content.type)}
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-gray-600">{content.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{content.progress}% complete</div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${content.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Learning Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card key={achievement.id} className={`${achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-full ${achievement.earned ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                            <IconComponent className={`h-5 w-5 ${achievement.earned ? 'text-yellow-600' : 'text-gray-500'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-gray-600">{achievement.description}</div>
                          </div>
                        </div>
                        
                        {achievement.earned ? (
                          <div className="text-sm text-yellow-600 font-medium">
                            Earned on {achievement.date}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              Progress: {achievement.progress}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
