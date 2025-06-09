
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ClipboardList,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';

export const MentalHealthScreeningInterface = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('phq9');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const assessmentTools = [
    {
      id: 'phq9',
      name: 'PHQ-9',
      title: 'Patient Health Questionnaire-9',
      category: 'Depression',
      questions: 9,
      timeEstimate: '5 min',
      description: 'Standardized tool for screening and monitoring depression severity'
    },
    {
      id: 'gad7',
      name: 'GAD-7',
      title: 'Generalized Anxiety Disorder-7',
      category: 'Anxiety',
      questions: 7,
      timeEstimate: '3 min',
      description: 'Validated screening tool for generalized anxiety disorder'
    },
    {
      id: 'pcl5',
      name: 'PCL-5',
      title: 'PTSD Checklist for DSM-5',
      category: 'PTSD',
      questions: 20,
      timeEstimate: '10 min',
      description: 'Self-report measure for PTSD symptoms'
    },
    {
      id: 'mood',
      name: 'MDQ',
      title: 'Mood Disorder Questionnaire',
      category: 'Bipolar',
      questions: 13,
      timeEstimate: '7 min',
      description: 'Screening tool for bipolar spectrum disorders'
    }
  ];

  const phq9Questions = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself or that you are a failure',
    'Trouble concentrating on things',
    'Moving or speaking slowly, or being fidgety',
    'Thoughts that you would be better off dead'
  ];

  const responseOptions = [
    { value: 0, label: 'Not at all' },
    { value: 1, label: 'Several days' },
    { value: 2, label: 'More than half the days' },
    { value: 3, label: 'Nearly every day' }
  ];

  const recentScreenings = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      assessment: 'PHQ-9',
      score: 12,
      severity: 'Moderate',
      date: '2024-01-15',
      status: 'completed',
      riskLevel: 'medium'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      assessment: 'GAD-7',
      score: 18,
      severity: 'Severe',
      date: '2024-01-14',
      status: 'completed',
      riskLevel: 'high'
    },
    {
      id: 3,
      patientName: 'Emily Davis',
      assessment: 'PHQ-9',
      score: 7,
      severity: 'Mild',
      date: '2024-01-14',
      status: 'completed',
      riskLevel: 'low'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe': return 'text-red-600';
      case 'moderate': return 'text-orange-600';
      case 'mild': return 'text-yellow-600';
      case 'minimal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleResponseChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = parseInt(value);
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateScore = () => {
    return responses.reduce((sum, response) => sum + response, 0);
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 20) return { severity: 'Severe', risk: 'high' };
    if (score >= 15) return { severity: 'Moderately Severe', risk: 'high' };
    if (score >= 10) return { severity: 'Moderate', risk: 'medium' };
    if (score >= 5) return { severity: 'Mild', risk: 'low' };
    return { severity: 'Minimal', risk: 'low' };
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="conduct" className="w-full">
        <TabsList>
          <TabsTrigger value="conduct">Conduct Assessment</TabsTrigger>
          <TabsTrigger value="history">Screening History</TabsTrigger>
          <TabsTrigger value="tools">Assessment Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="conduct" className="space-y-4">
          {!isCompleted ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  PHQ-9 Depression Screening
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {phq9Questions.length}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / phq9Questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Over the last 2 weeks, how often have you been bothered by:
                  </h3>
                  <p className="text-lg">{phq9Questions[currentQuestion]}?</p>
                </div>

                <RadioGroup 
                  value={responses[currentQuestion]?.toString() || ''} 
                  onValueChange={handleResponseChange}
                >
                  {responseOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={responses[currentQuestion] === undefined}
                  >
                    {currentQuestion < phq9Questions.length - 1 ? 'Next' : 'Complete Assessment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Assessment Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{calculateScore()}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-medium ${getSeverityColor(getScoreInterpretation(calculateScore()).severity)}`}>
                      {getScoreInterpretation(calculateScore()).severity}
                    </div>
                    <div className="text-sm text-gray-600">Severity Level</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getRiskColor(getScoreInterpretation(calculateScore()).risk)}>
                      {getScoreInterpretation(calculateScore()).risk} risk
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">Risk Level</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Schedule follow-up appointment within 2 weeks</li>
                    <li>• Consider referral to mental health specialist</li>
                    <li>• Provide patient with mental health resources</li>
                  </ul>
                </div>

                <Button onClick={() => {
                  setCurrentQuestion(0);
                  setResponses([]);
                  setIsCompleted(false);
                }}>
                  Start New Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScreenings.map((screening) => (
                  <div key={screening.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="font-medium">{screening.patientName}</div>
                        <div className="text-sm text-gray-600">{screening.assessment} Assessment</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">Score: {screening.score}</div>
                        <div className={`text-sm ${getSeverityColor(screening.severity)}`}>
                          {screening.severity}
                        </div>
                      </div>
                      <Badge className={getRiskColor(screening.riskLevel)}>
                        {screening.riskLevel} risk
                      </Badge>
                      <div className="text-sm text-gray-500">{screening.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessmentTools.map((tool) => (
              <Card key={tool.id} className={selectedAssessment === tool.id ? 'border-blue-500' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tool.name}</span>
                    <Badge variant="outline">{tool.category}</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{tool.title}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{tool.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ClipboardList className="h-4 w-4" />
                        {tool.questions} questions
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tool.timeEstimate}
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      variant={selectedAssessment === tool.id ? 'default' : 'outline'}
                      onClick={() => setSelectedAssessment(tool.id)}
                    >
                      Select Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
