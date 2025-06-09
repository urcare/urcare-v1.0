
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Play, 
  Download, 
  Share2,
  BookOpen,
  Heart,
  Brain,
  Stethoscope,
  Search
} from 'lucide-react';

interface ARContent {
  id: string;
  title: string;
  category: string;
  type: '3d_model' | 'procedure' | 'anatomy' | 'simulation';
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isDownloaded: boolean;
  downloadSize: string;
  rating: number;
  views: number;
}

interface ARSession {
  id: string;
  contentId: string;
  patientId: string;
  startTime: Date;
  duration: number;
  completed: boolean;
  effectiveness: number;
}

export const AREducationInterface = () => {
  const [arContent] = useState<ARContent[]>([
    {
      id: '1',
      title: 'Human Heart Anatomy',
      category: 'Cardiology',
      type: '3d_model',
      description: 'Interactive 3D model of the human heart with detailed chamber exploration',
      duration: 15,
      difficulty: 'beginner',
      isDownloaded: true,
      downloadSize: '45.2 MB',
      rating: 4.8,
      views: 12547
    },
    {
      id: '2',
      title: 'Knee Arthroscopy Procedure',
      category: 'Orthopedics',
      type: 'procedure',
      description: 'Step-by-step AR visualization of knee arthroscopy surgical procedure',
      duration: 25,
      difficulty: 'advanced',
      isDownloaded: false,
      downloadSize: '89.7 MB',
      rating: 4.9,
      views: 8934
    },
    {
      id: '3',
      title: 'Brain Structure Exploration',
      category: 'Neurology',
      type: 'anatomy',
      description: 'Detailed brain anatomy with neural pathway visualization',
      duration: 20,
      difficulty: 'intermediate',
      isDownloaded: true,
      downloadSize: '67.3 MB',
      rating: 4.7,
      views: 15623
    },
    {
      id: '4',
      title: 'Blood Pressure Simulation',
      category: 'General Medicine',
      type: 'simulation',
      description: 'Interactive simulation showing blood pressure measurement and interpretation',
      duration: 10,
      difficulty: 'beginner',
      isDownloaded: false,
      downloadSize: '23.1 MB',
      rating: 4.6,
      views: 9876
    }
  ]);

  const [recentSessions] = useState<ARSession[]>([
    {
      id: '1',
      contentId: '1',
      patientId: 'patient_123',
      startTime: new Date(Date.now() - 3600000),
      duration: 12,
      completed: true,
      effectiveness: 92
    },
    {
      id: '2',
      contentId: '3',
      patientId: 'patient_456',
      startTime: new Date(Date.now() - 7200000),
      duration: 18,
      completed: true,
      effectiveness: 87
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const categories = ['all', 'Cardiology', 'Orthopedics', 'Neurology', 'General Medicine'];
  
  const filteredContent = arContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startARSession = (contentId: string) => {
    setActiveSession(contentId);
    // In a real app, this would launch the AR session
    setTimeout(() => setActiveSession(null), 3000);
  };

  const downloadContent = async (contentId: string) => {
    // Simulate download
    console.log(`Downloading AR content: ${contentId}`);
  };

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
      case '3d_model': return <Heart className="h-4 w-4" />;
      case 'procedure': return <Stethoscope className="h-4 w-4" />;
      case 'anatomy': return <Brain className="h-4 w-4" />;
      case 'simulation': return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AR Content Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search AR content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AR Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContent.map((content) => (
          <Card key={content.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(content.type)}
                  <div>
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <p className="text-sm text-gray-600">{content.category}</p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(content.difficulty)}>
                  {content.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{content.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span>{content.duration} min</span>
                <span>{content.downloadSize}</span>
                <div className="flex items-center gap-1">
                  <span>⭐ {content.rating}</span>
                  <span className="text-gray-600">({content.views} views)</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => startARSession(content.id)}
                  disabled={activeSession === content.id}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {activeSession === content.id ? 'Launching AR...' : 'Launch AR'}
                </Button>
                
                {!content.isDownloaded ? (
                  <Button
                    variant="outline"
                    onClick={() => downloadContent(content.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent AR Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent AR Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => {
              const content = arContent.find(c => c.id === session.contentId);
              return (
                <div key={session.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{content?.title}</span>
                      <div className="text-sm text-gray-600">
                        Patient ID: {session.patientId}
                      </div>
                    </div>
                    <Badge className={session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {session.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration: </span>
                      <span className="font-medium">{session.duration} min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Started: </span>
                      <span className="font-medium">{session.startTime.toLocaleTimeString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Effectiveness: </span>
                      <span className="font-medium">{session.effectiveness}%</span>
                    </div>
                  </div>
                  
                  {session.completed && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Learning Effectiveness</span>
                        <span>{session.effectiveness}%</span>
                      </div>
                      <Progress value={session.effectiveness} className="h-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AR Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              AR Usage Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">567</div>
                  <div className="text-sm text-gray-600">Total AR Sessions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Session Duration</span>
                  <span className="font-medium">16.5 min</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Patient Satisfaction</span>
                  <span className="font-medium">4.7/5.0</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">ARKit (iOS)</span>
                <Badge className="bg-green-100 text-green-800">Supported</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ARCore (Android)</span>
                <Badge className="bg-green-100 text-green-800">Supported</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WebXR</span>
                <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">HoloLens</span>
                <Badge className="bg-blue-100 text-blue-800">Coming Soon</Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>System Requirements:</strong> iOS 12+ or Android 7.0+, 
                Camera access, Motion sensors, Minimum 3GB RAM
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
