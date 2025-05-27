
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Trophy, Target, Calendar, Crown, Star } from 'lucide-react';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  points: number;
  challengesCompleted: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team';
  duration: string;
  points: number;
  progress: number;
  target: number;
  participants: string[];
  status: 'active' | 'completed' | 'upcoming';
}

export const FamilyWellnessChallenges = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Sarah (Mom)',
      avatar: '👩‍💼',
      points: 1250,
      challengesCompleted: 8
    },
    {
      id: '2',
      name: 'Mike (Dad)',
      avatar: '👨‍💻',
      points: 980,
      challengesCompleted: 6
    },
    {
      id: '3',
      name: 'Emma',
      avatar: '👧',
      points: 1100,
      challengesCompleted: 9
    },
    {
      id: '4',
      name: 'Jake',
      avatar: '👦',
      points: 750,
      challengesCompleted: 5
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Family Step Challenge',
      description: 'Walk 50,000 steps together this week',
      type: 'team',
      duration: '7 days',
      points: 500,
      progress: 32000,
      target: 50000,
      participants: ['1', '2', '3', '4'],
      status: 'active'
    },
    {
      id: '2',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water daily for 5 days',
      type: 'individual',
      duration: '5 days',
      points: 200,
      progress: 3,
      target: 5,
      participants: ['3'],
      status: 'active'
    },
    {
      id: '3',
      title: 'Healthy Meal Prep',
      description: 'Prepare 3 healthy meals together',
      type: 'team',
      duration: '1 week',
      points: 300,
      progress: 3,
      target: 3,
      participants: ['1', '2'],
      status: 'completed'
    }
  ]);

  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const joinChallenge = (challengeId: string, memberId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, participants: [...challenge.participants, memberId] }
        : challenge
    ));
    toast.success('Joined challenge successfully! 🎯');
  };

  const updateProgress = (challengeId: string, increment: number) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { 
            ...challenge, 
            progress: Math.min(challenge.progress + increment, challenge.target),
            status: challenge.progress + increment >= challenge.target ? 'completed' : challenge.status
          }
        : challenge
    ));
    toast.success('Progress updated! Keep it up! 💪');
  };

  const createNewChallenge = () => {
    const newChallenge: Challenge = {
      id: Date.now().toString(),
      title: 'Weekend Workout',
      description: 'Complete 30 minutes of exercise each day this weekend',
      type: 'individual',
      duration: '2 days',
      points: 150,
      progress: 0,
      target: 2,
      participants: [],
      status: 'upcoming'
    };
    setChallenges(prev => [...prev, newChallenge]);
    toast.success('New challenge created! 🚀');
  };

  const sortedMembers = [...familyMembers].sort((a, b) => b.points - a.points);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'team' ? <Users className="h-4 w-4" /> : <Target className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Family Wellness Challenges
          </CardTitle>
          <CardDescription>
            Compete, collaborate, and achieve wellness goals together as a family
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createNewChallenge} className="w-full">
            <Trophy className="h-4 w-4 mr-2" />
            Create New Challenge
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Family Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedMembers.map((member, index) => (
              <div 
                key={member.id} 
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                    <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                  </div>
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">
                      {member.challengesCompleted} challenges completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-600">{member.points}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Challenges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTypeIcon(challenge.type)}
                            {challenge.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {challenge.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {challenge.points} points
                          </span>
                          <span>{challenge.participants.length} participant{challenge.participants.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {challenge.participants.map((participantId) => {
                        const member = familyMembers.find(m => m.id === participantId);
                        return member ? (
                          <span key={participantId} className="text-lg" title={member.name}>
                            {member.avatar}
                          </span>
                        ) : null;
                      })}
                    </div>
                    
                    {challenge.status === 'active' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateProgress(challenge.id, 1)}
                          variant="outline"
                        >
                          Update Progress
                        </Button>
                        {!challenge.participants.includes('1') && (
                          <Button
                            size="sm"
                            onClick={() => joinChallenge(challenge.id, '1')}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Join Challenge
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {challenge.status === 'completed' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-800 font-medium">🎉 Challenge Completed!</p>
                        <p className="text-sm text-green-600">
                          Everyone earned {challenge.points} points!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Daily Water Challenge</h4>
              <p className="text-sm text-blue-600">Everyone drinks 8 glasses daily for a week</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Family Fitness Hour</h4>
              <p className="text-sm text-green-600">Exercise together for 1 hour each weekend</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">Healthy Cooking</h4>
              <p className="text-sm text-orange-600">Try 3 new healthy recipes this month</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">Sleep Schedule</h4>
              <p className="text-sm text-purple-600">Maintain consistent bedtime for 2 weeks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
