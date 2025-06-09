
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Bot,
  User,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Heart
} from 'lucide-react';

export const PatientQueryInterface = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'patient',
      message: 'I have been experiencing chest pain for the past few hours. Should I be concerned?',
      timestamp: '10:30 AM',
      sentiment: 'concerned'
    },
    {
      id: 2,
      type: 'ai',
      message: 'I understand your concern about chest pain. This can be serious and I recommend seeking immediate medical attention. Would you like me to help you find the nearest emergency room or connect you with a healthcare provider?',
      timestamp: '10:31 AM',
      confidence: 94.5,
      escalated: true
    }
  ]);

  const activeChats = [
    {
      id: 1,
      patient: 'Patient #1247',
      lastMessage: 'Thank you for the help with my medication questions',
      timestamp: '2 min ago',
      status: 'resolved',
      sentiment: 'positive',
      urgency: 'low'
    },
    {
      id: 2,
      patient: 'Patient #1248',
      lastMessage: 'I have been experiencing chest pain...',
      timestamp: '5 min ago',
      status: 'escalated',
      sentiment: 'concerned',
      urgency: 'high'
    },
    {
      id: 3,
      patient: 'Patient #1249',
      lastMessage: 'When is my next appointment?',
      timestamp: '12 min ago',
      status: 'active',
      sentiment: 'neutral',
      urgency: 'low'
    }
  ];

  const quickResponses = [
    'I can help you with that. Let me get more information.',
    'For urgent medical concerns, please contact your healthcare provider immediately.',
    'I\'ll connect you with a human representative for personalized assistance.',
    'Let me look up your appointment information for you.'
  ];

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = {
      id: chatHistory.length + 1,
      type: 'patient',
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: 'neutral'
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        message: 'Thank you for your message. I\'m analyzing your query and will provide assistance shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 92.3
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'concerned': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Chat */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Patient Communication Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chat Messages */}
            <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
              <div className="space-y-3">
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'ai'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'ai' ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs font-medium">
                          {message.type === 'ai' ? 'AI Assistant' : 'Patient'}
                        </span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mt-2">
                          {message.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {message.confidence}% confidence
                            </Badge>
                          )}
                          {message.escalated && (
                            <Badge variant="destructive" className="text-xs">
                              Escalated
                            </Badge>
                          )}
                        </div>
                      )}
                      {message.type === 'patient' && message.sentiment && (
                        <div className="mt-1">
                          <Badge variant="outline" className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                            {message.sentiment}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Responses */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Responses</h4>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 p-2 text-xs"
                    onClick={() => setCurrentMessage(response)}
                  >
                    {response.substring(0, 30)}...
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Patient Chats */}
      <Card>
        <CardHeader>
          <CardTitle>Active Patient Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeChats.map((chat) => (
              <div key={chat.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{chat.patient}</span>
                  </div>
                  <Badge className={getUrgencyColor(chat.urgency)}>
                    {chat.urgency} priority
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-700 max-w-xs truncate">{chat.lastMessage}</div>
                    <div className="text-xs text-gray-500">{chat.timestamp}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={chat.status === 'escalated' ? 'destructive' : 'default'}>
                      {chat.status}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${getSentimentColor(chat.sentiment).replace('text-', 'bg-')}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Active Conversations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">1.8min</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">8.7/10</div>
            <div className="text-sm text-gray-600">Satisfaction Score</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
