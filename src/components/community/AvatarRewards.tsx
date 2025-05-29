
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Gift, CheckCircle, Lock, Users, MessageCircle, Heart, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

interface AvatarItem {
  id: string;
  name: string;
  category: 'hat' | 'shirt' | 'accessory' | 'background';
  image: string;
  cost: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AvatarRewards = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'avatars'>('overview');
  const [userPoints, setUserPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState(8);
  
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Join your first community',
      icon: '👥',
      points: 50,
      isUnlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Storyteller',
      description: 'Share your first recovery story',
      icon: '📖',
      points: 100,
      isUnlocked: true,
      unlockedAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'Supportive Friend',
      description: 'Give 50 likes to community posts',
      icon: '❤️',
      points: 75,
      isUnlocked: false,
      progress: { current: 32, target: 50 }
    },
    {
      id: '4',
      title: 'Community Leader',
      description: 'Help moderate discussions for 30 days',
      icon: '🛡️',
      points: 200,
      isUnlocked: false,
      progress: { current: 12, target: 30 }
    },
    {
      id: '5',
      title: 'Inspiration',
      description: 'Your story gets 100 likes',
      icon: '⭐',
      points: 150,
      isUnlocked: false,
      progress: { current: 67, target: 100 }
    }
  ]);

  const [avatarItems] = useState<AvatarItem[]>([
    {
      id: '1',
      name: 'Wellness Crown',
      category: 'hat',
      image: '/placeholder.svg',
      cost: 200,
      isUnlocked: true,
      rarity: 'rare'
    },
    {
      id: '2',
      name: 'Hope T-Shirt',
      category: 'shirt',
      image: '/placeholder.svg',
      cost: 150,
      isUnlocked: true,
      rarity: 'common'
    },
    {
      id: '3',
      name: 'Support Badge',
      category: 'accessory',
      image: '/placeholder.svg',
      cost: 100,
      isUnlocked: false,
      rarity: 'common'
    },
    {
      id: '4',
      name: 'Recovery Warrior Armor',
      category: 'shirt',
      image: '/placeholder.svg',
      cost: 500,
      isUnlocked: false,
      rarity: 'legendary'
    },
    {
      id: '5',
      name: 'Sunset Garden Background',
      category: 'background',
      image: '/placeholder.svg',
      cost: 300,
      isUnlocked: false,
      rarity: 'epic'
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const unlockAvatarItem = (itemId: string, cost: number) => {
    if (userPoints >= cost) {
      setUserPoints(userPoints - cost);
      // Update item unlock status
    }
  };

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            Your Rewards Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{userPoints}</div>
              <p className="text-sm text-gray-600">Community Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Level {userLevel}</div>
              <Progress value={75} className="mt-2" />
              <p className="text-sm text-gray-600 mt-1">75% to Level {userLevel + 1}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{achievements.filter(a => a.isUnlocked).length}</div>
              <p className="text-sm text-gray-600">Achievements Unlocked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          <Star className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'achievements' ? 'default' : 'outline'}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Achievements
        </Button>
        <Button
          variant={activeTab === 'avatars' ? 'default' : 'outline'}
          onClick={() => setActiveTab('avatars')}
        >
          <Gift className="h-4 w-4 mr-2" />
          Avatar Store
        </Button>
      </div>

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>
                Complete activities to earn points and unlock new achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${achievement.isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center gap-2">
                            {achievement.title}
                            {achievement.isUnlocked && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {!achievement.isUnlocked && <Lock className="h-4 w-4 text-gray-400" />}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                          
                          {achievement.progress && !achievement.isUnlocked && (
                            <div className="space-y-1">
                              <Progress 
                                value={(achievement.progress.current / achievement.progress.target) * 100} 
                                className="h-2"
                              />
                              <p className="text-xs text-gray-500">
                                {achievement.progress.current} / {achievement.progress.target}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant={achievement.isUnlocked ? 'default' : 'secondary'}>
                              {achievement.points} points
                            </Badge>
                            {achievement.isUnlocked && achievement.unlockedAt && (
                              <p className="text-xs text-gray-500">
                                Unlocked {achievement.unlockedAt}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Avatar Store Tab */}
      {activeTab === 'avatars' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Customization Store</CardTitle>
              <CardDescription>
                Spend your community points to unlock new avatar items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {avatarItems.map((item) => (
                  <Card key={item.id} className={`${item.isUnlocked ? 'bg-green-50 border-green-200' : ''} ${getRarityColor(item.rarity)} border-2`}>
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full" />
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{item.cost} points</span>
                        </div>
                        
                        {item.isUnlocked ? (
                          <Badge variant="default" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Owned
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={userPoints < item.cost}
                            onClick={() => unlockAvatarItem(item.id, item.cost)}
                          >
                            {userPoints >= item.cost ? 'Unlock' : 'Not Enough Points'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.filter(a => a.isUnlocked).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                      <div className="text-lg">{achievement.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-600">+{achievement.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Point Earning Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earn More Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Comment on posts</span>
                    </div>
                    <Badge variant="outline">+5 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Like community posts</span>
                    </div>
                    <Badge variant="outline">+2 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Attend support groups</span>
                    </div>
                    <Badge variant="outline">+25 pts</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
