
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, Clock, Phone, FileText } from 'lucide-react';

interface AnalysisResult {
  analysis: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  recommendedActions: string[];
  disclaimer: string;
}

interface SymptomAnalysisResultsProps {
  result: AnalysisResult;
  isLoading: boolean;
  onClose: () => void;
}

export function SymptomAnalysisResults({ result, isLoading, onClose }: SymptomAnalysisResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 animate-pulse" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>
            Our AI is analyzing your symptoms...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'emergency': return <Phone className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              AI Symptom Analysis
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <CardDescription>
            AI-powered analysis of your reported symptoms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgency Level */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Urgency Level:</span>
            <Badge className={`${getUrgencyColor(result.urgencyLevel)} flex items-center gap-1`}>
              {getUrgencyIcon(result.urgencyLevel)}
              {result.urgencyLevel.toUpperCase()}
            </Badge>
          </div>

          {/* Emergency Alert */}
          {result.urgencyLevel === 'emergency' && (
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 font-medium">
                Your symptoms may require immediate medical attention. Please seek emergency care.
              </AlertDescription>
            </Alert>
          )}

          {/* AI Analysis */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Analysis & Insights</h3>
            <div className="prose prose-sm max-w-none">
              {result.analysis.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-3 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Recommended Actions</h3>
            <ul className="space-y-2">
              {result.recommendedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {result.disclaimer}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
