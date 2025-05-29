
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Heart, Flag, MoreHorizontal, Pin, Users, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'member' | 'moderator' | 'admin';
    isVerified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isReported: boolean;
  replies: ChatReply[];
  communityId: string;
  communityName: string;
}

interface ChatReply {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: 'member' | 'moderator' | 'admin';
  };
  content: string;
  timestamp: string;
}

export const CommunityChatWall = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [showModerationPanel, setShowModerationPanel] = useState(false);

  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        avatar: '/placeholder.svg',
        role: 'member',
        isVerified: true
      },
      content: 'Just wanted to share that I hit my 6-month milestone managing my diabetes! The support from this community has been incredible. Thank you all! 💪',
      timestamp: '2 hours ago',
      likes: 24,
      isLiked: false,
      isPinned: true,
      isReported: false,
      replies: [
        {
          id: 'r1',
          author: {
            name: 'Dr. Emily Rodriguez',
            avatar: '/placeholder.svg',
            role: 'moderator'
          },
          content: 'Congratulations Sarah! That\'s a huge achievement!',
          timestamp: '1 hour ago'
        }
      ],
      communityId: 'diabetes',
      communityName: 'Diabetes Support'
    },
    {
      id: '2',
      author: {
        name: 'Mike Johnson',
        avatar: '/placeholder.svg',
        role: 'member',
        isVerified: false
      },
      content: 'Has anyone tried the new continuous glucose monitor? Looking for recommendations before my next doctor visit.',
      timestamp: '4 hours ago',
      likes: 8,
      isLiked: true,
      isPinned: false,
      isReported: false,
      replies: [],
      communityId: 'diabetes',
      communityName: 'Diabetes Support'
    },
    {
      id: '3',
      author: {
        name: 'Lisa Park',
        avatar: '/placeholder.svg',
        role: 'member',
        isVerified: true
      },
      content: 'Sharing my weekly meal prep for heart-healthy eating. Link in my profile for the full recipe guide!',
      timestamp: '6 hours ago',
      likes: 15,
      isLiked: false,
      isPinned: false,
      isReported: false,
      replies: [],
      communityId: 'heart',
      communityName: 'Heart Health'
    }
  ]);

  const communities = [
    { id: 'all', name: 'All Communities', count: 0 },
    { id: 'diabetes', name: 'Diabetes Support', count: 142 },
    { id: 'heart', name: 'Heart Health', count: 89 },
    { id: 'cancer', name: 'Cancer Warriors', count: 67 },
    { id: 'mental', name: 'Mental Wellness', count: 234 }
  ];

  const postMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    toast.success('Message posted to community wall!');
    setNewMessage('');
  };

  const likeMessage = (messageId: string) => {
    toast.success('Message liked!');
  };

  const reportMessage = (messageId: string) => {
    toast.success('Message reported to moderators');
  };

  const pinMessage = (messageId: string) => {
    toast.success('Message pinned to top of wall');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'moderator': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredMessages = selectedCommunity === 'all' 
    ? messages 
    : messages.filter(msg => msg.communityId === selectedCommunity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Community Chat Wall
              </CardTitle>
              <CardDescription>
                Connect with community members in real-time discussions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowModerationPanel(!showModerationPanel)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Moderation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Community Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {communities.map((community) => (
              <Button
                key={community.id}
                variant={selectedCommunity === community.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCommunity(community.id)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {community.name}
                {community.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {community.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Post New Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share with the Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's on your mind? Share an update, ask a question, or offer support..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-20"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Be kind, supportive, and follow community guidelines
            </p>
            <Button onClick={postMessage}>
              <Send className="h-4 w-4 mr-2" />
              Post Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Panel */}
      {showModerationPanel && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Moderation Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-sm text-gray-600">Reported Messages</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl font-bold text-yellow-600">7</div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <div className="text-2xl font-bold text-green-600">156</div>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={message.isPinned ? 'border-blue-200 bg-blue-50' : ''}>
            <CardContent className="p-4">
              {message.isPinned && (
                <div className="flex items-center gap-2 mb-3 text-blue-600">
                  <Pin className="h-4 w-4" />
                  <span className="text-sm font-medium">Pinned Message</span>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Message Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={message.author.avatar} />
                      <AvatarFallback>{message.author.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{message.author.name}</p>
                        {message.author.role !== 'member' && (
                          <Badge className={getRoleColor(message.author.role)}>
                            {message.author.role}
                          </Badge>
                        )}
                        {message.author.isVerified && (
                          <div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{message.timestamp}</span>
                        <span>•</span>
                        <span>{message.communityName}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Message Content */}
                <p className="text-gray-700 leading-relaxed">{message.content}</p>

                {/* Message Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeMessage(message.id)}
                      className={message.isLiked ? 'text-red-600' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${message.isLiked ? 'fill-current' : ''}`} />
                      {message.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply ({message.replies.length})
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => pinMessage(message.id)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => reportMessage(message.id)}
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Replies */}
                {message.replies.length > 0 && (
                  <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.author.avatar} />
                          <AvatarFallback>{reply.author.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{reply.author.name}</p>
                            {reply.author.role !== 'member' && (
                              <Badge className={`${getRoleColor(reply.author.role)} text-xs`}>
                                {reply.author.role}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to start a conversation in this community!
            </p>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Start the Conversation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
