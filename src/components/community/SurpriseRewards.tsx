
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Sparkles, Trophy, Star, Zap, Heart, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'points' | 'badge' | 'feature' | 'surprise';
  value: string;
  rarity: 'common' | 'rare' | 'legendary';
  icon: React.ReactNode;
  unlocked: boolean;
  dateUnlocked?: string;
}

interface SurpriseEvent {
  id: string;
  title: string;
  description: string;
  reward: string;
  trigger: string;
  probability: number;
  isActive: boolean;
}

export const SurpriseRewards = () => {
  const [streakCounter, setStreakCounter] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1247);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Community Champion',
      description: 'Helped 50+ community members',
      type: 'badge',
      value: 'Special Badge',
      rarity: 'rare',
      icon: <Trophy className="h-6 w-6" />,
      unlocked: true,
      dateUnlocked: '2024-01-15'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: '30-day engagement streak',
      type: 'points',
      value: '500 Points',
      rarity: 'legendary',
      icon: <Zap className="h-6 w-6" />,
      unlocked: false
    },
    {
      id: '3',
      title: 'Early Bird',
      description: 'First to join AMA session',
      type: 'feature',
      value: 'Priority Access',
      rarity: 'common',
      icon: <Star className="h-6 w-6" />,
      unlocked: true,
      dateUnlocked: '2024-01-18'
    },
    {
      id: '4',
      title: 'Mood Matcher',
      description: 'Perfect buddy match 10 times',
      type: 'surprise',
      value: 'Custom Avatar',
      rarity: 'rare',
      icon: <Heart className="h-6 w-6" />,
      unlocked: false
    }
  ];

  const surpriseEvents: SurpriseEvent[] = [
    {
      id: '1',
      title: 'Random Acts of Kindness',
      description: 'Surprise reward for helping others',
      reward: '100 bonus points',
      trigger: 'Helping community members',
      probability: 15,
      isActive: true
    },
    {
      id: '2',
      title: 'Serendipity Streak',
      description: 'Unexpected reward for consistency',
      reward: 'Exclusive badge',
      trigger: 'Daily engagement',
      probability: 5,
      isActive: true
    },
    {
      id: '3',
      title: 'Discovery Bonus',
      description: 'Reward for trying new features',
      reward: 'Feature unlock',
      trigger: 'Feature exploration',
      probability: 20,
      isActive: true
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const triggerSurpriseReward = () => {
    const activeEvents = surpriseEvents.filter(event => event.isActive);
    const randomEvent = activeEvents[Math.floor(Math.random() * activeEvents.length)];
    
    if (randomEvent && Math.random() * 100 < randomEvent.probability) {
      const surpriseReward: Reward = {
        id: 'surprise-' + Date.now(),
        title: 'Surprise Reward!',
        description: randomEvent.description,
        type: 'surprise',
        value: randomEvent.reward,
        rarity: 'rare',
        icon: <Gift className="h-6 w-6" />,
        unlocked: true,
        dateUnlocked: new Date().toLocaleDateString()
      };
      
      setCurrentReward(surpriseReward);
      setShowRewardModal(true);
      toast.success('🎉 Surprise reward unlocked!');
    }
  };

  const checkDailyReward = () => {
    // Simulate daily engagement check
    if (streakCounter > 0) {
      triggerSurpriseReward();
    }
  };

  useEffect(() => {
    // Check for surprise rewards every 30 seconds (for demo)
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        triggerSurpriseReward();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const claimReward = () => {
    if (currentReward) {
      setTotalPoints(prev => prev + 100);
      toast.success('Reward claimed successfully!');
      setShowRewardModal(false);
      setCurrentReward(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Surprise Rewards Engine
          </CardTitle>
          <CardDescription>
            Earn unexpected rewards for your community engagement and helpful behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{streakCounter}</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {rewards.filter(r => r.unlocked).length}
              </div>
              <p className="text-sm text-gray-600">Rewards Earned</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-sm text-gray-600">Surprise Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards Collection</CardTitle>
            <CardDescription>
              Badges, points, and special features you've unlocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward) => (
                <div 
                  key={reward.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    reward.unlocked ? `${getRarityBorder(reward.rarity)} bg-gradient-to-r from-white to-gray-50` : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getRarityColor(reward.rarity)} text-white`}>
                      {reward.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{reward.title}</h4>
                        <Badge className={`text-xs bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white border-0`}>
                          {reward.rarity.toUpperCase()}
                        </Badge>
                        {reward.unlocked && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-600">
                          {reward.value}
                        </span>
                        {reward.unlocked && reward.dateUnlocked && (
                          <span className="text-xs text-gray-500">
                            Earned on {reward.dateUnlocked}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Surprise Events</CardTitle>
            <CardDescription>
              Ongoing opportunities to earn unexpected rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surpriseEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.probability}% chance
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Trigger: {event.trigger}</span>
                      <span className="font-medium text-purple-600">{event.reward}</span>
                    </div>
                    <Progress value={event.probability} className="h-2" />
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button onClick={checkDailyReward} variant="outline">
                  <Gift className="h-4 w-4 mr-2" />
                  Check for Daily Surprises
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surprise Reward Modal */}
      {showRewardModal && currentReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 flex items-center justify-center mb-4">
                {currentReward.icon}
              </div>
              <CardTitle className="text-xl">🎉 Surprise Reward!</CardTitle>
              <CardDescription>{currentReward.title}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">{currentReward.description}</p>
              <div className="p-3 bg-white/50 rounded-lg">
                <span className="font-semibold text-purple-600">{currentReward.value}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={claimReward} className="flex-1">
                  <Gift className="h-4 w-4 mr-2" />
                  Claim Reward
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRewardModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
