
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Users,
  Activity,
  TrendingUp,
  Eye,
  Bell
} from 'lucide-react';

interface InfectionRisk {
  id: string;
  location: string;
  riskLevel: number;
  infectionType: string;
  patientsAffected: number;
  riskFactors: string[];
  lastUpdate: string;
  status: 'monitoring' | 'alert' | 'outbreak' | 'contained';
  containmentScore: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

const mockRisks: InfectionRisk[] = [
  {
    id: 'IR001',
    location: 'ICU Ward 3',
    riskLevel: 85,
    infectionType: 'Hospital-Acquired Pneumonia',
    patientsAffected: 3,
    riskFactors: ['Ventilator use', 'Extended stay', 'Immunocompromised'],
    lastUpdate: '2024-01-22 14:30',
    status: 'alert',
    containmentScore: 72,
    trend: 'increasing'
  },
  {
    id: 'IR002',
    location: 'Surgical Unit A',
    riskLevel: 45,
    infectionType: 'Surgical Site Infection',
    patientsAffected: 1,
    riskFactors: ['Post-operative', 'Diabetes comorbidity'],
    lastUpdate: '2024-01-22 13:15',
    status: 'monitoring',
    containmentScore: 89,
    trend: 'stable'
  }
];

export const InfectionRiskMapping = () => {
  const [risks] = useState<InfectionRisk[]>(mockRisks);
  const [selectedRisk, setSelectedRisk] = useState<InfectionRisk | null>(null);

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 80) return 'text-red-600';
    if (riskLevel >= 60) return 'text-orange-600';
    if (riskLevel >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'monitoring': return 'bg-blue-500 text-white';
      case 'alert': return 'bg-orange-500 text-white';
      case 'outbreak': return 'bg-red-500 text-white';
      case 'contained': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-green-600 transform rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Infection Risk Mapping
          </CardTitle>
          <CardDescription>
            Real-time risk visualization with outbreak detection and intelligent containment protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{risks.filter(r => r.status === 'alert' || r.status === 'outbreak').length}</p>
                    <p className="text-sm text-gray-600">Active Alerts</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{risks.length}</p>
                    <p className="text-sm text-gray-600">Monitored Locations</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{risks.reduce((sum, r) => sum + r.patientsAffected, 0)}</p>
                    <p className="text-sm text-gray-600">Patients Affected</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">81%</p>
                    <p className="text-sm text-gray-600">Avg Containment</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Infection Risk Areas</h3>
              {risks.map((risk) => (
                <Card 
                  key={risk.id} 
                  className={`cursor-pointer transition-colors ${selectedRisk?.id === risk.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                  onClick={() => setSelectedRisk(risk)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <h4 className="font-semibold">{risk.location}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{risk.infectionType}</p>
                        <p className="text-sm font-medium text-blue-600">{risk.patientsAffected} patients affected</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(risk.trend)}
                          <span className="text-xs text-gray-500">{risk.trend}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Level</span>
                        <span className={`font-bold ${getRiskColor(risk.riskLevel)}`}>
                          {risk.riskLevel}%
                        </span>
                      </div>
                      <Progress value={risk.riskLevel} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Containment</span>
                        <span className="font-bold text-green-600">{risk.containmentScore}%</span>
                      </div>
                      <Progress value={risk.containmentScore} className="h-2" />
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-sm text-gray-500">
                          <span>Updated: {risk.lastUpdate.split(' ')[1]}</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          <span>{risk.riskFactors.length} risk factors</span>
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
                    <CardTitle className="text-lg">{selectedRisk.location}</CardTitle>
                    <CardDescription>{selectedRisk.infectionType}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Risk Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p>Level: <strong className={getRiskColor(selectedRisk.riskLevel)}>{selectedRisk.riskLevel}%</strong></p>
                            <p>Status: <strong>{selectedRisk.status}</strong></p>
                            <p>Trend: <strong>{selectedRisk.trend}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Impact Metrics</h4>
                          <div className="space-y-1 text-sm">
                            <p>Patients: <strong>{selectedRisk.patientsAffected}</strong></p>
                            <p>Containment: <strong>{selectedRisk.containmentScore}%</strong></p>
                            <p>Updated: <strong>{selectedRisk.lastUpdate}</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <div className="space-y-2">
                          {selectedRisk.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-orange-50 rounded">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <span>{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">AI-Predicted Outbreak Risk</h4>
                        <div className="text-sm bg-red-50 p-3 rounded">
                          <p><strong>High Risk Alert:</strong> Current trajectory suggests potential spread to adjacent areas within 48-72 hours.</p>
                          <p className="mt-2"><strong>Confidence:</strong> 87% based on historical patterns and current risk factors.</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Containment Protocols</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Enhanced cleaning protocols activated</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>Staff screening implemented</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-yellow-50 rounded">
                            <Bell className="h-4 w-4 text-yellow-600" />
                            <span>Patient isolation procedures in place</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions</h4>
                        <div className="text-sm bg-blue-50 p-3 rounded space-y-1">
                          <p>• Increase monitoring frequency to every 4 hours</p>
                          <p>• Implement contact tracing for all ward staff</p>
                          <p>• Consider prophylactic treatment for high-risk patients</p>
                          <p>• Alert infection control team for immediate assessment</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Escalate Alert
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Map
                        </Button>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-1" />
                          Update Protocol
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select an infection risk area to view detailed analysis and containment protocols</p>
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
