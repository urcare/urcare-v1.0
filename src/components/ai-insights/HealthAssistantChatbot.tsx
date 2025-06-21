
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
  Brain, 
  AlertTriangle,
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'symptom' | 'education' | 'wellness' | 'emergency';
  confidence?: number;
  suggestions?: string[];
}

interface HealthContext {
  conditions: string[];
  medications: string[];
  allergies: string[];
  recentSymptoms: string[];
  riskFactors: string[];
}

export const HealthAssistantChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI Health Assistant. I can help with symptoms, health education, wellness coaching, and emergency guidance. How can I assist you today?',
      timestamp: new Date(),
      category: 'education'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [healthContext] = useState<HealthContext>({
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril', 'Metformin'],
    allergies: ['Penicillin'],
    recentSymptoms: ['Headache', 'Fatigue'],
    riskFactors: ['Family history of heart disease', 'Sedentary lifestyle']
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { id: 'symptoms', label: 'Symptom Check', icon: Heart, color: 'bg-red-100 text-red-700' },
    { id: 'medication', label: 'Medication Info', icon: Brain, color: 'bg-blue-100 text-blue-700' },
    { id: 'wellness', label: 'Wellness Tips', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { id: 'emergency', label: 'Emergency Help', icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' }
  ];

  const generateBotResponse = (userMessage: string, category: string = 'education'): Message => {
    const responses = {
      symptom: [
        'Based on your symptoms, I recommend monitoring them closely. If they persist or worsen, please consult your healthcare provider.',
        'I understand you\'re experiencing symptoms. Let me help you assess the severity and provide guidance.',
        'Symptom tracking is important. I\'ll help you understand what to watch for and when to seek care.'
      ],
      education: [
        'That\'s a great health question! Here\'s what you should know...',
        'Health education is key to wellness. Let me explain this topic for you.',
        'Understanding your health is empowering. Here\'s some helpful information...'
      ],
      wellness: [
        'Excellent focus on wellness! Small daily habits can make a big difference.',
        'Wellness is a journey, not a destination. Here are some personalized tips for you.',
        'Your commitment to health is admirable. Let\'s build healthy habits together.'
      ],
      emergency: [
        'This seems urgent. If you\'re experiencing a medical emergency, please call emergency services immediately.',
        'Your safety is paramount. For immediate medical emergencies, contact emergency services.',
        'I\'m here to help, but for urgent medical situations, please seek immediate professional care.'
      ]
    };

    const categoryResponses = responses[category as keyof typeof responses] || responses.education;
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: randomResponse,
      timestamp: new Date(),
      category: category as Message['category'],
      confidence: Math.round(85 + Math.random() * 10),
      suggestions: getSuggestions(category)
    };
  };

  const getSuggestions = (category: string): string[] => {
    const suggestionMap = {
      symptom: ['Track symptoms', 'Check temperature', 'Monitor vital signs'],
      education: ['Read more', 'Watch video', 'Schedule consultation'],
      wellness: ['Set reminder', 'Track progress', 'Join challenge'],
      emergency: ['Call emergency', 'Contact doctor', 'Visit ER']
    };
    return suggestionMap[category as keyof typeof suggestionMap] || [];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const category = detectCategory(inputMessage);
      const botResponse = generateBotResponse(inputMessage, category);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const detectCategory = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('symptom')) {
      return 'symptom';
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help')) {
      return 'emergency';
    }
    if (lowerMessage.includes('exercise') || lowerMessage.includes('diet') || lowerMessage.includes('wellness')) {
      return 'wellness';
    }
    return 'education';
  };

  const handleQuickAction = (actionId: string) => {
    const quickMessages = {
      symptoms: "I'm experiencing some symptoms and would like guidance.",
      medication: "Can you tell me about my medications?",
      wellness: "I'd like some wellness tips for better health.",
      emergency: "I need emergency health guidance."
    };

    const message = quickMessages[actionId as keyof typeof quickMessages];
    if (message) {
      setInputMessage(message);
    }
  };

  const toggleVoiceRecognition = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice recognition started');
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage("I have a headache and feeling tired");
        setIsListening(false);
        toast.success('Voice message captured');
      }, 3000);
    } else {
      toast.info('Voice recognition stopped');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Health Assistant</CardTitle>
                <p className="text-sm text-gray-600">Always here to help with your health questions</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            onClick={() => handleQuickAction(action.id)}
            className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color} border-0`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="context">Health Context</TabsTrigger>
          <TabsTrigger value="history">Chat History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardContent className="p-0">
              {/* Messages Area */}
              <ScrollArea className="h-96 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.confidence && (
                              <Badge variant="secondary" className="text-xs">
                                {message.confidence}% confident
                              </Badge>
                            )}
                          </div>
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => setInputMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about symptoms, medications, wellness tips..."
                      className="pr-12"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleVoiceRecognition}
                      className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                        isListening ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Avg response: 2-3 seconds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {healthContext.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline">{condition}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Medications</h4>
                <div className="flex flex-wrap gap-2">
                  {healthContext.medications.map((med, index) => (
                    <Badge key={index} variant="secondary">{med}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {healthContext.allergies.map((allergy, index) => (
                    <Badge key={index} className="bg-red-100 text-red-700">{allergy}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recent Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {healthContext.recentSymptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50">{symptom}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.filter(m => m.type === 'user').slice(-5).map((message) => (
                  <div key={message.id} className="p-3 border rounded-lg">
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contact */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Medical Emergency?</p>
              <p className="text-xs text-red-600">For immediate medical emergencies, call emergency services</p>
            </div>
            <Button variant="destructive" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
