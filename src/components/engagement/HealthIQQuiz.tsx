
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, X, Lightbulb, Award, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface HealthIQQuizProps {
  onScoreUpdate: (score: number, total: number) => void;
}

export const HealthIQQuiz = ({ onScoreUpdate }: HealthIQQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: Question[] = [
    {
      id: '1',
      question: 'How much water should an average adult drink per day?',
      options: ['4 glasses', '6 glasses', '8 glasses', '12 glasses'],
      correctAnswer: 2,
      explanation: 'The general recommendation is about 8 glasses (64 ounces) of water per day, though individual needs may vary.',
      category: 'Nutrition',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'What is considered a normal resting heart rate for adults?',
      options: ['40-60 bpm', '60-100 bpm', '100-120 bpm', '120-140 bpm'],
      correctAnswer: 1,
      explanation: 'A normal resting heart rate for adults ranges from 60 to 100 beats per minute.',
      category: 'Cardiology',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: 'Which vitamin is primarily produced when skin is exposed to sunlight?',
      options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E'],
      correctAnswer: 2,
      explanation: 'Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight.',
      category: 'Nutrition',
      difficulty: 'easy'
    },
    {
      id: '4',
      question: 'How many hours of sleep do adults typically need per night?',
      options: ['5-6 hours', '7-9 hours', '9-11 hours', '11-13 hours'],
      correctAnswer: 1,
      explanation: 'Most adults need 7-9 hours of quality sleep per night for optimal health.',
      category: 'Sleep Health',
      difficulty: 'easy'
    },
    {
      id: '5',
      question: 'What does BMI stand for?',
      options: ['Basic Metabolic Index', 'Body Mass Index', 'Blood Metabolism Indicator', 'Bone Mineral Index'],
      correctAnswer: 1,
      explanation: 'BMI stands for Body Mass Index, a measure of body fat based on height and weight.',
      category: 'General Health',
      difficulty: 'medium'
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
        const finalScore = selectedAnswer === currentQuestion.correctAnswer ? score + 1 : score;
        onScoreUpdate(finalScore, questions.length);
        toast.success(`Quiz completed! Your score: ${finalScore}/${questions.length}`);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-yellow-600" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-blue-600">
            {score}/{questions.length}
          </div>
          <div className="text-lg">
            Your Health IQ Score: {percentage}%
          </div>
          
          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
            <p className="text-sm text-gray-600">
              {percentage >= 80 ? 'Excellent! You have great health knowledge!' :
               percentage >= 60 ? 'Good job! Keep learning about health.' :
               'Keep studying! Health knowledge is important.'}
            </p>
          </div>

          <Button onClick={resetQuiz} className="mt-4">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Health IQ Quiz
              </CardTitle>
              <CardDescription>
                Test your health knowledge and learn new facts
              </CardDescription>
            </div>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestionIndex}</span>
            </div>
            <Progress value={((currentQuestionIndex) / questions.length) * 100} />
          </div>

          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {currentQuestion.category}
              </Badge>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-3 text-left border rounded-lg transition-all ${
                    selectedAnswer === index 
                      ? showResult 
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50'
                      : showResult && index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <div>
                        {index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Explanation</h4>
                    <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null && !showResult}
              className="w-full"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
