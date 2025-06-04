
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Route, 
  MapPin, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  User,
  Target
} from 'lucide-react';

interface TreatmentPathway {
  id: string;
  patientName: string;
  condition: string;
  currentStage: number;
  totalStages: number;
  pathway: {
    stage: number;
    title: string;
    description: string;
    duration: string;
    completed: boolean;
    outcomes: string[];
  }[];
  successProbability: number;
  personalizedFactors: string[];
  alternativePathways: string[];
  riskFactors: string[];
  monitoringPoints: string[];
}

const mockTreatmentPathways: TreatmentPathway[] = [
  {
    id: 'TP001',
    patientName: 'Maria Rodriguez',
    condition: 'Type 2 Diabetes Management',
    currentStage: 2,
    totalStages: 5,
    pathway: [
      {
        stage: 1,
        title: 'Initial Assessment & Education',
        description: 'Comprehensive evaluation, patient education, lifestyle counseling',
        duration: '2 weeks',
        completed: true,
        outcomes: ['Baseline HbA1c: 8.2%', 'Patient education completed', 'Nutrition consult scheduled']
      },
      {
        stage: 2,
        title: 'Metformin Initiation',
        description: 'Start metformin 500mg BID, monitor tolerance',
        duration: '4 weeks',
        completed: false,
        outcomes: ['Target: HbA1c < 7%', 'Monitor renal function', 'Assess GI tolerance']
      },
      {
        stage: 3,
        title: 'Optimization Phase',
        description: 'Adjust dosing, add second agent if needed',
        duration: '8 weeks',
        completed: false,
        outcomes: ['Optimize to metformin 1000mg BID', 'Consider GLP-1 agonist', 'Lifestyle reinforcement']
      },
      {
        stage: 4,
        title: 'Intensification',
        description: 'Add insulin or other agents based on response',
        duration: '12 weeks',
        completed: false,
        outcomes: ['Target HbA1c achieved', 'Cardiovascular risk assessment', 'Complication screening']
      },
      {
        stage: 5,
        title: 'Maintenance & Monitoring',
        description: 'Long-term management and complication prevention',
        duration: 'Ongoing',
        completed: false,
        outcomes: ['Quarterly HbA1c monitoring', 'Annual eye exams', 'Preventive care optimization']
      }
    ],
    successProbability: 78,
    personalizedFactors: ['Age: 52', 'BMI: 28.5', 'No cardiovascular disease', 'Good medication adherence history'],
    alternativePathways: ['SGLT-2 inhibitor first-line', 'Insulin therapy', 'Bariatric surgery evaluation'],
    riskFactors: ['Family history of CVD', 'Hypertension', 'Mild kidney disease'],
    monitoringPoints: ['HbA1c every 3 months', 'Renal function every 6 months', 'Diabetic eye exam annually']
  }
];

export const TreatmentPathwayGenerator = () => {
  const [treatmentPathways] = useState<TreatmentPathway[]>(mockTreatmentPathways);
  const [selectedPathway, setSelectedPathway] = useState<TreatmentPathway | null>(null);

  const getStageStatus = (stage: any, currentStage: number) => {
    if (stage.completed) return 'completed';
    if (stage.stage === currentStage) return 'current';
    if (stage.stage < currentStage) return 'completed';
    return 'upcoming';
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      case 'upcoming': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Treatment Pathway Generator
          </CardTitle>
          <CardDescription>
            Personalized treatment protocols with evidence-based pathways and outcome predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Route className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">45</p>
                    <p className="text-sm text-gray-600">Active Pathways</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">82.4%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <User className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">156</p>
                    <p className="text-sm text-gray-600">Personalized Plans</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">92%</p>
                    <p className="text-sm text-gray-600">Adherence Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Treatment Pathways</h3>
              {treatmentPathways.map((pathway) => (
                <Card 
                  key={pathway.id} 
                  className={`cursor-pointer transition-colors ${selectedPathway?.id === pathway.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedPathway(pathway)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{pathway.patientName}</h4>
                        <p className="text-sm text-gray-600">{pathway.condition}</p>
                        <p className="text-xs text-gray-500">Stage {pathway.currentStage} of {pathway.totalStages}</p>
                      </div>
                      <Badge variant="outline">{pathway.successProbability}% Success</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pathway Progress</span>
                        <span className="text-sm font-bold">{Math.round((pathway.currentStage / pathway.totalStages) * 100)}%</span>
                      </div>
                      <Progress value={(pathway.currentStage / pathway.totalStages) * 100} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-blue-500" />
                          <span>{pathway.totalStages} stages</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>Current: {pathway.pathway[pathway.currentStage - 1]?.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-purple-500" />
                          <span>{pathway.personalizedFactors.length} factors</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedPathway ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPathway.patientName} - Treatment Pathway</CardTitle>
                    <CardDescription>{selectedPathway.condition}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Pathway Progress</h4>
                          <div className="space-y-1 text-sm">
                            <p>Current Stage: <strong>{selectedPathway.currentStage}/{selectedPathway.totalStages}</strong></p>
                            <p>Success Probability: <strong>{selectedPathway.successProbability}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Current Stage</h4>
                          <p className="text-sm font-medium text-blue-600">
                            {selectedPathway.pathway[selectedPathway.currentStage - 1]?.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedPathway.pathway[selectedPathway.currentStage - 1]?.duration}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Treatment Stages</h4>
                        <div className="space-y-2">
                          {selectedPathway.pathway.map((stage, index) => {
                            const status = getStageStatus(stage, selectedPathway.currentStage);
                            return (
                              <div key={index} className="flex items-start gap-3 p-2 rounded">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getStageColor(status)}`}>
                                  {status === 'completed' ? <CheckCircle className="h-3 w-3" /> : stage.stage}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm">{stage.title}</h5>
                                  <p className="text-xs text-gray-600 mb-1">{stage.description}</p>
                                  <p className="text-xs text-gray-500">Duration: {stage.duration}</p>
                                  {stage.outcomes.length > 0 && status !== 'upcoming' && (
                                    <div className="mt-1">
                                      {stage.outcomes.map((outcome, i) => (
                                        <p key={i} className="text-xs text-blue-600">• {outcome}</p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Personalization Factors</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathway.personalizedFactors.map((factor, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      {selectedPathway.riskFactors.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 text-orange-600">Risk Factors</h4>
                          <ul className="space-y-1">
                            {selectedPathway.riskFactors.map((risk, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Alternative Pathways</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPathway.alternativePathways.map((alt, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{alt}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Route className="h-4 w-4 mr-1" />
                          Update Pathway
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Schedule Follow-up
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target className="h-4 w-4 mr-1" />
                          Set Reminders
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a treatment pathway to view detailed progression</p>
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
