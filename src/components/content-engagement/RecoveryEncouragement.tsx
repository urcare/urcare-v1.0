
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  Target, 
  MessageSquare,
  Award,
  Calendar,
  Smile,
  Trophy
} from 'lucide-react';

interface RecoveryMilestone {
  id: string;
  patientId: string;
  patientName: string;
  condition: string;
  milestoneType: string;
  targetDate: string;
  completionDate?: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  personalizedMessage: string;
  motivationLevel: 'high' | 'medium' | 'low';
}

interface MotivationalContent {
  id: string;
  patientId: string;
  messageType: 'encouragement' | 'achievement' | 'reminder' | 'support';
  content: string;
  deliveryTime: string;
  responseRate: number;
  effectivenessScore: number;
}

const mockMilestones: RecoveryMilestone[] = [
  {
    id: 'MIL001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    condition: 'Diabetes Management',
    milestoneType: 'Blood Sugar Control',
    targetDate: '2024-02-01',
    progress: 85,
    status: 'in-progress',
    personalizedMessage: "You're doing amazing with your blood sugar monitoring! Keep up the great work!",
    motivationLevel: 'high'
  },
  {
    id: 'MIL002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    condition: 'Post-Surgery Recovery',
    milestoneType: 'Physical Therapy Goals',
    targetDate: '2024-01-25',
    completionDate: '2024-01-24',
    progress: 100,
    status: 'completed',
    personalizedMessage: "Congratulations! You've exceeded your recovery goals ahead of schedule!",
    motivationLevel: 'high'
  },
  {
    id: 'MIL003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    condition: 'Mental Health',
    milestoneType: 'Therapy Sessions',
    targetDate: '2024-02-15',
    progress: 60,
    status: 'delayed',
    personalizedMessage: "Every step forward counts. Let's work together to get back on track.",
    motivationLevel: 'medium'
  }
];

const mockMotivationalContent: MotivationalContent[] = [
  {
    id: 'MSG001',
    patientId: 'P2847',
    messageType: 'encouragement',
    content: "Your dedication to monitoring your blood sugar is inspiring! You're building healthy habits that will benefit you for life.",
    deliveryTime: '2024-01-20 09:00',
    responseRate: 92,
    effectivenessScore: 89
  },
  {
    id: 'MSG002',
    patientId: 'P1932',
    messageType: 'achievement',
    content: "🎉 Amazing achievement! You've completed your physical therapy goals ahead of schedule. Your hard work is paying off!",
    deliveryTime: '2024-01-20 14:30',
    responseRate: 98,
    effectivenessScore: 95
  },
  {
    id: 'MSG003',
    patientId: 'P3156',
    messageType: 'support',
    content: "Remember, healing isn't linear. You're stronger than you know, and we're here to support you every step of the way.",
    deliveryTime: '2024-01-20 16:45',
    responseRate: 75,
    effectivenessScore: 82
  }
];

export const RecoveryEncouragement = () => {
  const [milestones] = useState<RecoveryMilestone[]>(mockMilestones);
  const [motivationalContent] = useState<MotivationalContent[]>(mockMotivationalContent);
  const [selectedMilestone, setSelectedMilestone] = useState<RecoveryMilestone | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'delayed': return 'bg-orange-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMotivationColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'encouragement': return <Heart className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'reminder': return <Calendar className="h-4 w-4" />;
      case 'support': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Recovery Encouragement Interface
          </CardTitle>
          <CardDescription>
            Personalized messaging, milestone tracking, and motivation enhancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {milestones.filter(m => m.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {milestones.filter(m => m.status === 'in-progress').length}
                  </p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {milestones.filter(m => m.status === 'delayed').length}
                  </p>
                  <p className="text-sm text-gray-600">Delayed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{motivationalContent.length}</p>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recovery Milestones</h3>
              {milestones.map((milestone) => (
                <Card 
                  key={milestone.id} 
                  className={`cursor-pointer transition-colors ${selectedMilestone?.id === milestone.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-pink-400`}
                  onClick={() => setSelectedMilestone(milestone)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{milestone.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{milestone.condition}</p>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm font-medium">{milestone.milestoneType}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{milestone.progress}%</p>
                          <p className="text-xs text-gray-500">Progress</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Smile className={`h-3 w-3 ${getMotivationColor(milestone.motivationLevel)}`} />
                          <span className={getMotivationColor(milestone.motivationLevel)}>
                            {milestone.motivationLevel} motivation
                          </span>
                        </div>
                        <span className="text-gray-500">Target: {milestone.targetDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Motivational Messages</h3>
              {motivationalContent.map((message) => (
                <Card key={message.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getMessageTypeIcon(message.messageType)}
                        <Badge variant="outline" className="capitalize">
                          {message.messageType}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{message.effectivenessScore}</p>
                        <p className="text-xs text-gray-500">Effectiveness</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 italic">"{message.content}"</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Sent: {message.deliveryTime}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{message.responseRate}% response</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selectedMilestone && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedMilestone.patientName} - {selectedMilestone.milestoneType}</CardTitle>
                <CardDescription>Detailed milestone tracking and personalized motivation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Milestone Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>Condition: <strong>{selectedMilestone.condition}</strong></p>
                        <p>Type: <strong>{selectedMilestone.milestoneType}</strong></p>
                        <p>Target Date: <strong>{selectedMilestone.targetDate}</strong></p>
                        {selectedMilestone.completionDate && (
                          <p>Completed: <strong>{selectedMilestone.completionDate}</strong></p>
                        )}
                        <p>Status: <strong className={getStatusColor(selectedMilestone.status).includes('green') ? 'text-green-600' : 
                          getStatusColor(selectedMilestone.status).includes('blue') ? 'text-blue-600' :
                          getStatusColor(selectedMilestone.status).includes('orange') ? 'text-orange-600' : 'text-gray-600'}>
                          {selectedMilestone.status}
                        </strong></p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Progress Tracking</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span className="font-bold">{selectedMilestone.progress}%</span>
                        </div>
                        <Progress value={selectedMilestone.progress} className="h-3" />
                        <p className="text-xs text-gray-500">
                          Motivation Level: <span className={getMotivationColor(selectedMilestone.motivationLevel)}>
                            {selectedMilestone.motivationLevel}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-600" />
                      Personalized Message
                    </h4>
                    <p className="text-blue-700 italic">"{selectedMilestone.personalizedMessage}"</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Send Encouragement
                    </Button>
                    <Button variant="outline">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Update Progress
                    </Button>
                    <Button variant="outline">
                      <Award className="h-4 w-4 mr-1" />
                      Create Reward
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
