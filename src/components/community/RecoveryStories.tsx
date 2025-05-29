
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heart, Share2, BookOpen, Plus, Eye, EyeOff, Users, ThumbsUp, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    condition: string;
  };
  publishedAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  tags: string[];
  privacyLevel: 'public' | 'community' | 'anonymous';
  readTime: number;
}

export const RecoveryStories = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    tags: '',
    isAnonymous: false,
    allowComments: true,
    privacyLevel: 'community' as const
  });

  const [stories] = useState<Story[]>([
    {
      id: '1',
      title: 'My Journey to Managing Diabetes',
      content: 'When I was first diagnosed with Type 2 diabetes, I felt overwhelmed and scared. The doctor handed me a glucose meter and a list of foods to avoid, but I felt lost. Three years later, I\'ve learned that managing diabetes isn\'t just about restrictions—it\'s about finding balance and community support...',
      author: {
        name: 'Sarah Chen',
        avatar: '/placeholder.svg',
        condition: 'Type 2 Diabetes'
      },
      publishedAt: '2024-01-15',
      likes: 127,
      comments: 23,
      isLiked: false,
      tags: ['diabetes', 'lifestyle-change', 'diet', 'hope'],
      privacyLevel: 'public',
      readTime: 4
    },
    {
      id: '2',
      title: 'Recovery After Heart Surgery',
      content: 'Six months ago, I underwent triple bypass surgery. The road to recovery has been challenging but incredibly rewarding. Here\'s what I wish I had known before my surgery and the support system that helped me through...',
      author: {
        name: 'Anonymous',
        avatar: '/placeholder.svg',
        condition: 'Heart Disease'
      },
      publishedAt: '2024-01-10',
      likes: 89,
      comments: 15,
      isLiked: true,
      tags: ['heart-surgery', 'recovery', 'support', 'gratitude'],
      privacyLevel: 'anonymous',
      readTime: 6
    }
  ]);

  const filters = ['all', 'diabetes', 'heart', 'cancer', 'mental-health', 'chronic-pain'];

  const handleCreateStory = () => {
    if (!newStory.title || !newStory.content) {
      toast.error('Please fill in both title and content');
      return;
    }
    
    toast.success('Your story has been shared successfully!');
    setShowCreateForm(false);
    setNewStory({
      title: '',
      content: '',
      tags: '',
      isAnonymous: false,
      allowComments: true,
      privacyLevel: 'community'
    });
  };

  const likeStory = (storyId: string) => {
    toast.success('Story liked!');
  };

  const shareStory = (storyId: string) => {
    toast.success('Story link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Recovery Stories
              </CardTitle>
              <CardDescription>
                Share your journey and inspire others in the community
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Share Your Story
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent className="border-t">
            <div className="space-y-4">
              <div>
                <Label htmlFor="story-title">Story Title</Label>
                <Input
                  id="story-title"
                  placeholder="Give your story a meaningful title..."
                  value={newStory.title}
                  onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="story-content">Your Story</Label>
                <Textarea
                  id="story-content"
                  placeholder="Share your journey, challenges, victories, and what you've learned..."
                  value={newStory.content}
                  onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                  className="min-h-32"
                />
              </div>
              
              <div>
                <Label htmlFor="story-tags">Tags (comma-separated)</Label>
                <Input
                  id="story-tags"
                  placeholder="diabetes, recovery, hope, lifestyle..."
                  value={newStory.tags}
                  onChange={(e) => setNewStory({...newStory, tags: e.target.value})}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="anonymous"
                    checked={newStory.isAnonymous}
                    onCheckedChange={(checked) => setNewStory({...newStory, isAnonymous: checked})}
                  />
                  <Label htmlFor="anonymous">Share anonymously</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="comments"
                    checked={newStory.allowComments}
                    onCheckedChange={(checked) => setNewStory({...newStory, allowComments: checked})}
                  />
                  <Label htmlFor="comments">Allow comments</Label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreateStory}>
                  Share Story
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Button>
        ))}
      </div>

      {/* Stories Feed */}
      <div className="space-y-6">
        {stories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={story.author.avatar} />
                    <AvatarFallback>
                      {story.privacyLevel === 'anonymous' ? '?' : story.author.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {story.privacyLevel === 'anonymous' ? 'Anonymous' : story.author.name}
                    </p>
                    <p className="text-sm text-gray-600">{story.author.condition}</p>
                    <p className="text-xs text-gray-500">{story.publishedAt} • {story.readTime} min read</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {story.privacyLevel === 'public' && <Eye className="h-3 w-3 mr-1" />}
                    {story.privacyLevel === 'anonymous' && <EyeOff className="h-3 w-3 mr-1" />}
                    {story.privacyLevel === 'community' && <Users className="h-3 w-3 mr-1" />}
                    {story.privacyLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {story.content}
                  {story.content.length > 200 && (
                    <Button variant="link" className="p-0 h-auto text-blue-600">
                      Read more
                    </Button>
                  )}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {story.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeStory(story.id)}
                    className={story.isLiked ? 'text-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${story.isLiked ? 'fill-current' : ''}`} />
                    {story.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {story.comments}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareStory(story.id)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
