import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, AlertTriangle, Clock, Brain } from 'lucide-react';
import { Symptom } from '@/types/healthTwin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SymptomAnalysisResults } from './SymptomAnalysisResults';

interface SymptomCheckerProps {
  onSymptomAdd: (symptom: Symptom) => void;
  onAnalyze: (symptoms: Symptom[]) => void;
}

interface AnalysisResult {
  analysis: string;
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  recommendedActions: string[];
  disclaimer: string;
}

export function SymptomChecker({ onSymptomAdd, onAnalyze }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<Partial<Symptom>>({
    severity: 3,
    duration: '1-2 days'
  });
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const bodyParts = [
    'head', 'neck', 'chest', 'abdomen', 'back', 'left-arm', 'right-arm', 
    'left-leg', 'right-leg', 'hands', 'feet'
  ];

  const severityLabels = {
    1: 'Very Mild',
    2: 'Mild',
    3: 'Moderate',
    4: 'Severe',
    5: 'Very Severe'
  };

  const handleBodyClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setClickPosition({ x, y });
    
    // Determine body part based on click position
    let bodyPart = '';
    if (y < 20) bodyPart = 'head';
    else if (y < 30) bodyPart = 'neck';
    else if (y < 50) bodyPart = 'chest';
    else if (y < 70) bodyPart = 'abdomen';
    else if (y < 85) bodyPart = x < 50 ? 'left-leg' : 'right-leg';
    else bodyPart = 'feet';
    
    setSelectedBodyPart(bodyPart);
    setCurrentSymptom(prev => ({ 
      ...prev, 
      bodyPart, 
      location: { x, y } 
    }));
  };

  const addSymptom = () => {
    if (!currentSymptom.name || !currentSymptom.bodyPart) return;

    const symptom: Symptom = {
      id: `symptom_${Date.now()}`,
      name: currentSymptom.name || '',
      severity: currentSymptom.severity || 3,
      bodyPart: currentSymptom.bodyPart || '',
      duration: currentSymptom.duration || '',
      description: currentSymptom.description || '',
      location: currentSymptom.location || { x: 50, y: 50 }
    };

    setSymptoms(prev => [...prev, symptom]);
    onSymptomAdd(symptom);
    
    // Reset form
    setCurrentSymptom({ severity: 3, duration: '1-2 days' });
    setSelectedBodyPart('');
    setClickPosition(null);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const getSeverityColor = (severity: number) => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-yellow-500',
      3: 'bg-orange-500',
      4: 'bg-red-500',
      5: 'bg-red-700'
    };
    return colors[severity as keyof typeof colors];
  };

  const analyzeWithAI = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { symptoms }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error('Failed to analyze symptoms. Please try again.');
        return;
      }

      setAnalysisResult(data);
      onAnalyze(symptoms);
      toast.success('Symptom analysis completed');
    } catch (error) {
      console.error('Error calling analysis function:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show analysis results if available
  if (analysisResult) {
    return (
      <SymptomAnalysisResults 
        result={analysisResult}
        isLoading={isAnalyzing}
        onClose={() => setAnalysisResult(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            AI Symptom Checker
          </CardTitle>
          <CardDescription>
            Click on the body diagram to locate symptoms and get AI-powered health insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Body Diagram */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Body Diagram
              </h3>
              
              <div className="relative">
                <svg
                  viewBox="0 0 200 400"
                  className="w-full max-w-md mx-auto border rounded-lg cursor-crosshair bg-gray-50"
                  onClick={handleBodyClick}
                >
                  {/* Basic human figure */}
                  <g fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2">
                    {/* Head */}
                    <circle cx="100" cy="40" r="25" />
                    {/* Neck */}
                    <rect x="90" y="65" width="20" height="15" />
                    {/* Torso */}
                    <rect x="70" y="80" width="60" height="120" />
                    {/* Arms */}
                    <rect x="40" y="90" width="25" height="80" />
                    <rect x="135" y="90" width="25" height="80" />
                    {/* Legs */}
                    <rect x="75" y="200" width="20" height="120" />
                    <rect x="105" y="200" width="20" height="120" />
                    {/* Hands */}
                    <circle cx="52" cy="180" r="8" />
                    <circle cx="148" cy="180" r="8" />
                    {/* Feet */}
                    <ellipse cx="85" cy="330" rx="12" ry="8" />
                    <ellipse cx="115" cy="330" rx="12" ry="8" />
                  </g>
                  
                  {/* Symptom markers */}
                  {symptoms.map(symptom => (
                    <circle
                      key={symptom.id}
                      cx={symptom.location.x * 2}
                      cy={symptom.location.y * 4}
                      r="6"
                      className={`${getSeverityColor(symptom.severity)} opacity-80`}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                  
                  {/* Current click position */}
                  {clickPosition && (
                    <circle
                      cx={clickPosition.x * 2}
                      cy={clickPosition.y * 4}
                      r="8"
                      fill="blue"
                      opacity="0.7"
                      stroke="white"
                      strokeWidth="2"
                    />
                  )}
                </svg>
                
                <div className="text-center text-sm text-gray-600 mt-2">
                  Click on the body to pinpoint symptom location
                </div>
              </div>
            </div>

            {/* Symptom Input Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Add Symptom</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom-name">Symptom Name</Label>
                  <Input
                    id="symptom-name"
                    value={currentSymptom.name || ''}
                    onChange={(e) => setCurrentSymptom(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Headache, Chest pain, Nausea"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Body Part</Label>
                  <Select 
                    value={selectedBodyPart} 
                    onValueChange={(value) => {
                      setSelectedBodyPart(value);
                      setCurrentSymptom(prev => ({ ...prev, bodyPart: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body part or click on diagram" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodyParts.map(part => (
                        <SelectItem key={part} value={part}>
                          {part.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Severity: {severityLabels[currentSymptom.severity as keyof typeof severityLabels]}</Label>
                  <Slider
                    value={[currentSymptom.severity || 3]}
                    onValueChange={([value]) => setCurrentSymptom(prev => ({ ...prev, severity: value as 1 | 2 | 3 | 4 | 5 }))}
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Very Mild</span>
                    <span>Very Severe</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select 
                    value={currentSymptom.duration || ''} 
                    onValueChange={(value) => setCurrentSymptom(prev => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less than 1 hour">Less than 1 hour</SelectItem>
                      <SelectItem value="1-6 hours">1-6 hours</SelectItem>
                      <SelectItem value="6-24 hours">6-24 hours</SelectItem>
                      <SelectItem value="1-2 days">1-2 days</SelectItem>
                      <SelectItem value="3-7 days">3-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="more than 2 weeks">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={currentSymptom.description || ''}
                    onChange={(e) => setCurrentSymptom(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the symptom in more detail..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={addSymptom} 
                  className="w-full"
                  disabled={!currentSymptom.name || !currentSymptom.bodyPart}
                >
                  Add Symptom
                </Button>
              </div>
            </div>
          </div>

          {/* Current Symptoms List */}
          {symptoms.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Current Symptoms ({symptoms.length})
              </h3>
              
              <div className="space-y-2">
                {symptoms.map(symptom => (
                  <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${getSeverityColor(symptom.severity)}`}
                      />
                      <div>
                        <div className="font-medium">{symptom.name}</div>
                        <div className="text-sm text-gray-600">
                          {symptom.bodyPart.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} · 
                          {severityLabels[symptom.severity]} · {symptom.duration}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeSymptom(symptom.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                onClick={analyzeWithAI}
                className="w-full"
                size="lg"
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms with AI'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
