
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Building,
  Shield
} from 'lucide-react';

export const BusinessImpactAnalysis = () => {
  const [businessProcesses, setBusinessProcesses] = useState([
    {
      id: 'BP001',
      name: 'Patient Registration & Admission',
      criticality: 'Critical',
      rto: '15 minutes',
      rpo: '5 minutes',
      dependencies: ['EHR System', 'Payment Gateway', 'ID Verification'],
      impactScore: 95,
      recoveryPlan: 'Automated',
      lastTested: '2024-01-15',
      status: 'Operational'
    },
    {
      id: 'BP002',
      name: 'Clinical Decision Support',
      criticality: 'High',
      rto: '30 minutes',
      rpo: '15 minutes',
      dependencies: ['Medical Database', 'AI Engine', 'Lab Systems'],
      impactScore: 88,
      recoveryPlan: 'Manual Override',
      lastTested: '2024-01-10',
      status: 'At Risk'
    },
    {
      id: 'BP003',
      name: 'Billing & Claims Processing',
      criticality: 'High',
      rto: '1 hour',
      rpo: '30 minutes',
      dependencies: ['Billing System', 'Insurance APIs', 'Payment Processing'],
      impactScore: 82,
      recoveryPlan: 'Hybrid',
      lastTested: '2024-01-20',
      status: 'Operational'
    }
  ]);

  const [dependencyMap, setDependencyMap] = useState([
    {
      system: 'EHR System',
      dependentProcesses: 8,
      criticality: 'Critical',
      redundancy: 'High',
      failoverTime: '< 5 min',
      status: 'Healthy'
    },
    {
      system: 'Payment Gateway',
      dependentProcesses: 5,
      criticality: 'High',
      redundancy: 'Medium',
      failoverTime: '< 15 min',
      status: 'Healthy'
    },
    {
      system: 'Lab Systems',
      dependentProcesses: 12,
      criticality: 'Critical',
      redundancy: 'Low',
      failoverTime: '> 30 min',
      status: 'At Risk'
    }
  ]);

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'At Risk': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Healthy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRedundancyColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* BIA Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">23</div>
            <div className="text-sm text-gray-600">Critical Processes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">15 min</div>
            <div className="text-sm text-gray-600">Avg RTO</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">67</div>
            <div className="text-sm text-gray-600">Dependencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">Recovery Readiness</div>
          </CardContent>
        </Card>
      </div>

      {/* Business Process Criticality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Business Process Criticality Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessProcesses.map((process) => (
              <div key={process.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{process.name}</div>
                    <div className="text-sm text-gray-600">ID: {process.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCriticalityColor(process.criticality)}>
                      {process.criticality}
                    </Badge>
                    <Badge className={getStatusColor(process.status)}>
                      {process.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">RTO</div>
                    <div className="font-medium">{process.rto}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">RPO</div>
                    <div className="font-medium">{process.rpo}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Impact Score</div>
                    <div className="font-medium">{process.impactScore}/100</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recovery Plan</div>
                    <div className="font-medium">{process.recoveryPlan}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Tested</div>
                    <div className="font-medium">{process.lastTested}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Dependencies</div>
                  <div className="flex flex-wrap gap-1">
                    {process.dependencies.map((dep, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Business Impact Score</span>
                    <span>{process.impactScore}/100</span>
                  </div>
                  <Progress value={process.impactScore} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Next test due: <span className="font-medium">March 15, 2024</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Test Recovery
                    </Button>
                    <Button size="sm">
                      Update Plan
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependency Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            System Dependency Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dependencyMap.map((system, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{system.system}</div>
                    <div className="text-sm text-gray-600">
                      {system.dependentProcesses} dependent processes
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCriticalityColor(system.criticality)}>
                      {system.criticality}
                    </Badge>
                    <Badge className={getStatusColor(system.status)}>
                      {system.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Redundancy Level</div>
                    <div className={`font-medium ${getRedundancyColor(system.redundancy)}`}>
                      {system.redundancy}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Failover Time</div>
                    <div className="font-medium">{system.failoverTime}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Dependencies
                    </Button>
                    <Button size="sm">
                      Test Failover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Planning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recovery Time Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Critical Gaps</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Lab Systems: RTO exceeds business requirement</div>
                  <div>• Backup systems: Testing overdue by 45 days</div>
                  <div>• Network redundancy: Single point of failure</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Optimization Targets</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Avg RTO</span>
                    <span>15 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target RTO</span>
                    <span className="text-green-600">8 minutes</span>
                  </div>
                  <Progress value={53} className="h-2" />
                  <div className="text-xs text-gray-600">53% to target</div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Recommendations</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>• Implement automated failover for Lab Systems</div>
                  <div>• Schedule quarterly DR testing</div>
                  <div>• Deploy redundant network paths</div>
                  <div>• Upgrade backup infrastructure</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">$125K</div>
                  <div className="text-xs text-gray-600">Cost per Hour Downtime</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">$2.1M</div>
                  <div className="text-xs text-gray-600">Annual Risk Exposure</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Revenue Loss</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Operational Costs</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Compliance Penalties</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Reputation Impact</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <div className="text-sm font-medium text-blue-800 mb-1">
                  Investment Recommendation
                </div>
                <div className="text-sm text-blue-700">
                  Invest $450K in redundancy upgrades to reduce annual risk exposure by 60% 
                  and achieve target RTOs within 6 months.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
