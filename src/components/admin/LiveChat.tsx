import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  Phone,
  Video,
  MoreVertical,
  Search,
  RefreshCw,
  Users,
  Circle,
  CheckCircle,
  Clock,
  Image,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  lastSeen: string;
  avatar?: string;
  hasUnreadMessages?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'voice';
  isAdmin: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface LiveChatProps {
  onRefresh?: () => void;
  onMessageRead?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onRefresh, onMessageRead }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - replace with actual API calls
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isOnline: true,
      lastSeen: 'now',
      hasUnreadMessages: true,
      lastMessage: 'I need help with my health plan',
      lastMessageTime: '2:17 PM'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      isOnline: true,
      lastSeen: '2 min ago',
      hasUnreadMessages: false,
      lastMessage: 'Thank you for your help!',
      lastMessageTime: '1:45 PM'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      isOnline: false,
      lastSeen: '1 hour ago',
      hasUnreadMessages: true,
      lastMessage: 'Can you help me with payment issues?',
      lastMessageTime: '12:30 PM'
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      isOnline: true,
      lastSeen: '5 min ago',
      hasUnreadMessages: false,
      lastMessage: 'Great, thanks!',
      lastMessageTime: '2:10 PM'
    },
    {
      id: '5',
      name: 'Mike Wilson',
      email: 'mike@example.com',
      isOnline: true,
      lastSeen: 'now',
      hasUnreadMessages: true,
      lastMessage: 'I want to change my workout schedule',
      lastMessageTime: '2:20 PM'
    }
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      content: 'I need help with my health plan',
      timestamp: '2:17:05 PM',
      type: 'text',
      isAdmin: false
    },
    {
      id: '2',
      userId: 'admin',
      userName: 'Admin',
      content: 'I can help you with that. What specific issues are you facing?',
      timestamp: '2:17:05 PM',
      type: 'text',
      isAdmin: true
    },
    {
      id: '3',
      userId: '1',
      userName: 'John Doe',
      content: 'I want to change my workout schedule',
      timestamp: '2:18:30 PM',
      type: 'text',
      isAdmin: false
    },
    {
      id: '4',
      userId: '3',
      userName: 'Bob Johnson',
      content: 'Can you help me with payment issues?',
      timestamp: '12:30:00 PM',
      type: 'text',
      isAdmin: false
    },
    {
      id: '5',
      userId: '5',
      userName: 'Mike Wilson',
      content: 'I want to change my workout schedule',
      timestamp: '2:20:00 PM',
      type: 'text',
      isAdmin: false
    }
  ];

  // Load users and messages
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading chat data:', error);
      toast.error('Failed to load chat data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: 'admin',
      userName: 'Admin',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }),
      type: 'text',
      isAdmin: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate user response after 2 seconds
    setTimeout(() => {
      const userResponse: Message = {
        id: (Date.now() + 1).toString(),
        userId: selectedUser.id,
        userName: selectedUser.name,
        content: 'Thank you for your help!',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        }),
        type: 'text',
        isAdmin: false
      };
      setMessages(prev => [...prev, userResponse]);
    }, 2000);

    toast.success('Message sent');
  };

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.success('Voice message recorded and sent');
      
      // Add voice message to chat
      const voiceMessage: Message = {
        id: Date.now().toString(),
        userId: 'admin',
        userName: 'Admin',
        content: '[Voice Message]',
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        }),
        type: 'voice',
        isAdmin: true
      };
      setMessages(prev => [...prev, voiceMessage]);
    } else {
      // Start recording
      setIsRecording(true);
      toast.info('Recording... Click again to stop');
    }
  };

  // Handle file attachment
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      userId: 'admin',
      userName: 'Admin',
      content: `[File: ${file.name}]`,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      }),
      type: 'file',
      isAdmin: true,
      attachments: [{
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }]
    };

    setMessages(prev => [...prev, fileMessage]);
    setShowAttachmentMenu(false);
    toast.success('File attached');
  };

  // Refresh handler
  const handleRefresh = () => {
    loadData();
    if (onRefresh) onRefresh();
  };

  return (
    <div className="h-[600px] flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Users Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Live Chat
            </h2>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Users className="w-4 h-4" />
                Chat Requests ({users.filter(u => u.hasUnreadMessages).length})
              </div>
              {users.filter(u => u.hasUnreadMessages).length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    New Messages
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Auto-select first user with unread messages
                        const firstUnreadUser = users.find(u => u.hasUnreadMessages);
                        if (firstUnreadUser) {
                          setSelectedUser(firstUnreadUser);
                          setUsers(prev => prev.map(u => 
                            u.id === firstUnreadUser.id ? { ...u, hasUnreadMessages: false } : u
                          ));
                          onMessageRead?.();
                        }
                      }}
                      className="text-xs h-6 px-2"
                    >
                      Respond
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // Mark all as read
                        setUsers(prev => prev.map(u => ({ ...u, hasUnreadMessages: false })));
                        onMessageRead?.();
                      }}
                      className="text-xs h-6 px-2 text-gray-500"
                    >
                      Mark All Read
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  // Mark messages as read when user is selected
                  if (user.hasUnreadMessages) {
                    setUsers(prev => prev.map(u => 
                      u.id === user.id ? { ...u, hasUnreadMessages: false } : u
                    ));
                    onMessageRead?.(); // Notify parent component
                  }
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === user.id
                    ? 'bg-blue-50 border border-blue-200'
                    : user.hasUnreadMessages
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {user.hasUnreadMessages && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                      {user.hasUnreadMessages && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    {user.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user.lastMessage}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <Circle className={`w-2 h-2 ${user.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-xs text-gray-500">
                          {user.isOnline ? 'Online' : user.lastSeen}
                        </span>
                      </div>
                      {user.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {user.lastMessageTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    {selectedUser.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(msg => msg.userId === selectedUser.id || msg.isAdmin)
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isAdmin
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isAdmin ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                      {message.attachments && (
                        <div className="mt-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded">
                              {attachment.type.startsWith('image/') ? (
                                <Image className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                              <span className="text-xs">{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1 h-8 w-8"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleRecording}
                      className={`p-1 h-8 w-8 ${
                        isRecording ? 'text-red-600 bg-red-50' : ''
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.txt"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a user to start chatting</p>
              <p className="text-sm">Choose from the list on the left to begin a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
