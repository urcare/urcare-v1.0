
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConditionCommunities } from './ConditionCommunities';
import { RecoveryStories } from './RecoveryStories';
import { AvatarRewards } from './AvatarRewards';
import { ReferralProgram } from './ReferralProgram';
import { CommunityChatWall } from './CommunityChatWall';
import { SupportGroups } from './SupportGroups';
import { MoodBasedMatching } from './MoodBasedMatching';
import { DoctorAMAWall } from './DoctorAMAWall';
import { EngagementTracker } from './EngagementTracker';
import { FeedbackBot } from './FeedbackBot';
import { SurpriseRewards } from './SurpriseRewards';
import { HealthAssistantBot } from './HealthAssistantBot';
import { Users, Heart, Trophy, UserPlus, MessageSquare, Calendar, Sparkles, Bot, TrendingUp, Brain, Gift, Star } from 'lucide-react';

export const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Premium Patient Community Platform
        </h1>
        <p className="text-gray-600">
          Connect, share, and support each other with AI-powered premium features
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Communities</h3>
              <p className="text-sm text-gray-600">Join condition-based support</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <h3 className="font-bold text-red-800">Mood Matching</h3>
              <p className="text-sm text-gray-600">AI buddy recommendations</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Star className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <h3 className="font-bold text-yellow-800">Doctor AMAs</h3>
              <p className="text-sm text-gray-600">Expert Q&A sessions</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-bold text-green-800">Engagement</h3>
              <p className="text-sm text-gray-600">Track participation</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Gift className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-bold text-purple-800">Surprises</h3>
              <p className="text-sm text-gray-600">Unexpected rewards</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Bot className="h-8 w-8 mx-auto text-cyan-600 mb-2" />
              <h3 className="font-bold text-cyan-800">AI Assistant</h3>
              <p className="text-sm text-gray-600">Personal health guide</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="communities" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Communities</span>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Premium</span>
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Stories</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Groups</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="space-y-6">
          <ConditionCommunities />
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <Tabs defaultValue="mood-matching" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="mood-matching">Mood Matching</TabsTrigger>
              <TabsTrigger value="doctor-ama">Doctor AMA</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="feedback">Feedback Bot</TabsTrigger>
              <TabsTrigger value="surprise-rewards">Surprises</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="mood-matching">
              <MoodBasedMatching />
            </TabsContent>

            <TabsContent value="doctor-ama">
              <DoctorAMAWall />
            </TabsContent>

            <TabsContent value="engagement">
              <EngagementTracker />
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackBot />
            </TabsContent>

            <TabsContent value="surprise-rewards">
              <SurpriseRewards />
            </TabsContent>

            <TabsContent value="ai-assistant">
              <HealthAssistantBot />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <RecoveryStories />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <AvatarRewards />
            <ReferralProgram />
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <CommunityChatWall />
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <SupportGroups />
        </TabsContent>
      </Tabs>
    </div>
  );
};
