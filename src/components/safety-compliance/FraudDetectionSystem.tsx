
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Search,
  Shield,
  Activity,
  Clock,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'billing_anomaly' | 'duplicate_claims' | 'upcoding' | 'phantom_billing' | 'kickback_scheme' | 'identity_theft';
  severity: 'low' | 'medium' | 'high' | 'critical';
  patientId?: string;
  patientName?: string;
  providerId: string;
  providerName: string;
  department: string;
  detectedAt: string;
  description: string;
  suspiciousAmount: number;
  normalAmount: number;
  confidence: number;
  riskScore: number;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  investigator?: string;
  evidence: string[];
  relatedAlerts: string[];
}

interface BillingPattern {
  id: string;
  providerId: string;
  providerName: string;
  department: string;
  timeframe: string;
  totalBilling: number;
  anomalyScore: number;
  patternType: 'volume_spike' | 'unusual_codes' | 'time_clustering' | 'patient_hopping' | 'service_bundling';
  description: string;
  comparisonData: {
    historical: number;
    peer: number;
    deviation: number;
  };
  flags: string[];
}

const mockAlerts: FraudAlert[] = [
  {
    id: 'FA001',
    type: 'billing_anomaly',
    severity: 'high',
    patientId: 'P2847',
    patientName: 'Sarah Johnson',
    providerId: 'D1234',
    providerName: 'Dr. Michael Roberts',
    department: 'Cardiology',
    detectedAt: '2024-01-20 14:30:00',
    description: 'Unusual billing pattern: High-complexity procedures billed consistently above department average',
    suspiciousAmount: 15420,
    normalAmount: 8750,
    confidence: 87,
    riskScore: 92,
    status: 'investigating',
    investigator: 'Fraud Investigation Team',
    evidence: ['Billing frequency anomaly', 'Procedure complexity mismatch', 'Patient documentation gaps'],
    relatedAlerts: ['FA003', 'FA005']
  },
  {
    id: 'FA002',
    type: 'duplicate_claims',
    severity: 'medium',
    patientId: 'P1932',
    patientName: 'Robert Davis',
    providerId: 'D5678',
    providerName: 'Dr. Lisa Thompson',
    department: 'Emergency',
    detectedAt: '2024-01-20 16:15:00',
    description: 'Duplicate claims submitted for same service within 24-hour period',
    suspiciousAmount: 2340,
    normalAmount: 1170,
    confidence: 95,
    riskScore: 78,
    status: 'active',
    evidence: ['Identical procedure codes', 'Same timestamp', 'Double billing detected'],
    relatedAlerts: []
  },
  {
    id: 'FA003',
    type: 'upcoding',
    severity: 'critical',
    patientId: 'P3156',
    patientName: 'Emily Rodriguez',
    providerId: 'D1234',
    providerName: 'Dr. Michael Roberts',
    department: 'Cardiology',
    detectedAt: '2024-01-20 18:45:00',
    description: 'Systematic upcoding detected: Simple procedures billed as complex interventions',
    suspiciousAmount: 22100,
    normalAmount: 12400,
    confidence: 94,
    riskScore: 96,
    status: 'investigating',
    investigator: 'Senior Fraud Analyst',
    evidence: ['Procedure code mismatch', 'Documentation inconsistency', 'Pattern across multiple patients'],
    relatedAlerts: ['FA001']
  }
];

const mockPatterns: BillingPattern[] = [
  {
    id: 'BP001',
    providerId: 'D1234',
    providerName: 'Dr. Michael Roberts',
    department: 'Cardiology',
    timeframe: 'Last 30 days',
    totalBilling: 245000,
    anomalyScore: 89,
    patternType: 'volume_spike',
    description: 'Billing volume increased 340% compared to historical average',
    comparisonData: {
      historical: 72000,
      peer: 85000,
      deviation: 240
    },
    flags: ['Volume anomaly', 'Complexity increase', 'New procedures']
  },
  {
    id: 'BP002',
    providerId: 'D5678',
    providerName: 'Dr. Lisa Thompson',
    department: 'Emergency',
    timeframe: 'Last 7 days',
    totalBilling: 67000,
    anomalyScore: 72,
    patternType: 'time_clustering',
    description: 'Unusual concentration of high-value procedures during night shifts',
    comparisonData: {
      historical: 52000,
      peer: 48000,
      deviation: 29
    },
    flags: ['Time pattern anomaly', 'Shift correlation']
  }
];

export const FraudDetectionSystem = () => {
  const [alerts] = useState<FraudAlert[]>(mockAlerts);
  const [patterns] = useState<BillingPattern[]>(mockPatterns);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500 text-white';
      case 'investigating': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'false_positive': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'billing_anomaly': return 'bg-orange-100 text-orange-800';
      case 'duplicate_claims': return 'bg-blue-100 text-blue-800';
      case 'upcoding': return 'bg-red-100 text-red-800';
      case 'phantom_billing': return 'bg-purple-100 text-purple-800';
      case 'kickback_scheme': return 'bg-pink-100 text-pink-800';
      case 'identity_theft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePotentialLoss = () => {
    return alerts.reduce((total, alert) => total + (alert.suspiciousAmount - alert.normalAmount), 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection System
          </CardTitle>
          <CardDescription>
            Advanced billing pattern analysis, anomaly identification, and investigation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculatePotentialLoss())}</p>
                  <p className="text-sm text-gray-600">Potential Loss</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{patterns.length}</p>
                  <p className="text-sm text-gray-600">Anomaly Patterns</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Search className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {alerts.filter(a => a.status === 'investigating').length}
                  </p>
                  <p className="text-sm text-gray-600">Investigating</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fraud Alerts</h3>
              {alerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`cursor-pointer transition-colors ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-red-400`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold mb-1">{alert.providerName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{alert.department}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{alert.detectedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getTypeColor(alert.type)}>
                          {alert.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Score</span>
                        <span className="font-bold text-red-600">{alert.riskScore}%</span>
                      </div>
                      <Progress value={alert.riskScore} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Suspicious Amount</span>
                        <span className="font-bold text-red-600">{formatCurrency(alert.suspiciousAmount)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Expected Amount</span>
                        <span className="font-medium">{formatCurrency(alert.normalAmount)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Confidence</span>
                        <span className="font-bold">{alert.confidence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              {selectedAlert ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedAlert.providerName} - Fraud Investigation</CardTitle>
                    <CardDescription>Detailed analysis and investigation workflow management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Alert Information</h4>
                          <div className="space-y-1 text-sm">
                            <p>Alert ID: <strong>{selectedAlert.id}</strong></p>
                            <p>Type: <strong>{selectedAlert.type.replace('_', ' ')}</strong></p>
                            <p>Severity: <strong>{selectedAlert.severity}</strong></p>
                            <p>Status: <strong>{selectedAlert.status}</strong></p>
                            <p>Detected: <strong>{selectedAlert.detectedAt}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Financial Impact</h4>
                          <div className="space-y-1 text-sm">
                            <p>Suspicious: <strong className="text-red-600">{formatCurrency(selectedAlert.suspiciousAmount)}</strong></p>
                            <p>Expected: <strong>{formatCurrency(selectedAlert.normalAmount)}</strong></p>
                            <p>Difference: <strong className="text-red-600">
                              {formatCurrency(selectedAlert.suspiciousAmount - selectedAlert.normalAmount)}
                            </strong></p>
                            <p>Risk Score: <strong>{selectedAlert.riskScore}%</strong></p>
                            <p>Confidence: <strong>{selectedAlert.confidence}%</strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded">{selectedAlert.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Evidence</h4>
                        <div className="space-y-2">
                          {selectedAlert.evidence.map((evidence, index) => (
                            <div key={index} className="text-sm bg-red-50 p-2 rounded">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="text-red-700">{evidence}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {selectedAlert.relatedAlerts.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Related Alerts</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedAlert.relatedAlerts.map((alertId, index) => (
                              <Badge key={index} variant="outline">
                                {alertId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedAlert.investigator && (
                        <div>
                          <h4 className="font-medium mb-2">Investigation Status</h4>
                          <p className="text-sm bg-blue-50 p-3 rounded">
                            Assigned to: <strong>{selectedAlert.investigator}</strong>
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button>
                          <Search className="h-4 w-4 mr-1" />
                          Investigate
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Report
                        </Button>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Timeline
                        </Button>
                        <Button variant="destructive">
                          <Shield className="h-4 w-4 mr-1" />
                          Block Provider
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a fraud alert to view detailed investigation information and evidence</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Billing Pattern Analysis</CardTitle>
              <CardDescription>Automated detection of suspicious billing patterns and anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{pattern.providerName}</h4>
                        <p className="text-sm text-gray-600">{pattern.department} • {pattern.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(pattern.totalBilling)}</p>
                        <p className="text-sm text-gray-600">Total Billing</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Historical Average</p>
                        <p className="font-semibold">{formatCurrency(pattern.comparisonData.historical)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Peer Average</p>
                        <p className="font-semibold">{formatCurrency(pattern.comparisonData.peer)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deviation</p>
                        <p className="font-semibold text-red-600">+{pattern.comparisonData.deviation}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Anomaly Score</span>
                        <span className="font-bold text-red-600">{pattern.anomalyScore}%</span>
                      </div>
                      <Progress value={pattern.anomalyScore} className="h-2" />
                    </div>
                    
                    <p className="text-sm mb-3">{pattern.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {pattern.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-orange-600">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
