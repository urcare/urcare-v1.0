
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Star, Target, Flame, Crown, Zap, Heart, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  requirements: string[];
}

interface AchievementBadgesProps {
  onBadgeEarned: (badgeId: string) => void;
}

export const AchievementBadges = ({ onBadgeEarned }: AchievementBadgesProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first micro-action',
      category: 'Getting Started',
      icon: <Zap className="h-6 w-6" />,
      rarity: 'common',
      points: 10,
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      unlockedAt: '2024-01-15',
      requirements: ['Complete 1 micro-action']
    },
    {
      id: '2',
      title: 'Hydration Hero',
      description: 'Drink water 7 days in a row',
      category: 'Wellness',
      icon: <Heart className="h-6 w-6" />,
      rarity: 'rare',
      points: 50,
      progress: 5,
      maxProgress: 7,
      isUnlocked: false,
      requirements: ['Complete water drinking action for 7 consecutive days']
    },
    {
      id: '3',
      title: 'Quiz Master',
      description: 'Score 100% on 3 Health IQ quizzes',
      category: 'Learning',
      icon: <Star className="h-6 w-6" />,
      rarity: 'epic',
      points: 100,
      progress: 1,
      maxProgress: 3,
      isUnlocked: false,
      requirements: ['Score perfect on 3 different Health IQ quizzes']
    },
    {
      id: '4',
      title: 'Community Builder',
      description: 'Help 10 community members',
      category: 'Social',
      icon: <Users className="h-6 w-6" />,
      rarity: 'rare',
      points: 75,
      progress: 3,
      maxProgress: 10,
      isUnlocked: false,
      requirements: ['Provide helpful responses to 10 community questions']
    },
    {
      id: '5',
      title: 'Streak Legend',
      description: 'Maintain a 30-day activity streak',
      category: 'Consistency',
      icon: <Flame className="h-6 w-6" />,
      rarity: 'legendary',
      points: 200,
      progress: 12,
      maxProgress: 30,
      isUnlocked: false,
      requirements: ['Complete at least one health action for 30 consecutive days']
    },
    {
      id: '6',
      title: 'Time Keeper',
      description: 'Use the platform for 100 days',
      category: 'Dedication',
      icon: <Clock className="h-6 w-6" />,
      rarity: 'epic',
      points: 150,
      progress: 67,
      maxProgress: 100,
      isUnlocked: false,
      requirements: ['Log into the platform on 100 different days']
    },
    {
      id: '7',
      title: 'Goal Crusher',
      description: 'Complete 5 wellness goals',
      category: 'Achievement',
      icon: <Target className="h-6 w-6" />,
      rarity: 'rare',
      points: 80,
      progress: 2,
      maxProgress: 5,
      isUnlocked: false,
      requirements: ['Successfully complete 5 wellness goals']
    },
    {
      id: '8',
      title: 'Health Champion',
      description: 'Earn 1000 total points',
      category: 'Milestone',
      icon: <Crown className="h-6 w-6" />,
      rarity: 'legendary',
      points: 250,
      progress: 456,
      maxProgress: 1000,
      isUnlocked: false,
      requirements: ['Accumulate 1000 points across all activities']
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'getting-started', 'wellness', 'learning', 'social', 'consistency', 'dedication', 'achievement', 'milestone'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '🥉';
      case 'rare': return '🥈';
      case 'epic': return '🥇';
      case 'legendary': return '👑';
      default: return '⭐';
    }
  };

  const handleClaimReward = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : achievement
    ));
    onBadgeEarned(achievementId);
    toast.success('🎉 Achievement unlocked! Badge earned!');
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || 
    achievement.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPoints = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Badges
          </CardTitle>
          <CardDescription>
            Unlock badges and earn rewards for your health journey milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{unlockedCount}</div>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{achievements.length}</div>
              <p className="text-sm text-gray-600">Total Badges</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <p className="text-sm text-gray-600">Badge Points</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
          <TabsT1rigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`transition-all duration-200 hover:shadow-md ${
                achievement.isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 
                achievement.progress > 0 ? 'border-blue-200' : 'bg-gray-50'
              }`}>
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      achievement.isUnlocked ? 'bg-yellow-200 text-yellow-800' : 
                      achievement.progress > 0 ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <span className="text-lg">{getRarityIcon(achievement.rarity)}</span>
                      </div>
                      <Badge className={`${getRarityColor(achievement.rarity)} text-xs`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    
                    {!achievement.isUnlocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-600">{achievement.points} points</span>
                    </div>
                    
                    {achievement.isUnlocked ? (
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Unlocked {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    ) : achievement.progress === achievement.maxProgress ? (
                      <Button 
                        onClick={() => handleClaimReward(achievement.id)}
                        className="w-full"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Claim Badge
                      </Button>
                    ) : (
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="space-y-1">
                          {achievement.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unlocked">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.filter(a => a.isUnlocked).map((achievement) => (
              <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-yellow-200 text-yellow-800 mb-3">
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    ✓ Completed
                  </Badge>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="text-sm text-blue-600 font-medium mt-2">
                    {achievement.points} points earned
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            {achievements.filter(a => !a.isUnlocked && a.progress > 0).map((achievement) => (
              <Card key={achievement.id} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-200 text-blue-800">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                    <div className="text-right">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <div className="text-sm text-blue-600 font-medium mt-1">
                        {achievement.points} pts
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.filter(a => !a.isUnlocked && a.progress === 0).map((achievement) => (
              <Card key={achievement.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-600">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-700">{achievement.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                      <div className="text-xs text-gray-500">
                        <p className="font-medium mb-1">Requirements:</p>
                        <ul className="space-y-1">
                          {achievement.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => {
              const categoryAchievements = achievements.filter(a => 
                a.category.toLowerCase().replace(/\s+/g, '-') === category
              );
              const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
              
              return (
                <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold mb-2 capitalize">
                      {category.replace('-', ' ')}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {unlockedInCategory}/{categoryAchievements.length}
                    </div>
                    <Progress 
                      value={(unlockedInCategory / categoryAchievements.length) * 100} 
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
