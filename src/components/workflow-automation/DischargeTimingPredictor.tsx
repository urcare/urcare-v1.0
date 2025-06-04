
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  User, 
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Bed
} from 'lucide-react';

interface DischargePrediction {
  id: string;
  patientName: string;
  admissionDate: string;
  currentLOS: number;
  predictedDischarge: string;
  confidence: number;
  readinessScore: number;
  blockers: string[];
  department: string;
  bed: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  resourcesRequired: string[];
  estimatedTimeToDischarge: string;
}

const mockPredictions: DischargePrediction[] = [
  {
    id: 'DP001',
    patientName: 'Robert Davis',
    admissionDate: '2024-01-10',
    currentLOS: 5,
    predictedDischarge: '2024-01-18 10:00',
    confidence: 87,
    readinessScore: 78,
    blockers: ['Pending Lab Results', 'Home Care Setup'],
    department: 'Cardiology',
    bed: 'C-204',
    priority: 'high',
    resourcesRequired: ['Discharge Planner', 'Home Health Coordinator'],
    estimatedTimeToDischarge: '2-3 days'
  },
  {
    id: 'DP002',
    patientName: 'Linda Wilson',
    admissionDate: '2024-01-12',
    currentLOS: 3,
    predictedDischarge: '2024-01-16 14:30',
    confidence: 92,
    readinessScore: 85,
    blockers: ['Family Education'],
    department: 'Surgery',
    bed: 'S-112',
    priority: 'normal',
    resourcesRequired: ['Discharge Nurse'],
    estimatedTimeToDischarge: '1 day'
  }
];

export const DischargeTimingPredictor = () => {
  const [predictions] = useState<DischargePrediction[]>(mockPredictions);
  const [selectedPrediction, setSelectedPrediction] = useState<DischargePrediction | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Discharge Timing Predictor
          </CardTitle>
          <CardDescription>
            Readiness assessments with resource availability and coordination planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{predictions.length}</p>
                    <p className="text-sm text-gray-600">Predictions Active</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">89%</p>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{predictions.filter(p => p.blockers.length > 0).length}</p>
                    <p className="text-sm text-gray-600">With Blockers</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Bed className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">3.2</p>
                    <p className="text-sm text-gray-600">Avg LOS (days)</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Discharge Predictions</h3>
              {predictions.map((prediction) => (
                <Card 
                  key={prediction.id} 
                  className={`cursor-pointer transition-colors ${selectedPrediction?.id === prediction.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedPrediction(prediction)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{prediction.patientName}</h4>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{prediction.department} - {prediction.bed}</p>
                        </div>
                        <p className="text-sm font-medium text-blue-600">LOS: {prediction.currentLOS} days</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getPriorityColor(prediction.priority)}>
                          {prediction.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          AI: {prediction.confidence}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Discharge Readiness</span>
                        <span className={`font-bold ${getReadinessColor(prediction.readinessScore)}`}>
                          {prediction.readinessScore}%
                        </span>
                      </div>
                      <Progress value={prediction.readinessScore} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div>
                          <span className="text-gray-500">Predicted:</span>
                          <p className="font-medium">{prediction.predictedDischarge}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">ETA:</span>
                          <p className="font-medium">{prediction.estimatedTimeToDischarge}</p>
                        </div>
                      </div>
                      
                      {prediction.blockers.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{prediction.blockers.length} blocker(s)</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {prediction.blockers.slice(0, 2).map((blocker, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {blocker}
                              </Badge>
                            ))}
                            {prediction.blockers.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{prediction.blockers.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedPrediction ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedPrediction.patientName}</CardTitle>
                    <CardDescription>{selectedPrediction.department} - Bed {selectedPrediction.bed}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Current Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Admission: <strong>{selectedPrediction.admissionDate}</strong></p>
                            <p>Current LOS: <strong>{selectedPrediction.currentLOS} days</strong></p>
                            <p>Priority: <strong>{selectedPrediction.priority}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">AI Prediction</h4>
                          <div className="space-y-1 text-sm">
                            <p>Confidence: <strong>{selectedPrediction.confidence}%</strong></p>
                            <p>Readiness: <strong className={getReadinessColor(selectedPrediction.readinessScore)}>
                              {selectedPrediction.readinessScore}%
                            </strong></p>
                            <p>ETA: <strong>{selectedPrediction.estimatedTimeToDischarge}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Predicted Discharge</h4>
                        <p className="text-lg font-bold text-blue-600">{selectedPrediction.predictedDischarge}</p>
                      </div>
                      
                      {selectedPrediction.blockers.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Current Blockers</h4>
                          <div className="space-y-1">
                            {selectedPrediction.blockers.map((blocker, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span>{blocker}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Required Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPrediction.resourcesRequired.map((resource, index) => (
                            <Badge key={index} variant="outline">{resource}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI Recommendations</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded space-y-1">
                          <p>• Schedule discharge planning meeting within 24 hours</p>
                          <p>• Coordinate with home health services early</p>
                          <p>• Ensure family education completion before discharge</p>
                          <p>• Pre-arrange follow-up appointments</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Discharge
                        </Button>
                        <Button variant="outline">
                          <Activity className="h-4 w-4 mr-1" />
                          Update Readiness
                        </Button>
                        <Button variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Clear Blockers
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a discharge prediction to view detailed analysis and planning options</p>
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
