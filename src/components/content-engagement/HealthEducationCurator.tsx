
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Brain,
  Lightbulb,
  Award,
  Play,
  CheckCircle
} from 'lucide-react';

interface EducationalContent {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'article' | 'video' | 'interactive' | 'quiz' | 'course';
  duration: number;
  completionRate: number;
  engagementScore: number;
  prerequisites: string[];
  learningObjectives: string[];
  tags: string[];
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  totalModules: number;
  completedModules: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetAudience: string[];
  progressPercentage: number;
}

interface KnowledgeAssessment {
  id: string;
  patientId: string;
  patientName: string;
  topicArea: string;
  score: number;
  completionDate: string;
  strengths: string[];
  improvementAreas: string[];
  recommendedContent: string[];
}

const mockContent: EducationalContent[] = [
  {
    id: 'EDU001',
    title: 'Understanding Diabetes Basics',
    category: 'Diabetes Management',
    difficulty: 'beginner',
    type: 'video',
    duration: 15,
    completionRate: 89,
    engagementScore: 92,
    prerequisites: [],
    learningObjectives: ['Understand what diabetes is', 'Learn about blood sugar management', 'Recognize symptoms'],
    tags: ['diabetes', 'basics', 'education']
  },
  {
    id: 'EDU002',
    title: 'Advanced Blood Sugar Monitoring',
    category: 'Diabetes Management',
    difficulty: 'intermediate',
    type: 'interactive',
    duration: 25,
    completionRate: 76,
    engagementScore: 87,
    prerequisites: ['Understanding Diabetes Basics'],
    learningObjectives: ['Master CGM usage', 'Interpret glucose patterns', 'Adjust lifestyle accordingly'],
    tags: ['diabetes', 'monitoring', 'cgm']
  },
  {
    id: 'EDU003',
    title: 'Heart Health Quiz',
    category: 'Cardiovascular Health',
    difficulty: 'beginner',
    type: 'quiz',
    duration: 10,
    completionRate: 94,
    engagementScore: 85,
    prerequisites: [],
    learningObjectives: ['Assess heart health knowledge', 'Identify risk factors', 'Learn prevention strategies'],
    tags: ['heart', 'quiz', 'assessment']
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'PATH001',
    name: 'Diabetes Mastery Program',
    description: 'Comprehensive learning path for diabetes management from basics to advanced care',
    totalModules: 8,
    completedModules: 5,
    estimatedTime: 120,
    difficulty: 'intermediate',
    targetAudience: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Prediabetes'],
    progressPercentage: 62
  },
  {
    id: 'PATH002',
    name: 'Heart Health Journey',
    description: 'Complete cardiovascular wellness education program',
    totalModules: 6,
    completedModules: 2,
    estimatedTime: 90,
    difficulty: 'beginner',
    targetAudience: ['Heart Disease', 'Hypertension', 'Prevention'],
    progressPercentage: 33
  },
  {
    id: 'PATH003',
    name: 'Mental Wellness Foundations',
    description: 'Building blocks for emotional and mental health',
    totalModules: 10,
    completedModules: 8,
    estimatedTime: 150,
    difficulty: 'beginner',
    targetAudience: ['Anxiety', 'Depression', 'Stress Management'],
    progressPercentage: 80
  }
];

const mockAssessments: KnowledgeAssessment[] = [
  {
    id: 'ASSESS001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    topicArea: 'Diabetes Management',
    score: 87,
    completionDate: '2024-01-20',
    strengths: ['Blood sugar monitoring', 'Medication adherence', 'Diet planning'],
    improvementAreas: ['Exercise planning', 'Carb counting'],
    recommendedContent: ['Advanced Blood Sugar Monitoring', 'Exercise for Diabetics']
  },
  {
    id: 'ASSESS002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    topicArea: 'Heart Health',
    score: 72,
    completionDate: '2024-01-19',
    strengths: ['Risk factor awareness', 'Medication knowledge'],
    improvementAreas: ['Diet modification', 'Stress management', 'Exercise protocols'],
    recommendedContent: ['Heart-Healthy Cooking', 'Stress Reduction Techniques']
  }
];

export const HealthEducationCurator = () => {
  const [content] = useState<EducationalContent[]>(mockContent);
  const [learningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [assessments] = useState<KnowledgeAssessment[]>(mockAssessments);
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500 text-white';
      case 'intermediate': return 'bg-yellow-500 text-white';
      case 'advanced': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'quiz': return <CheckCircle className="h-4 w-4" />;
      case 'interactive': return <Target className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Health Education Curator
          </CardTitle>
          <CardDescription>
            Content recommendation, learning path optimization, and knowledge assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{content.length}</p>
                  <p className="text-sm text-gray-600">Content Items</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{learningPaths.length}</p>
                  <p className="text-sm text-gray-600">Learning Paths</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(content.reduce((sum, c) => sum + c.completionRate, 0) / content.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Completion</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Award className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{assessments.length}</p>
                  <p className="text-sm text-gray-600">Assessments</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Educational Content</h3>
              {content.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-colors ${selectedContent?.id === item.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedContent(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm font-medium capitalize">{item.type}</span>
                          <span className="text-sm text-gray-500">• {item.duration} min</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{item.engagementScore}</p>
                          <p className="text-xs text-gray-500">Engagement</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-bold">{item.completionRate}%</span>
                      </div>
                      <Progress value={item.completionRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Paths</h3>
              {learningPaths.map((path) => (
                <Card key={path.id} className="border-l-4 border-l-green-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{path.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{path.description}</p>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span className="text-sm">{path.completedModules}/{path.totalModules} modules</span>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{path.progressPercentage}%</span>
                      </div>
                      <Progress value={path.progressPercentage} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">
                            {path.totalModules - path.completedModules} modules remaining
                          </span>
                        </div>
                        <span className="text-gray-500">{path.estimatedTime} min total</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Button size="sm">Continue Learning</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Knowledge Assessments</h3>
              {assessments.map((assessment) => (
                <Card key={assessment.id} className="border-l-4 border-l-orange-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{assessment.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{assessment.topicArea}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(assessment.score)}`}>
                          {assessment.score}%
                        </p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Strengths</p>
                        {assessment.strengths.slice(0, 2).map((strength, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{strength}</span>
                          </div>
                        ))}
                        {assessment.strengths.length > 2 && (
                          <p className="text-xs text-gray-500">+{assessment.strengths.length - 2} more</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Areas to Improve</p>
                        {assessment.improvementAreas.slice(0, 2).map((area, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-orange-600" />
                            <span className="text-xs">{area}</span>
                          </div>
                        ))}
                        {assessment.improvementAreas.length > 2 && (
                          <p className="text-xs text-gray-500">+{assessment.improvementAreas.length - 2} more</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Completed: {assessment.completionDate}</span>
                      <Button size="sm" variant="outline">
                        <Brain className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedContent && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedContent.title}</CardTitle>
                <CardDescription>{selectedContent.category} • {selectedContent.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Content Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>Type: <strong className="capitalize">{selectedContent.type}</strong></p>
                        <p>Difficulty: <strong className="capitalize">{selectedContent.difficulty}</strong></p>
                        <p>Duration: <strong>{selectedContent.duration} minutes</strong></p>
                        <p>Completion Rate: <strong>{selectedContent.completionRate}%</strong></p>
                        <p>Engagement Score: <strong>{selectedContent.engagementScore}</strong></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Learning Objectives</h4>
                      <div className="space-y-1">
                        {selectedContent.learningObjectives.map((objective, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{objective}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {selectedContent.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Prerequisites</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedContent.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Play className="h-4 w-4 mr-1" />
                      Access Content
                    </Button>
                    <Button variant="outline">
                      <Brain className="h-4 w-4 mr-1" />
                      Generate Quiz
                    </Button>
                    <Button variant="outline">
                      <Target className="h-4 w-4 mr-1" />
                      Related Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
