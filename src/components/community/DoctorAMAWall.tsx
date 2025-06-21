
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Heart, Clock, User, Stethoscope, ChevronUp, Send } from 'lucide-react';
import { toast } from 'sonner';

interface AMAQuestion {
  id: string;
  question: string;
  author: string;
  category: string;
  votes: number;
  answers: number;
  timestamp: string;
  answered: boolean;
  doctor?: {
    name: string;
    specialty: string;
    avatar: string;
  };
  answer?: string;
  answerTimestamp?: string;
}

export const DoctorAMAWall = () => {
  const [questions, setQuestions] = useState<AMAQuestion[]>([
    {
      id: '1',
      question: 'What are the early signs of diabetes that people often miss?',
      author: 'Sarah M.',
      category: 'Endocrinology',
      votes: 23,
      answers: 1,
      timestamp: '2 hours ago',
      answered: true,
      doctor: {
        name: 'Dr. Smith',
        specialty: 'Endocrinologist',
        avatar: '/placeholder.svg'
      },
      answer: 'Early signs include increased thirst, frequent urination, unexplained weight loss, and fatigue. Many people also experience blurred vision and slow-healing cuts.',
      answerTimestamp: '1 hour ago'
    },
    {
      id: '2',
      question: 'How often should I get my blood pressure checked if I have a family history of hypertension?',
      author: 'Mike J.',
      category: 'Cardiology',
      votes: 18,
      answers: 0,
      timestamp: '4 hours ago',
      answered: false
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [showAskForm, setShowAskForm] = useState(false);

  const categories = [
    'General', 'Cardiology', 'Endocrinology', 'Dermatology', 
    'Neurology', 'Pediatrics', 'Mental Health', 'Nutrition'
  ];

  const handleVote = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, votes: q.votes + 1 } : q
    ));
    toast.success('Vote recorded!');
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const question: AMAQuestion = {
      id: Date.now().toString(),
      question: newQuestion,
      author: 'You',
      category: selectedCategory,
      votes: 0,
      answers: 0,
      timestamp: 'Just now',
      answered: false
    };

    setQuestions(prev => [question, ...prev]);
    setNewQuestion('');
    setShowAskForm(false);
    toast.success('Question submitted! A doctor will answer soon.');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Cardiology': 'bg-red-100 text-red-800',
      'Endocrinology': 'bg-green-100 text-green-800',
      'Dermatology': 'bg-yellow-100 text-yellow-800',
      'Neurology': 'bg-purple-100 text-purple-800',
      'Pediatrics': 'bg-pink-100 text-pink-800',
      'Mental Health': 'bg-indigo-100 text-indigo-800',
      'Nutrition': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Doctor AMA Wall
          </CardTitle>
          <CardDescription>
            Ask medical questions and get answers from verified healthcare professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Active Doctors:</span> 12 online
            </div>
            <Button onClick={() => setShowAskForm(!showAskForm)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask a Question
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAskForm && (
        <Card>
          <CardHeader>
            <CardTitle>Ask Your Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Question</label>
              <Textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Ask a detailed medical question..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitQuestion}>
                <Send className="h-4 w-4 mr-2" />
                Submit Question
              </Button>
              <Button variant="outline" onClick={() => setShowAskForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(question.category)}>
                        {question.category}
                      </Badge>
                      {question.answered && (
                        <Badge className="bg-green-100 text-green-800">
                          Answered
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {question.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {question.timestamp}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(question.id)}
                      className="flex items-center gap-1"
                    >
                      <ChevronUp className="h-4 w-4" />
                      {question.votes}
                    </Button>
                  </div>
                </div>

                {question.answered && question.doctor && question.answer && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={question.doctor.avatar} />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-blue-900">{question.doctor.name}</div>
                        <div className="text-sm text-blue-700">{question.doctor.specialty}</div>
                      </div>
                      <div className="ml-auto text-xs text-blue-600">
                        {question.answerTimestamp}
                      </div>
                    </div>
                    <p className="text-blue-800">{question.answer}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{question.answers} answers</span>
                    <span>{question.votes} votes</span>
                  </div>
                  {!question.answered && (
                    <div className="text-sm text-orange-600">
                      Waiting for doctor response...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
