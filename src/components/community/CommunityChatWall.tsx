
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Heart, Reply, Share2, MoreHorizontal, Pin, Flag, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    isVerified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
  community: string;
}

export const CommunityChatWall = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: '/placeholder.svg',
        role: 'Community Leader',
        isVerified: true
      },
      content: 'Just wanted to share that I\'ve been diabetes-free for 6 months now! The support from this community has been incredible. Special thanks to everyone who shared meal prep tips and exercise routines. We\'re all in this together! 💪',
      timestamp: '2 hours ago',
      likes: 47,
      replies: 12,
      isLiked: false,
      isPinned: true,
      tags: ['success-story', 'diabetes', 'community-support'],
      community: 'Diabetes Support'
    },
    {
      id: '2',
      author: {
        name: 'Mike Johnson',
        avatar: '/placeholder.svg',
        role: 'Member',
        isVerified: false
      },
      content: 'Has anyone tried the new meditation app integration? I\'m curious about the guided sessions for anxiety management.',
      timestamp: '4 hours ago',
      likes: 23,
      replies: 8,
      isLiked: true,
      isPinned: false,
      tags: ['meditation', 'anxiety', 'apps'],
      community: 'Mental Health'
    },
    {
      id: '3',
      author: {
        name: 'Dr. Emily Rodriguez',
        avatar: '/placeholder.svg',
        role: 'Healthcare Professional',
        isVerified: true
      },
      content: 'Quick reminder: Regular blood pressure monitoring is crucial for heart health. Even if you feel fine, silent hypertension is real. Consider getting a home monitor if you haven\'t already. Stay healthy, everyone! ❤️',
      timestamp: '6 hours ago',
      likes: 89,
      replies: 24,
      isLiked: false,
      isPinned: false,
      tags: ['heart-health', 'blood-pressure', 'prevention'],
      community: 'Heart Health Heroes'
    },
    {
      id: '4',
      author: {
        name: 'Lisa Park',
        avatar: '/placeholder.svg',
        role: 'Moderator',
        isVerified: true
      },
      content: 'Weekly check-in: How is everyone doing with their wellness goals this week? Share your wins, no matter how small! Every step counts. 🌟',
      timestamp: '1 day ago',
      likes: 34,
      replies: 18,
      isLiked: false,
      isPinned: false,
      tags: ['weekly-checkin', 'goals', 'motivation'],
      community: 'General Wellness'
    }
  ]);

  const communities = ['all', 'diabetes-support', 'mental-health', 'heart-health-heroes', 'general-wellness'];

  const handlePostMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const newPost: Message = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        avatar: '/placeholder.svg',
        role: 'Member',
        isVerified: false
      },
      content: newMessage,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      isLiked: false,
      isPinned: false,
      tags: [],
      community: selectedCommunity === 'all' ? 'General Wellness' : selectedCommunity
    };

    setMessages(prev => [newPost, ...prev]);
    setNewMessage('');
    toast.success('Message posted successfully!');
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            isLiked: !msg.isLiked, 
            likes: msg.isLiked ? msg.likes - 1 : msg.likes + 1 
          }
        : msg
    ));
  };

  const handleShare = (messageId: string) => {
    toast.success('Message link copied to clipboard!');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Healthcare Professional': return 'bg-green-100 text-green-800';
      case 'Community Leader': return 'bg-purple-100 text-purple-800';
      case 'Moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(msg => 
    selectedCommunity === 'all' || 
    msg.community.toLowerCase().replace(/\s+/g, '-') === selectedCommunity
  ).sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return 0; // recent is default order
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Community Chat Wall
          </CardTitle>
          <CardDescription>
            Connect with the community, share experiences, and support each other
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.4k</div>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-gray-600">Posts Today</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <p className="text-sm text-gray-600">Positive Sentiment</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.8★</div>
              <p className="text-sm text-gray-600">Community Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share with the Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share your health journey, ask questions, or offer support..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                <SelectItem value="diabetes-support">Diabetes Support</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="heart-health-heroes">Heart Health Heroes</SelectItem>
                <SelectItem value="general-wellness">General Wellness</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePostMessage}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Post Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Communities</SelectItem>
            {communities.slice(1).map(community => (
              <SelectItem key={community} value={community}>
                {community.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`hover:shadow-md transition-shadow ${
            message.isPinned ? 'border-blue-200 bg-blue-50' : ''
          }`}>
            <CardContent className="p-6">
              {message.isPinned && (
                <div className="flex items-center gap-2 mb-3 text-blue-600">
                  <Pin className="h-4 w-4" />
                  <span className="text-sm font-medium">Pinned Message</span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={message.author.avatar} />
                  <AvatarFallback>{message.author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{message.author.name}</span>
                    {message.author.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <Badge className={`${getRoleColor(message.author.role)} text-xs`}>
                      {message.author.role}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{message.timestamp}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.community}
                    </Badge>
                  </div>

                  <p className="text-gray-800 mb-3 leading-relaxed">{message.content}</p>

                  {message.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {message.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(message.id)}
                        className={message.isLiked ? 'text-red-600' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${message.isLiked ? 'fill-current' : ''}`} />
                        {message.likes}
                      </Button>

                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4 mr-1" />
                        {message.replies}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(message.id)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Load More Messages
        </Button>
      </div>
    </div>
  );
};
