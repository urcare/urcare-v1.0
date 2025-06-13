
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  XCircle,
  CheckCircle,
  Zap,
  Lock,
  Eye,
  Calendar
} from 'lucide-react';

export const SecurityScanningInterface = () => {
  const [selectedVuln, setSelectedVuln] = useState<string | null>(null);

  const securityOverview = {
    overallScore: 94.3,
    criticalVulns: 2,
    highVulns: 8,
    mediumVulns: 23,
    lowVulns: 45,
    lastScan: '2024-06-13 08:00',
    nextScan: '2024-06-14 02:00'
  };

  const vulnerabilities = [
    {
      id: 'VULN-001',
      title: 'SQL Injection vulnerability in user search',
      severity: 'critical',
      cve: 'CVE-2024-1234',
      component: 'User Management API',
      description: 'Unsanitized input in search parameter allows SQL injection attacks',
      impact: 'Data breach, unauthorized access',
      remediation: 'Implement parameterized queries and input validation',
      status: 'open',
      detected: '2024-06-12 14:30',
      effort: 'high'
    },
    {
      id: 'VULN-002',
      title: 'Cross-Site Scripting (XSS) in patient notes',
      severity: 'high',
      cve: 'CVE-2024-5678',
      component: 'Patient Portal',
      description: 'Unescaped user input in patient notes field enables XSS attacks',
      impact: 'Session hijacking, data theft',
      remediation: 'Implement proper output encoding and CSP headers',
      status: 'in-progress',
      detected: '2024-06-11 09:15',
      effort: 'medium'
    },
    {
      id: 'VULN-003',
      title: 'Weak password policy enforcement',
      severity: 'medium',
      cve: null,
      component: 'Authentication System',
      description: 'Password policy allows weak passwords, increasing brute force risk',
      impact: 'Account compromise',
      remediation: 'Strengthen password requirements and implement rate limiting',
      status: 'resolved',
      detected: '2024-06-10 16:20',
      effort: 'low'
    },
    {
      id: 'VULN-004',
      title: 'Outdated dependency with known vulnerabilities',
      severity: 'high',
      cve: 'CVE-2024-9999',
      component: 'Third-party Library',
      description: 'Using outdated version of authentication library with security flaws',
      impact: 'Authentication bypass',
      remediation: 'Update to latest secure version of the library',
      status: 'open',
      detected: '2024-06-13 07:45',
      effort: 'low'
    }
  ];

  const scanResults = [
    {
      type: 'SAST',
      name: 'Static Application Security Testing',
      status: 'completed',
      lastRun: '2024-06-13 08:00',
      duration: '12m 34s',
      findings: 78,
      coverage: 95.2
    },
    {
      type: 'DAST',
      name: 'Dynamic Application Security Testing',
      status: 'completed',
      lastRun: '2024-06-13 06:30',
      duration: '45m 18s',
      findings: 23,
      coverage: 87.1
    },
    {
      type: 'SCA',
      name: 'Software Composition Analysis',
      status: 'running',
      lastRun: '2024-06-13 09:00',
      duration: '8m 42s',
      findings: 156,
      coverage: 100
    },
    {
      type: 'IAST',
      name: 'Interactive Application Security Testing',
      status: 'scheduled',
      lastRun: '2024-06-12 14:00',
      duration: '28m 15s',
      findings: 34,
      coverage: 76.5
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Zap className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Scanning Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{securityOverview.overallScore}%</div>
              <div className="text-sm text-gray-600">Security Score</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{securityOverview.criticalVulns}</div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{securityOverview.highVulns}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">78</div>
              <div className="text-sm text-gray-600">Total Findings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilities.map((vuln) => (
                <Card 
                  key={vuln.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedVuln === vuln.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedVuln(vuln.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        {getStatusIcon(vuln.status)}
                        <div>
                          <h4 className="font-semibold">{vuln.id}</h4>
                          <p className="text-sm font-medium">{vuln.title}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                        {vuln.cve && (
                          <Badge variant="outline">{vuln.cve}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{vuln.description}</p>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Component: </span>
                        <span className="text-gray-600">{vuln.component}</span>
                      </div>
                      <div>
                        <span className="font-medium">Impact: </span>
                        <span className="text-gray-600">{vuln.impact}</span>
                      </div>
                      <div>
                        <span className="font-medium">Remediation: </span>
                        <span className="text-gray-600">{vuln.remediation}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(vuln.status)}>
                        {vuln.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Fix
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Detected: {vuln.detected} • Effort: {vuln.effort}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Scan Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResults.map((scan, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(scan.status)}
                    <div>
                      <h4 className="font-semibold">{scan.type}</h4>
                      <p className="text-sm text-gray-600">{scan.name}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(scan.status)}>
                    {scan.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <div className="font-medium">Last Run</div>
                    <div className="text-gray-600">{scan.lastRun}</div>
                  </div>
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-gray-600">{scan.duration}</div>
                  </div>
                  <div>
                    <div className="font-medium">Findings</div>
                    <div className="text-gray-600">{scan.findings}</div>
                  </div>
                  <div>
                    <div className="font-medium">Coverage</div>
                    <div className="text-gray-600">{scan.coverage}%</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span>{scan.coverage}%</span>
                  </div>
                  <Progress value={scan.coverage} className="h-2" />
                </div>

                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline">
                    Run Scan
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Compliance & Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">OWASP Top 10</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>A01 - Broken Access Control:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Safe</Badge>
                </div>
                <div className="flex justify-between">
                  <span>A03 - Injection:</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800">Risk</Badge>
                </div>
                <div className="flex justify-between">
                  <span>A07 - XSS:</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Review</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Compliance Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>HIPAA:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SOC 2:</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between">
                  <span>GDPR:</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Review</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Risk Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-medium text-yellow-600">Medium</span>
                </div>
                <div className="flex justify-between">
                  <span>Exposure Level:</span>
                  <span className="font-medium text-green-600">Low</span>
                </div>
                <div className="flex justify-between">
                  <span>Threat Level:</span>
                  <span className="font-medium text-orange-600">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
