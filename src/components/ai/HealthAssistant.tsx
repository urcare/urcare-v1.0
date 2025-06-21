
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Mic, MicOff, Sparkles, Heart, Brain, Activity, Pill } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  type: 'text' | 'suggestion' | 'analysis';
  metadata?: {
    confidence?: number;
    sources?: string[];
    actionable?: boolean;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
}

export const HealthAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant. I can help you with medical questions, analyze symptoms, provide health insights, and guide you through your wellness journey. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      type: 'text',
      metadata: { confidence: 95 }
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Symptom Analysis',
      description: 'Describe your symptoms for AI analysis',
      icon: Brain,
      action: 'analyze_symptoms'
    },
    {
      id: '2',
      title: 'Medication Info',
      description: 'Get information about medications',
      icon: Pill,
      action: 'medication_info'
    },
    {
      id: '3',
      title: 'Health Metrics',
      description: 'Analyze your health data trends',
      icon: Activity,
      action: 'health_metrics'
    },
    {
      id: '4',
      title: 'Wellness Tips',
      description: 'Get personalized health recommendations',
      icon: Heart,
      action: 'wellness_tips'
    }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    let response = '';
    let type: 'text' | 'suggestion' | 'analysis' = 'text';
    let metadata = { confidence: 85 };

    if (input.includes('symptom') || input.includes('pain') || input.includes('feel')) {
      response = "I understand you're experiencing some symptoms. Based on what you've described, here's my analysis:\n\n• This could be related to several common conditions\n• I recommend monitoring your symptoms\n• Consider consulting with a healthcare provider if symptoms persist\n\nWould you like me to help you track these symptoms or provide more specific guidance?";
      type = 'analysis';
      metadata = { confidence: 78, actionable: true };
    } else if (input.includes('medication') || input.includes('drug') || input.includes('medicine')) {
      response = "I can help you with medication information. Please note that I provide general information only and you should always consult your healthcare provider for medical advice.\n\nWhat specific medication would you like to know about? I can provide information on:\n• Dosage guidelines\n• Common side effects\n• Drug interactions\n• Timing recommendations";
      type = 'suggestion';
      metadata = { confidence: 92, sources: ['FDA Database', 'Medical Literature'] };
    } else if (input.includes('health') || input.includes('wellness') || input.includes('tips')) {
      response = "Here are some personalized wellness recommendations based on your health profile:\n\n🏃‍♂️ **Physical Activity**: Aim for 150 minutes of moderate exercise weekly\n🥗 **Nutrition**: Focus on whole foods and adequate hydration\n😴 **Sleep**: Maintain 7-9 hours of quality sleep\n🧘 **Stress Management**: Practice mindfulness or meditation\n\nWould you like me to elaborate on any of these areas?";
      type = 'suggestion';
      metadata = { confidence: 89, actionable: true };
    } else {
      response = "Thank you for your question. I'm here to help with your health and wellness needs. I can assist with:\n\n• Symptom analysis and health insights\n• Medication information and reminders\n• Wellness recommendations\n• Health data interpretation\n• Preventive care guidance\n\nWhat specific health topic would you like to explore?";
    }

    return {
      id: Date.now().toString(),
      content: response,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      type,
      metadata
    };
  };

  const handleQuickAction = (action: string) => {
    let prompt = '';
    switch (action) {
      case 'analyze_symptoms':
        prompt = 'I need help analyzing my symptoms';
        break;
      case 'medication_info':
        prompt = 'Can you provide information about my medications?';
        break;
      case 'health_metrics':
        prompt = 'Help me understand my health metrics and trends';
        break;
      case 'wellness_tips':
        prompt = 'I would like personalized wellness recommendations';
        break;
    }
    
    setInputValue(prompt);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice input activated - speak now');
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setInputValue('I have been feeling tired lately and want to know what might be causing it');
        toast.success('Voice input captured');
      }, 3000);
    } else {
      toast.info('Voice input stopped');
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'analysis': return 'border-l-4 border-l-purple-500 bg-purple-50';
      case 'suggestion': return 'border-l-4 border-l-blue-500 bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="h-[800px] flex flex-col space-y-4">
      <Card className="bg-gradient-to-r from-green-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-600" />
            AI Health Assistant
          </CardTitle>
          <CardDescription>
            Your intelligent health companion powered by advanced medical AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.action)}
                  className="p-3 text-left border rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <Icon className="h-5 w-5 text-gray-600 mb-2" />
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/health-ai-avatar.png" />
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">HealthBot AI</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online & Ready to Help</span>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-start gap-3">
                      {message.sender === 'assistant' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`p-4 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : `${getMessageTypeColor(message.type)}`
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        
                        {message.metadata && message.sender === 'assistant' && (
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Confidence: {message.metadata.confidence}%</span>
                              {message.metadata.actionable && (
                                <Badge variant="outline" className="text-xs">
                                  Actionable
                                </Badge>
                              )}
                            </div>
                            {message.metadata.sources && (
                              <div className="mt-1 text-xs text-gray-500">
                                Sources: {message.metadata.sources.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {message.sender === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your health..."
                  className="pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleVoiceInput}
                  className={`absolute right-1 top-1 ${isListening ? 'text-red-600' : 'text-gray-400'}`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI provides general health information. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
