
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Activity,
  Shield,
  Clock
} from 'lucide-react';

interface OutcomeForecasting {
  id: string;
  patientName: string;
  condition: string;
  treatmentOption: string;
  successProbability: number;
  complicationRisk: number;
  recoveryTime: string;
  costEffectiveness: number;
  qualityOfLifeScore: number;
  evidenceQuality: 'high' | 'moderate' | 'low';
  riskFactors: string[];
  benefits: string[];
  alternatives: string[];
  recommendation: string;
  confidenceInterval: string;
}

const mockForecasts: OutcomeForecasting[] = [
  {
    id: 'OF001',
    patientName: 'David Miller',
    condition: 'Coronary Artery Disease',
    treatmentOption: 'Percutaneous Coronary Intervention (PCI)',
    successProbability: 92,
    complicationRisk: 8,
    recoveryTime: '2-4 weeks',
    costEffectiveness: 85,
    qualityOfLifeScore: 88,
    evidenceQuality: 'high',
    riskFactors: ['Diabetes', 'Hypertension', 'Age > 65'],
    benefits: ['Immediate symptom relief', 'Reduced risk of MI', 'Improved exercise tolerance'],
    alternatives: ['Medical management', 'CABG surgery'],
    recommendation: 'Proceed with PCI given high success probability and patient preferences',
    confidenceInterval: '88-96%'
  },
  {
    id: 'OF002',
    patientName: 'Lisa Thompson',
    condition: 'Breast Cancer (Stage II)',
    treatmentOption: 'Neoadjuvant Chemotherapy + Surgery',
    successProbability: 78,
    complicationRisk: 22,
    recoveryTime: '6-8 months',
    costEffectiveness: 72,
    qualityOfLifeScore: 71,
    evidenceQuality: 'high',
    riskFactors: ['HER2-positive', 'Lymph node involvement'],
    benefits: ['Tumor shrinkage', 'Improved surgical outcomes', 'Systemic treatment'],
    alternatives: ['Surgery first', 'Targeted therapy alone'],
    recommendation: 'Neoadjuvant approach recommended based on tumor characteristics',
    confidenceInterval: '72-84%'
  }
];

export const OutcomeForecastingPanel = () => {
  const [forecasts] = useState<OutcomeForecasting[]>(mockForecasts);
  const [selectedForecast, setSelectedForecast] = useState<OutcomeForecasting | null>(null);

  const getEvidenceColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSuccessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageSuccessRate = forecasts.reduce((sum, forecast) => sum + forecast.successProbability, 0) / forecasts.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Outcome Forecasting Panel
          </CardTitle>
          <CardDescription>
            Treatment success probabilities with risk-benefit analysis and decision support tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{averageSuccessRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Avg Success Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{forecasts.length}</p>
                    <p className="text-sm text-gray-600">Active Forecasts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-gray-600">Prediction Accuracy</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">87%</p>
                    <p className="text-sm text-gray-600">High Evidence</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Treatment Outcome Forecasts</h3>
              {forecasts.map((forecast) => (
                <Card 
                  key={forecast.id} 
                  className={`cursor-pointer transition-colors ${selectedForecast?.id === forecast.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedForecast(forecast)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{forecast.patientName}</h4>
                        <p className="text-sm text-gray-600">{forecast.condition}</p>
                        <p className="text-sm font-medium text-blue-600">{forecast.treatmentOption}</p>
                      </div>
                      <Badge className={getEvidenceColor(forecast.evidenceQuality)}>
                        {forecast.evidenceQuality.toUpperCase()} EVIDENCE
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Success Probability</span>
                        <span className={`text-sm font-bold ${getSuccessColor(forecast.successProbability)}`}>
                          {forecast.successProbability}%
                        </span>
                      </div>
                      <Progress value={forecast.successProbability} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span>Risk: {forecast.complicationRisk}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>Recovery: {forecast.recoveryTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span>QoL: {forecast.qualityOfLifeScore}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedForecast ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedForecast.patientName} - Outcome Analysis</CardTitle>
                    <CardDescription>{selectedForecast.condition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Success Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Success Rate: <strong className={getSuccessColor(selectedForecast.successProbability)}>{selectedForecast.successProbability}%</strong></p>
                            <p>Confidence: <strong>{selectedForecast.confidenceInterval}</strong></p>
                            <p>Complication Risk: <strong>{selectedForecast.complicationRisk}%</strong></p>
                            <p>Recovery Time: <strong>{selectedForecast.recoveryTime}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Quality Scores</h4>
                          <div className="space-y-1 text-sm">
                            <p>Quality of Life: <strong>{selectedForecast.qualityOfLifeScore}%</strong></p>
                            <p>Cost Effectiveness: <strong>{selectedForecast.costEffectiveness}%</strong></p>
                            <p>Evidence Quality: <strong className="capitalize">{selectedForecast.evidenceQuality}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Treatment Option</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{selectedForecast.treatmentOption}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Expected Benefits</h4>
                        <ul className="space-y-1">
                          {selectedForecast.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {selectedForecast.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedForecast.alternatives.map((alt, index) => (
                            <Badge key={index} variant="outline">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendation</h4>
                        <p className="text-sm bg-green-50 p-3 rounded">{selectedForecast.recommendation}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept Recommendation
                        </Button>
                        <Button variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Compare Options
                        </Button>
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Update Forecast
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an outcome forecast to view detailed analysis</p>
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
