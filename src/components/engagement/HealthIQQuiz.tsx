
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'nutrition' | 'exercise' | 'medical' | 'mental-health';
}

interface Props {
  onScoreUpdate: (score: number, total: number) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How much water should an average adult drink per day?',
    options: ['4 cups', '6 cups', '8 cups', '12 cups'],
    correctAnswer: 2,
    explanation: 'The general recommendation is about 8 cups (64 ounces) of water per day, though individual needs may vary.',
    category: 'nutrition'
  },
  {
    id: 'q2',
    question: 'What is the recommended amount of moderate exercise per week for adults?',
    options: ['75 minutes', '150 minutes', '300 minutes', '450 minutes'],
    correctAnswer: 1,
    explanation: 'Adults should get at least 150 minutes of moderate-intensity aerobic activity per week.',
    category: 'exercise'
  },
  {
    id: 'q3',
    question: 'Which of these is a symptom that should prompt immediate medical attention?',
    options: ['Mild headache', 'Chest pain with shortness of breath', 'Slight fatigue', 'Minor muscle soreness'],
    correctAnswer: 1,
    explanation: 'Chest pain combined with shortness of breath can indicate a serious heart condition requiring immediate medical attention.',
    category: 'medical'
  },
  {
    id: 'q4',
    question: 'What is a healthy way to manage stress?',
    options: ['Avoiding all stressful situations', 'Deep breathing exercises', 'Working longer hours', 'Skipping meals'],
    correctAnswer: 1,
    explanation: 'Deep breathing exercises activate the body\'s relaxation response and are an effective stress management technique.',
    category: 'mental-health'
  }
];

export const HealthIQQuiz = ({ onScoreUpdate }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'mental-health': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
  };

  const handleContinue = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
      onScoreUpdate(score, quizQuestions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return { message: "Excellent! You're a health expert! 🏆", color: "text-green-600" };
    if (percentage >= 70) return { message: "Great job! Your health knowledge is strong! 🌟", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good effort! Keep learning about health! 📚", color: "text-yellow-600" };
    return { message: "Keep studying! There's always room to improve! 💪", color: "text-orange-600" };
  };

  if (quizCompleted) {
    const scoreMessage = getScoreMessage();
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-blue-600">
              {score}/{quizQuestions.length}
            </div>
            <div className="space-y-2">
              <p className={`text-lg font-medium ${scoreMessage.color}`}>
                {scoreMessage.message}
              </p>
              <p className="text-gray-600">
                You scored {Math.round((score / quizQuestions.length) * 100)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Review Your Answers:</h4>
            <div className="grid gap-2">
              {quizQuestions.map((q, index) => (
                <div key={q.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Question {index + 1}</span>
                  {answers[index] === q.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health IQ Quiz
          </CardTitle>
          <Badge className={getCategoryColor(question.category)}>
            {question.category.replace('-', ' ')}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>Score: {score}/{currentQuestion}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!showResult ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{question.question}</h3>
              
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </>
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              {selectedAnswer === question.correctAnswer ? (
                <div className="text-green-600">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-bold">Correct!</h3>
                </div>
              ) : (
                <div className="text-red-600">
                  <XCircle className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-bold">Incorrect</h3>
                  <p className="text-sm">
                    The correct answer was: <strong>{question.options[question.correctAnswer]}</strong>
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 rounded-lg text-left">
                <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700 text-sm">{question.explanation}</p>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full">
              {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next Question'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
