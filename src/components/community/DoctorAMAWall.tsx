
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MessageCircle, ThumbsUp, BookOpen, Video } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  rating: number;
  experience: string;
  isLive: boolean;
}

interface AMASession {
  id: string;
  doctor: Doctor;
  title: string;
  description: string;
  scheduledTime: string;
  duration: string;
  attendees: number;
  maxAttendees: number;
  status: 'upcoming' | 'live' | 'completed';
  tags: string[];
}

interface Question {
  id: string;
  question: string;
  author: string;
  timestamp: string;
  likes: number;
  isAnswered: boolean;
  answer?: string;
  doctorId?: string;
}

export const DoctorAMAWall = () => {
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedSession, setSelectedSession] = useState<string>('');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'MD, PhD',
      specialty: 'Cardiology',
      avatar: '/placeholder.svg',
      rating: 4.9,
      experience: '15+ years',
      isLive: true
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'MD',
      specialty: 'Endocrinology',
      avatar: '/placeholder.svg',
      rating: 4.8,
      experience: '12+ years',
      isLive: false
    }
  ];

  const amaSessions: AMASession[] = [
    {
      id: '1',
      doctor: doctors[0],
      title: 'Heart Health After 40: Prevention & Management',
      description: 'Join Dr. Johnson for an interactive discussion about maintaining cardiovascular health.',
      scheduledTime: '2024-01-20 2:00 PM EST',
      duration: '60 min',
      attendees: 156,
      maxAttendees: 200,
      status: 'live',
      tags: ['heart-health', 'prevention', 'lifestyle']
    },
    {
      id: '2',
      doctor: doctors[1],
      title: 'Managing Diabetes: Latest Guidelines',
      description: 'Learn about the newest approaches to diabetes management and blood sugar control.',
      scheduledTime: '2024-01-22 3:00 PM EST',
      duration: '45 min',
      attendees: 89,
      maxAttendees: 150,
      status: 'upcoming',
      tags: ['diabetes', 'blood-sugar', 'medication']
    }
  ];

  const questions: Question[] = [
    {
      id: '1',
      question: 'What are the early warning signs of heart disease that people often miss?',
      author: 'Patient_123',
      timestamp: '5 min ago',
      likes: 23,
      isAnswered: true,
      answer: 'Great question! Early signs include unusual fatigue, shortness of breath during normal activities, chest discomfort that comes and goes, and swelling in legs or feet. Many people dismiss these as normal aging, but they warrant medical attention.',
      doctorId: '1'
    },
    {
      id: '2',
      question: 'How often should someone over 50 get their cholesterol checked?',
      author: 'HealthSeeker',
      timestamp: '12 min ago',
      likes: 18,
      isAnswered: false
    },
    {
      id: '3',
      question: 'Are there any natural ways to lower blood pressure besides medication?',
      author: 'WellnessJourney',
      timestamp: '18 min ago',
      likes: 31,
      isAnswered: true,
      answer: 'Absolutely! Regular exercise, reducing sodium intake, maintaining a healthy weight, limiting alcohol, managing stress through meditation or yoga, and getting adequate sleep can all significantly impact blood pressure.',
      doctorId: '1'
    }
  ];

  const submitQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    toast.success('Question submitted! You\'ll be notified when the doctor responds.');
    setNewQuestion('');
  };

  const joinSession = (sessionId: string) => {
    toast.success('Joined AMA session! You\'ll receive a notification when it starts.');
  };

  const likeQuestion = (questionId: string) => {
    toast.success('Question liked!');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Doctor AMA Wall
          </CardTitle>
          <CardDescription>
            Ask questions and join live sessions with verified medical professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-600">Active Doctors</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">245</div>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <p className="text-sm text-gray-600">Sessions This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="questions">Q&A Wall</TabsTrigger>
          <TabsTrigger value="doctors">Our Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid gap-4">
            {amaSessions.map((session) => (
              <Card key={session.id} className={`${session.status === 'live' ? 'border-red-200 bg-red-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.doctor.avatar} />
                        <AvatarFallback>{session.doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          with {session.doctor.name}, {session.doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={session.status === 'live' ? 'destructive' : session.status === 'upcoming' ? 'default' : 'secondary'}
                    >
                      {session.status === 'live' && '🔴 LIVE'}
                      {session.status === 'upcoming' && '📅 Upcoming'}
                      {session.status === 'completed' && '✅ Completed'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{session.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.scheduledTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {session.attendees}/{session.maxAttendees}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {session.status === 'live' ? (
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Session
                      </Button>
                    ) : session.status === 'upcoming' ? (
                      <Button onClick={() => joinSession(session.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Register for Session
                      </Button>
                    ) : (
                      <Button variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Recording
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Submit your health question for our doctors to answer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What would you like to ask our doctors?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={submitQuestion}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Submit Question
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <span>by {question.author}</span>
                          <span>•</span>
                          <span>{question.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => likeQuestion(question.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {question.likes}
                        </Button>
                        {question.isAnswered && (
                          <Badge className="bg-green-100 text-green-800">
                            Answered
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {question.isAnswered && question.answer && (
                      <div className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-3 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={doctors.find(d => d.id === question.doctorId)?.avatar} />
                            <AvatarFallback>Dr</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-blue-800">
                            {doctors.find(d => d.id === question.doctorId)?.name} answered:
                          </span>
                        </div>
                        <p className="text-gray-700">{question.answer}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{doctor.name}</h3>
                        {doctor.isLive && (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            🔴 Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doctor.title}</p>
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⭐ {doctor.rating}/5.0</span>
                        <span>{doctor.experience}</span>
                      </div>
                      <Button size="sm" className="mt-3">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Ask Question
                      </Button>
                    </div>
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
