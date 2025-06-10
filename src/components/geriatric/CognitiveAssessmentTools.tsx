
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Clock,
  Eye,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

export const CognitiveAssessmentTools = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('mmse');
  const [assessmentResults, setAssessmentResults] = useState({
    mmse: {
      score: 24,
      maxScore: 30,
      lastAssessed: '2024-01-10',
      previousScore: 26,
      interpretation: 'Mild cognitive impairment'
    },
    moca: {
      score: 22,
      maxScore: 30,
      lastAssessed: '2024-01-08',
      previousScore: 24,
      interpretation: 'Mild cognitive impairment'
    },
    clockDraw: {
      score: 3,
      maxScore: 4,
      lastAssessed: '2024-01-12',
      previousScore: 4,
      interpretation: 'Mild executive dysfunction'
    },
    gds: {
      score: 8,
      maxScore: 15,
      lastAssessed: '2024-01-15',
      previousScore: 6,
      interpretation: 'Mild depression'
    }
  });

  const assessmentTools = [
    {
      id: 'mmse',
      name: 'Mini-Mental State Examination (MMSE)',
      description: 'Screens for cognitive impairment',
      domains: ['Orientation', 'Registration', 'Attention', 'Recall', 'Language'],
      duration: '10-15 minutes',
      maxScore: 30,
      cutoffs: {
        normal: 24,
        mild: 18,
        moderate: 10
      }
    },
    {
      id: 'moca',
      name: 'Montreal Cognitive Assessment (MoCA)',
      description: 'Detects mild cognitive impairment',
      domains: ['Visuospatial', 'Executive', 'Naming', 'Memory', 'Attention', 'Language', 'Abstraction', 'Orientation'],
      duration: '15-20 minutes',
      maxScore: 30,
      cutoffs: {
        normal: 26,
        mild: 18,
        moderate: 10
      }
    },
    {
      id: 'clockDraw',
      name: 'Clock Drawing Test',
      description: 'Assesses executive function and visuospatial abilities',
      domains: ['Executive Function', 'Visuospatial', 'Planning'],
      duration: '5 minutes',
      maxScore: 4,
      cutoffs: {
        normal: 3,
        mild: 2,
        moderate: 1
      }
    },
    {
      id: 'gds',
      name: 'Geriatric Depression Scale (GDS-15)',
      description: 'Screens for depression in older adults',
      domains: ['Mood', 'Anhedonia', 'Hopelessness', 'Energy'],
      duration: '10 minutes',
      maxScore: 15,
      cutoffs: {
        normal: 5,
        mild: 10,
        moderate: 15
      }
    }
  ];

  const cognitiveInterventions = [
    {
      domain: 'Memory',
      interventions: ['Memory training exercises', 'Cognitive stimulation therapy', 'Reminiscence therapy'],
      icon: Brain
    },
    {
      domain: 'Executive Function',
      interventions: ['Problem-solving tasks', 'Planning activities', 'Working memory training'],
      icon: Target
    },
    {
      domain: 'Attention',
      interventions: ['Attention training games', 'Mindfulness exercises', 'Dual-task training'],
      icon: Eye
    },
    {
      domain: 'Language',
      interventions: ['Word-finding exercises', 'Reading comprehension', 'Verbal fluency tasks'],
      icon: Users
    }
  ];

  const getScoreInterpretation = (tool, score) => {
    const cutoffs = assessmentTools.find(t => t.id === tool)?.cutoffs;
    if (!cutoffs) return 'Unknown';
    
    if (score >= cutoffs.normal) return 'Normal';
    if (score >= cutoffs.mild) return 'Mild impairment';
    if (score >= cutoffs.moderate) return 'Moderate impairment';
    return 'Severe impairment';
  };

  const getScoreColor = (interpretation) => {
    switch(interpretation.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'mild impairment':
      case 'mild cognitive impairment':
      case 'mild depression': return 'bg-yellow-100 text-yellow-800';
      case 'moderate impairment': return 'bg-orange-100 text-orange-800';
      case 'severe impairment': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const performAssessment = (toolId) => {
    // Simulate assessment completion
    const tool = assessmentTools.find(t => t.id === toolId);
    const newScore = Math.floor(Math.random() * tool.maxScore);
    
    setAssessmentResults(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        score: newScore,
        lastAssessed: new Date().toISOString().split('T')[0],
        interpretation: getScoreInterpretation(toolId, newScore)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Assessment Results Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assessmentTools.map((tool) => {
          const result = assessmentResults[tool.id];
          return (
            <Card key={tool.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{result.score}/{tool.maxScore}</span>
                    {getTrendIcon(result.score, result.previousScore)}
                  </div>
                  <Progress value={(result.score / tool.maxScore) * 100} className="h-2" />
                  <Badge className={getScoreColor(result.interpretation)}>
                    {result.interpretation}
                  </Badge>
                  <div className="text-xs text-gray-600">
                    Last assessed: {result.lastAssessed}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Assessment Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assessmentTools.map((tool) => {
          const result = assessmentResults[tool.id];
          return (
            <Card key={tool.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {tool.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-sm text-gray-600">{tool.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Last Score</div>
                      <div className="text-sm text-gray-600">{result.score}/{tool.maxScore}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Assessment Domains:</div>
                    <div className="flex flex-wrap gap-1">
                      {tool.domains.map((domain, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Scoring Guidelines:</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Normal:</span>
                        <span>≥{tool.cutoffs.normal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mild impairment:</span>
                        <span>{tool.cutoffs.mild}-{tool.cutoffs.normal - 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moderate impairment:</span>
                        <span>{tool.cutoffs.moderate}-{tool.cutoffs.mild - 1}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => performAssessment(tool.id)}
                    className="w-full"
                    size="sm"
                  >
                    Perform Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cognitive Interventions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cognitive Interventions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Evidence-based interventions for cognitive enhancement
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cognitiveInterventions.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">{category.domain}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.interventions.map((intervention, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{intervention}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Care Plan Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Care Plan Adjustments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(assessmentResults).map(([toolId, result]) => {
              if (result.interpretation.toLowerCase().includes('impairment') || result.interpretation.toLowerCase().includes('depression')) {
                return (
                  <div key={toolId} className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">{assessmentTools.find(t => t.id === toolId)?.name}</span>
                    </div>
                    <div className="text-sm text-yellow-800">
                      Score: {result.score} - {result.interpretation}
                    </div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Recommendation: Consider referral to specialist and adjust care plan
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
