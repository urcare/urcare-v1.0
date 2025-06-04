
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Play,
  Pause,
  Volume2,
  Brain,
  Heart,
  Activity
} from 'lucide-react';

interface VoiceAnalysis {
  id: string;
  patientId: string;
  patientName: string;
  recordingDate: string;
  duration: number;
  emotionalState: 'positive' | 'neutral' | 'negative' | 'distressed' | 'angry';
  sentimentScore: number;
  stressLevel: number;
  confidenceLevel: number;
  keyEmotions: string[];
  escalationRisk: 'low' | 'medium' | 'high' | 'critical';
  transcript: string;
  recommendations: string[];
}

interface CommunicationOptimization {
  id: string;
  patientId: string;
  preferredTone: string;
  effectiveCommunication: string[];
  avoidanceFactors: string[];
  optimalTiming: string;
  responseStrategy: string;
}

const mockAnalyses: VoiceAnalysis[] = [
  {
    id: 'VA001',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    recordingDate: '2024-01-20 14:30',
    duration: 180,
    emotionalState: 'neutral',
    sentimentScore: 72,
    stressLevel: 35,
    confidenceLevel: 89,
    keyEmotions: ['calm', 'focused', 'slightly concerned'],
    escalationRisk: 'low',
    transcript: 'I\'ve been taking my medication as prescribed, but I\'m a bit worried about the side effects...',
    recommendations: ['Acknowledge concerns', 'Provide reassurance', 'Schedule follow-up']
  },
  {
    id: 'VA002',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    recordingDate: '2024-01-20 15:45',
    duration: 95,
    emotionalState: 'distressed',
    sentimentScore: 28,
    stressLevel: 78,
    confidenceLevel: 92,
    keyEmotions: ['frustrated', 'anxious', 'overwhelmed'],
    escalationRisk: 'high',
    transcript: 'This pain is getting worse and nothing seems to help. I don\'t know what to do anymore...',
    recommendations: ['Immediate support', 'Pain management review', 'Mental health consultation']
  },
  {
    id: 'VA003',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    recordingDate: '2024-01-20 16:20',
    duration: 240,
    emotionalState: 'positive',
    sentimentScore: 85,
    stressLevel: 20,
    confidenceLevel: 87,
    keyEmotions: ['grateful', 'hopeful', 'determined'],
    escalationRisk: 'low',
    transcript: 'I really appreciate all the support. I\'m feeling much better and looking forward to my next session...',
    recommendations: ['Positive reinforcement', 'Continue current approach', 'Celebrate progress']
  }
];

const mockOptimizations: CommunicationOptimization[] = [
  {
    id: 'CO001',
    patientId: 'P2847',
    preferredTone: 'Professional but warm',
    effectiveCommunication: ['Clear explanations', 'Visual aids', 'Written summaries'],
    avoidanceFactors: ['Medical jargon', 'Rushed conversations', 'Interruptions'],
    optimalTiming: 'Morning appointments',
    responseStrategy: 'Acknowledge concerns first, then provide information'
  },
  {
    id: 'CO002',
    patientId: 'P1932',
    preferredTone: 'Empathetic and patient',
    effectiveCommunication: ['Active listening', 'Validation', 'Step-by-step guidance'],
    avoidanceFactors: ['Dismissive language', 'Time pressure', 'Complex instructions'],
    optimalTiming: 'Afternoon when less stressed',
    responseStrategy: 'Lead with empathy, focus on immediate relief options'
  }
];

export const VoiceEmotionAnalysis = () => {
  const [analyses] = useState<VoiceAnalysis[]>(mockAnalyses);
  const [optimizations] = useState<CommunicationOptimization[]>(mockOptimizations);
  const [selectedAnalysis, setSelectedAnalysis] = useState<VoiceAnalysis | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const getEmotionalStateColor = (state: string) => {
    switch (state) {
      case 'positive': return 'text-green-600';
      case 'neutral': return 'text-blue-600';
      case 'negative': return 'text-orange-600';
      case 'distressed': return 'text-red-600';
      case 'angry': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getEscalationColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (score >= 40) return <Activity className="h-4 w-4 text-blue-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getOptimization = (patientId: string) => {
    return optimizations.find(opt => opt.patientId === patientId);
  };

  const togglePlayback = (analysisId: string) => {
    setIsPlaying(isPlaying === analysisId ? null : analysisId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Emotion Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Sentiment tracking, escalation alerts, and communication optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <Mic className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{analyses.length}</p>
                  <p className="text-sm text-gray-600">Analyses</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {analyses.filter(a => a.escalationRisk === 'high' || a.escalationRisk === 'critical').length}
                  </p>
                  <p className="text-sm text-gray-600">High Risk</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-green-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(analyses.reduce((sum, a) => sum + a.sentimentScore, 0) / analyses.length)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Sentiment</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(analyses.reduce((sum, a) => sum + a.confidenceLevel, 0) / analyses.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Confidence</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Voice Analyses</h3>
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className={`cursor-pointer transition-colors ${selectedAnalysis?.id === analysis.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-purple-400`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{analysis.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">ID: {analysis.patientId}</p>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4" />
                          <span className="text-sm font-medium">{analysis.duration}s recording</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getEscalationColor(analysis.escalationRisk)}>
                          {analysis.escalationRisk.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getEmotionalStateColor(analysis.emotionalState)}`}>
                            {analysis.emotionalState}
                          </p>
                          <p className="text-xs text-gray-500">Emotional State</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Sentiment Score</span>
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(analysis.sentimentScore)}
                          <span className="font-bold">{analysis.sentimentScore}%</span>
                        </div>
                      </div>
                      <Progress value={analysis.sentimentScore} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Stress Level</span>
                        <span className="font-bold text-orange-600">{analysis.stressLevel}%</span>
                      </div>
                      <Progress value={analysis.stressLevel} className="h-2 bg-orange-100" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayback(analysis.id);
                            }}
                          >
                            {isPlaying === analysis.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <span className="text-gray-500">{analysis.recordingDate}</span>
                        </div>
                        <span className="font-medium">{analysis.confidenceLevel}% confidence</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedAnalysis ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAnalysis.patientName} - Voice Analysis</CardTitle>
                    <CardDescription>Detailed emotion analysis and communication recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Emotional Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>State: <strong className={getEmotionalStateColor(selectedAnalysis.emotionalState)}>
                              {selectedAnalysis.emotionalState}
                            </strong></p>
                            <p>Sentiment: <strong>{selectedAnalysis.sentimentScore}%</strong></p>
                            <p>Stress: <strong>{selectedAnalysis.stressLevel}%</strong></p>
                            <p>Confidence: <strong>{selectedAnalysis.confidenceLevel}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Escalation Risk: <strong className={
                              selectedAnalysis.escalationRisk === 'high' || selectedAnalysis.escalationRisk === 'critical' 
                                ? 'text-red-600' : selectedAnalysis.escalationRisk === 'medium' 
                                ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {selectedAnalysis.escalationRisk}
                            </strong></p>
                            <p>Duration: <strong>{selectedAnalysis.duration}s</strong></p>
                            <p>Recorded: <strong>{selectedAnalysis.recordingDate}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Emotions Detected</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAnalysis.keyEmotions.map((emotion, index) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Transcript</h4>
                        <p className="text-sm text-gray-700 italic">"{selectedAnalysis.transcript}"</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <div className="space-y-2">
                          {selectedAnalysis.recommendations.map((rec, index) => (
                            <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-700">{rec}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {getOptimization(selectedAnalysis.patientId) && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium mb-2">Communication Optimization</h4>
                          <div className="text-sm space-y-1">
                            <p>Preferred Tone: <strong>{getOptimization(selectedAnalysis.patientId)?.preferredTone}</strong></p>
                            <p>Optimal Timing: <strong>{getOptimization(selectedAnalysis.patientId)?.optimalTiming}</strong></p>
                            <p>Strategy: <strong>{getOptimization(selectedAnalysis.patientId)?.responseStrategy}</strong></p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button>
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Create Alert
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Send Support
                        </Button>
                        <Button variant="outline">
                          <Brain className="h-4 w-4 mr-1" />
                          Analyze Trends
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a voice analysis to view detailed emotion insights and recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
