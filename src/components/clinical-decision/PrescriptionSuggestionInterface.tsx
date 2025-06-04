
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Pill, 
  AlertTriangle, 
  Shield, 
  Clock, 
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface PrescriptionSuggestion {
  id: string;
  patientName: string;
  condition: string;
  suggestedMedication: string;
  dosage: string;
  duration: string;
  confidenceScore: number;
  interactions: string[];
  allergies: string[];
  alternatives: string[];
  reasons: string[];
  contraindications: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}

const mockPrescriptionSuggestions: PrescriptionSuggestion[] = [
  {
    id: 'PS001',
    patientName: 'Sarah Johnson',
    condition: 'Hypertension',
    suggestedMedication: 'Lisinopril',
    dosage: '10mg daily',
    duration: 'Long-term',
    confidenceScore: 92,
    interactions: [],
    allergies: [],
    alternatives: ['Enalapril', 'Ramipril'],
    reasons: [
      'First-line ACE inhibitor for hypertension',
      'Good efficacy profile for patient age',
      'Compatible with current medications'
    ],
    contraindications: [],
    riskLevel: 'low'
  },
  {
    id: 'PS002',
    patientName: 'Michael Chen',
    condition: 'Type 2 Diabetes',
    suggestedMedication: 'Metformin',
    dosage: '500mg twice daily',
    duration: 'Long-term',
    confidenceScore: 88,
    interactions: ['Warfarin - Monitor INR closely'],
    allergies: [],
    alternatives: ['Sitagliptin', 'Empagliflozin'],
    reasons: [
      'First-line therapy for T2DM',
      'Weight neutral or weight loss',
      'Cardiovascular benefits'
    ],
    contraindications: ['Monitor renal function'],
    riskLevel: 'moderate'
  }
];

export const PrescriptionSuggestionInterface = () => {
  const [prescriptionSuggestions] = useState<PrescriptionSuggestion[]>(mockPrescriptionSuggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PrescriptionSuggestion | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Prescription Suggestion Interface
          </CardTitle>
          <CardDescription>
            AI-powered medication recommendations with drug interaction analysis and safety alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Pill className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">24</p>
                    <p className="text-sm text-gray-600">Prescriptions Today</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">3</p>
                    <p className="text-sm text-gray-600">Interaction Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">96.8%</p>
                    <p className="text-sm text-gray-600">Safety Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-sm text-gray-600">Allergy Checks</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Prescription Suggestions</h3>
              {prescriptionSuggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id} 
                  className={`cursor-pointer transition-colors ${selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-blue-500' : ''} border-l-4 ${suggestion.riskLevel === 'high' ? 'border-l-red-500' : suggestion.riskLevel === 'moderate' ? 'border-l-yellow-400' : 'border-l-green-400'}`}
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{suggestion.patientName}</h4>
                        <p className="text-sm text-gray-600">{suggestion.condition}</p>
                        <p className="text-sm font-medium text-blue-600">{suggestion.suggestedMedication}</p>
                      </div>
                      <Badge className={getRiskColor(suggestion.riskLevel)}>
                        {suggestion.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Dosage: {suggestion.dosage}</span>
                        <span>Duration: {suggestion.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className="text-sm font-bold">{suggestion.confidenceScore}%</span>
                      </div>
                      <Progress value={suggestion.confidenceScore} className="h-2" />
                      
                      {suggestion.interactions.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{suggestion.interactions.length} interaction(s)</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSuggestion ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSuggestion.patientName} - Prescription Details</CardTitle>
                    <CardDescription>{selectedSuggestion.suggestedMedication} for {selectedSuggestion.condition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Prescription Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Medication: <strong>{selectedSuggestion.suggestedMedication}</strong></p>
                            <p>Dosage: {selectedSuggestion.dosage}</p>
                            <p>Duration: {selectedSuggestion.duration}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Safety Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong>{selectedSuggestion.confidenceScore}%</strong></p>
                            <p>Risk Level: <span className="capitalize">{selectedSuggestion.riskLevel}</span></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Clinical Rationale</h4>
                        <ul className="space-y-1">
                          {selectedSuggestion.reasons.map((reason, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedSuggestion.interactions.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Drug Interactions</h4>
                          <ul className="space-y-1">
                            {selectedSuggestion.interactions.map((interaction, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                {interaction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedSuggestion.contraindications.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-orange-600">Contraindications & Monitoring</h4>
                          <ul className="space-y-1">
                            {selectedSuggestion.contraindications.map((contra, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-orange-600">
                                <Info className="h-3 w-3" />
                                {contra}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSuggestion.alternatives.map((alt, index) => (
                            <Badge key={index} variant="outline">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Pill className="h-4 w-4 mr-1" />
                          Prescribe
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Modify Dosage
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Select Alternative
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a prescription suggestion to view detailed analysis</p>
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
