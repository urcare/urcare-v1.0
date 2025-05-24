
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MicroActionsFeed } from './MicroActionsFeed';
import { HealthIQQuiz } from './HealthIQQuiz';
import { StoryScrollHighlights } from './StoryScrollHighlights';
import { WeeklyDigest } from './WeeklyDigest';
import { PeerMatching } from './PeerMatching';
import { AchievementBadges } from './AchievementBadges';
import { Zap, Brain, Star, Mail, Users, Trophy } from 'lucide-react';

export const EngagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('actions');
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    actionsCompleted: 0,
    quizzesTaken: 0,
    badgesEarned: 0,
    peersConnected: 0
  });

  const handleActionComplete = (actionId: string) => {
    setUserStats(prev => ({
      ...prev,
      actionsCompleted: prev.actionsCompleted + 1,
      totalPoints: prev.totalPoints + 10
    }));
  };

  const handleScoreUpdate = (score: number, total: number) => {
    setUserStats(prev => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      totalPoints: prev.totalPoints + (score * 5)
    }));
  };

  const handleBadgeEarned = (badgeId: string) => {
    setUserStats(prev => ({
      ...prev,
      badgesEarned: prev.badgesEarned + 1,
      totalPoints: prev.totalPoints + 25
    }));
  };

  const handlePeerConnect = (peerId: string) => {
    setUserStats(prev => ({
      ...prev,
      peersConnected: prev.peersConnected + 1,
      totalPoints: prev.totalPoints + 15
    }));
  };

  const handleStoryBookmark = (storyId: string) => {
    console.log('Story bookmarked:', storyId);
  };

  const handleStoryAction = (storyId: string) => {
    console.log('Story action taken:', storyId);
  };

  const handleDigestSend = () => {
    console.log('Weekly digest sent');
  };

  const handleContentLike = (contentId: string) => {
    console.log('Content liked:', contentId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Health Engagement Hub</h1>
        <p className="text-gray-600">
          Learn, engage, and connect on your health journey
        </p>
        <div className="text-lg font-semibold text-blue-600">
          Total Points: {userStats.totalPoints}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Actions</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Stories</span>
          </TabsTrigger>
          <TabsTrigger value="digest" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Digest</span>
          </TabsTrigger>
          <TabsTrigger value="peers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Peers</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Badges</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-6">
          <MicroActionsFeed onActionComplete={handleActionComplete} />
        </TabsContent>

        <TabsContent value="quiz" className="space-y-6">
          <HealthIQQuiz onScoreUpdate={handleScoreUpdate} />
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <StoryScrollHighlights 
            onBookmark={handleStoryBookmark}
            onStoryAction={handleStoryAction}
          />
        </TabsContent>

        <TabsContent value="digest" className="space-y-6">
          <WeeklyDigest onDigestSend={handleDigestSend} />
        </TabsContent>

        <TabsContent value="peers" className="space-y-6">
          <PeerMatching 
            onConnect={handlePeerConnect}
            onContentLike={handleContentLike}
          />
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <AchievementBadges onBadgeEarned={handleBadgeEarned} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
