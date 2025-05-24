
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Award, Lock, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'engagement' | 'learning' | 'consistency' | 'milestone' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  progress: number;
  maxProgress: number;
  points: number;
  requirement: string;
}

interface Props {
  onBadgeEarned: (badgeId: string) => void;
}

const achievements: Achievement[] = [
  {
    id: 'badge-1',
    title: 'First Steps',
    description: 'Complete your first micro-action',
    category: 'engagement',
    tier: 'bronze',
    icon: <Zap className="h-6 w-6" />,
    earned: true,
    earnedDate: '2024-01-15',
    progress: 1,
    maxProgress: 1,
    points: 10,
    requirement: 'Complete 1 micro-action'
  },
  {
    id: 'badge-2',
    title: 'Health Scholar',
    description: 'Score 80% or higher on 3 health quizzes',
    category: 'learning',
    tier: 'silver',
    icon: <Star className="h-6 w-6" />,
    earned: true,
    earnedDate: '2024-01-18',
    progress: 3,
    maxProgress: 3,
    points: 25,
    requirement: 'Score 80%+ on 3 quizzes'
  },
  {
    id: 'badge-3',
    title: 'Consistency Champion',
    description: 'Complete micro-actions for 7 days straight',
    category: 'consistency',
    tier: 'gold',
    icon: <Target className="h-6 w-6" />,
    earned: false,
    progress: 5,
    maxProgress: 7,
    points: 50,
    requirement: '7-day streak'
  },
  {
    id: 'badge-4',
    title: 'Knowledge Master',
    description: 'Achieve perfect scores on 5 quizzes',
    category: 'learning',
    tier: 'platinum',
    icon: <Trophy className="h-6 w-6" />,
    earned: false,
    progress: 2,
    maxProgress: 5,
    points: 100,
    requirement: '5 perfect quiz scores'
  },
  {
    id: 'badge-5',
    title: 'Community Connector',
    description: 'Connect with 5 health peers',
    category: 'social',
    tier: 'silver',
    icon: <Award className="h-6 w-6" />,
    earned: false,
    progress: 1,
    maxProgress: 5,
    points: 30,
    requirement: 'Connect with 5 peers'
  },
  {
    id: 'badge-6',
    title: 'Milestone Achiever',
    description: 'Complete 100 micro-actions',
    category: 'milestone',
    tier: 'gold',
    icon: <Star className="h-6 w-6" />,
    earned: false,
    progress: 28,
    maxProgress: 100,
    points: 75,
    requirement: '100 micro-actions'
  }
];

export const AchievementBadges = ({ onBadgeEarned }: Props) => {
  const [badges, setBadges] = useState(achievements);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Badges' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'learning', label: 'Learning' },
    { value: 'consistency', label: 'Consistency' },
    { value: 'milestone', label: 'Milestones' },
    { value: 'social', label: 'Social' }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBorder = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'border-orange-300';
      case 'silver': return 'border-gray-300';
      case 'gold': return 'border-yellow-300';
      case 'platinum': return 'border-purple-300';
      default: return 'border-gray-300';
    }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);

  const handleClaimProgress = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (badge && badge.progress >= badge.maxProgress && !badge.earned) {
      setBadges(prev => 
        prev.map(b => 
          b.id === badgeId 
            ? { ...b, earned: true, earnedDate: new Date().toISOString().split('T')[0] }
            : b
        )
      );
      onBadgeEarned(badgeId);
      toast.success(`🏆 Achievement unlocked: ${badge.title}!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{earnedBadges.length}</div>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((earnedBadges.length / badges.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Completion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            size="sm"
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <Card 
            key={badge.id} 
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              badge.earned ? 'bg-gradient-to-br from-green-50 to-blue-50' : 'opacity-75'
            } ${getTierBorder(badge.tier)} border-2`}
          >
            <CardContent className="p-6 text-center space-y-4">
              {/* Badge Icon */}
              <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${getTierColor(badge.tier)} flex items-center justify-center text-white shadow-lg`}>
                {badge.earned ? badge.icon : <Lock className="h-6 w-6" />}
              </div>

              {/* Badge Info */}
              <div className="space-y-2">
                <Badge className={`bg-gradient-to-r ${getTierColor(badge.tier)} text-white border-0`}>
                  {badge.tier.toUpperCase()}
                </Badge>
                <h3 className="font-bold text-lg">{badge.title}</h3>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>

              {/* Progress or Earned Status */}
              {badge.earned ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">Earned!</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {badge.earnedDate}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    +{badge.points} points
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(badge.progress / badge.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500">{badge.requirement}</p>
                  
                  {badge.progress >= badge.maxProgress ? (
                    <Button 
                      onClick={() => handleClaimProgress(badge.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Claim Badge
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {badge.maxProgress - badge.progress} more to unlock
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Tier Indicator */}
            <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-${badge.tier === 'gold' ? 'yellow' : badge.tier === 'silver' ? 'gray' : badge.tier === 'platinum' ? 'purple' : 'orange'}-400`} />
          </Card>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No badges found in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
