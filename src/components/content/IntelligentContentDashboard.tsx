
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalizedHealthFeed } from './PersonalizedHealthFeed';
import { ScanRContentSync } from './ScanRContentSync';
import { WellnessCards } from './WellnessCards';
import { MedicalMythbusters } from './MedicalMythbusters';
import { BookmarkLibrary } from './BookmarkLibrary';
import { MoodBasedFeed } from './MoodBasedFeed';
import { AvatarHealthReactions } from './AvatarHealthReactions';
import { Feed, BookMarked, Heart, Brain, Users, Smile, Bot } from 'lucide-react';

export const IntelligentContentDashboard = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [userMood, setUserMood] = useState<'positive' | 'neutral' | 'concerned' | 'motivated'>('neutral');
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  const handleBookmark = (contentId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Intelligent Health Content</h1>
        <p className="text-gray-600">
          Personalized content tailored to your health journey and current mood
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Feed className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">ScanR</span>
          </TabsTrigger>
          <TabsTrigger value="wellness" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wellness</span>
          </TabsTrigger>
          <TabsTrigger value="mythbusters" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Myths</span>
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            <span className="hidden sm:inline">Mood</span>
          </TabsTrigger>
          <TabsTrigger value="avatar" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Avatar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <PersonalizedHealthFeed 
            userMood={userMood}
            onBookmark={handleBookmark}
            bookmarkedItems={bookmarkedItems}
          />
        </TabsContent>

        <TabsContent value="reels" className="space-y-6">
          <ScanRContentSync onBookmark={handleBookmark} />
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <WellnessCards 
            onBookmark={handleBookmark}
            bookmarkedItems={bookmarkedItems}
          />
        </TabsContent>

        <TabsContent value="mythbusters" className="space-y-6">
          <MedicalMythbusters 
            onBookmark={handleBookmark}
            bookmarkedItems={bookmarkedItems}
          />
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-6">
          <BookmarkLibrary bookmarkedItems={bookmarkedItems} />
        </TabsContent>

        <TabsContent value="mood" className="space-y-6">
          <MoodBasedFeed 
            userMood={userMood}
            onMoodChange={setUserMood}
            onBookmark={handleBookmark}
          />
        </TabsContent>

        <TabsContent value="avatar" className="space-y-6">
          <AvatarHealthReactions userMood={userMood} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
