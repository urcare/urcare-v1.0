
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookMarked, Heart, Share2, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface HealthContent {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  relevanceScore: number;
  readTime: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  contentType: 'article' | 'tip' | 'alert' | 'insight';
  priority: 'high' | 'medium' | 'low';
}

interface Props {
  userMood: 'positive' | 'neutral' | 'concerned' | 'motivated';
  onBookmark: (contentId: string) => void;
  bookmarkedItems: string[];
}

const sampleContent: HealthContent[] = [
  {
    id: '1',
    title: 'Managing Diabetes: Latest Research on Continuous Glucose Monitoring',
    excerpt: 'New studies show CGM devices can improve HbA1c levels by up to 0.8% when used consistently.',
    category: 'Diabetes Management',
    relevanceScore: 95,
    readTime: '4 min read',
    author: 'Dr. Sarah Johnson',
    publishedAt: new Date('2024-01-20'),
    tags: ['diabetes', 'technology', 'monitoring'],
    contentType: 'insight',
    priority: 'high'
  },
  {
    id: '2',
    title: '5 Heart-Healthy Foods to Add to Your Diet Today',
    excerpt: 'Simple dietary changes that can significantly impact your cardiovascular health.',
    category: 'Heart Health',
    relevanceScore: 88,
    readTime: '3 min read',
    author: 'Nutritionist Lisa Chen',
    publishedAt: new Date('2024-01-18'),
    tags: ['nutrition', 'heart-health', 'prevention'],
    contentType: 'tip',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Medication Reminder: Check Your Blood Pressure Medicine Expiry',
    excerpt: 'Your Lisinopril prescription may need renewal soon. Schedule a check-up.',
    category: 'Medication Alert',
    relevanceScore: 92,
    readTime: '1 min read',
    author: 'Your Health Assistant',
    publishedAt: new Date('2024-01-19'),
    tags: ['medication', 'reminder', 'hypertension'],
    contentType: 'alert',
    priority: 'high'
  }
];

export const PersonalizedHealthFeed = ({ userMood, onBookmark, bookmarkedItems }: Props) => {
  const [likedItems, setLikedItems] = useState<string[]>([]);

  const handleLike = (contentId: string) => {
    setLikedItems(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleShare = (content: HealthContent) => {
    navigator.clipboard.writeText(`Check out: ${content.title}`);
    toast.success('Content copied to clipboard');
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'insight': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'tip': return <Heart className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // Filter content based on mood
  const filteredContent = sampleContent.filter(content => {
    if (userMood === 'concerned') return content.priority === 'high';
    if (userMood === 'motivated') return content.contentType === 'tip' || content.contentType === 'insight';
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Personalized Health Feed</CardTitle>
          <CardDescription>
            Content tailored to your conditions: Diabetes, Heart Health, Hypertension
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {filteredContent.map((content) => (
          <Card key={content.id} className={`border-l-4 ${getPriorityColor(content.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getContentIcon(content.contentType)}
                    <Badge variant="secondary">{content.category}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.relevanceScore}% match
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBookmark(content.id)}
                  className={bookmarkedItems.includes(content.id) ? 'text-blue-600' : ''}
                >
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{content.excerpt}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {content.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{content.author}</span>
                </div>
                <span>•</span>
                <span>{content.readTime}</span>
                <span>•</span>
                <span>{content.publishedAt.toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                {content.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(content.id)}
                    className={likedItems.includes(content.id) ? 'text-red-500' : ''}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {likedItems.includes(content.id) ? 'Liked' : 'Like'}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShare(content)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
                <Button size="sm">Read More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
