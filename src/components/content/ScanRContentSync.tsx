
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, BookMarked, FileText, Zap, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface ScanRContent {
  id: string;
  title: string;
  description: string;
  documentSource: string;
  insights: string[];
  aiGenerated: boolean;
  duration: number;
  category: string;
  relevanceScore: number;
}

interface Props {
  onBookmark: (contentId: string) => void;
}

const sampleScanRContent: ScanRContent[] = [
  {
    id: 'scanr-1',
    title: 'Your Blood Test Results Explained',
    description: 'AI-generated summary of your recent lab work with key insights',
    documentSource: 'Blood Test - Jan 15, 2024',
    insights: [
      'HbA1c improved by 0.3% since last test',
      'Vitamin D levels are optimal',
      'Consider discussing iron levels with doctor'
    ],
    aiGenerated: true,
    duration: 45,
    category: 'Lab Results',
    relevanceScore: 98
  },
  {
    id: 'scanr-2',
    title: 'Medication Interaction Alert',
    description: 'Important information about your current prescriptions',
    documentSource: 'Prescription Update - Jan 10, 2024',
    insights: [
      'No significant interactions detected',
      'Take Metformin with food',
      'Monitor for side effects'
    ],
    aiGenerated: true,
    duration: 30,
    category: 'Medications',
    relevanceScore: 94
  },
  {
    id: 'scanr-3',
    title: 'Chest X-Ray Follow-up',
    description: 'Detailed explanation of your imaging results',
    documentSource: 'Chest X-Ray - Jan 5, 2024',
    insights: [
      'Clear lung fields',
      'No acute findings',
      'Regular monitoring recommended'
    ],
    aiGenerated: true,
    duration: 35,
    category: 'Imaging',
    relevanceScore: 87
  }
];

export const ScanRContentSync = ({ onBookmark }: Props) => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const handlePlayContent = (contentId: string) => {
    setSelectedContent(contentId);
    toast.success('Starting ScanR Reel...');
    // In a real app, this would launch the reel player
  };

  const handleGenerateMore = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'AI analyzing your recent documents...',
        success: 'New ScanR content generated!',
        error: 'Failed to generate content'
      }
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            ScanR Content Sync
          </CardTitle>
          <CardDescription>
            AI-generated content based on your medical documents and records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Content Library</p>
              <p className="text-sm text-gray-600">
                {sampleScanRContent.length} AI-generated reels available
              </p>
            </div>
            <Button onClick={handleGenerateMore}>
              <Brain className="h-4 w-4 mr-2" />
              Generate More
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sampleScanRContent.map((content) => (
          <Card key={content.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{content.category}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {content.relevanceScore}% relevant
                    </Badge>
                    {content.aiGenerated && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onBookmark(content.id)}
                >
                  <BookMarked className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700">{content.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>Source: {content.documentSource}</span>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm">Key Insights:</p>
                <ul className="space-y-1">
                  {content.insights.map((insight, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{content.duration}s duration</span>
                </div>
                <Button 
                  onClick={() => handlePlayContent(content.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch ScanR Reel
                </Button>
              </div>
            </CardContent>

            {selectedContent === content.id && (
              <div className="absolute bottom-0 left-0 right-0">
                <Progress value={35} className="h-1 rounded-none" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
