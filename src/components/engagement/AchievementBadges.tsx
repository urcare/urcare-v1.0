
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Share2, Calendar, Award, Medal, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'hydration' | 'nutrition' | 'activity' | 'sleep' | 'consistency' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  earned: boolean;
  earnedDate?: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  endsIn: string;
}

export const AchievementBadges = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water for 7 consecutive days',
      category: 'hydration',
      tier: 'gold',
      progress: 7,
      maxProgress: 7,
      earned: true,
      earnedDate: '2024-01-20',
      points: 100,
      rarity: 'rare'
    },
    {
      id: '2',
      title: 'Sleep Champion',
      description: 'Get 8+ hours of sleep for 14 days',
      category: 'sleep',
      tier: 'silver',
      progress: 10,
      maxProgress: 14,
      earned: false,
      points: 75,
      rarity: 'common'
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Complete all daily habits for 30 days',
      category: 'consistency',
      tier: 'platinum',
      progress: 25,
      maxProgress: 30,
      earned: false,
      points: 200,
      rarity: 'legendary'
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '10K Steps Challenge',
      description: 'Walk 10,000 steps daily for a week',
      duration: '7 days',
      participants: 234,
      reward: 'Activity Master Badge',
      difficulty: 'medium',
      endsIn: '3 days'
    },
    {
      id: '2',
      title: 'Meditation Marathon',
      description: 'Meditate for 30 minutes daily',
      duration: '14 days',
      participants: 156,
      reward: 'Mindfulness Guru Badge',
      difficulty: 'hard',
      endsIn: '1 week'
    }
  ]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hydration': return '💧';
      case 'nutrition': return '🍎';
      case 'activity': return '🏃';
      case 'sleep': return '😴';
      case 'consistency': return '🎯';
      case 'social': return '👥';
      default: return '⭐';
    }
  };

  const handleShare = (achievement: Achievement) => {
    const shareText = `I just earned the "${achievement.title}" badge! 🏆 #HealthGoals #WellnessJourney`;
    
    if (navigator.share) {
      navigator.share({
        title: `Health Achievement: ${achievement.title}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Achievement copied to clipboard for sharing!');
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(c => 
        c.id === challengeId 
          ? { ...c, participants: c.participants + 1 }
          : c
      )
    );
    toast.success('Joined challenge! Good luck! 🎯');
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievement System
          </CardTitle>
          <CardDescription>
            Earn badges, complete challenges, and track your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{earnedAchievements.length}</div>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">7</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">My Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`relative overflow-hidden ${
                  achievement.earned ? 'bg-gradient-to-br from-green-50 to-blue-50' : 'opacity-75'
                }`}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${getTierColor(achievement.tier)} flex items-center justify-center text-white shadow-lg text-2xl`}>
                    {getCategoryIcon(achievement.category)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Badge className={`bg-gradient-to-r ${getTierColor(achievement.tier)} text-white border-0`}>
                        {achievement.tier.toUpperCase()}
                      </Badge>
                      <span className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>

                  {achievement.earned ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Trophy className="h-4 w-4" />
                        <span className="font-medium">Earned!</span>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">+{achievement.points}</div>
                        <p className="text-xs text-gray-500">Points</p>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {achievement.earnedDate}
                      </div>
                      <Button 
                        onClick={() => handleShare(achievement)}
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">+{achievement.points} pts</div>
                        <p className="text-xs text-gray-500">
                          {achievement.maxProgress - achievement.progress} more to unlock
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    <Badge 
                      className={
                        challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">{challenge.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Participants:</span>
                      <div className="font-medium">{challenge.participants}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Reward</span>
                    </div>
                    <p className="text-sm text-blue-700">{challenge.reward}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-orange-600">
                      Ends in: {challenge.endsIn}
                    </div>
                    <Button onClick={() => handleJoinChallenge(challenge.id)}>
                      <Target className="h-4 w-4 mr-2" />
                      Join Challenge
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
