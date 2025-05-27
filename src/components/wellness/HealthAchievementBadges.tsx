
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Share2, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'hydration' | 'nutrition' | 'activity' | 'sleep' | 'consistency';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  earned: boolean;
  earnedDate?: string;
  socialShares: number;
}

export const HealthAchievementBadges = () => {
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
      socialShares: 12
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
      socialShares: 0
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
      socialShares: 0
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hydration': return '💧';
      case 'nutrition': return '🍎';
      case 'activity': return '🏃';
      case 'sleep': return '😴';
      case 'consistency': return '🎯';
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

    setAchievements(prev => 
      prev.map(a => 
        a.id === achievement.id 
          ? { ...a, socialShares: a.socialShares + 1 }
          : a
      )
    );
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalPoints = earnedAchievements.reduce((sum, a) => {
    const tierPoints = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
    return sum + tierPoints[a.tier];
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold-500" />
            Health Achievement System
          </CardTitle>
          <CardDescription>
            Earn badges, share your success, and build healthy habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {achievements.reduce((sum, a) => sum + a.socialShares, 0)}
              </div>
              <p className="text-sm text-gray-600">Social Shares</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <Badge className={`bg-gradient-to-r ${getTierColor(achievement.tier)} text-white border-0`}>
                  {achievement.tier.toUpperCase()}
                </Badge>
                <h3 className="font-bold text-lg">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>

              {achievement.earned ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">Earned!</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {achievement.earnedDate}
                  </div>
                  <Button 
                    onClick={() => handleShare(achievement)}
                    className="w-full"
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Achievement
                  </Button>
                  {achievement.socialShares > 0 && (
                    <p className="text-xs text-gray-500">
                      Shared {achievement.socialShares} times
                    </p>
                  )}
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
                  <p className="text-xs text-gray-500">
                    {achievement.maxProgress - achievement.progress} more to unlock
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
