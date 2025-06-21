
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Bookmark, Share2, MessageCircle, Eye, Star, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  readTime: number;
  likes: number;
  comments: number;
  bookmarks: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  image?: string;
  type: 'text' | 'video' | 'audio';
  publishedAt: string;
}

interface StoryScrollHighlightsProps {
  onBookmark: (storyId: string) => void;
  onStoryAction: (storyId: string) => void;
}

export const StoryScrollHighlights = ({ onBookmark, onStoryAction }: StoryScrollHighlightsProps) => {
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'My 30-Day Meditation Journey',
      content: 'Starting meditation seemed impossible, but here\'s how I built a consistent practice that changed my life. The first week was the hardest...',
      author: {
        name: 'Sarah Chen',
        avatar: '/placeholder.svg',
        verified: true
      },
      category: 'Mental Health',
      readTime: 3,
      likes: 127,
      comments: 23,
      bookmarks: 45,
      isLiked: false,
      isBookmarked: false,
      tags: ['meditation', 'mindfulness', 'mental-health'],
      publishedAt: '2 days ago',
      type: 'text'
    },
    {
      id: '2',
      title: 'Quick 5-Minute Morning Stretch',
      content: 'Start your day right with this energizing stretch routine. Perfect for beginners and can be done anywhere!',
      author: {
        name: 'Fitness Mike',
        avatar: '/placeholder.svg',
        verified: true
      },
      category: 'Fitness',
      readTime: 5,
      likes: 89,
      comments: 15,
      bookmarks: 67,
      isLiked: true,
      isBookmarked: false,
      tags: ['fitness', 'morning-routine', 'stretching'],
      publishedAt: '1 day ago',
      type: 'video'
    },
    {
      id: '3',
      title: 'Healthy Meal Prep in 30 Minutes',
      content: 'Discover how to prepare a week\'s worth of nutritious meals in just 30 minutes. Includes shopping list and step-by-step guide.',
      author: {
        name: 'Chef Emma',
        avatar: '/placeholder.svg',
        verified: false
      },
      category: 'Nutrition',
      readTime: 7,
      likes: 203,
      comments: 41,
      bookmarks: 156,
      isLiked: false,
      isBookmarked: true,
      tags: ['nutrition', 'meal-prep', 'healthy-eating'],
      publishedAt: '3 days ago',
      type: 'text'
    },
    {
      id: '4',
      title: 'Sleep Better Tonight: Expert Tips',
      content: 'A sleep specialist shares the top 7 strategies for improving sleep quality naturally. No supplements needed!',
      author: {
        name: 'Dr. Sleep',
        avatar: '/placeholder.svg',
        verified: true
      },
      category: 'Sleep Health',
      readTime: 4,
      likes: 156,
      comments: 28,
      bookmarks: 89,
      isLiked: false,
      isBookmarked: false,
      tags: ['sleep', 'wellness', 'health-tips'],
      publishedAt: '5 days ago',
      type: 'audio'
    }
  ]);

  const handleLike = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isLiked: !story.isLiked,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1
          }
        : story
    ));
    toast.success('Story liked!');
  };

  const handleBookmark = (storyId: string) => {
    setStories(prev => prev.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            isBookmarked: !story.isBookmarked,
            bookmarks: story.isBookmarked ? story.bookmarks - 1 : story.bookmarks + 1
          }
        : story
    ));
    onBookmark(storyId);
    toast.success('Story bookmarked!');
  };

  const handleShare = (storyId: string) => {
    toast.success('Story link copied to clipboard!');
    onStoryAction(storyId);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <div className="w-4 h-4 rounded-full bg-red-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mental Health': return 'bg-purple-100 text-purple-800';
      case 'Fitness': return 'bg-green-100 text-green-800';
      case 'Nutrition': return 'bg-orange-100 text-orange-800';
      case 'Sleep Health': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Story Highlights</h2>
        <p className="text-gray-600">Discover inspiring health stories and expert tips</p>
      </div>

      <div className="space-y-6">
        {stories.map((story, index) => (
          <Card key={story.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={story.author.avatar} />
                      <AvatarFallback>{story.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{story.author.name}</span>
                        {story.author.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{story.publishedAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(story.category)}>
                      {story.category}
                    </Badge>
                    {getTypeIcon(story.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{story.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{story.content}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{story.readTime} min read</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(story.id)}
                      className={story.isLiked ? 'text-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${story.isLiked ? 'fill-current' : ''}`} />
                      {story.likes}
                    </Button>

                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {story.comments}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmark(story.id)}
                      className={story.isBookmarked ? 'text-blue-600' : ''}
                    >
                      <Bookmark className={`h-4 w-4 mr-1 ${story.isBookmarked ? 'fill-current' : ''}`} />
                      {story.bookmarks}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(story.id)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Featured highlight for first story */}
              {index === 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-blue-800">Featured Story</span>
                    <span className="text-gray-600">• Trending in Mental Health</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">
          Load More Stories
        </Button>
      </div>
    </div>
  );
};
