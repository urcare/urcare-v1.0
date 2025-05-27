
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Brain, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  message: string;
  timestamp: string;
  type?: 'suggestion' | 'motivation' | 'plan' | 'question';
}

interface CoachingSuggestion {
  category: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
}

export const VirtualHealthCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'coach',
      message: "Hi! I'm your virtual health coach. I've noticed you're doing great with hydration this week! How can I help you today?",
      timestamp: '10:30 AM',
      type: 'motivation'
    },
    {
      id: '2',
      sender: 'user',
      message: "I've been struggling with my morning exercise routine lately. Any suggestions?",
      timestamp: '10:32 AM'
    },
    {
      id: '3',
      sender: 'coach',
      message: "I understand! Let's break this down. What specific challenges are you facing with your morning routine? Is it time, motivation, or energy levels?",
      timestamp: '10:33 AM',
      type: 'question'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions: CoachingSuggestion[] = [
    {
      category: 'Exercise',
      title: 'Morning Routine Restart',
      description: 'Start with 5-minute workouts to rebuild your habit',
      urgency: 'medium'
    },
    {
      category: 'Sleep',
      title: 'Sleep Schedule Optimization',
      description: 'Your sleep has been inconsistent. Let\'s create a bedtime routine',
      urgency: 'high'
    },
    {
      category: 'Nutrition',
      title: 'Meal Prep Strategy',
      description: 'Plan tomorrow\'s meals to maintain your nutrition goals',
      urgency: 'low'
    }
  ];

  const quickQuestions = [
    "How do I build better habits?",
    "I'm feeling unmotivated today",
    "What should I focus on this week?",
    "Help me with meal planning",
    "I missed my workout, what now?"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        message: generateCoachResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'suggestion'
      };
      setMessages(prev => [...prev, coachResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateCoachResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Based on your recent progress, I'd recommend starting small and building consistency. What feels most achievable for you right now?",
      "I can see you're committed to improving your health! Let's focus on one habit at a time. Which area would you like to work on first?",
      "Your dedication is inspiring! Remember, small consistent actions lead to big results. How about we set a micro-goal for tomorrow?",
      "I understand it can be challenging. Let's break this down into smaller, manageable steps. What's one thing you could do today?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'suggestion': return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'motivation': return 'bg-green-50 border-l-4 border-l-green-500';
      case 'plan': return 'bg-purple-50 border-l-4 border-l-purple-500';
      case 'question': return 'bg-orange-50 border-l-4 border-l-orange-500';
      default: return '';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Virtual Health Coach
          </CardTitle>
          <CardDescription>
            AI-powered personal health coaching with personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border rounded-lg h-96 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-green-600 text-white'
                        }`}>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : `bg-gray-100 ${getMessageTypeColor(message.type)}`
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask your health coach anything..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full text-left justify-start text-sm h-auto py-2 px-3"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Today's Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{suggestion.category}</Badge>
                          <Badge className={getUrgencyColor(suggestion.urgency)}>
                            {suggestion.urgency}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
