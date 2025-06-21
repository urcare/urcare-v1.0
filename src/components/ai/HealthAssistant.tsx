
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Bot, Heart, Brain, Stethoscope, Send, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence: number;
    actionable?: boolean;
    sources?: string[];
  };
}

interface HealthInsight {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export const HealthAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Health Assistant. I can help you understand symptoms, provide health information, and guide you on when to seek medical attention. How can I assist you today?',
      timestamp: new Date(),
      metadata: { confidence: 95 }
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([
    {
      id: '1',
      category: 'Preventive Care',
      title: 'Annual Health Checkup Due',
      description: 'Based on your age and health history, you\'re due for your annual physical examination.',
      severity: 'medium',
      actionable: true
    },
    {
      id: '2',
      category: 'Lifestyle',
      title: 'Hydration Reminder',
      description: 'Your water intake has been below recommended levels. Aim for 8 glasses daily.',
      severity: 'low',
      actionable: true
    }
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        metadata: { 
          confidence: 85,
          actionable: true,
          sources: ['Medical Journal', 'Health Guidelines']
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('headache')) {
      return 'Headaches can have various causes including dehydration, stress, or lack of sleep. For occasional headaches, try staying hydrated, getting adequate rest, and managing stress. However, if you experience severe, sudden, or persistent headaches, please consult a healthcare provider.';
    }
    
    if (lowerInput.includes('fever')) {
      return 'A fever is your body\'s natural response to infection. For adults, a temperature above 100.4°F (38°C) is considered a fever. Stay hydrated, rest, and monitor your temperature. Seek medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.';
    }
    
    return 'Thank you for your question. While I can provide general health information, it\'s important to consult with a healthcare professional for personalized medical advice, especially for specific symptoms or concerns.';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            AI Health Assistant
          </CardTitle>
          <CardDescription>
            Your personal AI-powered health companion for guidance and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always available for health questions</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Smart Insights</h3>
              <p className="text-sm text-gray-600">AI-powered health recommendations</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Stethoscope className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold">Medical Guidance</h3>
              <p className="text-sm text-gray-600">Evidence-based health information</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Health Chat</TabsTrigger>
          <TabsTrigger value="insights">Health Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.metadata && (
                        <div className="mt-2 text-xs opacity-75">
                          Confidence: {message.metadata.confidence}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about symptoms, medications, or health concerns..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {healthInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge className={getSeverityColor(insight.severity)}>
                      {insight.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge variant="outline">{insight.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  {insight.actionable && (
                    <Button size="sm" onClick={() => toast.success('Action noted!')}>
                      Take Action
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
