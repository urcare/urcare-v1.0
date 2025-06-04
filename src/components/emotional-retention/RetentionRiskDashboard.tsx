
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Target,
  Calendar,
  MessageCircle,
  Heart,
  Brain
} from 'lucide-react';

interface RetentionRisk {
  id: string;
  patientId: string;
  patientName: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastEngagement: string;
  engagementTrend: 'increasing' | 'stable' | 'declining' | 'critical';
  predictedChurnDate: string;
  interventionStrategy: string[];
  riskFactors: string[];
  retentionScore: number;
  daysSinceLastActivity: number;
}

const mockRisks: RetentionRisk[] = [
  {
    id: 'RR001',
    patientId: 'P3156',
    patientName: 'Emma Davis',
    riskScore: 89,
    riskLevel: 'critical',
    lastEngagement: '2024-01-15',
    engagementTrend: 'critical',
    predictedChurnDate: '2024-01-25',
    interventionStrategy: ['immediate outreach', 'personalized content', 'incentive offer'],
    riskFactors: ['decreased usage', 'missed appointments', 'negative feedback'],
    retentionScore: 23,
    daysSinceLastActivity: 5
  },
  {
    id: 'RR002',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    riskScore: 72,
    riskLevel: 'high',
    lastEngagement: '2024-01-18',
    engagementTrend: 'declining',
    predictedChurnDate: '2024-02-10',
    interventionStrategy: ['engagement campaign', 'support outreach', 'habit reinforcement'],
    riskFactors: ['irregular usage', 'low mood scores', 'support requests'],
    retentionScore: 45,
    daysSinceLastActivity: 2
  },
  {
    id: 'RR003',
    patientId: 'P1932',
    patientName: 'Michael Chen',
    riskScore: 34,
    riskLevel: 'medium',
    lastEngagement: '2024-01-20',
    engagementTrend: 'stable',
    predictedChurnDate: '2024-03-15',
    interventionStrategy: ['maintain engagement', 'new feature introduction'],
    riskFactors: ['plateau in progress', 'routine usage only'],
    retentionScore: 78,
    daysSinceLastActivity: 0
  }
];

export const RetentionRiskDashboard = () => {
  const [risks] = useState<RetentionRisk[]>(mockRisks);
  const [selectedRisk, setSelectedRisk] = useState<RetentionRisk | null>(null);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Retention Risk Dashboard
          </CardTitle>
          <CardDescription>
            Dropout prediction with intervention strategies and engagement optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {risks.filter(r => r.riskLevel === 'critical').length}
                    </p>
                    <p className="text-sm text-gray-600">Critical Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {risks.filter(r => r.riskLevel === 'high').length}
                    </p>
                    <p className="text-sm text-gray-600">High Risk</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(risks.reduce((sum, r) => sum + r.retentionScore, 0) / risks.length)}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Retention</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Target className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {risks.filter(r => r.riskLevel === 'low').length}
                    </p>
                    <p className="text-sm text-gray-600">Low Risk</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Patient Retention Analysis</h3>
              {risks.map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`cursor-pointer transition-colors ${selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-yellow-400`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{risk.patientName}</h4>
                        <p className="text-sm text-gray-600 mb-1">ID: {risk.patientId}</p>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Risk Score: {risk.riskScore}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getRiskColor(risk.riskLevel)}>
                          {risk.riskLevel.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-bold">{risk.retentionScore}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Retention Risk</span>
                        <span className={`font-bold ${getScoreColor(risk.riskScore)}`}>
                          {risk.riskScore}%
                        </span>
                      </div>
                      <Progress value={risk.riskScore} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Last: {risk.lastEngagement}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${getTrendColor(risk.engagementTrend)}`}>
                          <TrendingDown className="h-3 w-3" />
                          <span>{risk.engagementTrend}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedRisk ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedRisk.patientName}</CardTitle>
                    <CardDescription>Detailed retention analysis and intervention strategies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Risk Score: <strong className={getScoreColor(selectedRisk.riskScore)}>
                              {selectedRisk.riskScore}%
                            </strong></p>
                            <p>Level: <strong>{selectedRisk.riskLevel}</strong></p>
                            <p>Retention: <strong>{selectedRisk.retentionScore}%</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Engagement Status</h4>
                          <div className="space-y-1 text-sm">
                            <p>Trend: <strong className={getTrendColor(selectedRisk.engagementTrend)}>
                              {selectedRisk.engagementTrend}
                            </strong></p>
                            <p>Last Activity: <strong>{selectedRisk.daysSinceLastActivity} days ago</strong></p>
                            <p>Predicted Churn: <strong>{selectedRisk.predictedChurnDate}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <div className="space-y-2">
                          {selectedRisk.riskFactors.map((factor, index) => (
                            <div key={index} className="text-sm bg-red-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-red-700">{factor}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Intervention Strategies</h4>
                        <div className="space-y-2">
                          {selectedRisk.interventionStrategy.map((strategy, index) => (
                            <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-blue-700">{strategy}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Retention Optimization</h4>
                        <div className="space-y-2">
                          <div className="text-sm bg-green-50 p-2 rounded">
                            <p className="font-medium text-green-800">Personalized Engagement</p>
                            <p className="text-green-700">Tailor content and interactions to patient preferences</p>
                          </div>
                          <div className="text-sm bg-purple-50 p-2 rounded">
                            <p className="font-medium text-purple-800">Proactive Support</p>
                            <p className="text-purple-700">Reach out before issues escalate to critical levels</p>
                          </div>
                          <div className="text-sm bg-orange-50 p-2 rounded">
                            <p className="font-medium text-orange-800">Value Reinforcement</p>
                            <p className="text-orange-700">Highlight benefits and progress achievements</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact Patient
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Send Support
                        </Button>
                        <Button variant="outline">
                          <Brain className="h-4 w-4 mr-1" />
                          AI Intervention
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a patient to view detailed retention analysis and intervention strategies</p>
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
