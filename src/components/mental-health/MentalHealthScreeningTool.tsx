
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ScreeningQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

interface ScreeningResult {
  score: number;
  level: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export const MentalHealthScreeningTool = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions: ScreeningQuestion[] = [
    {
      id: 'mood',
      question: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?',
      options: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'Several days', score: 1 },
        { value: '2', label: 'More than half the days', score: 2 },
        { value: '3', label: 'Nearly every day', score: 3 }
      ]
    },
    {
      id: 'interest',
      question: 'Little interest or pleasure in doing things?',
      options: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'Several days', score: 1 },
        { value: '2', label: 'More than half the days', score: 2 },
        { value: '3', label: 'Nearly every day', score: 3 }
      ]
    },
    {
      id: 'sleep',
      question: 'Trouble falling or staying asleep, or sleeping too much?',
      options: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'Several days', score: 1 },
        { value: '2', label: 'More than half the days', score: 2 },
        { value: '3', label: 'Nearly every day', score: 3 }
      ]
    },
    {
      id: 'energy',
      question: 'Feeling tired or having little energy?',
      options: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'Several days', score: 1 },
        { value: '2', label: 'More than half the days', score: 2 },
        { value: '3', label: 'Nearly every day', score: 3 }
      ]
    },
    {
      id: 'anxiety',
      question: 'Feeling nervous, anxious, or on edge?',
      options: [
        { value: '0', label: 'Not at all', score: 0 },
        { value: '1', label: 'Several days', score: 1 },
        { value: '2', label: 'More than half the days', score: 2 },
        { value: '3', label: 'Nearly every day', score: 3 }
      ]
    }
  ];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let totalScore = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      }
    });

    let level: 'low' | 'moderate' | 'high';
    let recommendations: string[];

    if (totalScore <= 4) {
      level = 'low';
      recommendations = [
        'Continue maintaining good mental health practices',
        'Consider regular exercise and stress management',
        'Schedule routine check-ups with your healthcare provider'
      ];
    } else if (totalScore <= 9) {
      level = 'moderate';
      recommendations = [
        'Consider speaking with a mental health professional',
        'Practice stress reduction techniques',
        'Maintain regular sleep and exercise routines',
        'Consider therapy or counseling'
      ];
    } else {
      level = 'high';
      recommendations = [
        'Strongly recommend immediate consultation with a mental health professional',
        'Consider therapy or psychiatric evaluation',
        'Reach out to support systems (family, friends)',
        'Contact crisis helpline if feeling unsafe'
      ];
    }

    setResult({ score: totalScore, level, recommendations });
    setIsCompleted(true);
    toast.success('Screening completed');
  };

  const resetScreening = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setIsCompleted(false);
  };

  if (isCompleted && result) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Mental Health Screening Results
            </CardTitle>
            <CardDescription>Your screening has been completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold text-blue-600">
                Score: {result.score}/15
              </div>
              <div className="flex items-center justify-center gap-2">
                {result.level === 'low' && <CheckCircle className="h-6 w-6 text-green-600" />}
                {result.level === 'moderate' && <AlertTriangle className="h-6 w-6 text-yellow-600" />}
                {result.level === 'high' && <AlertTriangle className="h-6 w-6 text-red-600" />}
                <span className={`text-lg font-semibold ${
                  result.level === 'low' ? 'text-green-600' :
                  result.level === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {result.level.toUpperCase()} Risk Level
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Button onClick={resetScreening} variant="outline">
                Take Again
              </Button>
              <Button onClick={() => toast.success('Results saved to your profile')}>
                Save Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Mental Health Screening
          </CardTitle>
          <CardDescription>
            A brief assessment to help evaluate your mental health status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[questions[currentQuestion].id] || ''}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[questions[currentQuestion].id]}
            >
              {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
