
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Settings, 
  MessageSquare,
  Zap,
  Brain,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceSettings {
  enabled: boolean;
  language: string;
  sensitivity: number;
  wakeWord: string;
  continuousListening: boolean;
  feedbackEnabled: boolean;
  medicalVocabulary: boolean;
  handsFreeModeEnabled: boolean;
  voiceToTextEnabled: boolean;
}

interface VoiceCommand {
  id: string;
  phrase: string;
  category: 'navigation' | 'documentation' | 'search' | 'action';
  description: string;
  confidence: number;
  lastUsed: string;
}

export const VoiceNavigationManager = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: false,
    language: 'en-US',
    sensitivity: 70,
    wakeWord: 'medical assistant',
    continuousListening: false,
    feedbackEnabled: true,
    medicalVocabulary: true,
    handsFreeModeEnabled: false,
    voiceToTextEnabled: true
  });

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' }
  ];

  const voiceCommands: VoiceCommand[] = [
    {
      id: 'nav-1',
      phrase: 'Go to dashboard',
      category: 'navigation',
      description: 'Navigate to main dashboard',
      confidence: 95,
      lastUsed: '2024-01-20 14:30:00'
    },
    {
      id: 'nav-2',
      phrase: 'Open patient records',
      category: 'navigation',
      description: 'Navigate to patient records section',
      confidence: 92,
      lastUsed: '2024-01-20 13:45:00'
    },
    {
      id: 'doc-1',
      phrase: 'Start new note',
      category: 'documentation',
      description: 'Begin voice-to-text documentation',
      confidence: 88,
      lastUsed: '2024-01-20 15:20:00'
    },
    {
      id: 'search-1',
      phrase: 'Search for patient',
      category: 'search',
      description: 'Initiate patient search function',
      confidence: 94,
      lastUsed: '2024-01-20 12:15:00'
    },
    {
      id: 'action-1',
      phrase: 'Emergency mode',
      category: 'action',
      description: 'Activate emergency protocols',
      confidence: 97,
      lastUsed: '2024-01-19 09:30:00'
    }
  ];

  const updateSetting = (key: keyof VoiceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`${key} updated`);
  };

  const startListening = () => {
    if (!settings.enabled) {
      toast.error('Voice navigation is disabled');
      return;
    }

    setIsListening(true);
    setCurrentCommand('');
    setConfidence(0);
    
    // Simulate voice recognition
    setTimeout(() => {
      setCurrentCommand('Go to dashboard');
      setConfidence(95);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsListening(false);
        setIsProcessing(false);
        toast.success('Voice command executed: Go to dashboard');
      }, 1500);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
    setCurrentCommand('');
    setConfidence(0);
  };

  const testVoiceRecognition = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Testing voice recognition...',
        success: 'Voice recognition test completed successfully',
        error: 'Voice recognition test failed'
      }
    );
  };

  const trainVoiceModel = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 5000)),
      {
        loading: 'Training medical vocabulary model...',
        success: 'Voice model training completed',
        error: 'Training failed'
      }
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation': return 'bg-blue-100 text-blue-800';
      case 'documentation': return 'bg-green-100 text-green-800';
      case 'search': return 'bg-purple-100 text-purple-800';
      case 'action': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return Activity;
      case 'documentation': return MessageSquare;
      case 'search': return Settings;
      case 'action': return Zap;
      default: return Settings;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voice Navigation System</h2>
          <p className="text-muted-foreground">Medical command recognition and hands-free operation</p>
        </div>
        <div className="flex items-center gap-3">
          {isListening && (
            <Badge className="bg-red-100 text-red-800 animate-pulse">
              <Mic className="h-3 w-3 mr-1" />
              Listening...
            </Badge>
          )}
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? 'Stop' : 'Start'} Voice
          </Button>
        </div>
      </div>

      {/* Voice Recognition Status */}
      {(isListening || isProcessing) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {isProcessing ? 'Processing command...' : 'Listening for command...'}
                  </span>
                </div>
                {confidence > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    {confidence}% confidence
                  </Badge>
                )}
              </div>
              
              {currentCommand && (
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium">Recognized: "{currentCommand}"</p>
                </div>
              )}
              
              {isProcessing && (
                <Progress value={75} className="h-2" />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Enable Voice Navigation</span>
                <p className="text-sm text-muted-foreground">Turn on voice command recognition</p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(value) => updateSetting('enabled', value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recognition Language</label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">
                Sensitivity: {settings.sensitivity}%
              </label>
              <Slider
                value={[settings.sensitivity]}
                onValueChange={([value]) => updateSetting('sensitivity', value)}
                min={30}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Medical Vocabulary</span>
                <p className="text-sm text-muted-foreground">Enhanced recognition for medical terms</p>
              </div>
              <Switch
                checked={settings.medicalVocabulary}
                onCheckedChange={(value) => updateSetting('medicalVocabulary', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Hands-Free Mode</span>
                <p className="text-sm text-muted-foreground">Continuous voice operation</p>
              </div>
              <Switch
                checked={settings.handsFreeModeEnabled}
                onCheckedChange={(value) => updateSetting('handsFreeModeEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Voice-to-Text</span>
                <p className="text-sm text-muted-foreground">Convert speech to documentation</p>
              </div>
              <Switch
                checked={settings.voiceToTextEnabled}
                onCheckedChange={(value) => updateSetting('voiceToTextEnabled', value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={testVoiceRecognition} variant="outline" className="flex-1">
                <Volume2 className="h-4 w-4 mr-2" />
                Test Recognition
              </Button>
              <Button onClick={trainVoiceModel} variant="outline" className="flex-1">
                <Brain className="h-4 w-4 mr-2" />
                Train Model
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Voice Commands
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {voiceCommands.map((command) => {
              const CategoryIcon = getCategoryIcon(command.category);
              return (
                <div key={command.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4" />
                      <span className="font-medium">"{command.phrase}"</span>
                    </div>
                    <Badge className={getCategoryColor(command.category)}>
                      {command.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{command.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Last used: {command.lastUsed}
                    </span>
                    <Badge variant="secondary">
                      {command.confidence}% accuracy
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
