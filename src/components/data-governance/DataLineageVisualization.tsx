
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GitBranch,
  Database,
  ArrowRight,
  Search,
  Eye,
  AlertTriangle,
  Activity,
  Target
} from 'lucide-react';

export const DataLineageVisualization = () => {
  const [lineageData, setLineageData] = useState([
    {
      id: 'LIN001',
      sourceSystem: 'EMR System',
      sourceTable: 'patient_records',
      transformations: [
        'Data Validation',
        'PHI Anonymization',
        'Format Standardization'
      ],
      targetSystem: 'Analytics Warehouse',
      targetTable: 'patient_analytics',
      impactLevel: 'High',
      dependencies: 5,
      lastUpdate: '2024-01-22 10:30:00'
    },
    {
      id: 'LIN002',
      sourceSystem: 'Billing System',
      sourceTable: 'financial_transactions',
      transformations: [
        'Currency Conversion',
        'Tax Calculation',
        'Aggregation'
      ],
      targetSystem: 'Reporting Database',
      targetTable: 'revenue_reports',
      impactLevel: 'Medium',
      dependencies: 3,
      lastUpdate: '2024-01-22 09:15:00'
    },
    {
      id: 'LIN003',
      sourceSystem: 'Lab System',
      sourceTable: 'test_results',
      transformations: [
        'Unit Conversion',
        'Reference Range Mapping',
        'Quality Validation'
      ],
      targetSystem: 'Clinical Dashboard',
      targetTable: 'lab_analytics',
      impactLevel: 'Critical',
      dependencies: 8,
      lastUpdate: '2024-01-22 08:45:00'
    }
  ]);

  const [impactAnalysis, setImpactAnalysis] = useState([
    {
      id: 'IMP001',
      changeType: 'Schema Modification',
      sourceSystem: 'EMR System',
      affectedDownstream: 12,
      estimatedImpact: 'High',
      riskLevel: 'Medium',
      changeDescription: 'Adding new patient identifier field',
      reviewStatus: 'Pending'
    },
    {
      id: 'IMP002',
      changeType: 'Data Format Change',
      sourceSystem: 'Billing System',
      affectedDownstream: 6,
      estimatedImpact: 'Medium',
      riskLevel: 'Low',
      changeDescription: 'Updating currency precision from 2 to 4 decimals',
      reviewStatus: 'Approved'
    }
  ]);

  const [dependencies, setDependencies] = useState([
    {
      system: 'Analytics Warehouse',
      dependsOn: ['EMR System', 'Lab System', 'Billing System'],
      provides: ['Business Intelligence', 'Compliance Reports'],
      criticalityLevel: 'High',
      healthStatus: 'Healthy'
    },
    {
      system: 'Clinical Dashboard',
      dependsOn: ['Lab System', 'Pharmacy System'],
      provides: ['Real-time Monitoring', 'Clinical Alerts'],
      criticalityLevel: 'Critical',
      healthStatus: 'Warning'
    },
    {
      system: 'Reporting Database',
      dependsOn: ['Billing System', 'HR System'],
      provides: ['Financial Reports', 'Operational Metrics'],
      criticalityLevel: 'Medium',
      healthStatus: 'Healthy'
    }
  ]);

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lineage Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">247</div>
            <div className="text-sm text-gray-600">Data Flows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Source Systems</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">156</div>
            <div className="text-sm text-gray-600">Dependencies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">98.2%</div>
            <div className="text-sm text-gray-600">Lineage Coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Lineage Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Data Lineage Flow
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Search className="h-3 w-3 mr-1" />
              Search Lineage
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              View Diagram
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {lineageData.map((lineage) => (
              <div key={lineage.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">Lineage ID: {lineage.id}</div>
                  <Badge className={getImpactColor(lineage.impactLevel)}>
                    {lineage.impactLevel} Impact
                  </Badge>
                </div>

                {/* Source to Target Flow */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <Database className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="font-medium text-blue-800">{lineage.sourceSystem}</div>
                      <div className="text-sm text-blue-600">{lineage.sourceTable}</div>
                    </div>
                  </div>

                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 text-center mb-1">Transformations</div>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {lineage.transformations.map((transform, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {transform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <Database className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <div className="font-medium text-green-800">{lineage.targetSystem}</div>
                      <div className="text-sm text-green-600">{lineage.targetTable}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dependencies:</span>
                    <span className="font-medium ml-1">{lineage.dependencies}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium ml-1">{lineage.lastUpdate}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactAnalysis.map((impact) => (
              <div key={impact.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{impact.changeType}</div>
                    <div className="text-sm text-gray-600">Source: {impact.sourceSystem}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(impact.estimatedImpact)}>
                      {impact.estimatedImpact} Impact
                    </Badge>
                    <Badge variant="outline" className={impact.reviewStatus === 'Approved' ? 'border-green-300 text-green-700' : 'border-orange-300 text-orange-700'}>
                      {impact.reviewStatus}
                    </Badge>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Change Description</div>
                  <div className="bg-gray-50 p-2 rounded text-sm">{impact.changeDescription}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Affected Downstream Systems:</span>
                    <span className="font-medium ml-1">{impact.affectedDownstream}</span>
                    <span className="text-gray-600 ml-4">Risk Level:</span>
                    <span className="font-medium ml-1">{impact.riskLevel}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      View Impact
                    </Button>
                    {impact.reviewStatus === 'Pending' && (
                      <Button size="sm">
                        Review Change
                      </Button>
                    )}
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
            <Database className="h-5 w-5" />
            System Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dependencies.map((dep, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{dep.system}</div>
                    <Badge className={getImpactColor(dep.criticalityLevel)}>
                      {dep.criticalityLevel} Criticality
                    </Badge>
                  </div>
                  <Badge className={getHealthColor(dep.healthStatus)}>
                    {dep.healthStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Depends On</div>
                    <div className="flex flex-wrap gap-1">
                      {dep.dependsOn.map((system, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Provides To</div>
                    <div className="flex flex-wrap gap-1">
                      {dep.provides.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
