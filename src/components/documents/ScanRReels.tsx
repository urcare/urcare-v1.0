
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, FileText } from 'lucide-react';

interface ReelDocument {
  id: string;
  name: string;
  category: string;
  summary: string;
  keyPoints: string[];
  previewImage: string;
  audioNarration?: string;
  duration: number; // in seconds
}

// Sample reel documents
const sampleReels: ReelDocument[] = [
  {
    id: '1',
    name: 'Blood Test Results Summary',
    category: 'Lab Results',
    summary: 'Your recent blood work shows excellent glucose control with HbA1c at 6.8%. Cholesterol levels are within target range.',
    keyPoints: [
      'HbA1c: 6.8% (Target: <7%)',
      'Cholesterol: 185 mg/dL (Normal)',
      'Kidney function: Normal',
      'Continue current medication'
    ],
    previewImage: '/api/placeholder/300/400',
    duration: 45
  },
  {
    id: '2',
    name: 'Chest X-Ray Analysis',
    category: 'Imaging',
    summary: 'Clear chest X-ray with no signs of infection or abnormalities. Heart size normal, lung fields clear.',
    keyPoints: [
      'No acute findings',
      'Heart size: Normal',
      'Lung fields: Clear',
      'No pneumonia signs'
    ],
    previewImage: '/api/placeholder/300/400',
    duration: 30
  },
  {
    id: '3',
    name: 'Prescription Update',
    category: 'Medications',
    summary: 'Updated prescription for Metformin. Dosage increased to 1000mg twice daily for better glucose control.',
    keyPoints: [
      'Metformin: 1000mg twice daily',
      'Take with meals',
      'Monitor for side effects',
      'Next review: 3 months'
    ],
    previewImage: '/api/placeholder/300/400',
    duration: 35
  }
];

export const ScanRReels = () => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentReel = sampleReels[currentReelIndex];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentReel.duration) {
            // Auto-advance to next reel
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentReel.duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentReelIndex((prev) => (prev + 1) % sampleReels.length);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentReelIndex((prev) => (prev - 1 + sampleReels.length) % sampleReels.length);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / currentReel.duration) * 100;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ScanR Reels
        </CardTitle>
        <CardDescription>
          Quick document review in bite-sized summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Preview */}
        <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={currentReel.previewImage} 
            alt={currentReel.name}
            className="w-full h-full object-cover"
          />
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="rounded-full w-16 h-16"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}
        </div>

        {/* Document Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{currentReel.category}</Badge>
            <span className="text-sm text-gray-500">
              {formatTime(currentTime)} / {formatTime(currentReel.duration)}
            </span>
          </div>
          
          <h3 className="font-semibold">{currentReel.name}</h3>
          <p className="text-sm text-gray-600">{currentReel.summary}</p>
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Points:</h4>
          <ul className="space-y-1">
            {currentReel.keyPoints.map((point, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-blue-500 mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button size="sm" variant="ghost" onClick={handlePrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button size="sm" onClick={handlePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button size="sm" variant="ghost" onClick={handleNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Reel Navigation */}
        <div className="flex justify-center gap-1">
          {sampleReels.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentReelIndex(index);
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentReelIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
