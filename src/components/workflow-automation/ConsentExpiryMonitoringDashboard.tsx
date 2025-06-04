
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Clock, 
  FileText, 
  RefreshCw,
  Calendar,
  User,
  CheckCircle,
  Bell
} from 'lucide-react';

interface ConsentExpiry {
  id: string;
  patientName: string;
  consentType: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'renewed';
  procedure: string;
  department: string;
  renewalRequired: boolean;
  complianceRisk: 'low' | 'medium' | 'high';
  autoRenewalEligible: boolean;
}

const mockConsents: ConsentExpiry[] = [
  {
    id: 'CE001',
    patientName: 'Maria Rodriguez',
    consentType: 'Surgical Consent',
    issueDate: '2023-11-15',
    expiryDate: '2024-01-20',
    daysRemaining: 5,
    status: 'expiring_soon',
    procedure: 'Laparoscopic Surgery',
    department: 'Surgery',
    renewalRequired: true,
    complianceRisk: 'high',
    autoRenewalEligible: false
  },
  {
    id: 'CE002',
    patientName: 'David Kim',
    consentType: 'Treatment Consent',
    issueDate: '2023-12-01',
    expiryDate: '2024-01-18',
    daysRemaining: 3,
    status: 'expiring_soon',
    procedure: 'Chemotherapy',
    department: 'Oncology',
    renewalRequired: true,
    complianceRisk: 'medium',
    autoRenewalEligible: true
  }
];

export const ConsentExpiryMonitoringDashboard = () => {
  const [consents] = useState<ConsentExpiry[]>(mockConsents);
  const [selectedConsent, setSelectedConsent] = useState<ConsentExpiry | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'expiring_soon': return 'bg-orange-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      case 'renewed': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyLevel = (daysRemaining: number) => {
    if (daysRemaining <= 0) return { level: 'expired', color: 'red' };
    if (daysRemaining <= 3) return { level: 'critical', color: 'red' };
    if (daysRemaining <= 7) return { level: 'urgent', color: 'orange' };
    if (daysRemaining <= 14) return { level: 'warning', color: 'yellow' };
    return { level: 'normal', color: 'green' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Consent Expiry Monitoring Dashboard
          </CardTitle>
          <CardDescription>
            Renewal alerts with document management and compliance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 border-red-200 bg-red-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-600">{consents.filter(c => c.status === 'expiring_soon').length}</p>
                    <p className="text-sm text-gray-600">Expiring Soon</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{consents.length}</p>
                    <p className="text-sm text-gray-600">Total Consents</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-green-200 bg-green-50">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{consents.filter(c => c.autoRenewalEligible).length}</p>
                    <p className="text-sm text-gray-600">Auto-Renewable</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">98%</p>
                    <p className="text-sm text-gray-600">Compliance Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Consent Expiry Alerts</h3>
              {consents.map((consent) => {
                const urgency = getUrgencyLevel(consent.daysRemaining);
                return (
                  <Card 
                    key={consent.id} 
                    className={`cursor-pointer transition-colors ${selectedConsent?.id === consent.id ? 'ring-2 ring-blue-500' : ''} border-l-4 border-l-${urgency.color}-400`}
                    onClick={() => setSelectedConsent(consent)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <h4 className="font-semibold">{consent.patientName}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{consent.consentType}</p>
                          <p className="text-sm font-medium text-blue-600">{consent.procedure}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getStatusColor(consent.status)}>
                            {consent.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getRiskColor(consent.complianceRisk)}>
                            {consent.complianceRisk.toUpperCase()} RISK
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Expires:</span>
                            <p className="font-medium">{consent.expiryDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Days Left:</span>
                            <p className={`font-bold text-${urgency.color}-600`}>{consent.daysRemaining}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{consent.department}</span>
                          <div className="flex gap-2">
                            {consent.autoRenewalEligible && (
                              <Badge variant="outline" className="text-xs">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Auto-Renewal
                              </Badge>
                            )}
                            {consent.renewalRequired && (
                              <Badge variant="outline" className="text-xs">
                                <Bell className="h-3 w-3 mr-1" />
                                Renewal Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              {selectedConsent ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedConsent.patientName}</CardTitle>
                    <CardDescription>{selectedConsent.consentType} - {selectedConsent.procedure}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Consent Details</h4>
                          <div className="space-y-1 text-sm">
                            <p>Type: <strong>{selectedConsent.consentType}</strong></p>
                            <p>Department: <strong>{selectedConsent.department}</strong></p>
                            <p>Procedure: <strong>{selectedConsent.procedure}</strong></p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Timeline</h4>
                          <div className="space-y-1 text-sm">
                            <p>Issued: <strong>{selectedConsent.issueDate}</strong></p>
                            <p>Expires: <strong>{selectedConsent.expiryDate}</strong></p>
                            <p>Days Left: <strong className={`text-${getUrgencyLevel(selectedConsent.daysRemaining).color}-600`}>
                              {selectedConsent.daysRemaining}
                            </strong></p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Compliance Status</h4>
                        <div className="flex items-center gap-4">
                          <Badge className={getRiskColor(selectedConsent.complianceRisk)}>
                            {selectedConsent.complianceRisk.toUpperCase()} RISK
                          </Badge>
                          <Badge className={getStatusColor(selectedConsent.status)}>
                            {selectedConsent.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Renewal Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Auto-Renewal Eligible</span>
                            <Badge variant={selectedConsent.autoRenewalEligible ? "default" : "secondary"}>
                              {selectedConsent.autoRenewalEligible ? "Yes" : "No"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Manual Renewal Required</span>
                            <Badge variant={selectedConsent.renewalRequired ? "destructive" : "default"}>
                              {selectedConsent.renewalRequired ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Recommended Actions</h4>
                        <div className="text-sm bg-yellow-50 p-3 rounded space-y-1">
                          <p>• Immediate renewal required due to expiry proximity</p>
                          <p>• Schedule patient appointment for consent review</p>
                          <p>• Notify attending physician of expiry status</p>
                          <p>• Prepare renewal documentation</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Initiate Renewal
                        </Button>
                        <Button variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Review
                        </Button>
                        <Button variant="outline">
                          <Bell className="h-4 w-4 mr-1" />
                          Send Alert
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Select a consent to view expiry details and renewal options</p>
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
