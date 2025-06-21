
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Heart, 
  AlertTriangle, 
  Phone,
  Clock,
  Brain,
  Lightbulb,
  Shield,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'symptom-check' | 'emergency' | 'education' | 'coaching';
  metadata?: {
    confidence?: number;
    urgency?: 'low' | 'medium' | 'high' | 'emergency';
    suggestions?: string[];
    followUp?: string[];
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
  category: 'symptom' | 'medication' | 'appointment' | 'wellness' | 'emergency';
}

interface ConversationSuggestion {
  id: string;
  text: string;
  category: string;
}

export const HealthAssistantChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Health Assistant. I can help you with symptoms, medication questions, health education, and wellness coaching. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Symptom Check',
      icon: <Heart className="h-4 w-4" />,
      action: 'I have symptoms I want to discuss',
      category: 'symptom'
    },
    {
      id: '2',
      label: 'Medication Help',
      icon: <Activity className="h-4 w-4" />,
      action: 'I have questions about my medications',
      category: 'medication'
    },
    {
      id: '3',
      label: 'Emergency',
      icon: <AlertTriangle className="h-4 w-4" />,
      action: 'This is an emergency',
      category: 'emergency'
    },
    {
      id: '4',
      label: 'Wellness Tips',
      icon: <Lightbulb className="h-4 w-4" />,
      action: 'Give me wellness tips for today',
      category: 'wellness'
    }
  ];

  const suggestions: ConversationSuggestion[] = [
    { id: '1', text: 'What does my blood test mean?', category: 'education' },
    { id: '2', text: 'How to manage my blood pressure?', category: 'coaching' },
    { id: '3', text: 'Side effects of my medication?', category: 'medication' },
    { id: '4', text: 'When should I see a doctor?', category: 'guidance' }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(content);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    
    // Emergency detection
    if (input.includes('emergency') || input.includes('urgent') || input.includes('chest pain') || input.includes('can\'t breathe')) {
      return {
        id: Date.now().toString(),
        content: "🚨 This sounds like a medical emergency. Please call 911 immediately or go to the nearest emergency room. I'm also notifying your emergency contacts.",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'emergency',
        metadata: {
          urgency: 'emergency',
          suggestions: ['Call 911', 'Go to ER', 'Contact emergency contact']
        }
      };
    }

    // Symptom checking
    if (input.includes('symptom') || input.includes('pain') || input.includes('fever') || input.includes('headache')) {
      return {
        id: Date.now().toString(),
        content: "I'd be happy to help you understand your symptoms. Based on what you've described, here are some possible considerations:\n\n• Monitor your symptoms closely\n• Consider when they started and any triggers\n• Note any associated symptoms\n\nWould you like me to help you prepare questions for your doctor or check if this warrants immediate attention?",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'symptom-check',
        metadata: {
          confidence: 75,
          urgency: 'medium',
          suggestions: ['Schedule doctor visit', 'Monitor symptoms', 'Take temperature'],
          followUp: ['How long have you had these symptoms?', 'Any other symptoms?', 'Taking any medications?']
        }
      };
    }

    // Medication questions
    if (input.includes('medication') || input.includes('drug') || input.includes('pill') || input.includes('side effect')) {
      return {
        id: Date.now().toString(),
        content: "I can help with medication information. For your safety, I recommend:\n\n• Always consult your pharmacist or doctor for specific advice\n• Check for drug interactions with your current medications\n• Report any side effects to your healthcare provider\n\nWhat specific medication question do you have? I can provide general information and help you prepare questions for your pharmacist.",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'coaching',
        metadata: {
          confidence: 90,
          urgency: 'low',
          suggestions: ['Contact pharmacist', 'Check drug interactions', 'Review medication list']
        }
      };
    }

    // General health education
    return {
      id: Date.now().toString(),
      content: "That's a great health question! Based on current medical guidelines and your health profile, here's what I can share:\n\n• General health information based on medical evidence\n• Personalized suggestions based on your health data\n• Recommendations for next steps\n\nRemember, this information is educational and doesn't replace professional medical advice. Would you like me to help you find relevant resources or prepare questions for your healthcare provider?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'education',
      metadata: {
        confidence: 85,
        urgency: 'low',
        suggestions: ['Learn more', 'Schedule appointment', 'Track symptoms'],
        followUp: ['Any specific concerns?', 'Want to dive deeper?', 'Questions for your doctor?']
      }
    };
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice input activated - speak now');
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('I have been feeling tired lately and have some questions');
        toast.success('Voice input captured');
      }, 3000);
    }
  };

  const escalateToHuman = () => {
    toast.success('Connecting you with a human health advisor...');
    const humanMessage: ChatMessage = {
      id: Date.now().toString(),
      content: "I'm connecting you with one of our human health advisors who can provide more personalized assistance. Please hold on while I transfer your conversation.",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, humanMessage]);
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'symptom-check': return <Heart className="h-4 w-4 text-orange-600" />;
      case 'education': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'coaching': return <Brain className="h-4 w-4 text-green-600" />;
      default: return <Bot className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Health Chat</TabsTrigger>
          <TabsTrigger value="coaching">Wellness Coaching</TabsTrigger>
          <TabsTrigger value="education">Health Education</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Chat Interface */}
          <Card className="h-96">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                AI Health Assistant
                <Badge variant="outline" className="ml-auto">
                  <Shield className="h-3 w-3 mr-1" />
                  HIPAA Compliant
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                            {message.sender === 'user' ? 
                              <User className="h-4 w-4" /> : 
                              getMessageTypeIcon(message.type)
                            }
                          </div>
                          <div className={`p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : `${getUrgencyColor(message.metadata?.urgency)}`
                          }`}>
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            
                            {message.metadata && (
                              <div className="mt-2 space-y-2">
                                {message.metadata.confidence && (
                                  <div className="text-xs opacity-75">
                                    Confidence: {message.metadata.confidence}%
                                  </div>
                                )}
                                
                                {message.metadata.suggestions && (
                                  <div className="flex flex-wrap gap-1">
                                    {message.metadata.suggestions.map((suggestion, index) => (
                                      <Badge key={index} variant="outline" className="text-xs cursor-pointer">
                                        {suggestion}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="text-xs opacity-50 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                        <Bot className="h-4 w-4 animate-pulse" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about symptoms, medications, or health concerns..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleVoiceInput}
                    variant="outline"
                    size="icon"
                    className={isListening ? 'bg-red-100 border-red-300' : ''}
                  >
                    {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={() => handleSendMessage(inputMessage)}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex items-center gap-1"
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Escalation */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="text-xs"
                >
                  {suggestion.text}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={escalateToHuman}
                className="flex items-center gap-1"
              >
                <User className="h-3 w-3" />
                Human Support
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleSendMessage('This is an emergency')}
                className="flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                Emergency
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Wellness Coaching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Today's Focus</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Take morning medications</li>
                    <li>• 30-minute walk after breakfast</li>
                    <li>• Blood pressure check at 6 PM</li>
                    <li>• Prepare questions for tomorrow's appointment</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Weekly Goals</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Exercise 5 days this week ✓</li>
                    <li>• Medication adherence >95% ✓</li>
                    <li>• Track blood pressure daily</li>
                    <li>• Complete stress management session</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Education Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Understanding Your Conditions</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Hypertension management guide</li>
                    <li>• Diabetes prevention tips</li>
                    <li>• Heart-healthy lifestyle changes</li>
                    <li>• Medication interaction guide</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Interactive Learning</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Nutrition planning quiz</li>
                    <li>• Exercise safety assessment</li>
                    <li>• Symptom tracker tutorial</li>
                    <li>• Emergency response training</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
