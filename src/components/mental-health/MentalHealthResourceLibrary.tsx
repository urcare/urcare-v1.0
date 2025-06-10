
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen,
  Video,
  Download,
  Clock,
  Star,
  Eye,
  Search,
  Filter,
  Play,
  FileText,
  Users,
  TrendingUp,
  Heart,
  Brain
} from 'lucide-react';

export const MentalHealthResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    'Depression',
    'Anxiety',
    'PTSD',
    'Bipolar',
    'Stress Management',
    'Mindfulness',
    'Sleep',
    'Addiction',
    'Grief',
    'Relationships'
  ];

  const resources = [
    {
      id: 1,
      title: 'Understanding Depression: A Complete Guide',
      type: 'video',
      category: 'Depression',
      duration: '15 mins',
      views: 1250,
      rating: 4.8,
      thumbnail: '/placeholder.svg',
      description: 'Comprehensive overview of depression symptoms, causes, and treatment options',
      tags: ['education', 'awareness', 'treatment'],
      difficulty: 'Beginner'
    },
    {
      id: 2,
      title: 'Anxiety Management Techniques',
      type: 'video',
      category: 'Anxiety',
      duration: '12 mins',
      views: 980,
      rating: 4.6,
      thumbnail: '/placeholder.svg',
      description: 'Practical techniques for managing anxiety in daily life',
      tags: ['techniques', 'coping', 'self-help'],
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Mindfulness Meditation for Beginners',
      type: 'video',
      category: 'Mindfulness',
      duration: '20 mins',
      views: 2100,
      rating: 4.9,
      thumbnail: '/placeholder.svg',
      description: 'Introduction to mindfulness meditation practices',
      tags: ['meditation', 'mindfulness', 'relaxation'],
      difficulty: 'Beginner'
    },
    {
      id: 4,
      title: 'Interactive CBT Worksheet',
      type: 'interactive',
      category: 'Depression',
      estimatedTime: '30 mins',
      completions: 450,
      rating: 4.7,
      description: 'Cognitive Behavioral Therapy exercises for thought pattern analysis',
      tags: ['CBT', 'worksheets', 'self-assessment'],
      difficulty: 'Intermediate',
      features: ['Progress tracking', 'Personalized feedback', 'Printable results']
    },
    {
      id: 5,
      title: 'PTSD Recovery Workbook',
      type: 'interactive',
      category: 'PTSD',
      estimatedTime: '45 mins',
      completions: 320,
      rating: 4.5,
      description: 'Structured exercises for PTSD recovery and coping strategies',
      tags: ['PTSD', 'recovery', 'workbook'],
      difficulty: 'Advanced',
      features: ['Multi-session support', 'Progress tracking', 'Crisis resources']
    },
    {
      id: 6,
      title: 'Sleep Hygiene Assessment',
      type: 'interactive',
      category: 'Sleep',
      estimatedTime: '15 mins',
      completions: 680,
      rating: 4.4,
      description: 'Evaluate and improve your sleep habits',
      tags: ['sleep', 'assessment', 'habits'],
      difficulty: 'Beginner',
      features: ['Personalized recommendations', 'Sleep diary', 'Progress tracking']
    }
  ];

  const articles = [
    {
      id: 1,
      title: '10 Evidence-Based Strategies for Managing Depression',
      category: 'Depression',
      readTime: '8 min read',
      author: 'Dr. Sarah Johnson',
      publishDate: '2024-01-10',
      views: 3200,
      description: 'Research-backed approaches to depression management and recovery'
    },
    {
      id: 2,
      title: 'The Science of Anxiety: Understanding Your Brain',
      category: 'Anxiety',
      readTime: '12 min read',
      author: 'Dr. Michael Chen',
      publishDate: '2024-01-08',
      views: 2800,
      description: 'Explore the neurological basis of anxiety and how it affects behavior'
    },
    {
      id: 3,
      title: 'Building Resilience After Trauma',
      category: 'PTSD',
      readTime: '15 min read',
      author: 'Dr. Emily Rodriguez',
      publishDate: '2024-01-05',
      views: 2100,
      description: 'Strategies for building psychological resilience following traumatic experiences'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'interactive': return Brain;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="interactive">Interactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="resources" className="w-full">
        <TabsList>
          <TabsTrigger value="resources">Interactive Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles & Guides</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resource.type === 'video' && (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {resource.type === 'video' ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {resource.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {resource.views}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {resource.estimatedTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {resource.completions}
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {resource.type === 'interactive' && 'features' in resource && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Features:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {resource.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        {resource.type === 'video' ? 'Watch Now' : 'Start Module'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="space-y-4">
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-3">{article.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By {article.author}</span>
                        <span>{article.publishDate}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views}
                        </div>
                      </div>
                    </div>
                    <Button>Read Article</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">12,450</div>
                <div className="text-sm text-gray-600">Total Resource Views</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">3,200</div>
                <div className="text-sm text-gray-600">Completed Modules</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">4.7</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Most Popular Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.slice(0, 5).map((resource, index) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-gray-600">{resource.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {resource.type === 'video' ? resource.views : resource.completions} 
                        {resource.type === 'video' ? ' views' : ' completions'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <Star className="h-3 w-3 inline fill-yellow-400 text-yellow-400 mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
