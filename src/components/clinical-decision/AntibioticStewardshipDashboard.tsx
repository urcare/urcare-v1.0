
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  XCircle,
  Zap,
  Microscope
} from 'lucide-react';

interface AntibioticRecommendation {
  id: string;
  patientName: string;
  infection: string;
  currentAntibiotic: string;
  recommendedAction: 'continue' | 'de-escalate' | 'escalate' | 'stop' | 'switch';
  recommendation: string;
  resistanceRisk: number;
  durationOptimal: string;
  currentDuration: string;
  cultures: {
    organism: string;
    sensitivity: string;
    resistance: string[];
  }[];
  alternativeOptions: string[];
  stewardshipScore: number;
}

const mockAntibioticRecommendations: AntibioticRecommendation[] = [
  {
    id: 'AR001',
    patientName: 'David Kim',
    infection: 'Community-acquired pneumonia',
    currentAntibiotic: 'Ceftriaxone 1g IV daily',
    recommendedAction: 'de-escalate',
    recommendation: 'Switch to oral amoxicillin 875mg BID based on clinical improvement',
    resistanceRisk: 15,
    durationOptimal: '5-7 days',
    currentDuration: '3 days',
    cultures: [
      {
        organism: 'Streptococcus pneumoniae',
        sensitivity: 'Penicillin sensitive',
        resistance: []
      }
    ],
    alternativeOptions: ['Amoxicillin', 'Azithromycin'],
    stewardshipScore: 92
  },
  {
    id: 'AR002',
    patientName: 'Nancy Wilson',
    infection: 'Complicated UTI',
    currentAntibiotic: 'Ciprofloxacin 400mg IV BID',
    recommendedAction: 'switch',
    recommendation: 'Switch to ceftriaxone due to high local fluoroquinolone resistance',
    resistanceRisk: 78,
    durationOptimal: '7-10 days',
    currentDuration: '2 days',
    cultures: [
      {
        organism: 'E. coli',
        sensitivity: 'Ceftriaxone sensitive',
        resistance: ['Ciprofloxacin', 'Trimethoprim-sulfamethoxazole']
      }
    ],
    alternativeOptions: ['Ceftriaxone', 'Ertapenem'],
    stewardshipScore: 68
  }
];

export const AntibioticStewardshipDashboard = () => {
  const [antibioticRecommendations] = useState<AntibioticRecommendation[]>(mockAntibioticRecommendations);
  const [selectedRecommendation, setSelectedRecommendation] = useState<AntibioticRecommendation | null>(null);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'continue': return 'bg-green-500 text-white';
      case 'de-escalate': return 'bg-blue-500 text-white';
      case 'escalate': return 'bg-yellow-500 text-white';
      case 'stop': return 'bg-gray-500 text-white';
      case 'switch': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getResistanceColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStewardshipColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Antibiotic Stewardship Dashboard
          </CardTitle>
          <CardDescription>
            AI-powered antibiotic optimization with resistance monitoring and stewardship recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">34</p>
                    <p className="text-sm text-gray-600">Active Prescriptions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">8</p>
                    <p className="text-sm text-gray-600">High Resistance Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">23%</p>
                    <p className="text-sm text-gray-600">Resistance Reduction</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">5.2</p>
                    <p className="text-sm text-gray-600">Avg. Duration (days)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stewardship Recommendations</h3>
              {antibioticRecommendations.map((recommendation) => (
                <Card 
                  key={recommendation.id} 
                  className={`cursor-pointer transition-colors ${selectedRecommendation?.id === recommendation.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${recommendation.resistanceRisk >= 70 ? 'border-l-red-500' : recommendation.resistanceRisk >= 40 ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                  onClick={() => setSelectedRecommendation(recommendation)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{recommendation.patientName}</h4>
                        <p className="text-sm text-gray-600">{recommendation.infection}</p>
                        <p className="text-sm font-medium text-blue-600">{recommendation.currentAntibiotic}</p>
                      </div>
                      <Badge className={getActionColor(recommendation.recommendedAction)}>
                        {recommendation.recommendedAction.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Resistance Risk:</span>
                          <span className={`font-bold ml-1 ${getResistanceColor(recommendation.resistanceRisk)}`}>
                            {recommendation.resistanceRisk}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-bold ml-1">{recommendation.currentDuration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Stewardship Score</span>
                        <span className={`text-sm font-bold ${getStewardshipColor(recommendation.stewardshipScore)}`}>
                          {recommendation.stewardshipScore}/100
                        </span>
                      </div>
                      <Progress value={recommendation.stewardshipScore} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Microscope className="h-3 w-3 text-blue-500" />
                          <span>{recommendation.cultures.length} culture(s)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-green-500" />
                          <span>{recommendation.alternativeOptions.length} alternatives</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedRecommendation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedRecommendation.patientName} - Stewardship Analysis</CardTitle>
                    <CardDescription>{selectedRecommendation.infection}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Treatment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Antibiotic: <strong>{selectedRecommendation.currentAntibiotic}</strong></p>
                            <p>Duration: {selectedRecommendation.currentDuration}</p>
                            <p>Optimal: {selectedRecommendation.durationOptimal}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Resistance Risk: <span className={getResistanceColor(selectedRecommendation.resistanceRisk)}>{selectedRecommendation.resistanceRisk}%</span></p>
                            <p>Stewardship Score: <span className={getStewardshipColor(selectedRecommendation.stewardshipScore)}>{selectedRecommendation.stewardshipScore}/100</span></p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <h4 className="font-medium mb-1 flex items-center gap-2">
                          <Badge className={getActionColor(selectedRecommendation.recommendedAction)}>
                            {selectedRecommendation.recommendedAction.toUpperCase()}
                          </Badge>
                          AI Recommendation
                        </h4>
                        <p className="text-sm">{selectedRecommendation.recommendation}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Culture Results</h4>
                        <div className="space-y-2">
                          {selectedRecommendation.cultures.map((culture, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <Microscope className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-sm">{culture.organism}</span>
                              </div>
                              <p className="text-xs text-green-600 mb-1">✓ {culture.sensitivity}</p>
                              {culture.resistance.length > 0 && (
                                <div className="text-xs text-red-600">
                                  ✗ Resistant to: {culture.resistance.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecommendation.alternativeOptions.map((alt, index) => (
                            <Badge key={index} variant="outline">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Apply Recommendation
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-4 w-4 mr-1" />
                          Override with Justification
                        </Button>
                        <Button size="sm" variant="outline">
                          <Microscope className="h-4 w-4 mr-1" />
                          Order Additional Cultures
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an antibiotic recommendation to view detailed stewardship analysis</p>
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
