
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Workflow, 
  Mic, 
  Zap, 
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Smartphone
} from 'lucide-react';

interface WorkflowFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  usage: number;
  timeSaved: number;
  icon: React.ComponentType<any>;
}

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: string;
  frequency: number;
}

interface ContextShortcut {
  id: string;
  name: string;
  context: string;
  action: string;
  triggers: number;
  efficiency: number;
}

export const MobileWorkflowOptimizer = () => {
  const [workflowFeatures, setWorkflowFeatures] = useState<WorkflowFeature[]>([
    {
      id: '1',
      name: 'Voice Data Entry',
      description: 'Speech-to-text for patient notes and documentation',
      enabled: true,
      usage: 87,
      timeSaved: 45,
      icon: Mic
    },
    {
      id: '2',
      name: 'Predictive Text',
      description: 'AI-powered text suggestions for faster data entry',
      enabled: true,
      usage: 72,
      timeSaved: 32,
      icon: Zap
    },
    {
      id: '3',
      name: 'Context Shortcuts',
      description: 'Dynamic shortcuts based on current workflow context',
      enabled: true,
      usage: 93,
      timeSaved: 28,
      icon: Target
    },
    {
      id: '4',
      name: 'Smart Forms',
      description: 'Auto-populated forms with intelligent field detection',
      enabled: false,
      usage: 45,
      timeSaved: 15,
      icon: CheckCircle
    }
  ]);

  const [voiceCommands] = useState<VoiceCommand[]>([
    {
      id: '1',
      phrase: 'Open patient record',
      action: 'Navigate to patient records',
      category: 'Navigation',
      frequency: 234
    },
    {
      id: '2',
      phrase: 'Schedule appointment',
      action: 'Open appointment scheduler',
      category: 'Scheduling',
      frequency: 187
    },
    {
      id: '3',
      phrase: 'Add vital signs',
      action: 'Open vitals entry form',
      category: 'Data Entry',
      frequency: 156
    },
    {
      id: '4',
      phrase: 'Send prescription',
      action: 'Open prescription interface',
      category: 'Medication',
      frequency: 143
    }
  ]);

  const [contextShortcuts] = useState<ContextShortcut[]>([
    {
      id: '1',
      name: 'Quick Vitals',
      context: 'Patient Exam',
      action: 'One-tap vital signs entry',
      triggers: 342,
      efficiency: 78
    },
    {
      id: '2',
      name: 'Lab Orders',
      context: 'Diagnosis Review',
      action: 'Common lab test ordering',
      triggers: 298,
      efficiency: 85
    },
    {
      id: '3',
      name: 'Follow-up Schedule',
      context: 'Visit Completion',
      action: 'Schedule next appointment',
      triggers: 276,
      efficiency: 72
    }
  ]);

  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const toggleFeature = (featureId: string) => {
    setWorkflowFeatures(prev => 
      prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    setRecognizedText('');
    
    // Simulate voice recognition
    setTimeout(() => {
      setRecognizedText('Patient reports chest pain, started 2 hours ago, sharp, radiating to left arm...');
      setIsListening(false);
    }, 3000);
  };

  const stopVoiceRecognition = () => {
    setIsListening(false);
  };

  const workflowStats = {
    totalTimeSaved: 120, // minutes per day
    efficiencyGain: 34, // percentage
    tasksCompleted: 89,
    errorReduction: 23
  };

  return (
    <div className="space-y-6">
      {/* Workflow Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{workflowStats.totalTimeSaved}</div>
            <div className="text-sm text-gray-600">Minutes Saved/Day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{workflowStats.efficiencyGain}%</div>
            <div className="text-sm text-gray-600">Efficiency Gain</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{workflowStats.tasksCompleted}</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{workflowStats.errorReduction}%</div>
            <div className="text-sm text-gray-600">Error Reduction</div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Workflow Optimization Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="font-medium">{feature.name}</span>
                        <div className="text-sm text-gray-600">{feature.description}</div>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Usage: </span>
                      <span className="font-medium">{feature.usage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time Saved: </span>
                      <span className="font-medium">{feature.timeSaved} min/day</span>
                    </div>
                    <div className="md:col-span-1">
                      <Progress value={feature.usage} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Voice Commands */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Voice Input Interface */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Button
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    variant={isListening ? "destructive" : "default"}
                    size="sm"
                  >
                    <Mic className={`h-4 w-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                    {isListening ? 'Stop' : 'Start'} Listening
                  </Button>
                  {isListening && (
                    <Badge className="bg-red-100 text-red-800 animate-pulse">Recording</Badge>
                  )}
                </div>
                
                {recognizedText && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-600 mb-1">Recognized text:</div>
                    <div className="text-sm">{recognizedText}</div>
                  </div>
                )}
              </div>

              {/* Most Used Commands */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Most Used Commands</h4>
                {voiceCommands.slice(0, 4).map((command) => (
                  <div key={command.id} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">"{command.phrase}"</span>
                      <Badge variant="outline">{command.frequency}</Badge>
                    </div>
                    <div className="text-xs text-gray-600">{command.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Context-Aware Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contextShortcuts.map((shortcut) => (
                <div key={shortcut.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{shortcut.name}</span>
                    <Badge variant="outline">{shortcut.context}</Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">{shortcut.action}</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">Triggers: </span>
                      <span className="font-medium">{shortcut.triggers}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Efficiency: </span>
                      <span className="font-medium">{shortcut.efficiency}%</span>
                    </div>
                  </div>
                  
                  <Progress value={shortcut.efficiency} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Workflow Analytics & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Usage Patterns</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Peak Usage Hours</span>
                  <span className="font-medium">9 AM - 11 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Most Active Day</span>
                  <span className="font-medium">Tuesday</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Session</span>
                  <span className="font-medium">12.5 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Task Completion Rate</span>
                  <span className="font-medium">94.2%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Efficiency Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Data Entry Speed</span>
                    <span>+34% faster</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Navigation Efficiency</span>
                    <span>+42% faster</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Error Reduction</span>
                    <span>-23% errors</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Mobile Optimization Insights</span>
            </div>
            <div className="text-sm text-blue-700">
              Your workflow efficiency has improved by 34% since enabling mobile optimizations. 
              Voice commands are saving you an average of 45 minutes per day. Consider enabling 
              Smart Forms for additional 15-minute daily savings.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
