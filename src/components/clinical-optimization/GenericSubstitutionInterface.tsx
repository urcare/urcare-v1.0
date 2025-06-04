
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Pill, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Shield,
  Calculator
} from 'lucide-react';

interface GenericSubstitution {
  id: string;
  patientName: string;
  brandMedication: string;
  genericAlternative: string;
  brandCost: number;
  genericCost: number;
  monthlySavings: number;
  yearlyProjection: number;
  therapeuticEquivalence: number;
  bioequivalence: string;
  fdaApproval: boolean;
  contraindications: string[];
  patientFactors: string[];
  pharmacistNotes: string;
  confidenceScore: number;
}

const mockSubstitutions: GenericSubstitution[] = [
  {
    id: 'GS001',
    patientName: 'Sarah Johnson',
    brandMedication: 'Lipitor 20mg (Atorvastatin)',
    genericAlternative: 'Generic Atorvastatin 20mg',
    brandCost: 180,
    genericCost: 25,
    monthlySavings: 155,
    yearlyProjection: 1860,
    therapeuticEquivalence: 98,
    bioequivalence: 'AB-rated',
    fdaApproval: true,
    contraindications: [],
    patientFactors: ['Stable on current therapy', 'Good medication adherence'],
    pharmacistNotes: 'Excellent candidate for generic substitution. No issues expected.',
    confidenceScore: 96
  },
  {
    id: 'GS002',
    patientName: 'Michael Chen',
    brandMedication: 'Nexium 40mg (Esomeprazole)',
    genericAlternative: 'Generic Esomeprazole 40mg',
    brandCost: 240,
    genericCost: 45,
    monthlySavings: 195,
    yearlyProjection: 2340,
    therapeuticEquivalence: 94,
    bioequivalence: 'AB-rated',
    fdaApproval: true,
    contraindications: ['Monitor for breakthrough symptoms'],
    patientFactors: ['GERD well-controlled', 'Previous generic tolerance'],
    pharmacistNotes: 'Good candidate. Monitor for 2 weeks after switch.',
    confidenceScore: 89
  }
];

export const GenericSubstitutionInterface = () => {
  const [substitutions] = useState<GenericSubstitution[]>(mockSubstitutions);
  const [selectedSubstitution, setSelectedSubstitution] = useState<GenericSubstitution | null>(null);

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalMonthlySavings = substitutions.reduce((sum, sub) => sum + sub.monthlySavings, 0);
  const totalYearlySavings = substitutions.reduce((sum, sub) => sum + sub.yearlyProjection, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Generic Substitution Interface
          </CardTitle>
          <CardDescription>
            Medication alternatives with cost savings calculation and clinical equivalence verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">${totalMonthlySavings}</p>
                    <p className="text-sm text-gray-600">Monthly Savings</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">${totalYearlySavings}</p>
                    <p className="text-sm text-gray-600">Yearly Projection</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">96%</p>
                    <p className="text-sm text-gray-600">Avg Equivalence</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{substitutions.length}</p>
                    <p className="text-sm text-gray-600">Candidates</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generic Substitution Opportunities</h3>
              {substitutions.map((substitution) => (
                <Card 
                  key={substitution.id} 
                  className={`cursor-pointer transition-colors ${selectedSubstitution?.id === substitution.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-green-400`}
                  onClick={() => setSelectedSubstitution(substitution)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{substitution.patientName}</h4>
                        <p className="text-sm text-gray-600">{substitution.brandMedication}</p>
                        <p className="text-sm font-medium text-green-600">Save ${substitution.monthlySavings}/month</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className="bg-blue-500 text-white">
                          {substitution.bioequivalence}
                        </Badge>
                        {substitution.fdaApproval && (
                          <Badge className="bg-green-500 text-white">
                            FDA Approved
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Brand: ${substitution.brandCost}</span>
                        <span>Generic: ${substitution.genericCost}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Therapeutic Equivalence</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(substitution.therapeuticEquivalence)}`}>
                          {substitution.therapeuticEquivalence}%
                        </span>
                      </div>
                      <Progress value={substitution.therapeuticEquivalence} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calculator className="h-3 w-3 text-green-500" />
                          <span>Confidence: {substitution.confidenceScore}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span>{substitution.contraindications.length} notes</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedSubstitution ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedSubstitution.patientName} - Substitution Analysis</CardTitle>
                    <CardDescription>{selectedSubstitution.brandMedication}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Cost Comparison</h4>
                          <div className="space-y-1 text-sm">
                            <p>Brand Cost: <strong>${selectedSubstitution.brandCost}/month</strong></p>
                            <p>Generic Cost: <strong>${selectedSubstitution.genericCost}/month</strong></p>
                            <p className="text-green-600">Monthly Savings: <strong>${selectedSubstitution.monthlySavings}</strong></p>
                            <p className="text-green-600">Yearly Projection: <strong>${selectedSubstitution.yearlyProjection}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Equivalence Rating</h4>
                          <p className="text-2xl font-bold text-blue-600">{selectedSubstitution.therapeuticEquivalence}%</p>
                          <p className="text-sm text-gray-600">{selectedSubstitution.bioequivalence} Bioequivalence</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Generic Alternative</h4>
                        <p className="text-sm bg-blue-50 p-3 rounded">{selectedSubstitution.genericAlternative}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Patient Factors</h4>
                        <ul className="space-y-1">
                          {selectedSubstitution.patientFactors.map((factor, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedSubstitution.contraindications.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Monitoring Notes</h4>
                          <ul className="space-y-1">
                            {selectedSubstitution.contraindications.map((note, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Pharmacist Notes</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedSubstitution.pharmacistNotes}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className={`text-lg font-bold ${getConfidenceColor(selectedSubstitution.confidenceScore)}`}>
                          {selectedSubstitution.confidenceScore}%
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Approve Substitution
                        </Button>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-1" />
                          Safety Review
                        </Button>
                        <Button variant="outline">
                          <Calculator className="h-4 w-4 mr-1" />
                          Cost Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a substitution candidate to view detailed analysis</p>
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
