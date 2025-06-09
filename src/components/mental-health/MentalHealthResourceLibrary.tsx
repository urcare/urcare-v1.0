
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Search,
  Play,
  Download,
  Heart,
  Star,
  Clock,
  Users,
  Filter,
  Bookmark
} from 'lucide-react';

export const MentalHealthResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resourceCategories = [
    { id: 'all', name: 'All Resources', count: 156 },
    { id: 'depression', name: 'Depression', count: 42 },
    { id: 'anxiety', name: 'Anxiety', count: 38 },
    { id: 'ptsd', name: 'PTSD', count: 24 },
    { id: 'bipolar', name: 'Bipolar', count: 18 },
    { id: 'addiction', name: 'Addiction', count: 22 },
    { id: 'relationships', name: 'Relationships', count: 12 }
  ];

  const videoResources = [
    {
      id: 1,
      title: 'Understanding Depression: A Comprehensive Guide',
      category: 'depression',
      duration: '12:34',
      views: 15420,
      rating: 4.8,
      thumbnail: '/placeholder.svg',
      description: 'Learn about the symptoms, causes, and treatment options for depression.',
      tags: ['depression', 'mental health', 'education'],
      difficulty: 'beginner'
    },
    {
      id: 2,
      title: 'Anxiety Management Techniques',
      category: 'anxiety',
      duration: '8:45',
      views: 12890,
      rating: 4.9,
      thumbnail: '/placeholder.svg',
      description: 'Practical techniques for managing anxiety in daily life.',
      tags: ['anxiety', 'coping', 'techniques'],
      difficulty: 'intermediate'
    },
    {
      id: 3,
      title: 'Mindfulness Meditation for Beginners',
      category: 'general',
      duration: '15:22',
      views: 23456,
      rating: 4.7,
      thumbnail: '/placeholder.svg',
      description: 'Introduction to mindfulness meditation practices.',
      tags: ['mindfulness', 'meditation', 'stress'],
      difficulty: 'beginner'
    }
  ];

  const interactiveModules = [
    {
      id: 1,
      title: 'CBT Thought Record Worksheet',
      category: 'depression',
      type: 'interactive',
      estimatedTime: '15 min',
      completions: 3420,
      rating: 4.6,
      description: 'Interactive worksheet to identify and challenge negative thought patterns.',
      features: ['Self-guided', 'Progress tracking', 'Printable']
    },
    {
      id: 2,
      title: 'Anxiety Self-Assessment Tool',
      category: 'anxiety',
      type: 'assessment',
      estimatedTime: '10 min',
      completions: 5670,
      rating: 4.8,
      description: 'Comprehensive tool to assess anxiety levels and get personalized recommendations.',
      features: ['Instant results', 'Personalized', 'Progress tracking']
    },
    {
      id: 3,
      title: 'Mood Tracking Journal',
      category: 'general',
      type: 'tool',
      estimatedTime: '5 min daily',
      completions: 8920,
      rating: 4.5,
      description: 'Daily mood tracking with insights and pattern recognition.',
      features: ['Daily tracking', 'Analytics', 'Export data']
    }
  ];

  const personalizedRecommendations = [
    {
      id: 1,
      title: 'Recommended for You: Sleep and Mental Health',
      reason: 'Based on your recent sleep assessment',
      resources: ['Sleep Hygiene Video', 'Bedtime Routine Planner', 'Sleep Diary Template'],
      priority: 'high'
    },
    {
      id: 2,
      title: 'Continue Learning: Cognitive Behavioral Therapy',
      reason: 'You completed Introduction to CBT',
      resources: ['Advanced CBT Techniques', 'CBT Homework Exercises', 'Thought Record Practice'],
      priority: 'medium'
    }
  ];

  const filteredResources = [...videoResources, ...interactiveModules].filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return BookOpen;
      case 'assessment': return Users;
      case 'tool': return Heart;
      default: return Play;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalizedRecommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {rec.resources.map((resource, index) => (
                    <Badge key={index} variant="secondary">{resource}</Badge>
                  ))}
                </div>
                <Button size="sm">Explore Resources</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resourceCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  className="w-full justify-between"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => {
                  const TypeIcon = getTypeIcon(resource.type || 'video');
                  return (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <TypeIcon className="h-8 w-8 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium mb-1 line-clamp-2">{resource.title}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{resource.description}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              {'difficulty' in resource && (
                                <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                                  {resource.difficulty}
                                </Badge>
                              )}
                              <Badge variant="outline">{resource.category}</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {'duration' in resource ? resource.duration : `${resource.estimatedTime}`}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {resource.rating}
                                </div>
                              </div>
                              <Button size="sm">
                                {'duration' in resource ? (
                                  <>
                                    <Play className="h-3 w-3 mr-1" />
                                    Watch
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    Start
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoResources.filter(resource => 
                  (selectedCategory === 'all' || resource.category === selectedCategory) &&
                  resource.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="font-medium mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {video.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {video.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {video.views.toLocaleString()}
                          </div>
                        </div>
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="interactive" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interactiveModules.filter(module => 
                  (selectedCategory === 'all' || module.category === selectedCategory) &&
                  module.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((module) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{module.type}</Badge>
                      </div>
                      
                      <h3 className="font-medium mb-2">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {module.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {module.rating}
                          </div>
                        </div>
                        <Button size="sm">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assessments" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interactiveModules.filter(module => 
                  module.type === 'assessment' &&
                  (selectedCategory === 'all' || module.category === selectedCategory) &&
                  module.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-purple-600" />
                        <Badge variant="outline">Assessment</Badge>
                      </div>
                      
                      <h3 className="font-medium mb-2">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {assessment.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {assessment.completions.toLocaleString()}
                          </div>
                        </div>
                        <Button size="sm">
                          <Users className="h-3 w-3 mr-1" />
                          Take Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
