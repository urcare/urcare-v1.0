
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Play, 
  FileText,
  Target,
  Timer,
  Users,
  Activity
} from 'lucide-react';

export const DisasterRecoveryConsole = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [testInProgress, setTestInProgress] = useState(false);

  const drScenarios = [
    {
      id: '1',
      name: 'Primary Data Center Failure',
      type: 'critical',
      rto: '2 hours',
      rpo: '15 minutes',
      lastTested: '2024-01-10',
      testResult: 'passed',
      systems: ['All Systems'],
      checklist: ['Failover to DR site', 'Verify data integrity', 'Test user access']
    },
    {
      id: '2',
      name: 'Database Corruption',
      type: 'high',
      rto: '4 hours',
      rpo: '1 hour',
      lastTested: '2024-01-08',
      testResult: 'failed',
      systems: ['Database', 'Applications'],
      checklist: ['Restore from backup', 'Verify data consistency', 'Resume operations']
    },
    {
      id: '3',
      name: 'Network Infrastructure Loss',
      type: 'medium',
      rto: '6 hours',
      rpo: '30 minutes',
      lastTested: '2024-01-05',
      testResult: 'passed',
      systems: ['Network', 'Communications'],
      checklist: ['Activate backup links', 'Reroute traffic', 'Test connectivity']
    }
  ];

  const recoveryTeams = [
    {
      name: 'Infrastructure Team',
      lead: 'John Smith',
      members: 4,
      status: 'available',
      expertise: ['Servers', 'Network', 'Storage']
    },
    {
      name: 'Database Team',
      lead: 'Sarah Johnson',
      members: 3,
      status: 'on-call',
      expertise: ['Database', 'Backup', 'Recovery']
    },
    {
      name: 'Application Team',
      lead: 'Mike Wilson',
      members: 5,
      status: 'available',
      expertise: ['Applications', 'Services', 'Integration']
    },
    {
      name: 'Security Team',
      lead: 'Lisa Brown',
      members: 2,
      status: 'available',
      expertise: ['Security', 'Compliance', 'Access Control']
    }
  ];

  const complianceReports = [
    {
      standard: 'ISO 27001',
      lastAudit: '2024-01-01',
      status: 'compliant',
      nextReview: '2024-07-01'
    },
    {
      standard: 'SOC 2 Type II',
      lastAudit: '2023-12-15',
      status: 'compliant',
      nextReview: '2024-06-15'
    },
    {
      standard: 'GDPR',
      lastAudit: '2024-01-10',
      status: 'minor-issues',
      nextReview: '2024-04-10'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'partial': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'on-call': return 'bg-blue-100 text-blue-800';
      case 'busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'minor-issues': return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startDRTest = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setTestInProgress(true);
    // Simulate test progress
    setTimeout(() => setTestInProgress(false), 5000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Disaster Recovery Console
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">DR Scenarios</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2hrs</div>
              <div className="text-sm text-gray-600">Avg RTO</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">Test Success</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">7 days</div>
              <div className="text-sm text-gray-600">Last Test</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {testInProgress && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="font-medium">DR Test in Progress...</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={60} className="w-32 h-2" />
                <span className="text-sm font-medium">60%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>DR Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drScenarios.map((scenario) => (
                <Card 
                  key={scenario.id} 
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedScenario === scenario.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <h4 className="font-semibold">{scenario.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTypeColor(scenario.type)}>
                          {scenario.type}
                        </Badge>
                        {getResultIcon(scenario.testResult)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">RTO</div>
                        <div className="text-gray-600">{scenario.rto}</div>
                      </div>
                      <div>
                        <div className="font-medium">RPO</div>
                        <div className="text-gray-600">{scenario.rpo}</div>
                      </div>
                      <div>
                        <div className="font-medium">Last Tested</div>
                        <div className="text-gray-600">{scenario.lastTested}</div>
                      </div>
                      <div>
                        <div className="font-medium">Systems</div>
                        <div className="text-gray-600">{scenario.systems.join(', ')}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium text-sm">Checklist:</div>
                      <div className="space-y-1">
                        {scenario.checklist.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startDRTest(scenario.id)}
                        disabled={testInProgress}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="ghost">
                        <FileText className="h-3 w-3 mr-1" />
                        Plan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recovery Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recoveryTeams.map((team, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{team.name}</h4>
                    <Badge className={getStatusColor(team.status)}>
                      {team.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Team Lead:</span>
                      <span className="font-medium">{team.lead}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Members:</span>
                      <span className="font-medium">{team.members}</span>
                    </div>
                    <div>
                      <span>Expertise: </span>
                      <span className="font-medium">{team.expertise.join(', ')}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full mt-3">
                    Contact Team
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Recovery Time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">2.5hrs</div>
                  <div className="text-sm text-gray-600">Average RTO</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">15min</div>
                  <div className="text-sm text-gray-600">Average RPO</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Recent Test Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Database Failover</span>
                    <Badge className="bg-green-100 text-green-800">1.8hrs</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Network Recovery</span>
                    <Badge className="bg-green-100 text-green-800">3.2hrs</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Full Site Recovery</span>
                    <Badge className="bg-yellow-100 text-yellow-800">5.1hrs</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceReports.map((report, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{report.standard}</h4>
                    <Badge className={getComplianceColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Last Audit</div>
                      <div className="text-gray-600">{report.lastAudit}</div>
                    </div>
                    <div>
                      <div className="font-medium">Next Review</div>
                      <div className="text-gray-600">{report.nextReview}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Compliance Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
