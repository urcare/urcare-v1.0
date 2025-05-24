
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Meh, Frown, Target, BookMarked } from 'lucide-react';

interface MoodContent {
  id: string;
  title: string;
  description: string;
  mood: 'positive' | 'neutral' | 'concerned' | 'motivated';
  contentType: 'motivation' | 'education' | 'support' | 'action';
  timeToRead: string;
}

interface Props {
  userMood: 'positive' | 'neutral' | 'concerned' | 'motivated';
  onMoodChange: (mood: 'positive' | 'neutral' | 'concerned' | 'motivated') => void;
  onBookmark: (contentId: string) => void;
}

const moodContent: Record<string, MoodContent[]> = {
  positive: [
    {
      id: 'pos-1',
      title: 'Celebrate Your Health Wins!',
      description: 'Track your recent achievements and keep the momentum going.',
      mood: 'positive',
      contentType: 'motivation',
      timeToRead: '2 min'
    },
    {
      id: 'pos-2',
      title: 'Advanced Wellness Challenges',
      description: 'Ready for the next level? Try these evidence-based health optimizations.',
      mood: 'positive',
      contentType: 'action',
      timeToRead: '5 min'
    }
  ],
  neutral: [
    {
      id: 'neu-1',
      title: 'Daily Health Routine Check',
      description: 'Simple ways to maintain your current health status.',
      mood: 'neutral',
      contentType: 'education',
      timeToRead: '3 min'
    },
    {
      id: 'neu-2',
      title: 'Understanding Your Medications',
      description: 'Learn how your current prescriptions work and why they matter.',
      mood: 'neutral',
      contentType: 'education',
      timeToRead: '4 min'
    }
  ],
  concerned: [
    {
      id: 'con-1',
      title: 'You\'re Not Alone',
      description: 'Connect with support resources and remember that help is available.',
      mood: 'concerned',
      contentType: 'support',
      timeToRead: '3 min'
    },
    {
      id: 'con-2',
      title: 'Small Steps, Big Impact',
      description: 'Gentle, manageable actions you can take today to feel better.',
      mood: 'concerned',
      contentType: 'action',
      timeToRead: '5 min'
    }
  ],
  motivated: [
    {
      id: 'mot-1',
      title: 'Transform Your Health Journey',
      description: 'Comprehensive strategies for achieving your health goals.',
      mood: 'motivated',
      contentType: 'action',
      timeToRead: '7 min'
    },
    {
      id: 'mot-2',
      title: 'Latest Health Research You Can Use',
      description: 'Cutting-edge findings that can enhance your wellness routine.',
      mood: 'motivated',
      contentType: 'education',
      timeToRead: '6 min'
    }
  ]
};

export const MoodBasedFeed = ({ userMood, onMoodChange, onBookmark }: Props) => {
  const moodOptions = [
    { value: 'positive', label: 'Positive', icon: <Smile className="h-4 w-4" />, color: 'bg-green-500' },
    { value: 'neutral', label: 'Neutral', icon: <Meh className="h-4 w-4" />, color: 'bg-gray-500' },
    { value: 'concerned', label: 'Concerned', icon: <Frown className="h-4 w-4" />, color: 'bg-orange-500' },
    { value: 'motivated', label: 'Motivated', icon: <Target className="h-4 w-4" />, color: 'bg-blue-500' }
  ];

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'motivation': return 'bg-yellow-100 text-yellow-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-pink-100 text-pink-800';
      case 'action': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentContent = moodContent[userMood] || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mood-Based Content Feed</CardTitle>
          <CardDescription>
            Content personalized based on how you're feeling today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-3">How are you feeling today?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={userMood === mood.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onMoodChange(mood.value as any)}
                    className="flex items-center gap-2"
                  >
                    <div className={`w-3 h-3 rounded-full ${mood.color}`} />
                    {mood.icon}
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Current mood:</strong> {moodOptions.find(m => m.value === userMood)?.label}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Content below is tailored to support you in this emotional state
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {currentContent.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getContentTypeColor(content.contentType)}>
                      {content.contentType}
                    </Badge>
                    <span className="text-sm text-gray-500">{content.timeToRead}</span>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBookmark(content.id)}
                >
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{content.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {moodOptions.find(m => m.value === content.mood)?.icon}
                  <span className="text-sm text-gray-600">
                    Tailored for {content.mood} mood
                  </span>
                </div>
                <Button size="sm">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentContent.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No content available for this mood</p>
            <p className="text-sm text-gray-400">Try selecting a different mood above</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
