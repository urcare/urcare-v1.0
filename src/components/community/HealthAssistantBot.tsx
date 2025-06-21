
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Send, Sparkles, Heart, Brain, Lightbulb, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  type?: 'suggestion' | 'question' | 'tip' | 'reminder';
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
}

export const HealthAssistantBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI Health Assistant. I can help with health questions, provide wellness tips, remind you about medications, and support your health journey. How can I assist you today?',
      sender: 'bot',
      timestamp: 'Just now',
      type: 'suggestion'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Symptom Checker',
      description: 'Describe your symptoms for guidance',
      icon: <Heart className="h-5 w-5" />,
      action: 'symptom-check'
    },
    {
      id: '2',
      title: 'Medication Reminder',
      description: 'Set up medication reminders',
      icon: <Clock className="h-5 w-5" />,
      action: 'med-reminder'
    },
    {
      id: '3',
      title: 'Health Tips',
      description: 'Get personalized health advice',
      icon: <Lightbulb className="h-5 w-5" />,
      action: 'health-tips'
    },
    {
      id: '4',
      title: 'Mental Wellness',
      description: 'Support for mental health',
      icon: <Brain className="h-5 w-5" />,
      action: 'mental-wellness'
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateBotResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('pain') || lowerInput.includes('hurt')) {
      return {
        id: (Date.now() + 1).toString(),
        content: 'I understand you\'re experiencing pain. While I can\'t diagnose, I can suggest some general approaches: 1) Apply ice/heat as appropriate, 2) Gentle stretching, 3) Over-the-counter pain relief if suitable. If pain persists or is severe, please consult a healthcare provider. Would you like specific tips for the type of pain you\'re experiencing?',
        sender: 'bot',
        timestamp: 'Just now',
        type: 'tip'
      };
    }
    
    if (lowerInput.includes('stress') || lowerInput.includes('anxiety')) {
      return {
        id: (Date.now() + 1).toString(),
        content: 'Stress and anxiety are common experiences. Here are some immediate techniques that might help: 1) Deep breathing (4 counts in, 6 counts out), 2) Progressive muscle relaxation, 3) Mindful meditation for 5-10 minutes, 4) Light physical activity. If these feelings persist, consider speaking with a mental health professional. Would you like me to guide you through a quick breathing exercise?',
        sender: 'bot',
        timestamp: 'Just now',
        type: 'tip'
      };
    }
    
    if (lowerInput.includes('medication') || lowerInput.includes('medicine')) {
      return {
        id: (Date.now() + 1).toString(),
        content: 'I can help you organize your medications! I can assist with: 1) Setting up reminder schedules, 2) Tracking adherence, 3) Providing general information about medications (not medical advice), 4) Connecting you with pharmacist resources. What specific help do you need with your medications?',
        sender: 'bot',
        timestamp: 'Just now',
        type: 'suggestion'
      };
    }
    
    return {
      id: (Date.now() + 1).toString(),
      content: 'Thank you for sharing that with me. I\'m here to support your health journey. Based on what you\'ve told me, I recommend: 1) Keeping track of your symptoms or concerns, 2) Maintaining regular healthy habits, 3) Consulting with healthcare providers for personalized advice. Is there a specific aspect of your health you\'d like to focus on today?',
      sender: 'bot',
      timestamp: 'Just now',
      type: 'suggestion'
    };
  };

  const handleQuickAction = (action: string) => {
    let response = '';
    
    switch (action) {
      case 'symptom-check':
        response = 'I\'d like to help you understand your symptoms better. Please describe what you\'re experiencing, including when it started, how severe it is (1-10), and any other relevant details. Remember, this is for guidance only - always consult a healthcare professional for proper diagnosis.';
        break;
      case 'med-reminder':
        response = 'Let\'s set up your medication reminders! I can help you track: 1) Medication names and dosages, 2) Times to take them, 3) Frequency, 4) Special instructions. What medications do you need reminders for?';
        break;
      case 'health-tips':
        response = 'Here are some personalized health tips based on common wellness practices: 1) Stay hydrated (8 glasses of water daily), 2) Get 7-9 hours of sleep, 3) Include 30 minutes of movement daily, 4) Eat a variety of colorful fruits and vegetables, 5) Practice stress management. Which area would you like specific advice on?';
        break;
      case 'mental-wellness':
        response = 'Mental wellness is just as important as physical health. Some daily practices that can help: 1) Mindfulness meditation (even 5 minutes), 2) Gratitude journaling, 3) Regular social connections, 4) Limiting negative media, 5) Professional support when needed. How are you feeling today, and what kind of support would be most helpful?';
        break;
      default:
        response = 'I\'m here to help with your health concerns. What would you like to know?';
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      content: response,
      sender: 'bot',
      timestamp: 'Just now',
      type: 'suggestion'
    };

    setMessages(prev => [...prev, botMessage]);
    toast.success('Health assistant activated!');
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'suggestion': return 'border-l-blue-400 bg-blue-50';
      case 'tip': return 'border-l-green-400 bg-green-50';
      case 'reminder': return 'border-l-yellow-400 bg-yellow-50';
      default: return 'border-l-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Health Assistant
          </CardTitle>
          <CardDescription>
            Your personal AI companion for health guidance, symptom support, and wellness coaching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">24/7</div>
              <p className="text-sm text-gray-600">Available</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2k</div>
              <p className="text-sm text-gray-600">Questions Answered</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <p className="text-sm text-gray-600">Helpful Rating</p>
            </div>
            <div className="p-3 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">&lt;30s</div>
              <p className="text-sm text-gray-600">Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Get instant help with common health needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chat with Health Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      {message.sender === 'bot' ? (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </Avatar>
                    
                    <div className={`${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : `bg-white border-l-4 ${getMessageTypeColor(message.type)}`
                    } p-3 rounded-lg shadow-sm`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </span>
                        {message.type && message.sender === 'bot' && (
                          <Badge variant="secondary" className="text-xs">
                            {message.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    </Avatar>
                    <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-l-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="animate-bounce">●</div>
                        <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
                        <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                        <span className="ml-2 text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about your health..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              💡 This AI assistant provides general health information and guidance. Always consult healthcare professionals for medical advice, diagnosis, or treatment.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
