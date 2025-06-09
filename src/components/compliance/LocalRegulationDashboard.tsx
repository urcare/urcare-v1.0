
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building,
  FileText,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

export const LocalRegulationDashboard = () => {
  const [localRegulations, setLocalRegulations] = useState([
    {
      id: 'LR001',
      regulation: 'State Health Department Licensing',
      jurisdiction: 'State of California',
      type: 'Healthcare Facility License',
      status: 'Current',
      expiryDate: '2024-12-31',
      renewalRequired: true,
      daysToExpiry: 322,
      compliance: 95.2
    },
    {
      id: 'LR002',
      regulation: 'County Fire Safety Compliance',
      jurisdiction: 'Los Angeles County',
      type: 'Fire Safety Certificate',
      status: 'Expired',
      expiryDate: '2024-01-15',
      renewalRequired: true,
      daysToExpiry: -7,
      compliance: 78.5
    },
    {
      id: 'LR003',
      regulation: 'City Building Code Compliance',
      jurisdiction: 'City of Los Angeles',
      type: 'Occupancy Permit',
      status: 'Current',
      expiryDate: '2025-06-30',
      renewalRequired: false,
      daysToExpiry: 489,
      compliance: 92.1
    }
  ]);

  const [regulatoryChanges, setRegulatoryChanges] = useState([
    {
      id: 'RC001',
      title: 'Updated Patient Privacy Requirements',
      jurisdiction: 'State of California',
      effectiveDate: '2024-03-01',
      impact: 'High',
      status: 'Action Required',
      description: 'New requirements for patient consent documentation',
      daysToImplement: 38
    },
    {
      id: 'RC002',
      title: 'Revised Fire Safety Standards',
      jurisdiction: 'Los Angeles County',
      effectiveDate: '2024-04-15',
      impact: 'Medium',
      status: 'Under Review',
      description: 'Updated sprinkler system testing requirements',
      daysToImplement: 83
    },
    {
      id: 'RC003',
      title: 'New Waste Disposal Regulations',
      jurisdiction: 'City of Los Angeles',
      effectiveDate: '2024-02-15',
      impact: 'Low',
      status: 'Implemented',
      description: 'Enhanced medical waste segregation protocols',
      daysToImplement: 0
    }
  ]);

  const complianceStatus = {
    overallCompliance: 89.3,
    currentRegulations: 2,
    expiredRegulations: 1,
    pendingRenewals: 2,
    upcomingChanges: 2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current':
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Action Required':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Local Regulation Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{complianceStatus.overallCompliance}%</div>
            <div className="text-sm text-gray-600">Overall Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{complianceStatus.currentRegulations}</div>
            <div className="text-sm text-gray-600">Current Permits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{complianceStatus.expiredRegulations}</div>
            <div className="text-sm text-gray-600">Expired Permits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{complianceStatus.upcomingChanges}</div>
            <div className="text-sm text-gray-600">Upcoming Changes</div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Local Regulatory Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localRegulations.map((regulation) => (
              <div key={regulation.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{regulation.regulation}</div>
                    <div className="text-sm text-gray-600">{regulation.jurisdiction} • {regulation.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(regulation.status)}>
                      {regulation.status}
                    </Badge>
                    {regulation.renewalRequired && (
                      <Badge variant="outline">
                        Renewal Required
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Regulation ID</div>
                    <div className="font-medium">{regulation.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expiry Date</div>
                    <div className="font-medium">{regulation.expiryDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Days to Expiry</div>
                    <div className={`font-medium ${regulation.daysToExpiry < 0 ? 'text-red-600' : regulation.daysToExpiry < 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {regulation.daysToExpiry < 0 ? `${Math.abs(regulation.daysToExpiry)} days overdue` : `${regulation.daysToExpiry} days`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance</div>
                    <div className="font-medium">{regulation.compliance}%</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Level</span>
                    <span className="text-sm font-medium">{regulation.compliance}%</span>
                  </div>
                  <Progress value={regulation.compliance} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {regulation.renewalRequired && (
                    <Button size="sm">
                      Initiate Renewal
                    </Button>
                  )}
                  {regulation.daysToExpiry < 0 && (
                    <Button size="sm" variant="destructive">
                      Urgent Action Required
                    </Button>
                  )}
                </div>

                {regulation.daysToExpiry < 30 && regulation.status !== 'Expired' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Renewal deadline approaching - action required within {regulation.daysToExpiry} days
                  </div>
                )}

                {regulation.status === 'Expired' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Regulation expired {Math.abs(regulation.daysToExpiry)} days ago - immediate renewal required
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Change Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Regulatory Change Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regulatoryChanges.map((change) => (
              <div key={change.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{change.title}</div>
                    <div className="text-sm text-gray-600">{change.jurisdiction}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(change.impact)}>
                      {change.impact} Impact
                    </Badge>
                    <Badge className={getStatusColor(change.status)}>
                      {change.status}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-3">
                  {change.description}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Change ID</div>
                    <div className="font-medium">{change.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Effective Date</div>
                    <div className="font-medium">{change.effectiveDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Implementation Timeline</div>
                    <div className="font-medium">
                      {change.daysToImplement > 0 ? `${change.daysToImplement} days` : 'Complete'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {change.status === 'Action Required' && (
                      <Button size="sm">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>

                {change.daysToImplement <= 30 && change.status !== 'Implemented' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Implementation deadline approaching - {change.daysToImplement} days remaining
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Compliance Monitoring & Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Compliance Trends</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium text-green-600">89.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="text-sm font-medium">87.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">3 Months Ago</span>
                    <span className="text-sm font-medium">85.7%</span>
                  </div>
                  <div className="text-sm text-green-600 mt-2">
                    ↗ Improving trend (+3.6%)
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="font-medium mb-2">Upcoming Deadlines</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fire Safety Renewal</span>
                    <span className="font-medium text-red-600">Overdue</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Privacy Policy Update</span>
                    <span className="font-medium">38 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Building Code Review</span>
                    <span className="font-medium">83 days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{complianceStatus.overallCompliance}%</div>
                <div className="text-sm text-blue-700">Overall Compliance Score</div>
                <Progress value={complianceStatus.overallCompliance} className="mt-2 h-2" />
              </div>

              <div className="space-y-2">
                <Button className="w-full">
                  Generate Compliance Report
                </Button>
                <Button className="w-full" variant="outline">
                  Setup Compliance Alerts
                </Button>
                <Button className="w-full" variant="outline">
                  Export Regulatory Summary
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
