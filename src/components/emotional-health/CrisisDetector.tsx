
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MoodEntry, CrisisAlert } from '@/types/emotionalHealth';
import { AlertTriangle, Phone, MessageCircle, Heart, Shield, Clock } from 'lucide-react';

interface CrisisDetectorProps {
  recentMoods: MoodEntry[];
  alerts: CrisisAlert[];
  onAlertUpdate: (alerts: CrisisAlert[]) => void;
}

const crisisPhrases = [
  'I can\'t take this anymore',
  'I want to disappear',
  'Nobody would miss me',
  'I feel hopeless',
  'I can\'t see a way out',
  'I want to hurt myself',
  'Life isn\'t worth living',
  'I feel like giving up',
  'I can\'t go on',
  'I feel trapped'
];

const emergencyContacts = [
  {
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    type: 'crisis',
    available: '24/7'
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    type: 'text',
    available: '24/7'
  },
  {
    name: 'Emergency Services',
    number: '911',
    type: 'emergency',
    available: '24/7'
  }
];

export function CrisisDetector({ recentMoods, alerts, onAlertUpdate }: CrisisDetectorProps) {
  const [detectedText, setDetectedText] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Detect crisis phrases in text
  const detectCrisisPhrases = (text: string): string[] => {
    const lowercaseText = text.toLowerCase();
    return crisisPhrases.filter(phrase => 
      lowercaseText.includes(phrase.toLowerCase())
    );
  };

  // Analyze mood patterns for crisis indicators
  const analyzeMoodForCrisis = (): { severity: CrisisAlert['severity']; reasons: string[] } => {
    if (recentMoods.length < 3) return { severity: 'low', reasons: [] };

    const reasons: string[] = [];
    let severity: CrisisAlert['severity'] = 'low';

    // Check for consistently very low mood
    const veryLowMoods = recentMoods.filter(mood => mood.intensity <= 2).length;
    if (veryLowMoods >= 3) {
      reasons.push('Consistently very low mood intensity');
      severity = 'high';
    } else if (veryLowMoods >= 2) {
      reasons.push('Multiple very low mood entries');
      severity = 'medium';
    }

    // Check for sad/depressed moods
    const sadMoods = recentMoods.filter(mood => 
      mood.mood === 'very_sad' || mood.mood === 'sad'
    ).length;
    if (sadMoods >= 4) {
      reasons.push('Persistent sadness pattern');
      severity = severity === 'high' ? 'high' : 'medium';
    }

    // Check for hopelessness indicators in notes
    const hopelessNotes = recentMoods.filter(mood => 
      mood.notes && mood.notes.toLowerCase().includes('hopeless')
    ).length;
    if (hopelessNotes > 0) {
      reasons.push('Expressions of hopelessness detected');
      severity = 'critical';
    }

    return { severity, reasons };
  };

  const handleTextAnalysis = () => {
    const detectedCrisisPhrases = detectCrisisPhrases(detectedText);
    
    if (detectedCrisisPhrases.length > 0) {
      const newAlert: CrisisAlert = {
        id: `crisis_${Date.now()}`,
        severity: 'critical',
        message: `Crisis language detected: "${detectedCrisisPhrases[0]}"`,
        triggeredAt: new Date(),
        isActive: true,
        recommendedActions: [
          'Reach out to a crisis helpline immediately',
          'Contact a trusted friend or family member',
          'Consider calling emergency services if in immediate danger',
          'Go to the nearest emergency room'
        ]
      };
      
      onAlertUpdate([newAlert, ...alerts]);
    }
    
    setDetectedText('');
  };

  const dismissAlert = (alertId: string) => {
    onAlertUpdate(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false } : alert
    ));
  };

  const getSeverityColor = (severity: CrisisAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-orange-400 bg-orange-50';
      case 'low': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  // Auto-analyze mood patterns
  useEffect(() => {
    if (recentMoods.length >= 3) {
      const analysis = analyzeMoodForCrisis();
      
      if (analysis.severity !== 'low' && analysis.reasons.length > 0) {
        const existingAlert = alerts.find(alert => 
          alert.message.includes('Mood pattern analysis')
        );
        
        if (!existingAlert) {
          const newAlert: CrisisAlert = {
            id: `pattern_${Date.now()}`,
            severity: analysis.severity,
            message: `Mood pattern analysis indicates potential crisis: ${analysis.reasons.join(', ')}`,
            triggeredAt: new Date(),
            isActive: true,
            recommendedActions: [
              'Consider speaking with a mental health professional',
              'Reach out to trusted friends or family',
              'Practice immediate coping strategies',
              'Contact a crisis helpline if needed'
            ]
          };
          
          onAlertUpdate([newAlert, ...alerts]);
        }
      }
    }
  }, [recentMoods]);

  const activeAlerts = alerts.filter(alert => alert.isActive);

  return (
    <div className="space-y-6">
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>Crisis Alert - {alert.severity.toUpperCase()}</span>
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
              </AlertTitle>
              <AlertDescription>
                <div className="space-y-3">
                  <p>{alert.message}</p>
                  <div>
                    <h4 className="font-medium mb-2">Recommended Actions:</h4>
                    <ul className="space-y-1">
                      {alert.recommendedActions.map((action, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">
                      <Phone className="h-4 w-4 mr-1" />
                      Call 988
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Crisis Detection & Support
          </CardTitle>
          <CardDescription>
            AI-powered early warning system for emotional crises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🤖 How It Works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Monitors mood patterns continuously</li>
                <li>• Detects crisis language in text</li>
                <li>• Provides immediate support resources</li>
                <li>• Connects you with emergency services</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">⚡ Immediate Help</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• 24/7 crisis hotlines available</li>
                <li>• Text-based support options</li>
                <li>• Emergency services integration</li>
                <li>• Professional resource connections</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Test Crisis Phrase Detection</h4>
            <div className="space-y-3">
              <textarea
                value={detectedText}
                onChange={(e) => setDetectedText(e.target.value)}
                placeholder="Type here to test crisis phrase detection..."
                className="w-full p-3 border rounded-lg resize-none h-20"
              />
              <Button onClick={handleTextAnalysis} disabled={!detectedText.trim()}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Analyze Text
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>
            Immediate support resources available 24/7
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    contact.type === 'crisis' ? 'bg-red-100' :
                    contact.type === 'text' ? 'bg-blue-100' :
                    'bg-orange-100'
                  }`}>
                    {contact.type === 'crisis' ? <Heart className="h-5 w-5 text-red-600" /> :
                     contact.type === 'text' ? <MessageCircle className="h-5 w-5 text-blue-600" /> :
                     <Phone className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-lg font-mono">{contact.number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {contact.available}
                  </Badge>
                  <Button size="sm">
                    Call Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Planning</CardTitle>
          <CardDescription>
            Create your personal crisis response plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Warning Signs</h4>
              <p className="text-sm text-yellow-800">
                Recognize early warning signs like changes in sleep, appetite, social withdrawal, 
                increased substance use, or persistent negative thoughts.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🛡️ Coping Strategies</h4>
              <p className="text-sm text-green-800">
                Develop healthy coping mechanisms: deep breathing, progressive muscle relaxation, 
                grounding techniques, calling a friend, or engaging in a favorite activity.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📞 Support Network</h4>
              <p className="text-sm text-blue-800">
                Maintain a list of supportive people you can contact: friends, family members, 
                therapists, crisis hotlines, and other professional resources.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
