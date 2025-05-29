
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConditionCommunities } from './ConditionCommunities';
import { RecoveryStories } from './RecoveryStories';
import { AvatarRewards } from './AvatarRewards';
import { ReferralProgram } from './ReferralProgram';
import { CommunityChatWall } from './CommunityChatWall';
import { SupportGroups } from './SupportGroups';
import { Users, Heart, Trophy, UserPlus, MessageSquare, Calendar } from 'lucide-react';

export const CommunityDashboard = () => {
  const [activeTab, setActiveTab] = useState('communities');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Patient Community Platform
        </h1>
        <p className="text-gray-600">
          Connect, share, and support each other on your health journey
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-lg">
              <Users className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Communities</h3>
              <p className="text-sm text-gray-600">Join condition-based support groups</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Heart className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Recovery Stories</h3>
              <p className="text-sm text-gray-600">Share and inspire others</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg">
              <Trophy className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-bold text-blue-800">Rewards</h3>
              <p className="text-sm text-gray-600">Earn avatars and achievements</p>
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
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Stories</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Referrals</span>
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

        <TabsContent value="stories" className="space-y-6">
          <RecoveryStories />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <AvatarRewards />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralProgram />
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
