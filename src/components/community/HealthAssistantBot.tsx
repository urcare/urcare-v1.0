
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, MessageSquare, Heart, Brain, Calendar, Clock, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  type?: 'text' | 'suggestion' | 'reminder' | 'insight';
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export const HealthAssistantBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your personal health assistant. I'm here to help you track your wellness, provide health insights, and support your community journey. How can I assist you today?",
      isBot: true,
      timestamp: '10:00 AM',
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const healthInsights: HealthInsight[] = [
    {
      id: '1',
      title: 'Mood Pattern Analysis',
      description: 'Your mood has been consistently improving over the past week. Great progress!',
      category: 'Mental Health',
      priority: 'medium',
      actionable: false
    },
    {
      id: '2',
      title: 'Activity Reminder',
      description: 'You haven\'t logged your medication today. Would you like me to set a reminder?',
      category: 'Medication',
      priority: 'high',
      actionable: true
    },
    {
      id: '3',
      title: 'Community Engagement',
      description: 'You\'ve been very active in the diabetes community. Consider sharing your experience!',
      category: 'Social',
      priority: 'low',
      actionable: true
    }
  ];

  const quickActions = [
    { label: 'Check my mood trends', action: 'mood-trends' },
    { label: 'Find buddy matches', action: 'buddy-match' },
    { label: 'Schedule health reminder', action: 'reminder' },
    { label: 'Get wellness tips', action: 'wellness-tips' },
    { label: 'Community suggestions', action: 'community' }
  ];

  const botResponses = {
    'mood-trends': "Based on your recent activity, I've noticed you've been feeling more positive lately! Your engagement with the community seems to correlate with better mood days. Would you like me to analyze this pattern further?",
    'buddy-match': "I found 3 potential buddy matches based on your current mood and interests! Sarah M. (92% compatibility) is also interested in meditation and journaling. Would you like me to introduce you?",
    'reminder': "I can help you set up personalized health reminders. What would you like to be reminded about? Medication, appointments, mood check-ins, or exercise?",
    'wellness-tips': "Here are your personalized wellness tips for today: 1) Stay hydrated - you're at 60% of your daily goal, 2) Consider a 10-minute meditation session, 3) Share your progress in the community for motivation!",
    'community': "Based on your interests, I recommend checking out the 'Heart Health Heroes' community - they have an AMA session with Dr. Johnson tomorrow at 2 PM. You might also enjoy the recovery stories in the diabetes support group."
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(newMessage),
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const response = botResponses[action as keyof typeof botResponses];
    if (response) {
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'suggestion'
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('mood') || lowerInput.includes('feeling')) {
      return "I understand you're asking about mood. I can help you track mood patterns and find compatible community members. Your recent mood trend shows improvement - keep up the great work! Would you like me to find buddy matches based on your current mood?";
    }
    
    if (lowerInput.includes('community') || lowerInput.includes('friend')) {
      return "The community is a great place to find support! Based on your profile, I recommend joining the discussions in your condition-specific groups. I can also help you find buddy matches with 85%+ compatibility. What type of support are you looking for?";
    }
    
    if (lowerInput.includes('reminder') || lowerInput.includes('medication')) {
      return "I can set up smart reminders for you! I notice you might benefit from medication reminders and mood check-ins. I can also remind you about upcoming AMA sessions and community events. What would you like me to help you remember?";
    }
    
    if (lowerInput.includes('doctor') || lowerInput.includes('ama')) {
      return "There are several exciting AMA sessions coming up! Dr. Johnson has a heart health session tomorrow, and Dr. Chen will discuss diabetes management next week. I can register you for sessions that match your interests. Which topics interest you most?";
    }
    
    return "I'm here to help with your health journey! I can assist with mood tracking, finding community connections, setting reminders, providing wellness insights, and connecting you with relevant AMA sessions. What would you like to explore?";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Health Assistant
          </CardTitle>
          <CardDescription>
            Your personal AI companion for health insights, community connections, and wellness support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <p className="text-sm text-gray-600">Conversations</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-sm text-gray-600">Insights Today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat with Health Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] ${message.isBot ? 'flex gap-2' : ''}`}>
                      {message.isBot && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-blue-50 text-blue-900' 
                          : 'bg-purple-600 text-white ml-12'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-blue-50 text-blue-900 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAction(action.action)}
                      className="text-xs"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your health..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Health Insights
              </CardTitle>
              <CardDescription>
                AI-powered personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="h-6 text-xs">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Smart Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span>Medication reminder</span>
                  <span className="text-xs text-gray-500">2:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span>Mood check-in</span>
                  <span className="text-xs text-gray-500">6:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span>Dr. AMA session</span>
                  <span className="text-xs text-gray-500">Tomorrow 2:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
