
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  AlertTriangle,
  Search,
  Download,
  TrendingUp,
  Target,
  Eye,
  RefreshCw
} from 'lucide-react';

export const RiskAssessmentDashboard = () => {
  const [threatAssessments, setThreatAssessments] = useState([
    {
      id: 'TA001',
      category: 'Cyber Security',
      threat: 'Advanced Persistent Threat',
      riskScore: 92,
      likelihood: 'High',
      impact: 'Critical',
      status: 'Active',
      lastAssessed: '2024-01-22',
      mitigationStatus: 45
    },
    {
      id: 'TA002',
      category: 'Data Privacy',
      threat: 'Data Breach via Insider',
      riskScore: 78,
      likelihood: 'Medium',
      impact: 'High',
      status: 'Monitoring',
      lastAssessed: '2024-01-20',
      mitigationStatus: 72
    },
    {
      id: 'TA003',
      category: 'Operational',
      threat: 'System Downtime',
      riskScore: 65,
      likelihood: 'Medium',
      impact: 'Medium',
      status: 'Mitigating',
      lastAssessed: '2024-01-18',
      mitigationStatus: 88
    }
  ]);

  const [vulnerabilities, setVulnerabilities] = useState([
    {
      id: 'VUL001',
      system: 'Patient Portal',
      vulnerability: 'SQL Injection',
      severity: 'Critical',
      cvssScore: 9.8,
      discovered: '2024-01-21',
      status: 'Open',
      assignedTo: 'Security Team'
    },
    {
      id: 'VUL002',
      system: 'EHR System',
      vulnerability: 'Cross-Site Scripting',
      severity: 'High',
      cvssScore: 7.4,
      discovered: '2024-01-19',
      status: 'In Progress',
      assignedTo: 'Development Team'
    },
    {
      id: 'VUL003',
      system: 'Billing System',
      vulnerability: 'Weak Authentication',
      severity: 'Medium',
      cvssScore: 5.2,
      discovered: '2024-01-15',
      status: 'Resolved',
      assignedTo: 'IT Team'
    }
  ]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': case 'Open': return 'bg-red-100 text-red-800';
      case 'Monitoring': case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Mitigating': case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Critical Threats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">28</div>
            <div className="text-sm text-gray-600">High Risk Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-600">Vulnerabilities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Mitigation Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Active Threat Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threatAssessments.map((threat) => (
              <div key={threat.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{threat.threat}</div>
                      <div className="text-sm text-gray-600">{threat.category} - ID: {threat.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-lg font-bold ${getRiskColor(threat.riskScore)}`}>
                      {threat.riskScore}
                    </div>
                    <Badge className={getStatusColor(threat.status)}>
                      {threat.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Likelihood</div>
                    <div className="font-medium">{threat.likelihood}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Impact</div>
                    <div className="font-medium">{threat.impact}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Assessed</div>
                    <div className="font-medium">{threat.lastAssessed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Mitigation Progress</div>
                    <div className="font-medium">{threat.mitigationStatus}%</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm">
                      Update
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mitigation Progress</span>
                    <span>{threat.mitigationStatus}%</span>
                  </div>
                  <Progress value={threat.mitigationStatus} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability Scanning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Vulnerability Assessment Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{vuln.vulnerability}</div>
                    <div className="text-sm text-gray-600">{vuln.system} - ID: {vuln.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(vuln.severity)}>
                      {vuln.severity}
                    </Badge>
                    <Badge className={getStatusColor(vuln.status)}>
                      {vuln.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">CVSS Score</div>
                    <div className={`font-medium ${getRiskColor(vuln.cvssScore * 10)}`}>
                      {vuln.cvssScore}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Discovered</div>
                    <div className="font-medium">{vuln.discovered}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Assigned To</div>
                    <div className="font-medium">{vuln.assignedTo}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                    <Button size="sm">
                      Remediate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Scoring & Mitigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Scoring Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Risk Score</span>
                <span className="text-2xl font-bold text-orange-600">68.5</span>
              </div>
              <Progress value={68.5} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">+5.2</div>
                  <div className="text-xs text-gray-600">vs Last Month</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">72</div>
                  <div className="text-xs text-gray-600">Days to Target</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Mitigation Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-sm">Patch critical vulnerabilities</span>
                <Badge className="bg-red-100 text-red-800">Urgent</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                <span className="text-sm">Update security policies</span>
                <Badge className="bg-orange-100 text-orange-800">High</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm">Conduct security training</span>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Run Scan
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
