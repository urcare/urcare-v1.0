
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  Merge,
  Eye,
  Settings,
  Search
} from 'lucide-react';

export const MasterDataManagement = () => {
  const [masterRecords, setMasterRecords] = useState([
    {
      id: 'MR001',
      entity: 'Patient',
      goldenRecord: 'John Smith - MRN: 123456',
      duplicates: 3,
      confidence: 98.5,
      lastMerge: '2024-01-20',
      steward: 'Dr. Sarah Johnson',
      status: 'Approved',
      conflicts: 0
    },
    {
      id: 'MR002',
      entity: 'Provider',
      goldenRecord: 'City General Hospital - NPI: 789012',
      duplicates: 2,
      confidence: 95.2,
      lastMerge: '2024-01-18',
      steward: 'Admin Team',
      status: 'Under Review',
      conflicts: 1
    },
    {
      id: 'MR003',
      entity: 'Medication',
      goldenRecord: 'Acetaminophen 500mg - NDC: 456789',
      duplicates: 5,
      confidence: 92.8,
      lastMerge: '2024-01-15',
      steward: 'Pharmacy Director',
      status: 'Conflicts Detected',
      conflicts: 3
    }
  ]);

  const [conflicts, setConflicts] = useState([
    {
      id: 'CONF001',
      masterRecord: 'MR002',
      field: 'Provider Address',
      source1: '123 Main St, City, State 12345',
      source2: '123 Main Street, City, State 12345',
      confidence1: 85,
      confidence2: 90,
      recommendation: 'Use Source 2',
      steward: 'Admin Team'
    },
    {
      id: 'CONF002',
      masterRecord: 'MR003',
      field: 'Medication Strength',
      source1: '500mg',
      source2: '0.5g',
      confidence1: 95,
      confidence2: 92,
      recommendation: 'Use Source 1',
      steward: 'Pharmacy Director'
    }
  ]);

  const [stewards, setStewards] = useState([
    {
      id: 'ST001',
      name: 'Dr. Sarah Johnson',
      domain: 'Patient Data',
      recordsManaged: 15847,
      pendingConflicts: 2,
      approvalRate: 98.5,
      lastActivity: '2024-01-22 10:30:00'
    },
    {
      id: 'ST002',
      name: 'Admin Team',
      domain: 'Provider Data',
      recordsManaged: 2156,
      pendingConflicts: 1,
      approvalRate: 96.2,
      lastActivity: '2024-01-22 09:15:00'
    },
    {
      id: 'ST003',
      name: 'Pharmacy Director',
      domain: 'Medication Data',
      recordsManaged: 8934,
      pendingConflicts: 3,
      approvalRate: 94.8,
      lastActivity: '2024-01-22 08:45:00'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Conflicts Detected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Master Data Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">2,847</div>
            <div className="text-sm text-gray-600">Master Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">26,937</div>
            <div className="text-sm text-gray-600">Source Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">47</div>
            <div className="text-sm text-gray-600">Pending Conflicts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">96.4%</div>
            <div className="text-sm text-gray-600">Match Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Golden Records Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Golden Records Management
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Merge className="h-3 w-3 mr-1" />
              Merge Records
            </Button>
            <Button size="sm" variant="outline">
              <Search className="h-3 w-3 mr-1" />
              Search Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {masterRecords.map((record) => (
              <div key={record.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{record.goldenRecord}</div>
                    <div className="text-sm text-gray-600">ID: {record.id} | Entity: {record.entity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    {record.conflicts > 0 && (
                      <Badge variant="outline" className="border-red-300 text-red-700">
                        {record.conflicts} conflicts
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Duplicates Found</div>
                    <div className="font-medium">{record.duplicates}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                    <div className={`font-medium ${getConfidenceColor(record.confidence)}`}>
                      {record.confidence}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Data Steward</div>
                    <div className="font-medium">{record.steward}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Merge</div>
                    <div className="font-medium">{record.lastMerge}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  {record.conflicts > 0 && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Resolve Conflicts
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit Record
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conflict Resolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Conflict Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="p-4 border rounded-lg bg-yellow-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">Field Conflict: {conflict.field}</div>
                    <div className="text-sm text-gray-600">Conflict ID: {conflict.id} | Master Record: {conflict.masterRecord}</div>
                  </div>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    Needs Resolution
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white rounded border">
                    <div className="text-sm text-gray-600 mb-1">Source 1 ({conflict.confidence1}% confidence)</div>
                    <div className="font-medium">{conflict.source1}</div>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <div className="text-sm text-gray-600 mb-1">Source 2 ({conflict.confidence2}% confidence)</div>
                    <div className="font-medium">{conflict.source2}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600">Recommendation:</span>
                    <span className="font-medium ml-1">{conflict.recommendation}</span>
                    <span className="text-gray-600 ml-2">| Steward: {conflict.steward}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Accept Recommendation
                    </Button>
                    <Button size="sm" variant="outline">
                      Manual Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Stewardship */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Data Stewardship
          </CardTitle>
          <Button size="sm">
            <Users className="h-3 w-3 mr-1" />
            Assign Steward
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stewards.map((steward) => (
              <div key={steward.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{steward.name}</div>
                    <div className="text-sm text-gray-600">Domain: {steward.domain}</div>
                  </div>
                  <Badge variant="outline" className={steward.pendingConflicts > 0 ? 'border-orange-300 text-orange-700' : 'border-green-300 text-green-700'}>
                    {steward.pendingConflicts} pending
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Records Managed</div>
                    <div className="font-medium">{steward.recordsManaged.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Approval Rate</div>
                    <div className="font-medium">{steward.approvalRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Pending Conflicts</div>
                    <div className="font-medium">{steward.pendingConflicts}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Activity</div>
                    <div className="font-medium">{steward.lastActivity}</div>
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
