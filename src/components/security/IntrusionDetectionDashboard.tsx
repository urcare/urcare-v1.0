
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Eye, 
  Shield,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  Zap,
  Ban,
  CheckCircle
} from 'lucide-react';

interface ThreatDetection {
  id: string;
  type: 'malware' | 'brute_force' | 'sql_injection' | 'xss' | 'ddos' | 'privilege_escalation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  source: string;
  target: string;
  status: 'detected' | 'blocked' | 'investigating' | 'mitigated';
  confidence: number;
  details: string;
}

interface SecurityRule {
  id: string;
  name: string;
  type: 'signature' | 'anomaly' | 'behavioral' | 'ml';
  enabled: boolean;
  sensitivity: 'high' | 'medium' | 'low';
  detections: number;
  falsePositives: number;
}

export const IntrusionDetectionDashboard = () => {
  const [threats, setThreats] = useState<ThreatDetection[]>([
    {
      id: '1',
      type: 'brute_force',
      severity: 'high',
      timestamp: new Date(Date.now() - 300000),
      source: '192.168.1.100',
      target: 'login.hospital.com',
      status: 'blocked',
      confidence: 95,
      details: 'Multiple failed login attempts from suspicious IP'
    },
    {
      id: '2',
      type: 'sql_injection',
      severity: 'critical',
      timestamp: new Date(Date.now() - 600000),
      source: '10.0.0.50',
      target: 'patient-db.internal',
      status: 'detected',
      confidence: 88,
      details: 'SQL injection attempt detected in patient search form'
    },
    {
      id: '3',
      type: 'malware',
      severity: 'critical',
      timestamp: new Date(Date.now() - 900000),
      source: 'workstation-23',
      target: 'file-server.internal',
      status: 'mitigated',
      confidence: 92,
      details: 'Ransomware signature detected and quarantined'
    }
  ]);

  const [securityRules, setSecurityRules] = useState<SecurityRule[]>([
    {
      id: 'rule-001',
      name: 'Brute Force Detection',
      type: 'signature',
      enabled: true,
      sensitivity: 'high',
      detections: 156,
      falsePositives: 3
    },
    {
      id: 'rule-002',
      name: 'Anomalous Data Access',
      type: 'anomaly',
      enabled: true,
      sensitivity: 'medium',
      detections: 89,
      falsePositives: 12
    },
    {
      id: 'rule-003',
      name: 'ML Threat Classifier',
      type: 'ml',
      enabled: true,
      sensitivity: 'high',
      detections: 234,
      falsePositives: 8
    },
    {
      id: 'rule-004',
      name: 'Behavioral Analysis',
      type: 'behavioral',
      enabled: false,
      sensitivity: 'low',
      detections: 45,
      falsePositives: 23
    }
  ]);

  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simulate new threat detections
        if (Math.random() < 0.1) {
          const threatTypes = ['malware', 'brute_force', 'sql_injection', 'xss', 'ddos'];
          const severities = ['low', 'medium', 'high', 'critical'];
          
          const newThreat: ThreatDetection = {
            id: Date.now().toString(),
            type: threatTypes[Math.floor(Math.random() * threatTypes.length)] as any,
            severity: severities[Math.floor(Math.random() * severities.length)] as any,
            timestamp: new Date(),
            source: `192.168.1.${Math.floor(Math.random() * 255)}`,
            target: 'hospital-system.com',
            status: 'detected',
            confidence: Math.floor(Math.random() * 40) + 60,
            details: 'Automated threat detection alert'
          };
          
          setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
        }
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-orange-100 text-orange-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware': return AlertTriangle;
      case 'brute_force': return Shield;
      case 'sql_injection': return Eye;
      case 'xss': return Zap;
      case 'ddos': return Activity;
      default: return AlertTriangle;
    }
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const criticalThreats = threats.filter(t => t.severity === 'critical').length;
  const blockedThreats = threats.filter(t => t.status === 'blocked').length;
  const activeRules = securityRules.filter(r => r.enabled).length;

  return (
    <div className="space-y-6">
      {/* Intrusion Detection Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Intrusion Detection System
            </span>
            <div className="flex items-center gap-2">
              <Badge className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isMonitoring ? 'Active' : 'Paused'}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{criticalThreats}</div>
              <div className="text-sm text-gray-600">Critical Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{blockedThreats}</div>
              <div className="text-sm text-gray-600">Blocked Attacks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{threats.length}</div>
              <div className="text-sm text-gray-600">Total Detections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeRules}</div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threat Detection Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Threat Detections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threats.map((threat) => {
              const IconComponent = getThreatIcon(threat.type);
              return (
                <div key={threat.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-5 w-5 ${
                        threat.severity === 'critical' ? 'text-red-600' :
                        threat.severity === 'high' ? 'text-orange-600' :
                        threat.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div>
                        <div className="font-medium">{threat.details}</div>
                        <div className="text-sm text-gray-600">{formatTime(threat.timestamp)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(threat.severity)}>
                        {threat.severity}
                      </Badge>
                      <Badge className={getStatusColor(threat.status)}>
                        {threat.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Source:</span>
                      <span className="ml-2">{threat.source}</span>
                    </div>
                    <div>
                      <span className="font-medium">Target:</span>
                      <span className="ml-2">{threat.target}</span>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <span className="ml-2">{threat.confidence}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{threat.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Ban className="h-3 w-3 mr-1" />
                      Block Source
                    </Button>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Resolved
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Rules Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detection Rules
            </span>
            <Button>
              Add Custom Rule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-600">
                        {rule.type} detection | {rule.sensitivity} sensitivity
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {rule.detections} detections
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSecurityRules(prev => 
                          prev.map(r => 
                            r.id === rule.id 
                              ? { ...r, enabled: !r.enabled }
                              : r
                          )
                        );
                      }}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Detections:</span>
                    <span className="ml-2">{rule.detections}</span>
                  </div>
                  <div>
                    <span className="font-medium">False Positives:</span>
                    <span className="ml-2 text-orange-600">{rule.falsePositives}</span>
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span>
                    <span className="ml-2">
                      {Math.round(((rule.detections - rule.falsePositives) / rule.detections) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Effectiveness</span>
                    <span>{Math.round(((rule.detections - rule.falsePositives) / rule.detections) * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round(((rule.detections - rule.falsePositives) / rule.detections) * 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automated Response Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automated Response Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="h-4 w-4 text-red-600" />
                <h4 className="font-medium">Auto IP Blocking</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automatically block malicious IP addresses
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium">Threat Quarantine</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Isolate infected systems automatically
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-medium">Alert Escalation</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Escalate critical threats to security team
              </p>
              <div className="flex justify-between items-center">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
