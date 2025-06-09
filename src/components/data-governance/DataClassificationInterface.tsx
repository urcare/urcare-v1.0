
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Database,
  Tag,
  Search,
  Filter,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  Brain
} from 'lucide-react';

export const DataClassificationInterface = () => {
  const [classificationData, setClassificationData] = useState([
    {
      id: 'DS001',
      name: 'Patient Medical Records',
      type: 'Structured',
      classification: 'Highly Confidential',
      sensitivity: 'Critical',
      compliance: ['HIPAA', 'GDPR'],
      autoClassified: true,
      confidence: 98.5,
      lastScan: '2024-01-22 10:30:00'
    },
    {
      id: 'DS002',
      name: 'Financial Transaction Data',
      type: 'Structured',
      classification: 'Confidential',
      sensitivity: 'High',
      compliance: ['SOX', 'PCI-DSS'],
      autoClassified: true,
      confidence: 95.2,
      lastScan: '2024-01-22 09:15:00'
    },
    {
      id: 'DS003',
      name: 'Employee Contact Information',
      type: 'Mixed',
      classification: 'Internal',
      sensitivity: 'Medium',
      compliance: ['GDPR'],
      autoClassified: false,
      confidence: 0,
      lastScan: '2024-01-21 16:45:00'
    }
  ]);

  const [classificationRules, setClassificationRules] = useState([
    {
      id: 'RULE001',
      name: 'PHI Detection',
      pattern: 'Social Security Numbers, Medical Record Numbers',
      classification: 'Highly Confidential',
      status: 'Active',
      accuracy: 97.8
    },
    {
      id: 'RULE002',
      name: 'Financial Data',
      pattern: 'Credit Card Numbers, Bank Account Information',
      classification: 'Confidential',
      status: 'Active',
      accuracy: 94.5
    },
    {
      id: 'RULE003',
      name: 'Personal Identifiers',
      pattern: 'Email Addresses, Phone Numbers',
      classification: 'Internal',
      status: 'Active',
      accuracy: 89.2
    }
  ]);

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Highly Confidential': return 'bg-red-100 text-red-800';
      case 'Confidential': return 'bg-orange-100 text-orange-800';
      case 'Internal': return 'bg-blue-100 text-blue-800';
      case 'Public': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Classification Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">15,847</div>
            <div className="text-sm text-gray-600">Total Datasets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">14,122</div>
            <div className="text-sm text-gray-600">Auto-Classified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">1,725</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">89.2%</div>
            <div className="text-sm text-gray-600">Classification Coverage</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Discovery and Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Data Discovery & Classification
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm">
              <Zap className="h-3 w-3 mr-1" />
              Run Auto-Classification
            </Button>
            <Button size="sm" variant="outline">
              <Filter className="h-3 w-3 mr-1" />
              Filter Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classificationData.map((dataset) => (
              <div key={dataset.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{dataset.name}</div>
                    <div className="text-sm text-gray-600">ID: {dataset.id} | Type: {dataset.type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dataset.autoClassified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Classified
                      </Badge>
                    )}
                    <Badge className={getClassificationColor(dataset.classification)}>
                      {dataset.classification}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Sensitivity Level</div>
                    <Badge className={getSensitivityColor(dataset.sensitivity)}>
                      {dataset.sensitivity}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {dataset.compliance.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Confidence Score</div>
                    <div className="font-medium">
                      {dataset.confidence > 0 ? `${dataset.confidence}%` : 'Manual Review'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Scan</div>
                    <div className="font-medium">{dataset.lastScan}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Edit Classification
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Classification Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Classification Rules
          </CardTitle>
          <Button size="sm">
            <Settings className="h-3 w-3 mr-1" />
            Manage Rules
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classificationRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-gray-600">ID: {rule.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {rule.status}
                    </Badge>
                    <div className="text-sm font-medium">{rule.accuracy}% Accuracy</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">Detection Pattern</div>
                  <div className="bg-gray-50 p-2 rounded text-sm">{rule.pattern}</div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getClassificationColor(rule.classification)}>
                    {rule.classification}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Test Rule
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Manual Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="datasetName">Dataset Name</Label>
                <Input id="datasetName" placeholder="Enter dataset name" />
              </div>
              <div>
                <Label htmlFor="datasetType">Dataset Type</Label>
                <Input id="datasetType" placeholder="Structured/Unstructured/Mixed" />
              </div>
              <div>
                <Label htmlFor="classification">Classification Level</Label>
                <Input id="classification" placeholder="Highly Confidential/Confidential/Internal/Public" />
              </div>
              <Button className="w-full">
                Classify Dataset
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Classification Guidelines</div>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Highly Confidential:</strong> PHI, Financial records, Legal documents</div>
                <div><strong>Confidential:</strong> Internal business data, Employee records</div>
                <div><strong>Internal:</strong> Operational data, Policies, Procedures</div>
                <div><strong>Public:</strong> Published information, Marketing materials</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
