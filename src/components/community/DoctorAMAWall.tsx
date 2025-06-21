
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Calendar, Users, Star, Clock, MessageCircle, ThumbsUp, Send, Live } from 'lucide-react';
import { toast } from 'sonner';

interface AMASession {
  id: string;
  doctor: {
    name: string;
    avatar: string;
    specialization: string;
    credentials: string;
    rating: number;
    verified: boolean;
  };
  title: string;
  description: string;
  scheduledDate: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed';
  participantCount: number;
  questionsCount: number;
  tags: string[];
}

interface Question {
  id: string;
  author: string;
  question: string;
  timestamp: string;
  votes: number;
  isAnswered: boolean;
  answer?: string;
  answerTime?: string;
}

export const DoctorAMAWall = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionAuthor, setNewQuestionAuthor] = useState('');

  const [amaSessions] = useState<AMASession[]>([
    {
      id: '1',
      doctor: {
        name: 'Dr. Sarah Martinez',
        avatar: '/placeholder.svg',
        specialization: 'Endocrinology & Diabetes',
        credentials: 'MD, CDE',
        rating: 4.9,
        verified: true
      },
      title: 'Managing Type 2 Diabetes: Latest Treatment Options',
      description: 'Join Dr. Martinez for an in-depth discussion about modern diabetes management, including new medications, lifestyle interventions, and continuous glucose monitoring.',
      scheduledDate: 'Today at 7:00 PM EST',
      duration: 60,
      status: 'live',
      participantCount: 234,
      questionsCount: 45,
      tags: ['diabetes', 'endocrinology', 'medication', 'lifestyle']
    },
    {
      id: '2',
      doctor: {
        name: 'Dr. Michael Chen',
        avatar: '/placeholder.svg',
        specialization: 'Cardiology',
        credentials: 'MD, FACC',
        rating: 4.8,
        verified: true
      },
      title: 'Heart Health After 50: Prevention & Management',
      description: 'Learn about cardiovascular risk factors, preventive measures, and treatment options for heart conditions in adults over 50.',
      scheduledDate: 'Tomorrow at 6:30 PM EST',
      duration: 45,
      status: 'upcoming',
      participantCount: 0,
      questionsCount: 12,
      tags: ['cardiology', 'prevention', 'heart-health', 'aging']
    },
    {
      id: '3',
      doctor: {
        name: 'Dr. Emily Rodriguez',
        avatar: '/placeholder.svg',
        specialization: 'Mental Health & Psychiatry',
        credentials: 'MD, PhD',
        rating: 5.0,
        verified: true
      },
      title: 'Anxiety & Depression: Understanding Treatment Options',
      description: 'Comprehensive discussion about mental health conditions, therapy options, medications, and lifestyle approaches to managing anxiety and depression.',
      scheduledDate: 'Last week',
      duration: 90,
      status: 'completed',
      participantCount: 456,
      questionsCount: 78,
      tags: ['mental-health', 'anxiety', 'depression', 'therapy']
    }
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      author: 'HealthSeeker92',
      question: 'What are the latest CGM options for Type 2 diabetes patients?',
      timestamp: '5 minutes ago',
      votes: 23,
      isAnswered: true,
      answer: 'Great question! The latest CGM devices like Dexcom G7 and FreeStyle Libre 3 offer excellent accuracy and ease of use for Type 2 patients. They provide real-time glucose readings and trends, which can be game-changing for management.',
      answerTime: '3 minutes ago'
    },
    {
      id: '2',
      author: 'DiabetesWarrior',
      question: 'How do I know if I need to switch from metformin to insulin?',
      timestamp: '8 minutes ago',
      votes: 18,
      isAnswered: false
    },
    {
      id: '3',
      author: 'ConcernedParent',
      question: 'My teenager was just diagnosed with Type 1. What should I know about managing their care?',
      timestamp: '12 minutes ago',
      votes: 31,
      isAnswered: true,
      answer: 'Type 1 in teens requires a team approach. Focus on education, consistent carb counting, and maintaining open communication. Modern insulin pumps and CGMs make management much easier than in the past.',
      answerTime: '7 minutes ago'
    }
  ]);

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim() || !newQuestionAuthor.trim()) {
      toast.error('Please enter both your name and question');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      author: newQuestionAuthor,
      question: newQuestion,
      timestamp: 'Just now',
      votes: 0,
      isAnswered: false
    };

    setQuestions(prev => [question, ...prev]);
    setNewQuestion('');
    setNewQuestionAuthor('');
    toast.success('Question submitted! The doctor will answer shortly.');
  };

  const handleVoteQuestion = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, votes: q.votes + 1 } : q
    ));
    toast.success('Vote counted!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-800 border-red-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Live className="h-4 w-4" />;
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Doctor AMA Sessions
          </CardTitle>
          <CardDescription>
            Ask questions directly to verified healthcare professionals in live Q&A sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-sm text-gray-600">Expert Doctors</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-gray-600">Sessions Held</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.4k</div>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AMA Sessions List */}
      <div className="space-y-4">
        {amaSessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session.doctor.avatar} />
                    <AvatarFall

3ack>{session.doctor.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{session.title}</h3>
                      <Badge className={`${getStatusColor(session.status)} border`}>
                        {getStatusIcon(session.status)}
                        <span className="ml-1 capitalize">{session.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium">{session.doctor.name}</span>
                      {session.doctor.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                      <Badge variant="outline">
                        {session.doctor.specialization}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{session.doctor.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{session.description}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.scheduledDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration} minutes
                      </div>
                      {session.status !== 'upcoming' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.participantCount} participants
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {session.questionsCount} questions
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {session.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {session.status === 'live' && (
                    <Button 
                      onClick={() => setSelectedSession(session.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Live className="h-4 w-4 mr-2" />
                      Join Live
                    </Button>
                  )}
                  {session.status === 'upcoming' && (
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                  )}
                  {session.status === 'completed' && (
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      View Recap
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Session Interface */}
      {selectedSession && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Live className="h-5 w-5" />
              Live AMA Session
            </CardTitle>
            <CardDescription>
              {amaSessions.find(s => s.id === selectedSession)?.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ask Your Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name (anonymous options available)"
                    value={newQuestionAuthor}
                    onChange={(e) => setNewQuestionAuthor(e.target.value)}
                  />
                  <div /> {/* Spacer for grid */}
                </div>
                <Textarea
                  placeholder="Type your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleSubmitQuestion}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Question
                </Button>
              </CardContent>
            </Card>

            {/* Questions & Answers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions & Answers</CardTitle>
                <CardDescription>
                  Vote for questions you'd like to see answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className={`border rounded-lg p-4 ${
                      question.isAnswered ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{question.author}</span>
                            <span className="text-sm text-gray-500">• {question.timestamp}</span>
                            {question.isAnswered && (
                              <Badge className="bg-green-100 text-green-800">
                                ✓ Answered
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-800 mb-2">{question.question}</p>
                          
                          {question.isAnswered && question.answer && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback>Dr</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">Dr. Answer</span>
                                <span className="text-xs text-gray-500">• {question.answerTime}</span>
                              </div>
                              <p className="text-sm text-gray-800">{question.answer}</p>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVoteQuestion(question.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {question.votes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
