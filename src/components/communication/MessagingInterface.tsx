
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Pin, 
  Star, 
  AlertTriangle,
  Send,
  Paperclip,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  thread?: string;
}

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  pinned: boolean;
  tags: string[];
}

export const MessagingInterface = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv-1');
  const [messageInput, setMessageInput] = useState('');

  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      title: 'ICU Patient Care Team',
      participants: ['Dr. Smith', 'Nurse Johnson', 'Dr. Williams'],
      lastMessage: 'Patient vitals showing improvement...',
      timestamp: '2 minutes ago',
      unreadCount: 3,
      priority: 'urgent',
      pinned: true,
      tags: ['ICU', 'Critical']
    },
    {
      id: 'conv-2',
      title: 'Surgery Schedule Coordination',
      participants: ['Dr. Brown', 'OR Coordinator', 'Anesthesiologist'],
      lastMessage: 'Tomorrow\'s schedule confirmed',
      timestamp: '15 minutes ago',
      unreadCount: 1,
      priority: 'high',
      pinned: false,
      tags: ['Surgery', 'Scheduling']
    },
    {
      id: 'conv-3',
      title: 'Lab Results Discussion',
      participants: ['Dr. Davis', 'Lab Technician'],
      lastMessage: 'Blood work results are ready',
      timestamp: '1 hour ago',
      unreadCount: 0,
      priority: 'normal',
      pinned: false,
      tags: ['Lab', 'Results']
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg-1',
      sender: 'Dr. Smith',
      role: 'Doctor',
      content: 'Patient in bed 12 showing signs of improvement. Vitals are stabilizing.',
      timestamp: '10:30 AM',
      priority: 'high',
      read: true
    },
    {
      id: 'msg-2',
      sender: 'Nurse Johnson',
      role: 'Nurse',
      content: 'Confirmed. Pain levels reduced to 4/10. Patient is more responsive.',
      timestamp: '10:32 AM',
      priority: 'normal',
      read: true
    },
    {
      id: 'msg-3',
      sender: 'Dr. Williams',
      role: 'Specialist',
      content: 'Great news! Let\'s continue current treatment plan. I\'ll check in this afternoon.',
      timestamp: '10:35 AM',
      priority: 'normal',
      read: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversations
            </CardTitle>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  getPriorityColor(conversation.priority)
                } ${selectedConversation === conversation.id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{conversation.title}</h4>
                      {conversation.pinned && <Pin className="h-3 w-3 text-gray-500" />}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {conversation.participants.join(', ')}
                    </p>
                    <p className="text-sm text-gray-700 truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      <div className="flex items-center gap-1">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getPriorityBadgeColor(conversation.priority)}`}>
                          {conversation.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Thread */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ICU Patient Care Team</CardTitle>
              <CardDescription>3 participants • Last active 2 minutes ago</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender}</span>
                    <Badge variant="outline" className="text-xs">{message.role}</Badge>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    {message.priority === 'urgent' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Mark as urgent
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Request read receipt
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
