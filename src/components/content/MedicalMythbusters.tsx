
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookMarked, X, Check, AlertTriangle, Lightbulb } from 'lucide-react';

interface MythBuster {
  id: string;
  myth: string;
  reality: string;
  explanation: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  relatedConditions: string[];
}

interface Props {
  onBookmark: (contentId: string) => void;
  bookmarkedItems: string[];
}

const mythBusters: MythBuster[] = [
  {
    id: 'myth-1',
    myth: 'Insulin causes weight gain, so I should avoid it',
    reality: 'Insulin is essential for diabetes management and weight can be controlled',
    explanation: 'While insulin can cause initial weight changes, proper dosing, diet, and exercise help maintain healthy weight. Avoiding insulin leads to dangerous blood sugar levels.',
    category: 'Diabetes',
    severity: 'critical',
    sources: ['American Diabetes Association', 'Mayo Clinic'],
    relatedConditions: ['Type 1 Diabetes', 'Type 2 Diabetes']
  },
  {
    id: 'myth-2',
    myth: 'All cholesterol is bad for your heart',
    reality: 'HDL (good) cholesterol actually protects your heart',
    explanation: 'Your body needs cholesterol to function. HDL cholesterol helps remove harmful LDL cholesterol from arteries. Focus on lowering LDL while maintaining healthy HDL levels.',
    category: 'Heart Health',
    severity: 'medium',
    sources: ['American Heart Association', 'Harvard Health'],
    relatedConditions: ['High Cholesterol', 'Heart Disease']
  },
  {
    id: 'myth-3',
    myth: 'Natural supplements are always safe',
    reality: 'Natural doesn\'t mean harmless - supplements can interact with medications',
    explanation: 'Many natural supplements can interfere with prescription medications or have side effects. Always consult your healthcare provider before starting any supplement.',
    category: 'Medications',
    severity: 'high',
    sources: ['FDA', 'WebMD'],
    relatedConditions: ['All Conditions']
  },
  {
    id: 'myth-4',
    myth: 'You should stop taking blood pressure medication once it normalizes',
    reality: 'Blood pressure medications work by being taken consistently',
    explanation: 'Stopping blood pressure medication typically causes blood pressure to return to high levels. These medications manage the condition but don\'t cure it.',
    category: 'Hypertension',
    severity: 'critical',
    sources: ['American Heart Association', 'CDC'],
    relatedConditions: ['Hypertension', 'Heart Disease']
  }
];

export const MedicalMythbusters = ({ onBookmark, bookmarkedItems }: Props) => {
  const [expandedMyth, setExpandedMyth] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical Mythbusters</CardTitle>
          <CardDescription>
            Evidence-based facts to dispel common health misconceptions
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {mythBusters.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(item.severity)}>
                      {getSeverityIcon(item.severity)}
                      <span className="ml-1 capitalize">{item.severity}</span>
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBookmark(item.id)}
                  className={bookmarkedItems.includes(item.id) ? 'text-blue-600' : ''}
                >
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Myth */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">Myth:</p>
                    <p className="text-red-700">{item.myth}</p>
                  </div>
                </div>
              </div>

              {/* Reality */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800">Reality:</p>
                    <p className="text-green-700">{item.reality}</p>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              {expandedMyth === item.id && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-3">
                    <p className="font-medium text-blue-800">Explanation:</p>
                    <p className="text-blue-700">{item.explanation}</p>
                    
                    <div className="space-y-2">
                      <p className="font-medium text-blue-800">Related Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.relatedConditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-blue-800">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.sources.map((source, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedMyth(
                  expandedMyth === item.id ? null : item.id
                )}
                className="w-full"
              >
                {expandedMyth === item.id ? 'Show Less' : 'Learn More'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
