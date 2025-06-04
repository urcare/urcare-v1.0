
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Activity
} from 'lucide-react';

interface ChronicCareProtocol {
  id: string;
  patientName: string;
  condition: string;
  protocolName: string;
  adherenceScore: number;
  lastUpdate: string;
  nextReview: string;
  status: 'active' | 'needs-attention' | 'completed';
  guidelines: string[];
  currentMedications: string[];
  upcomingTasks: string[];
  recentOutcomes: string[];
  riskFactors: string[];
}

const mockProtocols: ChronicCareProtocol[] = [
  {
    id: 'CCP001',
    patientName: 'Maria Rodriguez',
    condition: 'Type 2 Diabetes',
    protocolName: 'Comprehensive Diabetes Management',
    adherenceScore: 87,
    lastUpdate: '2024-01-15',
    nextReview: '2024-02-15',
    status: 'active',
    guidelines: ['ADA Diabetes Guidelines 2024', 'AACE Comprehensive Care Plan'],
    currentMedications: ['Metformin 1000mg BID', 'Lisinopril 10mg daily'],
    upcomingTasks: ['HbA1c test in 2 weeks', 'Ophthalmology screening due'],
    recentOutcomes: ['HbA1c improved from 8.2% to 7.1%', 'Blood pressure stable'],
    riskFactors: ['Family history of CAD', 'BMI 32']
  },
  {
    id: 'CCP002',
    patientName: 'Robert Johnson',
    condition: 'Heart Failure',
    protocolName: 'HF with Reduced Ejection Fraction Protocol',
    adherenceScore: 94,
    lastUpdate: '2024-01-14',
    nextReview: '2024-01-28',
    status: 'active',
    guidelines: ['ACC/AHA Heart Failure Guidelines', 'ESC Heart Failure Guidelines'],
    currentMedications: ['Carvedilol 25mg BID', 'Lisinopril 20mg daily', 'Furosemide 40mg daily'],
    upcomingTasks: ['Echocardiogram next week', 'Cardiology follow-up'],
    recentOutcomes: ['EF improved from 25% to 35%', 'No hospitalizations in 6 months'],
    riskFactors: ['Previous MI', 'Diabetes']
  }
];

export const ChronicCareProtocolInterface = () => {
  const [protocols] = useState<ChronicCareProtocol[]>(mockProtocols);
  const [selectedProtocol, setSelectedProtocol] = useState<ChronicCareProtocol | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'needs-attention': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getAdherenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Chronic Care Protocol Interface
          </CardTitle>
          <CardDescription>
            Condition-specific guidelines with treatment tracking and outcome monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Heart className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-gray-600">Active Protocols</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">91.2%</p>
                    <p className="text-sm text-gray-600">Avg Adherence</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">23</p>
                    <p className="text-sm text-gray-600">Due Reviews</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">84%</p>
                    <p className="text-sm text-gray-600">Goal Achievement</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chronic Care Protocols</h3>
              {protocols.map((protocol) => (
                <Card 
                  key={protocol.id} 
                  className={`cursor-pointer transition-colors ${selectedProtocol?.id === protocol.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-blue-400`}
                  onClick={() => setSelectedProtocol(protocol)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{protocol.patientName}</h4>
                        <p className="text-sm text-gray-600">{protocol.condition}</p>
                        <p className="text-sm font-medium text-blue-600">{protocol.protocolName}</p>
                      </div>
                      <Badge className={getStatusColor(protocol.status)}>
                        {protocol.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Adherence Score</span>
                        <span className={`text-sm font-bold ${getAdherenceColor(protocol.adherenceScore)}`}>
                          {protocol.adherenceScore}%
                        </span>
                      </div>
                      <Progress value={protocol.adherenceScore} className="h-2" />
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-green-500" />
                          <span>Next: {protocol.nextReview}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>{protocol.upcomingTasks.length} tasks</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedProtocol ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedProtocol.patientName} - Protocol Details</CardTitle>
                    <CardDescription>{selectedProtocol.protocolName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Protocol Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Condition: <strong>{selectedProtocol.condition}</strong></p>
                            <p>Adherence: <span className={getAdherenceColor(selectedProtocol.adherenceScore)}>{selectedProtocol.adherenceScore}%</span></p>
                            <p>Last Update: {selectedProtocol.lastUpdate}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Next Review</h4>
                          <p className="text-2xl font-bold text-blue-600">{selectedProtocol.nextReview}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Clinical Guidelines</h4>
                        <ul className="space-y-1">
                          {selectedProtocol.guidelines.map((guideline, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {guideline}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Current Medications</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProtocol.currentMedications.map((med, index) => (
                            <Badge key={index} variant="outline">{med}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Upcoming Tasks</h4>
                        <ul className="space-y-1">
                          {selectedProtocol.upcomingTasks.map((task, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-blue-500" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recent Outcomes</h4>
                        <ul className="space-y-1">
                          {selectedProtocol.recentOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {selectedProtocol.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <Activity className="h-4 w-4 mr-1" />
                          Update Protocol
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Review
                        </Button>
                        <Button variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a protocol to view detailed information</p>
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
