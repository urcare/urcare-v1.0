
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Bandage, Search, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface FirstAidStep {
  id: number;
  instruction: string;
  warning?: string;
  tip?: string;
  illustration?: string;
}

interface FirstAidGuide {
  id: string;
  title: string;
  category: 'emergency' | 'common' | 'pediatric' | 'senior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeRequired: string;
  description: string;
  whenToUse: string[];
  whenToCall911: string[];
  supplies: string[];
  steps: FirstAidStep[];
}

export const FirstAidGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const firstAidGuides: FirstAidGuide[] = [
    {
      id: 'cpr',
      title: 'CPR (Cardiopulmonary Resuscitation)',
      category: 'emergency',
      severity: 'critical',
      timeRequired: '2-4 minutes',
      description: 'Life-saving technique for when someone has stopped breathing or their heart has stopped',
      whenToUse: [
        'Person is unconscious and not breathing',
        'No pulse can be detected',
        'Person is unresponsive to verbal and physical stimuli'
      ],
      whenToCall911: [
        'Immediately before starting CPR',
        'If available, ask someone else to call while you start CPR'
      ],
      supplies: ['None required', 'AED if available'],
      steps: [
        {
          id: 1,
          instruction: 'Check for responsiveness by tapping shoulders and shouting "Are you okay?"',
          illustration: '👤'
        },
        {
          id: 2,
          instruction: 'Call 911 immediately or have someone else call',
          warning: 'Time is critical - get help fast',
          illustration: '📞'
        },
        {
          id: 3,
          instruction: 'Place person on their back on a firm surface, tilt head back slightly',
          illustration: '🛏️'
        },
        {
          id: 4,
          instruction: 'Place heel of one hand on center of chest between nipples, other hand on top',
          illustration: '🤲'
        },
        {
          id: 5,
          instruction: 'Push hard and fast at least 2 inches deep, 100-120 compressions per minute',
          tip: 'Think of the beat of "Stayin\' Alive" by Bee Gees',
          illustration: '💓'
        },
        {
          id: 6,
          instruction: 'Give 30 compressions, then 2 rescue breaths. Continue until help arrives',
          illustration: '🫁'
        }
      ]
    },
    {
      id: 'choking',
      title: 'Choking Relief (Heimlich Maneuver)',
      category: 'emergency',
      severity: 'high',
      timeRequired: '1-2 minutes',
      description: 'Technique to dislodge objects blocking the airway',
      whenToUse: [
        'Person cannot speak, cough, or breathe',
        'Person is making the universal choking sign (hands to throat)',
        'Person is turning blue around lips or face'
      ],
      whenToCall911: [
        'If choking person becomes unconscious',
        'If Heimlich maneuver does not work after several attempts'
      ],
      supplies: ['None required'],
      steps: [
        {
          id: 1,
          instruction: 'Ask "Are you choking?" to confirm airway obstruction',
          illustration: '❓'
        },
        {
          id: 2,
          instruction: 'Stand behind the person and wrap your arms around their waist',
          illustration: '🤗'
        },
        {
          id: 3,
          instruction: 'Make a fist with one hand and place it above the navel',
          illustration: '👊'
        },
        {
          id: 4,
          instruction: 'Grasp fist with other hand and give quick upward thrusts',
          tip: 'Use firm, quick motions - not gradual pressure',
          illustration: '⬆️'
        },
        {
          id: 5,
          instruction: 'Continue until object is expelled or person becomes unconscious',
          warning: 'If person becomes unconscious, begin CPR',
          illustration: '🔄'
        }
      ]
    },
    {
      id: 'bleeding',
      title: 'Severe Bleeding Control',
      category: 'common',
      severity: 'high',
      timeRequired: '5-10 minutes',
      description: 'Steps to control heavy bleeding and prevent shock',
      whenToUse: [
        'Blood is spurting or flowing continuously',
        'Bleeding does not stop with direct pressure',
        'Large or deep wound'
      ],
      whenToCall911: [
        'Bleeding cannot be controlled',
        'Signs of shock appear',
        'Cut is very deep or large'
      ],
      supplies: ['Clean cloth or gauze', 'Bandages', 'Gloves if available'],
      steps: [
        {
          id: 1,
          instruction: 'Put on gloves or use barrier to protect yourself from blood',
          warning: 'Protect yourself from bloodborne pathogens',
          illustration: '🧤'
        },
        {
          id: 2,
          instruction: 'Apply direct pressure to wound with clean cloth',
          illustration: '🩹'
        },
        {
          id: 3,
          instruction: 'If blood soaks through, add more cloth but don\'t remove original',
          tip: 'Removing original cloth may disrupt clotting',
          illustration: '📚'
        },
        {
          id: 4,
          instruction: 'Elevate injured area above heart level if possible',
          illustration: '📈'
        },
        {
          id: 5,
          instruction: 'Apply pressure bandage to maintain pressure on wound',
          illustration: '🎗️'
        }
      ]
    },
    {
      id: 'burns',
      title: 'Burn Treatment',
      category: 'common',
      severity: 'medium',
      timeRequired: '10-15 minutes',
      description: 'Treatment for thermal, chemical, and electrical burns',
      whenToUse: [
        'Skin is red, blistered, or charred',
        'Person has been exposed to heat, chemicals, or electricity',
        'Pain or burning sensation at injury site'
      ],
      whenToCall911: [
        'Burns cover large area or multiple body parts',
        'Burns are on face, hands, feet, or genitals',
        'Chemical or electrical burns'
      ],
      supplies: ['Cool water', 'Clean cloth', 'Burn gel if available'],
      steps: [
        {
          id: 1,
          instruction: 'Remove person from heat source and ensure safety',
          warning: 'Do not touch electrical burns until power is off',
          illustration: '🔥'
        },
        {
          id: 2,
          instruction: 'Cool burn with lukewarm water for 10-20 minutes',
          tip: 'Avoid ice water which can cause more damage',
          illustration: '💧'
        },
        {
          id: 3,
          instruction: 'Remove jewelry and loose clothing from burned area',
          warning: 'Do not remove clothing stuck to skin',
          illustration: '💍'
        },
        {
          id: 4,
          instruction: 'Cover burn with sterile gauze or clean cloth',
          illustration: '🩹'
        },
        {
          id: 5,
          instruction: 'Do not break blisters or apply ice, butter, or ointments',
          warning: 'These can worsen the burn',
          illustration: '❌'
        }
      ]
    }
  ];

  const filteredGuides = firstAidGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedGuideData = selectedGuide ? firstAidGuides.find(g => g.id === selectedGuide) : null;

  if (selectedGuideData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-600" />
                  {selectedGuideData.title}
                </CardTitle>
                <CardDescription>{selectedGuideData.description}</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedGuide(null)}>
                Back to Guide List
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <Badge className={getSeverityColor(selectedGuideData.severity)}>
                  {selectedGuideData.severity.toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Severity</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{selectedGuideData.timeRequired}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Time Required</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center gap-1">
                  <Bandage className="h-4 w-4" />
                  <span className="font-medium">{selectedGuideData.supplies.length}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Supplies Needed</p>
              </div>
            </div>

            <Tabs defaultValue="when-to-use">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="when-to-use">When to Use</TabsTrigger>
                <TabsTrigger value="supplies">Supplies</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="emergency">Call 911</TabsTrigger>
              </TabsList>

              <TabsContent value="when-to-use" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">When to Use This Technique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGuideData.whenToUse.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplies" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Supplies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedGuideData.supplies.map((supply, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Bandage className="h-4 w-4 text-blue-600" />
                          <span>{supply}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <div className="space-y-4">
                  {selectedGuideData.steps.map((step) => (
                    <Card key={step.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                              {step.id}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="font-medium mb-2">{step.instruction}</p>
                                {step.warning && (
                                  <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 mb-2">
                                    <div className="flex items-center gap-1">
                                      <AlertTriangle className="h-4 w-4" />
                                      <strong>Warning:</strong> {step.warning}
                                    </div>
                                  </div>
                                )}
                                {step.tip && (
                                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                    <strong>Tip:</strong> {step.tip}
                                  </div>
                                )}
                              </div>
                              {step.illustration && (
                                <div className="text-3xl">{step.illustration}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">When to Call 911</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedGuideData.whenToCall911.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                          <span className="text-red-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-600" />
            Offline First Aid Guide
          </CardTitle>
          <CardDescription>
            Step-by-step emergency medical procedures with illustrations - works offline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search first aid procedures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'emergency' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('emergency')}
              >
                Emergency
              </Button>
              <Button
                variant={selectedCategory === 'common' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('common')}
              >
                Common
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription className="mt-1">{guide.description}</CardDescription>
                    </div>
                    <Badge className={getSeverityColor(guide.severity)}>
                      {guide.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{guide.timeRequired}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bandage className="h-4 w-4" />
                      <span>{guide.steps.length} steps</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedGuide(guide.id)}
                    className="w-full"
                  >
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No first aid guides found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Important Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 text-sm">
            This guide provides basic first aid information and should not replace professional medical training. 
            Always call emergency services for serious injuries or when in doubt. Consider taking a certified 
            first aid course for comprehensive training.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
