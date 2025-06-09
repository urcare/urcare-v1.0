
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  Calendar,
  Trash2,
  Archive,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter
} from 'lucide-react';

export const DataRetentionDashboard = () => {
  const [retentionPolicies, setRetentionPolicies] = useState([
    {
      id: 'POL001',
      name: 'Patient Medical Records',
      dataType: 'PHI',
      retentionPeriod: '10 years',
      disposalMethod: 'Secure Destruction',
      compliance: ['HIPAA', 'State Law'],
      status: 'Active',
      recordsAffected: 125847,
      nextReview: '2024-03-15'
    },
    {
      id: 'POL002',
      name: 'Financial Transaction Data',
      dataType: 'Financial',
      retentionPeriod: '7 years',
      disposalMethod: 'Cryptographic Deletion',
      compliance: ['SOX', 'IRS'],
      status: 'Active',
      recordsAffected: 89234,
      nextReview: '2024-02-28'
    },
    {
      id: 'POL003',
      name: 'Employee Records',
      dataType: 'HR Data',
      retentionPeriod: '5 years post-employment',
      disposalMethod: 'Secure Deletion',
      compliance: ['Labor Law', 'GDPR'],
      status: 'Under Review',
      recordsAffected: 12456,
      nextReview: '2024-01-30'
    }
  ]);

  const [disposalSchedule, setDisposalSchedule] = useState([
    {
      id: 'DISP001',
      dataSet: 'Legacy Patient Records 2014',
      retentionExpiry: '2024-01-25',
      recordCount: 15623,
      disposalMethod: 'Secure Destruction',
      status: 'Scheduled',
      complianceCheck: 'Passed'
    },
    {
      id: 'DISP002',
      dataSet: 'Old Financial Data 2017',
      retentionExpiry: '2024-02-10',
      recordCount: 8945,
      disposalMethod: 'Cryptographic Deletion',
      status: 'Pending Approval',
      complianceCheck: 'In Progress'
    },
    {
      id: 'DISP003',
      dataSet: 'Former Employee Records',
      retentionExpiry: '2024-01-28',
      recordCount: 234,
      disposalMethod: 'Secure Deletion',
      status: 'Ready for Disposal',
      complianceCheck: 'Passed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pending Approval': return 'bg-orange-100 text-orange-800';
      case 'Ready for Disposal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Retention Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">42</div>
            <div className="text-sm text-gray-600">Active Policies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">227,537</div>
            <div className="text-sm text-gray-600">Records Managed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-600">Pending Disposal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">96.8%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Retention Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Retention Policies
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Settings className="h-3 w-3 mr-1" />
              New Policy
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="h-3 w-3 mr-1" />
              Filter Policies
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionPolicies.map((policy) => (
              <div key={policy.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{policy.name}</div>
                    <div className="text-sm text-gray-600">ID: {policy.id} | Data Type: {policy.dataType}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Retention Period</div>
                    <div className="font-medium">{policy.retentionPeriod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Disposal Method</div>
                    <div className="font-medium">{policy.disposalMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Records Affected</div>
                    <div className="font-medium">{policy.recordsAffected.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Review</div>
                    <div className="font-medium">{policy.nextReview}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {policy.compliance.map((comp, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule Review
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit Policy
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disposal Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Data Disposal Schedule
          </CardTitle>
          <Button size="sm" variant="outline">
            <Archive className="h-3 w-3 mr-1" />
            Archive Manager
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disposalSchedule.map((disposal) => (
              <div key={disposal.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{disposal.dataSet}</div>
                    <div className="text-sm text-gray-600">ID: {disposal.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(disposal.status)}>
                      {disposal.status}
                    </Badge>
                    <Badge className={getComplianceColor(disposal.complianceCheck)}>
                      {disposal.complianceCheck}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Retention Expiry</div>
                    <div className="font-medium">{disposal.retentionExpiry}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Record Count</div>
                    <div className="font-medium">{disposal.recordCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Disposal Method</div>
                    <div className="font-medium">{disposal.disposalMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="font-medium">{disposal.status}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {disposal.status === 'Ready for Disposal' && (
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Execute Disposal
                    </Button>
                  )}
                  {disposal.status === 'Pending Approval' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve Disposal
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Retention Compliance Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="font-medium text-green-800">Compliant Policies</div>
              </div>
              <div className="text-2xl font-bold text-green-600">38/42</div>
              <div className="text-sm text-green-700">90.5% compliance rate</div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="font-medium text-yellow-800">Under Review</div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-yellow-700">Policies requiring attention</div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div className="font-medium text-red-800">Overdue Disposal</div>
              </div>
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-red-700">Immediate action required</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
