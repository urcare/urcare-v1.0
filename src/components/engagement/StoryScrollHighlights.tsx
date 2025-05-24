
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, Clock, Bookmark } from 'lucide-react';

interface StoryHighlight {
  id: string;
  title: string;
  content: string;
  category: 'breakthrough' | 'reminder' | 'achievement' | 'alert' | 'tip';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  image?: string;
  actionText?: string;
  isBookmarked: boolean;
}

interface Props {
  onBookmark: (storyId: string) => void;
  onStoryAction: (storyId: string) => void;
}

const storyHighlights: StoryHighlight[] = [
  {
    id: 'story-1',
    title: 'New Diabetes Research',
    content: 'Recent studies show that a 10-minute walk after meals can reduce blood sugar spikes by up to 30%. This simple habit could significantly improve your glucose control.',
    category: 'breakthrough',
    timestamp: '2 hours ago',
    priority: 'high',
    actionText: 'Try Today',
    isBookmarked: false
  },
  {
    id: 'story-2',
    title: 'Medication Reminder',
    content: 'Don\'t forget to take your evening Metformin. Consistent timing helps maintain stable blood sugar levels throughout the day.',
    category: 'reminder',
    timestamp: '4 hours ago',
    priority: 'high',
    actionText: 'Mark Taken',
    isBookmarked: false
  },
  {
    id: 'story-3',
    title: 'Weekly Achievement',
    content: 'Congratulations! You\'ve completed 5 days of your walking routine this week. You\'re building a fantastic healthy habit!',
    category: 'achievement',
    timestamp: '1 day ago',
    priority: 'medium',
    actionText: 'View Progress',
    isBookmarked: true
  },
  {
    id: 'story-4',
    title: 'Heart Health Tip',
    content: 'Including omega-3 rich foods like salmon, walnuts, and flax seeds in your diet can support cardiovascular health and reduce inflammation.',
    category: 'tip',
    timestamp: '2 days ago',
    priority: 'medium',
    actionText: 'Save Recipe',
    isBookmarked: false
  },
  {
    id: 'story-5',
    title: 'Lab Results Available',
    content: 'Your recent blood work results are now available. Your HbA1c has improved from last quarter - great progress!',
    category: 'alert',
    timestamp: '3 days ago',
    priority: 'high',
    actionText: 'View Results',
    isBookmarked: false
  }
];

export const StoryScrollHighlights = ({ onBookmark, onStoryAction }: Props) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [stories, setStories] = useState(storyHighlights);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breakthrough': return 'bg-purple-100 text-purple-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'tip': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handlePrevious = () => {
    setCurrentStory(prev => prev > 0 ? prev - 1 : stories.length - 1);
  };

  const handleNext = () => {
    setCurrentStory(prev => prev < stories.length - 1 ? prev + 1 : 0);
  };

  const handleBookmark = (storyId: string) => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, isBookmarked: !story.isBookmarked }
          : story
      )
    );
    onBookmark(storyId);
  };

  const story = stories[currentStory];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Story Highlights</h3>
        <div className="flex items-center gap-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStory ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className={`relative overflow-hidden border-2 ${getPriorityColor(story.priority)}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(story.category)}>
                    {story.category}
                  </Badge>
                  {story.priority === 'high' && (
                    <Star className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <h4 className="text-lg font-semibold">{story.title}</h4>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBookmark(story.id)}
                  className={story.isBookmarked ? 'text-blue-600' : ''}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {story.timestamp}
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{story.content}</p>

            {story.actionText && (
              <Button 
                onClick={() => onStoryAction(story.id)}
                className="w-full sm:w-auto"
              >
                {story.actionText}
              </Button>
            )}
          </div>
        </CardContent>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevious}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNext}
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Story Counter */}
      <div className="text-center text-sm text-gray-500">
        {currentStory + 1} of {stories.length} highlights
      </div>
    </div>
  );
};
